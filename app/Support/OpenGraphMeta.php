<?php

namespace App\Support;

use Illuminate\Support\Str;

class OpenGraphMeta
{
    public const DEFAULT_SITE_NAME = 'XpertBid';
    public const DEFAULT_BANNER = '/assets/images/WebsiteBanner2.png';
    public const DEFAULT_DESCRIPTION = 'Discover verified listings, online auctions, and marketplace deals in Pakistan on XpertBid.';

    /**
     * Build an array of meta tags (Open Graph, Twitter, Canonical) from the Inertia page data.
     *
     * @param array $page
     * @return array<string, string>
     */
    public static function tagsFromInertiaPage(array $page): array
    {
        $props = $page['props'] ?? [];
        $siteName = self::siteName();

        $auction = data_get($props, 'auction');
        if (is_array($auction) && !empty($auction)) {
            return self::buildAuctionTags($auction, $siteName);
        }

        $blog = data_get($props, 'blog');
        if (is_array($blog) && !empty($blog)) {
            return self::buildBlogTags($blog, $siteName);
        }

        return self::buildDefaultTags($siteName);
    }

    /**
     * Render the meta tags as an HTML string suitable for inclusion in the <head>.
     *
     * @param array $page
     * @return string
     */
    public static function renderHtml(array $page): string
    {
        $tags = self::tagsFromInertiaPage($page);
        if (empty($tags)) {
            return '';
        }

        $lines = [];
        foreach ($tags as $key => $content) {
            if ($content === null || $content === '') {
                continue;
            }

            $escapedContent = e($content);
            $escapedKey = e($key);

            if ($key === 'canonical') {
                $lines[] = '<link rel="canonical" href="' . $escapedContent . '" head-key="canonical">';
            } elseif ($key === 'description') {
                $lines[] = '<meta name="description" content="' . $escapedContent . '" head-key="description">';
            } elseif (str_starts_with($key, 'twitter:')) {
                $lines[] = '<meta name="' . $escapedKey . '" content="' . $escapedContent . '" head-key="' . $escapedKey . '">';
            } else {
                $lines[] = '<meta property="' . $escapedKey . '" content="' . $escapedContent . '" head-key="' . $escapedKey . '">';
            }
        }

        return implode("\n        ", $lines);
    }

    /**
     * Get the dynamic title for the initial server-rendered <title> tag.
     *
     * @param array $page
     * @return string
     */
    public static function pageTitle(array $page): string
    {
        $siteName = self::siteName();
        $props = $page['props'] ?? [];

        $auctionTitle = data_get($props, 'auction.title');
        if (!empty($auctionTitle)) {
            return trim($auctionTitle) . ' - ' . $siteName;
        }

        $blogTitle = data_get($props, 'blog.title');
        if (!empty($blogTitle)) {
            return trim($blogTitle) . ' - ' . $siteName;
        }

        return $siteName . ' - Online Auction & Marketplace';
    }

    /**
     * Build OG tags specifically for an auction/listing product.
     *
     * @param array $auction
     * @param string $siteName
     * @return array<string, string>
     */
    protected static function buildAuctionTags(array $auction, string $siteName): array
    {
        $rawTitle = trim((string) data_get($auction, 'title', ''));
        $location = trim((string) data_get($auction, 'product_location', ''));

        if (!empty($rawTitle)) {
            $displayTitle = !empty($location)
                ? "{$rawTitle} in {$location} | {$siteName}"
                : "{$rawTitle} | {$siteName}";
        } else {
            $displayTitle = $siteName;
        }

        $rawDesc = (string) data_get($auction, 'description', '');
        $cleanDesc = self::cleanDescription($rawDesc);
        if ($cleanDesc === '') {
            $cleanDesc = !empty($rawTitle)
                ? "Check out {$rawTitle} on {$siteName}. Buy, bid, and connect with verified sellers."
                : self::DEFAULT_DESCRIPTION;
        }

        $slug = data_get($auction, 'slug');
        $canonicalUrl = !empty($slug) ? url('/product/' . $slug) : url()->current();

        $imageUrl = self::resolveAuctionImageUrl($auction);

        return [
            'description' => $cleanDesc,
            'og:type' => 'website',
            'og:site_name' => $siteName,
            'og:title' => $displayTitle,
            'og:description' => $cleanDesc,
            'og:url' => $canonicalUrl,
            'og:image' => $imageUrl,
            'og:image:secure_url' => $imageUrl,
            'og:image:alt' => $rawTitle !== '' ? $rawTitle : $siteName,
            'twitter:card' => 'summary_large_image',
            'twitter:title' => $displayTitle,
            'twitter:description' => $cleanDesc,
            'twitter:image' => $imageUrl,
            'canonical' => $canonicalUrl,
        ];
    }

