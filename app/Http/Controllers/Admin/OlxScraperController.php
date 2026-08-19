<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuctionCategory;
use App\Models\Listing;
use App\Models\User;
use App\Services\OlxScraperService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use RuntimeException;

class OlxScraperController extends Controller
{
    public function __construct(protected OlxScraperService $scraper)
    {
    }

    public function index(Request $request)
    {
        return Inertia::render('Admin/Tools/OlxScraper', $this->pageProps([
            'url' => $request->string('url')->toString(),
            'status' => $request->session()->get('success') ?? $request->session()->get('status'),
            'error' => $request->session()->get('error'),
        ]));
    }

    public function preview(Request $request)
    {
        $validated = $request->validate([
            'url' => ['required', 'url'],
        ]);

        try {
            $preview = $this->scraper->scrape($validated['url']);
            $error = empty($preview['title']) ? 'OLX listing title was not detected from the page HTML.' : null;
        } catch (\Throwable $e) {
            Log::warning('OLX preview scrape failed', [
                'url' => $validated['url'],
                'message' => $e->getMessage(),
            ]);

            return Inertia::render('Admin/Tools/OlxScraper', $this->pageProps([
                'url' => $validated['url'],
                'error' => $e->getMessage(),
            ]));
        }

        return Inertia::render('Admin/Tools/OlxScraper', $this->pageProps([
            'url' => $validated['url'],
            'preview' => $preview,
            'preview_images' => $preview['images'] ?? [],
            'error' => $error,
        ]));
    }

    public function image(Request $request)
    {
        $validated = $request->validate([
            'url' => ['required', 'url'],
            'source' => ['nullable', 'url'],
        ]);

        $headers = [
            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
            'Accept' => 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
            'Referer' => $validated['source'] ?? $this->imageReferer($validated['url']),
        ];

        if (!empty($validated['source']) && ($origin = $this->originFromUrl($validated['source']))) {
            $headers['Origin'] = $origin;
        }

        $response = Http::withHeaders($headers)->timeout(30)->retry(1, 500)->get($validated['url']);

        if (!$response->successful()) {
            abort(404);
        }

        $contentType = $response->header('Content-Type') ?: 'image/jpeg';

        return response($response->body(), 200)
            ->header('Content-Type', $contentType)
            ->header('Cache-Control', 'public, max-age=3600');
    }

