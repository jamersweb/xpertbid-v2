<?php

namespace App\Services;

use App\Events\BuyerRequestChanged;
use App\Models\BuyerRequest;
use App\Models\BuyerRequestImage;
use App\Models\BuyerRequestOffer;
use App\Models\NewNotification;
use App\Models\SellerBuyerRequestPreference;
use App\Models\SellerBuyerRequestPreferenceLocation;
use App\Models\User;
use App\Support\BuyerRequestAlertSender;
use App\Support\BuyerRequestSiteScope;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\ImageManager;

class BuyerRequestService
{
    public function createRequest(User $buyer, array $data, array $imageFiles = []): BuyerRequest
    {
        return DB::transaction(function () use ($buyer, $data, $imageFiles) {
            $request = BuyerRequest::create([
                'user_id' => $buyer->id,
                'title' => $data['title'],
                'slug' => BuyerRequest::uniqueSlugFromTitle($data['title']),
                'description' => $data['description'] ?? null,
                'category_id' => $data['category_id'] ?? null,
                'sub_category_id' => $data['sub_category_id'] ?? null,
                'child_category_id' => $data['child_category_id'] ?? null,
                'location_label' => $data['location_label'] ?? null,
                'country' => $data['country'] ?? null,
                'state' => $data['state'] ?? null,
                'city' => $data['city'] ?? null,
                'budget' => $data['budget'] ?? null,
                'latitude' => $data['latitude'] ?? null,
                'longitude' => $data['longitude'] ?? null,
                'status' => BuyerRequest::STATUS_OPEN,
            ]);

            $this->storeImages($request, $imageFiles);
            $this->notifyMatchedSellers($request);

            return $request->load(['images', 'category', 'offers']);
        });
    }

    public function updateRequest(User $buyer, BuyerRequest $request, array $data, array $imageFiles = [], array $removeImageIds = []): BuyerRequest
    {
        if ((int) $request->user_id !== (int) $buyer->id) {
            throw ValidationException::withMessages([
                'request' => 'You can only edit your own requests.',
            ]);
        }

        if ($request->status === BuyerRequest::STATUS_FULFILLED) {
            throw ValidationException::withMessages([
                'status' => 'Fulfilled requests cannot be edited.',
            ]);
        }

        return DB::transaction(function () use ($request, $data, $imageFiles, $removeImageIds) {
            $title = $data['title'] ?? $request->title;

            $request->update([
                'title' => $title,
                // Keep slug stable so shared links keep working
                'description' => $data['description'] ?? null,
                'category_id' => $data['category_id'] ?? null,
                'sub_category_id' => $data['sub_category_id'] ?? null,
                'child_category_id' => $data['child_category_id'] ?? null,
                'location_label' => $data['location_label'] ?? null,
                'country' => $data['country'] ?? null,
                'state' => $data['state'] ?? null,
                'city' => $data['city'] ?? null,
                'budget' => array_key_exists('budget', $data)
                    ? ($data['budget'] !== '' && $data['budget'] !== null ? $data['budget'] : null)
                    : $request->budget,
                'latitude' => $data['latitude'] ?? null,
                'longitude' => $data['longitude'] ?? null,
            ]);

            if (! empty($removeImageIds)) {
                $request->images()
                    ->whereIn('id', $removeImageIds)
                    ->get()
                    ->each(function (BuyerRequestImage $image) {
                        $absolute = public_path(ltrim((string) $image->path, '/'));
                        if (is_file($absolute)) {
                            @unlink($absolute);
                        }
                        $image->delete();
                    });
            }

            $remaining = $request->images()->count();
            $incoming = array_values(array_filter($imageFiles));
            $allowed = max(0, 8 - $remaining);
            $this->storeImages($request, array_slice($incoming, 0, $allowed));

            return $request->fresh(['images', 'category', 'subCategory', 'childCategory']);
        });
    }

    public function closeRequest(BuyerRequest $request): BuyerRequest
    {
        if (! $request->isOpen()) {
            throw ValidationException::withMessages([
                'status' => 'Only open requests can be closed.',
            ]);
        }

        $fresh = DB::transaction(function () use ($request) {
            $request->update([
                'status' => BuyerRequest::STATUS_CLOSED,
                'closed_at' => now(),
            ]);

            $sellerIds = $request->offers()
                ->where('status', BuyerRequestOffer::STATUS_PENDING)
                ->pluck('seller_id')
                ->unique();

            foreach ($sellerIds as $sellerId) {
                $this->notify(
                    (int) $sellerId,
                    'Buyer request closed',
                    sprintf('The buyer closed "%s". New offers are no longer accepted.', $request->title),
                    BuyerRequestAlertSender::KEY_REQUEST_CLOSED,
                    $request
                );
            }

            return $request->fresh(['images', 'category', 'offers.seller']);
        });

        $this->broadcastChange($fresh, 'request.closed');

        return $fresh;
    }