    /**
     * Build OG tags for a blog post.
     *
     * @param array $blog
     * @param string $siteName
     * @return array<string, string>
     */
    protected static function buildBlogTags(array $blog, string $siteName): array
    {
        $rawTitle = trim((string) data_get($blog, 'title', ''));
        $displayTitle = !empty($rawTitle) ? "{$rawTitle} | {$siteName}" : $siteName;

        $rawDesc = (string) data_get($blog, 'description', data_get($blog, 'short_description', ''));
        $cleanDesc = self::cleanDescription($rawDesc);
        if ($cleanDesc === '') {
            $cleanDesc = self::DEFAULT_DESCRIPTION;
        }

        $slug = data_get($blog, 'slug');
        $canonicalUrl = !empty($slug) ? url('/blogs/' . $slug) : url()->current();

        $rawImage = data_get($blog, 'image');
        $imageUrl = !empty($rawImage) ? self::toAbsoluteUrl($rawImage) : self::toAbsoluteUrl(self::DEFAULT_BANNER);

        return [
            'description' => $cleanDesc,
            'og:type' => 'article',
            'og:site_name' => $siteName,
            'og:title' => $displayTitle,
            'og:description' => $cleanDesc,
            'og:url' => $canonicalUrl,
            'og:image' => $imageUrl,
            'og:image:secure_url' => $imageUrl,
            'twitter:card' => 'summary_large_image',
            'twitter:title' => $displayTitle,
            'twitter:description' => $cleanDesc,
            'twitter:image' => $imageUrl,
            'canonical' => $canonicalUrl,
        ];
    }

    /**
     * Fallback default OG tags for general pages.
     *
     * @param string $siteName
     * @return array<string, string>
     */
    protected static function buildDefaultTags(string $siteName): array
    {
        $imageUrl = self::toAbsoluteUrl(self::DEFAULT_BANNER);
        $url = url()->current();
        $title = "{$siteName} - Online Auction & Marketplace";

        return [
            'description' => self::DEFAULT_DESCRIPTION,
            'og:type' => 'website',
            'og:site_name' => $siteName,
            'og:title' => $title,
            'og:description' => self::DEFAULT_DESCRIPTION,
            'og:url' => $url,
            'og:image' => $imageUrl,
            'og:image:secure_url' => $imageUrl,
            'twitter:card' => 'summary_large_image',
            'twitter:title' => $title,
            'twitter:description' => self::DEFAULT_DESCRIPTION,
            'twitter:image' => $imageUrl,
            'canonical' => $url,
        ];
    }

    /**
     * Clean and truncate description text for meta tags.
     *
     * @param string $description
     * @param int $limit
     * @return string
     */
    public static function cleanDescription(string $description, int $limit = 160): string
    {
        $clean = strip_tags($description);
        $clean = html_entity_decode($clean, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $clean = trim((string) preg_replace('/\s+/', ' ', $clean));

        return Str::limit($clean, $limit);
    }

    /**
     * Resolve the absolute image URL for an auction.
     *
     * @param array $auction
     * @return string
     */
    protected static function resolveAuctionImageUrl(array $auction): string
    {
        $rawImage = data_get($auction, 'image_url');

        if (empty($rawImage)) {
            $album = data_get($auction, 'album_urls');
            if (is_array($album) && !empty($album)) {
                $rawImage = $album[0] ?? null;
            }
        }

        if (empty($rawImage)) {
            $directImage = data_get($auction, 'image');
            if (!empty($directImage) && class_exists(ListingMedia::class)) {
                $rawImage = ListingMedia::buildAssetUrl($directImage);
            }
        }

        if (empty($rawImage)) {
            $rawImage = self::DEFAULT_BANNER;
        }

        return self::toAbsoluteUrl((string) $rawImage);
    }

    /**
     * Convert any relative path or asset path to a fully qualified URL.
     *
     * @param string $path
     * @return string
     */
    protected static function toAbsoluteUrl(string $path): string
    {
        $trimmed = trim($path);
        if (str_starts_with($trimmed, 'http://') || str_starts_with($trimmed, 'https://')) {
            return $trimmed;
        }

        return url(ltrim($trimmed, '/'));
    }

    /**
     * Resolve the clean site name.
     *
     * @return string
     */
    protected static function siteName(): string
    {
        $name = config('app.name', self::DEFAULT_SITE_NAME);
        if (empty($name) || strtolower($name) === 'laravel') {
            return self::DEFAULT_SITE_NAME;
        }

        return $name;
    }
}

