<?php

namespace App\Http\Controllers;

use App\Models\AuctionCategory;
use App\Models\Blog;
use App\Models\Brand;
use App\Models\Listing;
use App\Models\Mall;
use Carbon\Carbon;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class SitemapController extends Controller
{
    private const PRODUCTS_PER_SITEMAP = 40000;

    public function index(): Response
    {
        $base = rtrim((string) config('app.url'), '/');
        $now = now()->toAtomString();

        $productPages = (int) ceil(max(1, $this->productCount()) / self::PRODUCTS_PER_SITEMAP);

        $sitemaps = [
            ['loc' => "{$base}/sitemap/static.xml", 'lastmod' => $now],
            ['loc' => "{$base}/sitemap/categories.xml", 'lastmod' => $now],
            ['loc' => "{$base}/sitemap/blogs.xml", 'lastmod' => $now],
            ['loc' => "{$base}/sitemap/brands.xml", 'lastmod' => $now],
            ['loc' => "{$base}/sitemap/malls.xml", 'lastmod' => $now],
        ];

        for ($page = 1; $page <= $productPages; $page++) {
            $sitemaps[] = [
                'loc' => "{$base}/sitemap/products-{$page}.xml",
                'lastmod' => $now,
            ];
        }

        $xml = view('sitemap.index', ['sitemaps' => $sitemaps])->render();

        return $this->xmlResponse($xml);
    }

    public function staticPages(): Response
    {
        $base = rtrim((string) config('app.url'), '/');
        $now = now();

        $urls = [
            $this->urlEntry("{$base}/", $now, 'daily', '1.0'),
            $this->urlEntry("{$base}/marketplace", $now, 'daily', '0.9'),
            $this->urlEntry("{$base}/categories", $now, 'weekly', '0.8'),
            $this->urlEntry("{$base}/brands", $now, 'weekly', '0.7'),
            $this->urlEntry("{$base}/blogs", $now, 'daily', '0.7'),
            $this->urlEntry("{$base}/malls", $now, 'weekly', '0.7'),
            $this->urlEntry("{$base}/live-auctions", $now, 'hourly', '0.8'),
            $this->urlEntry("{$base}/1-rupee-auctions", $now, 'daily', '0.7'),
            $this->urlEntry("{$base}/about", $now, 'monthly', '0.5'),
            $this->urlEntry("{$base}/about-our-partner", $now, 'monthly', '0.4'),
            $this->urlEntry("{$base}/contact", $now, 'monthly', '0.5'),
            $this->urlEntry("{$base}/faq", $now, 'monthly', '0.5'),
            $this->urlEntry("{$base}/privacy-policy", $now, 'yearly', '0.3'),
            $this->urlEntry("{$base}/refund-policy", $now, 'yearly', '0.3'),
            $this->urlEntry("{$base}/shipping-policy", $now, 'yearly', '0.3'),
            $this->urlEntry("{$base}/seller-policy", $now, 'yearly', '0.3'),
            $this->urlEntry("{$base}/terms", $now, 'yearly', '0.3'),
            $this->urlEntry("{$base}/easy-home", $now, 'monthly', '0.4'),
        ];

        return $this->xmlResponse(view('sitemap.urlset', ['urls' => $urls])->render());
    }

    public function categories(): Response
    {
        $base = rtrim((string) config('app.url'), '/');
        $types = ['auctions', 'normal-products', 'business-products'];

        $categories = AuctionCategory::query()
            ->whereNotNull('slug')
            ->where('slug', '!=', '')
            ->orderBy('id')
            ->get(['id', 'slug', 'updated_at', 'created_at']);

        $urls = [];
        foreach ($categories as $category) {
            $lastmod = $category->updated_at ?: $category->created_at ?: now();
            foreach ($types as $typeSlug) {
                $urls[] = $this->urlEntry(
                    "{$base}/marketplace/{$category->slug}/{$typeSlug}",
                    $lastmod,
                    'daily',
                    '0.7'
                );
            }
        }

        return $this->xmlResponse(view('sitemap.urlset', ['urls' => $urls])->render());
    }

    public function products(int $page = 1): Response
    {
        $page = max(1, $page);
        $base = rtrim((string) config('app.url'), '/');

        $listings = $this->productQuery()
            ->forPage($page, self::PRODUCTS_PER_SITEMAP)
            ->get(['slug', 'updated_at', 'created_at']);

        $urls = $listings->map(function (Listing $listing) use ($base) {
            return $this->urlEntry(
                "{$base}/product/{$listing->slug}",
                $listing->updated_at ?: $listing->created_at ?: now(),
                'daily',
                '0.8'
            );
        })->all();

        return $this->xmlResponse(view('sitemap.urlset', ['urls' => $urls])->render());
    }

    public function blogs(): Response
    {
        $base = rtrim((string) config('app.url'), '/');

        $urls = Blog::query()
            ->whereNotNull('slug')
            ->where('slug', '!=', '')
            ->orderByDesc('updated_at')
            ->get(['slug', 'updated_at', 'created_at'])
            ->map(function (Blog $blog) use ($base) {
                return $this->urlEntry(
                    "{$base}/blogs/{$blog->slug}",
                    $blog->updated_at ?: $blog->created_at ?: now(),
                    'weekly',
                    '0.6'
                );
            })
            ->all();

        return $this->xmlResponse(view('sitemap.urlset', ['urls' => $urls])->render());
    }

    public function brands(): Response
    {
        $base = rtrim((string) config('app.url'), '/');

        $urls = Brand::query()
            ->whereNotNull('slug')
            ->where('slug', '!=', '')
            ->orderBy('id')
            ->get(['slug', 'updated_at', 'created_at'])
            ->map(function (Brand $brand) use ($base) {
                return $this->urlEntry(
                    "{$base}/properties-brand/{$brand->slug}",
                    $brand->updated_at ?: $brand->created_at ?: now(),
                    'weekly',
                    '0.5'
                );
            })
            ->all();

        return $this->xmlResponse(view('sitemap.urlset', ['urls' => $urls])->render());
    }

    public function malls(): Response
    {
        $base = rtrim((string) config('app.url'), '/');

        $urls = Mall::query()
            ->where('status', 'active')
            ->whereNotNull('slug')
            ->where('slug', '!=', '')
            ->orderBy('id')
            ->get(['slug', 'updated_at', 'created_at'])
            ->map(function (Mall $mall) use ($base) {
                return $this->urlEntry(
                    "{$base}/malls/{$mall->slug}",
                    $mall->updated_at ?: $mall->created_at ?: now(),
                    'weekly',
                    '0.6'
                );
            })
            ->all();

        return $this->xmlResponse(view('sitemap.urlset', ['urls' => $urls])->render());
    }

    protected function productQuery()
    {
        $query = Listing::query()
            ->browseable()
            ->whereNotNull('slug')
            ->where('slug', '!=', '')
            ->where(function ($q) {
                $q->whereNull('listing_type')
                    ->orWhere('listing_type', '!=', 'live_auction');
            })
            ->orderBy('id');

        // Property listings belong on property.xpertbid.com sitemap — skip on main site.
        $propertyIds = Listing::propertyCategoryIds();
        if ($propertyIds !== []) {
            $query->where(function ($q) use ($propertyIds) {
                $q->where(function ($inner) use ($propertyIds) {
                    $inner->whereNull('category_id')->orWhereNotIn('category_id', $propertyIds);
                })->where(function ($inner) use ($propertyIds) {
                    $inner->whereNull('sub_category_id')->orWhereNotIn('sub_category_id', $propertyIds);
                })->where(function ($inner) use ($propertyIds) {
                    $inner->whereNull('child_category_id')->orWhereNotIn('child_category_id', $propertyIds);
                });
            });
        }

        return $query;
    }

    protected function productCount(): int
    {
        return (int) Cache::remember('sitemap.product_count', now()->addMinutes(30), function () {
            return $this->productQuery()->count();
        });
    }

    protected function urlEntry(string $loc, $lastmod, string $changefreq, string $priority): array
    {
        $lastmodValue = $lastmod instanceof Carbon
            ? $lastmod
            : Carbon::parse($lastmod);

        return [
            'loc' => $loc,
            'lastmod' => $lastmodValue->toAtomString(),
            'changefreq' => $changefreq,
            'priority' => $priority,
        ];
    }

    protected function xmlResponse(string $xml): Response
    {
        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
            'Cache-Control' => 'public, max-age=1800',
        ]);
    }
}