    public function submitOffer(User $seller, BuyerRequest $request, array $data): BuyerRequestOffer
    {
        $this->assertCorporateVerified($seller);

        if (! $request->acceptsNewOffers()) {
            throw ValidationException::withMessages([
                'request' => 'This request is no longer accepting offers.',
            ]);
        }

        if ((int) $request->user_id === (int) $seller->id) {
            throw ValidationException::withMessages([
                'request' => 'You cannot offer on your own request.',
            ]);
        }

        // Many sellers may bid on one request. Only constrain THIS seller
        // to a single active (pending/accepted) offer — never block others.
        $existing = $request->offers()
            ->where('seller_id', $seller->id)
            ->whereIn('status', [
                BuyerRequestOffer::STATUS_PENDING,
                BuyerRequestOffer::STATUS_ACCEPTED,
            ])
            ->first();

        if ($existing && $existing->status === BuyerRequestOffer::STATUS_ACCEPTED) {
            throw ValidationException::withMessages([
                'offer' => 'Your offer was already accepted.',
            ]);
        }

        if ($existing) {
            return $this->updateOffer($seller, $existing, $data);
        }

        $offer = BuyerRequestOffer::create([
            'buyer_request_id' => $request->id,
            'seller_id' => $seller->id,
            'price' => $data['price'],
            'message' => $data['message'] ?? null,
            'status' => BuyerRequestOffer::STATUS_PENDING,
        ]);

        $this->notify(
            (int) $request->user_id,
            'New offer received',
            sprintf('You received a new offer on "%s".', $request->title),
            BuyerRequestAlertSender::KEY_OFFER_RECEIVED,
            $request,
            ['price' => $offer->price]
        );

        $offer->load('seller');
        $this->broadcastChange($request, 'offer.submitted', $offer);

        return $offer;
    }

    public function updateOffer(User $seller, BuyerRequestOffer $offer, array $data): BuyerRequestOffer
    {
        $this->assertCorporateVerified($seller);

        if ((int) $offer->seller_id !== (int) $seller->id) {
            throw ValidationException::withMessages([
                'offer' => 'You can only edit your own offers.',
            ]);
        }

        if (! $offer->isPending()) {
            throw ValidationException::withMessages([
                'offer' => 'Only pending offers can be edited.',
            ]);
        }

        $request = $offer->buyerRequest;
        if (! $request || ! $request->acceptsNewOffers()) {
            throw ValidationException::withMessages([
                'request' => 'This request is no longer open.',
            ]);
        }

        $offer->update([
            'price' => $data['price'] ?? $offer->price,
            'message' => array_key_exists('message', $data) ? $data['message'] : $offer->message,
        ]);

        $this->notify(
            (int) $request->user_id,
            'Offer updated',
            sprintf('A seller updated their offer on "%s".', $request->title),
            BuyerRequestAlertSender::KEY_OFFER_UPDATED,
            $request,
            ['price' => $offer->price]
        );

        $fresh = $offer->fresh('seller');
        $this->broadcastChange($request, 'offer.updated', $fresh);

        return $fresh;
    }

    public function withdrawOffer(User $seller, BuyerRequestOffer $offer): BuyerRequestOffer
    {
        if ((int) $offer->seller_id !== (int) $seller->id) {
            throw ValidationException::withMessages([
                'offer' => 'You can only delete your own offers.',
            ]);
        }

        if (! $offer->isPending()) {
            throw ValidationException::withMessages([
                'offer' => 'Only pending offers can be withdrawn.',
            ]);
        }

        $request = $offer->buyerRequest;
        $offer->update(['status' => BuyerRequestOffer::STATUS_WITHDRAWN]);
        $offer->delete();

        if ($request) {
            $this->notify(
                (int) $request->user_id,
                'Offer withdrawn',
                sprintf('A seller withdrew their offer on "%s".', $request->title),
                BuyerRequestAlertSender::KEY_OFFER_WITHDRAWN,
                $request
            );
            $this->broadcastChange($request, 'offer.withdrawn', $offer);
        }

        return $offer;
    }