    public function save(Request $request)
    {
        $validated = $request->validate([
            'url' => ['required', 'url'],
            'user_id' => ['required', 'exists:users,id'],
            'category_id' => ['required', 'exists:auction_categories,id'],
            'sub_category_id' => ['nullable', 'exists:auction_categories,id'],
            'child_category_id' => ['nullable', 'exists:auction_categories,id'],
            'listing_type' => ['nullable', 'in:auction,normal,business,live_auction'],
            'title' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'minimum_bid' => ['nullable', 'numeric', 'min:0'],
            'reserve_price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
            'discount_type' => ['nullable', 'in:percent,flat'],
            'discount_value' => ['nullable', 'numeric', 'min:0'],
            'variations' => ['nullable', 'array'],
            'variations.*.name' => ['nullable', 'string', 'max:255'],
            'variations.*.price' => ['nullable', 'numeric', 'min:0'],
            'variations.*.discount_type' => ['nullable', 'in:percent,flat'],
            'variations.*.discount_value' => ['nullable', 'numeric', 'min:0'],
            'images_managed' => ['nullable', 'boolean'],
            'kept_images' => ['nullable', 'array'],
            'kept_images.*' => ['nullable', 'string', 'max:5000'],
            'new_images' => ['nullable', 'array'],
            'new_images.*' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,gif', 'max:5120'],
        ]);

        $title = Str::limit(trim((string) $validated['title']), 255, '');
        $description = (string) ($validated['description'] ?? '');
        $listingType = $validated['listing_type'] ?? 'auction';
        $minimumBid = $this->normalizeNumeric($validated['minimum_bid'] ?? null);
        $reservePrice = $this->normalizeNumeric($validated['reserve_price'] ?? null);
        $price = $this->normalizeNumeric($validated['price'] ?? null);
        $stock = array_key_exists('stock', $validated) && $validated['stock'] !== null
            ? (int) $validated['stock']
            : null;
        $startDate = $validated['start_date'] ?? null;
        $endDate = $validated['end_date'] ?? null;
        $sourceDomain = parse_url($validated['url'], PHP_URL_HOST) ?: null;
        $supportsVariations = !in_array($listingType, ['auction', 'live_auction'], true);
        $variations = $supportsVariations ? $this->normalizeVariations($validated['variations'] ?? []) : [];
        $discountType = $supportsVariations ? ($validated['discount_type'] ?? null) : null;
        $discountValue = $supportsVariations ? $this->normalizeNumeric($validated['discount_value'] ?? null) : null;

        try {
            $downloadedImages = $this->resolveListingImages($request, [], $validated['url']);
            $coverImage = $downloadedImages[0] ?? null;

            $listingData = [
                'price' => $price,
                'minimum_bid' => $minimumBid ?? 0,
                'reserve_price' => $reservePrice ?? 0,
                'stock' => $stock,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'discount_type' => $discountType,
                'discount_value' => $discountValue,
                'variations' => $variations,
                'source_url' => $validated['url'],
                'source_domain' => $sourceDomain,
                'scraped_title' => $title,
                'scraped_description' => $description,
            ];

            $listing = Listing::create([
                'title' => $title,
                'description' => $description,
                'user_id' => $validated['user_id'],
                'category_id' => $validated['category_id'],
                'sub_category_id' => $validated['sub_category_id'] ?: null,
                'child_category_id' => $validated['child_category_id'] ?: null,
                'listing_type' => $listingType,
                'image' => $coverImage,
                'album' => $downloadedImages,
                'listing_source' => 'olx',
                'listing_data' => $listingData,
                'status' => 'active',
                'is_autobidder_on' => $listingType === 'auction',
            ]);
        } catch (\Throwable $e) {
            Log::error('OLX save failed', [
                'url' => $validated['url'],
                'message' => $e->getMessage(),
            ]);

            return redirect()
                ->route('admin.olx-scraper.index', ['url' => $validated['url']])
                ->with('error', 'Save failed: ' . $e->getMessage());
        }

        return redirect()
            ->route('admin.olx-scraper.index', ['url' => $validated['url']])
            ->with('success', 'OLX listing saved successfully. Listing ID: ' . $listing->id);
    }

    protected function pageProps(array $overrides = []): array
    {
        return array_merge([
            'users' => User::query()
                ->select('id', 'name', 'email', 'profile_pic')
                ->orderBy('name')
                ->get(),
            'categories' => AuctionCategory::query()
                ->select('id', 'name', 'parent_id', 'sub_category_id', 'slug')
                ->with([
                    'subCategories' => fn ($query) => $query
                        ->select('id', 'name', 'parent_id', 'sub_category_id', 'slug')
                        ->with([
                            'childCategories' => fn ($childQuery) => $childQuery
                                ->select('id', 'name', 'parent_id', 'sub_category_id', 'slug'),
                        ])
                        ->orderBy('name'),
                ])
                ->whereNull('parent_id')
                ->whereNull('sub_category_id')
                ->orderBy('name')
                ->get(),
            'preview' => null,
            'error' => null,
            'status' => null,
            'raw' => null,
            'url' => '',
            'preview_images' => [],
        ], $overrides);
    }

    protected function resolveListingImages(Request $request, array $scrapedImages, ?string $sourceUrl = null): array
    {
        if (!$request->boolean('images_managed')) {
            return $this->downloadImages($scrapedImages, $sourceUrl);
        }

        $keptUrls = array_values(array_filter((array) $request->input('kept_images', [])));
        $downloaded = $this->downloadImages($keptUrls, $sourceUrl);
        $uploaded = $this->storeUploadedImages($request->file('new_images', []) ?: []);

        return array_values(array_merge($downloaded, $uploaded));
    }

