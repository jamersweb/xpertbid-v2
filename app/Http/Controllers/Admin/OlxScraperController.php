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
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'minimum_bid' => ['nullable', 'numeric', 'min:0'],
            'reserve_price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
        ]);

        try {
            $scraped = $this->scraper->scrape($validated['url']);
        } catch (\Throwable $e) {
            Log::error('OLX save scrape failed', [
                'url' => $validated['url'],
                'message' => $e->getMessage(),
            ]);

            return back()
                ->withInput()
                ->with('error', 'Scrape failed: ' . $e->getMessage());
        }

        $title = trim((string) ($validated['title'] ?? '')) ?: ($scraped['title'] ?? 'No title');
        $description = trim((string) ($validated['description'] ?? '')) ?: ($scraped['description'] ?? '');
        $listingType = $validated['listing_type'] ?? 'auction';
        $minimumBid = $this->numericOrFallback($validated['minimum_bid'] ?? null, $scraped['minimum_bid'] ?? null);
        $reservePrice = $this->numericOrFallback($validated['reserve_price'] ?? null, $scraped['reserve_price'] ?? null);
        $price = $this->numericOrFallback($validated['price'] ?? null, $scraped['price'] ?? null);
        $stock = isset($validated['stock']) && $validated['stock'] !== '' ? (int) $validated['stock'] : null;
        $startDate = $validated['start_date'] ?? null;
        $endDate = $validated['end_date'] ?? null;

        if ($title === '' || $title === 'No title') {
            return back()->withInput()->with('error', 'OLX title could not be detected. Please enter it manually.');
        }

        $downloadedImages = $this->downloadImages($scraped['images'] ?? []);
        $coverImage = $downloadedImages[0] ?? null;

        $listingData = [
            'price' => $price,
            'minimum_bid' => $minimumBid ?? 0,
            'reserve_price' => $reservePrice ?? 0,
            'stock' => $stock,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'source_url' => $validated['url'],
            'source_domain' => $scraped['source_domain'] ?? null,
            'scraped_title' => $scraped['title'] ?? null,
            'scraped_description' => $scraped['description'] ?? null,
            'scraped_location' => $scraped['location_text'] ?? null,
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

    protected function downloadImages(array $imageUrls): array
    {
        $savedImages = [];
        $directory = public_path('assets/images/auction');
        File::ensureDirectoryExists($directory);

        foreach (array_values(array_filter($imageUrls)) as $index => $imageUrl) {
            try {
                if (!filter_var($imageUrl, FILTER_VALIDATE_URL)) {
                    continue;
                }

                $response = Http::timeout(30)->retry(1, 500)->get($imageUrl);
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
}