    public function acceptOffer(User $buyer, BuyerRequestOffer $offer): BuyerRequestOffer
    {
        $request = $offer->buyerRequest;

        if (! $request || (int) $request->user_id !== (int) $buyer->id) {
            throw ValidationException::withMessages([
                'offer' => 'You can only accept offers on your own requests.',
            ]);
        }

        if (! $request->isOpen()) {
            throw ValidationException::withMessages([
                'request' => 'This request is not open.',
            ]);
        }

        if (! $offer->isPending()) {
            throw ValidationException::withMessages([
                'offer' => 'Only pending offers can be accepted.',
            ]);
        }

        $accepted = DB::transaction(function () use ($offer, $request) {
            $offer->update(['status' => BuyerRequestOffer::STATUS_ACCEPTED]);

            $otherOffers = $request->offers()
                ->where('id', '!=', $offer->id)
                ->where('status', BuyerRequestOffer::STATUS_PENDING)
                ->get();

            foreach ($otherOffers as $other) {
                $other->update(['status' => BuyerRequestOffer::STATUS_REJECTED]);
                $this->notify(
                    (int) $other->seller_id,
                    'Offer rejected',
                    sprintf('Your offer on "%s" was not selected.', $request->title),
                    BuyerRequestAlertSender::KEY_OFFER_REJECTED,
                    $request
                );
            }

            $request->update([
                'status' => BuyerRequest::STATUS_FULFILLED,
                'accepted_offer_id' => $offer->id,
                'closed_at' => now(),
            ]);

            $this->notify(
                (int) $offer->seller_id,
                'Offer accepted',
                sprintf('Your offer on "%s" was accepted. The buyer will contact XpertBid support to complete the purchase.', $request->title),
                BuyerRequestAlertSender::KEY_OFFER_ACCEPTED,
                $request,
                ['price' => $offer->price]
            );

            return $offer->fresh(['seller', 'buyerRequest']);
        });

        $freshRequest = $accepted->buyerRequest ?? $request->fresh();
        if ($freshRequest) {
            $this->broadcastChange($freshRequest, 'offer.accepted', $accepted);
        }

        return $accepted;
    }

    public function rejectOffer(User $buyer, BuyerRequestOffer $offer): BuyerRequestOffer
    {
        $request = $offer->buyerRequest;

        if (! $request || (int) $request->user_id !== (int) $buyer->id) {
            throw ValidationException::withMessages([
                'offer' => 'You can only reject offers on your own requests.',
            ]);
        }

        if (! $request->isOpen()) {
            throw ValidationException::withMessages([
                'request' => 'This request is not open.',
            ]);
        }

        if (! $offer->isPending()) {
            throw ValidationException::withMessages([
                'offer' => 'Only pending offers can be rejected.',
            ]);
        }

        $offer->update(['status' => BuyerRequestOffer::STATUS_REJECTED]);

        $this->notify(
            (int) $offer->seller_id,
            'Offer rejected',
            sprintf('Your offer on "%s" was rejected.', $request->title),
            BuyerRequestAlertSender::KEY_OFFER_REJECTED,
            $request
        );

        $fresh = $offer->fresh('seller');
        $this->broadcastChange($request, 'offer.rejected', $fresh);

        return $fresh;
    }

    public function saveSellerPreferences(User $seller, array $categoryIds, array $locations): SellerBuyerRequestPreference
    {
        $this->assertCorporateVerified($seller);

        return DB::transaction(function () use ($seller, $categoryIds, $locations) {
            $preference = SellerBuyerRequestPreference::firstOrCreate([
                'user_id' => $seller->id,
            ]);

            $preference->categories()->sync(array_values(array_unique(array_filter($categoryIds))));

            $preference->locations()->delete();

            foreach ($locations as $location) {
                if (empty($location['location_label']) && empty($location['city']) && empty($location['latitude'])) {
                    continue;
                }

                SellerBuyerRequestPreferenceLocation::create([
                    'preference_id' => $preference->id,
                    'location_label' => $location['location_label'] ?? null,
                    'country' => $location['country'] ?? null,
                    'state' => $location['state'] ?? null,
                    'city' => $location['city'] ?? null,
                    'latitude' => $location['latitude'] ?? null,
                    'longitude' => $location['longitude'] ?? null,
                ]);
            }

            return $preference->load(['categories', 'locations']);
        });
    }

    public function matchedOpenRequestsForSeller(User $seller, ?string $site = null): Collection
    {
        $this->assertCorporateVerified($seller);

        // Preferences are optional and used for notifications only.
        // Corporate sellers always see open leads (optionally site-scoped) and can offer freely.
        $query = BuyerRequest::query()
            ->with([
                'images:id,buyer_request_id,path,sort_order',
                'category:id,name',
                'subCategory:id,name',
                'childCategory:id,name',
                'user:id,name,profile_pic',
            ])
            ->withCount([
                'offers',
                'offers as my_offer_count' => function ($q) use ($seller) {
                    $q->where('seller_id', $seller->id)
                        ->whereNull('deleted_at')
                        ->whereIn('status', [
                            BuyerRequestOffer::STATUS_PENDING,
                            BuyerRequestOffer::STATUS_ACCEPTED,
                            BuyerRequestOffer::STATUS_REJECTED,
                        ]);
                },
            ])
            ->where('status', BuyerRequest::STATUS_OPEN)
            ->where('user_id', '!=', $seller->id);

        BuyerRequestSiteScope::applyToQuery($query, $site);

        return $query
            ->orderByDesc('created_at')
            ->get([
                'id',
                'user_id',
                'title',
                'slug',
                'description',
                'category_id',
                'sub_category_id',
                'child_category_id',
                'location_label',
                'country',
                'state',
                'city',
                'budget',
                'latitude',
                'longitude',
                'status',
                'created_at',
                'updated_at',
            ]);
    }