    protected function storeUploadedImages(array $files): array
    {
        $savedImages = [];
        $directory = public_path('assets/images/auction');
        File::ensureDirectoryExists($directory);

        foreach (array_values(array_filter($files)) as $index => $file) {
            if (!$file || !$file->isValid()) {
                continue;
            }

            $extension = strtolower($file->getClientOriginalExtension() ?: 'jpg');
            $extension = in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'], true) ? $extension : 'jpg';
            $filename = time() . '_olx_upload_' . Str::random(12) . '_' . $index . '.' . $extension;
            $file->move($directory, $filename);
            $savedImages[] = '/assets/images/auction/' . $filename;
        }

        return $savedImages;
    }

    protected function downloadImages(array $imageUrls, ?string $sourceUrl = null): array
    {
        $savedImages = [];
        $directory = public_path('assets/images/auction');
        File::ensureDirectoryExists($directory);

        $headers = [
            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
            'Accept' => 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        ];

        if ($sourceUrl) {
            $headers['Referer'] = $this->imageReferer($sourceUrl);
            if ($origin = $this->originFromUrl($sourceUrl)) {
                $headers['Origin'] = $origin;
            }
        }

        foreach (array_values(array_filter($imageUrls)) as $index => $imageUrl) {
            try {
                if (!filter_var($imageUrl, FILTER_VALIDATE_URL)) {
                    continue;
                }

                $response = Http::withHeaders($headers)->timeout(12)->get($imageUrl);
                if (!$response->successful()) {
                    continue;
                }

                $path = parse_url($imageUrl, PHP_URL_PATH) ?: '';
                $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION)) ?: 'jpg';
                $extension = in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'bmp', 'svg'], true)
                    ? $extension
                    : 'jpg';

                $filename = time() . '_olx_' . Str::random(12) . '_' . $index . '.' . $extension;
                file_put_contents($directory . DIRECTORY_SEPARATOR . $filename, $response->body());
                $savedImages[] = '/assets/images/auction/' . $filename;
            } catch (\Throwable $e) {
                Log::warning('OLX image download failed', [
                    'url' => $imageUrl,
                    'message' => $e->getMessage(),
                ]);
            }
        }

        return $savedImages;
    }

    protected function normalizeVariations(array $variations): array
    {
        $normalized = [];

        foreach ($variations as $variation) {
            if (!is_array($variation)) {
                continue;
            }

            $name = trim((string) ($variation['name'] ?? ''));
            if ($name === '') {
                continue;
            }

            $discountType = in_array($variation['discount_type'] ?? '', ['percent', 'flat'], true)
                ? $variation['discount_type']
                : null;

            $normalized[] = [
                'name' => Str::limit($name, 255, ''),
                'price' => $this->normalizeNumeric($variation['price'] ?? null),
                'discount_type' => $discountType,
                'discount_value' => $discountType ? $this->normalizeNumeric($variation['discount_value'] ?? null) : null,
            ];
        }

        return $normalized;
    }

    protected function numericOrFallback(mixed $primary, mixed $fallback): ?float
    {
        $value = $this->normalizeNumeric($primary);
        if ($value !== null) {
            return $value;
        }

        return $this->normalizeNumeric($fallback);
    }

    protected function normalizeNumeric(mixed $value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_numeric($value)) {
            return (float) $value;
        }

        if (is_string($value)) {
            $clean = preg_replace('/[^\d.]+/', '', $value) ?? '';
            return $clean !== '' && is_numeric($clean) ? (float) $clean : null;
        }

        return null;
    }

    protected function imageReferer(string $url): string
    {
        $origin = $this->originFromUrl($url);
        return $origin ?: $url;
    }

    protected function originFromUrl(string $url): ?string
    {
        $parts = parse_url($url);
        if (!$parts || empty($parts['scheme']) || empty($parts['host'])) {
            return null;
        }

        return $parts['scheme'] . '://' . $parts['host'];
    }
}