    public function notifyMatchedSellers(BuyerRequest $request): void
    {
        $sellerIds = $this->findMatchedSellerIds($request);

        foreach ($sellerIds as $sellerId) {
            $this->notify(
                (int) $sellerId,
                'New buyer request',
                sprintf('A new request matches your preferences: "%s".', $request->title),
                BuyerRequestAlertSender::KEY_MATCHED_REQUEST,
                $request
            );
        }
    }

    public function findMatchedSellerIds(BuyerRequest $request): Collection
    {
        if (! $request->category_id) {
            return collect();
        }

        $preferences = SellerBuyerRequestPreference::query()
            ->with(['locations', 'user.corporateVerification'])
            ->whereHas('categories', fn ($q) => $q->where('auction_categories.id', $request->category_id))
            ->whereHas('user.corporateVerification', function ($q) {
                $q->whereIn('status', ['verified', 'approved']);
            })
            ->get();

        return $preferences
            ->filter(fn (SellerBuyerRequestPreference $pref) => $this->locationMatches($request, $pref->locations))
            ->pluck('user_id')
            ->unique()
            ->values();
    }

    public function storeImages(BuyerRequest $request, array $imageFiles): void
    {
        $sort = 0;
        foreach ($imageFiles as $file) {
            if (! $file instanceof UploadedFile) {
                continue;
            }

            BuyerRequestImage::create([
                'buyer_request_id' => $request->id,
                'path' => $this->storeOptimizedImage($file),
                'sort_order' => $sort++,
            ]);
        }
    }

    public function storeOptimizedImage(UploadedFile $file): string
    {
        $directory = public_path('assets/images/buyer_requests');
        File::ensureDirectoryExists($directory);

        $manager = new ImageManager(new GdDriver());
        $image = $manager->read($file->getRealPath());
        $image->scaleDown(width: 1800, height: 1800);

        $filename = time().'_'.Str::random(12).'.webp';
        $encoded = $image->encode(new WebpEncoder(82));
        $encoded->save($directory.DIRECTORY_SEPARATOR.$filename);

        return 'assets/images/buyer_requests/'.$filename;
    }

    public function assertCorporateVerified(User $user): void
    {
        $user->loadMissing('corporateVerification');

        if (! $user->isCorporateVerified()) {
            throw ValidationException::withMessages([
                'verification' => 'Only corporate-verified sellers can perform this action.',
            ]);
        }
    }

    protected function locationMatches(BuyerRequest $request, Collection $locations): bool
    {
        if ($locations->isEmpty()) {
            return false;
        }

        foreach ($locations as $location) {
            if ($this->geoLevelMatches($request->city, $location->city)) {
                return true;
            }
            if ($this->geoLevelMatches($request->state, $location->state)) {
                return true;
            }
            if ($this->geoLevelMatches($request->country, $location->country)) {
                return true;
            }
        }

        return false;
    }

    protected function geoLevelMatches(?string $left, ?string $right): bool
    {
        $left = $this->normalizeGeo($left);
        $right = $this->normalizeGeo($right);

        if ($left === '' || $right === '') {
            return false;
        }

        return $left === $right;
    }

    protected function normalizeGeo(?string $value): string
    {
        return strtolower(trim((string) $value));
    }

    protected function notify(
        int $userId,
        string $title,
        string $message,
        string $alertKey,
        BuyerRequest $request,
        array $context = []
    ): void {
        // Keep type short — DB column may be VARCHAR(10) in older schemas
        NewNotification::create([
            'user_id' => $userId,
            'title' => $title,
            'message' => $message,
            'type' => 'request',
            'image_url' => NewNotification::getImageForType('request'),
            'read_at' => null,
        ]);

        try {
            $user = User::query()->find($userId);
            if ($user) {
                BuyerRequestAlertSender::send($user, $alertKey, $request, $context);
            }
        } catch (\Throwable $e) {
            report($e);
        }
    }

    protected function broadcastChange(
        BuyerRequest $request,
        string $action,
        ?BuyerRequestOffer $offer = null
    ): void {
        try {
            broadcast(new BuyerRequestChanged($request, $action, $offer))->toOthers();
        } catch (\Throwable $e) {
            report($e);
        }
    }
}
