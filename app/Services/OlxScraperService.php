<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;
use DOMDocument;
use DOMXPath;

class OlxScraperService
{
    public function scrape(string $url): array
    {
        $response = Http::withHeaders([
            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
            'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language' => 'en-US,en;q=0.9',
            'Cache-Control' => 'no-cache',
            'Pragma' => 'no-cache',
        ])->timeout(30)->retry(1, 500)->get($url);

        if (!$response->successful()) {
            throw new RuntimeException('OLX returned HTTP ' . $response->status());
        }

        $html = $response->body();
        if (trim($html) === '') {
            throw new RuntimeException('OLX returned an empty response.');
        }

        return $this->parseHtml($html, $url);
    }

    protected function parseHtml(string $html, string $url): array
    {
        libxml_use_internal_errors(true);

        $dom = new DOMDocument();
        $dom->loadHTML($html, LIBXML_NOWARNING | LIBXML_NOERROR | LIBXML_NONET);
        $xpath = new DOMXPath($dom);

        $title = $this->firstText($xpath, [
            '//meta[@property="og:title"]/@content',
            '//meta[@name="twitter:title"]/@content',
            '//h1[normalize-space()]',
            '//title',
        ]);

        $description = $this->firstText($xpath, [
            '//meta[@property="og:description"]/@content',
            '//meta[@name="description"]/@content',
            '//*[@aria-label="Description"]',
            '//*[@data-aut-id="itemDescriptionContent"]',
            '//*[contains(@class, "description")]',
        ]);

        $price = $this->firstText($xpath, [
            '//*[@aria-label="Price"]',
            '//*[@data-aut-id="itemPrice"]',
            '//meta[@property="product:price:amount"]/@content',
            '//meta[@property="og:price:amount"]/@content',
        ]);

        $location = $this->firstText($xpath, [
            '//*[@aria-label="Location"]',
            '//*[@data-aut-id="itemLocation"]',
            '//*[contains(@class, "location")]',
        ]);

        $images = $this->extractImages($xpath, $html, $url);
        $normalizedPrice = $this->normalizePrice($price);

        return [
            'title' => $this->normalizeTitle($title),
            'description' => $this->normalizeDescription($description),
            'images' => $images,
            'location_text' => $this->normalizeText($location),
            'price' => $normalizedPrice,
            'variations' => $this->extractVariations($xpath, $normalizedPrice),
            'minimum_bid' => 0,
            'reserve_price' => 0,
            'source_url' => $url,
            'source_domain' => parse_url($url, PHP_URL_HOST),
        ];
    }

    protected function extractVariations(DOMXPath $xpath, ?string $fallbackPrice): array
    {
        $parameters = $this->extractParameters($xpath);
        if ($parameters === []) {
            return [];
        }

        $nameParts = [];
        foreach (['color', 'colour', 'size', 'variant', 'storage', 'ram', 'memory'] as $key) {
            if (!empty($parameters[$key])) {
                $nameParts[] = $parameters[$key];
            }
        }

        $name = implode(' / ', array_values(array_unique(array_filter($nameParts))));
        if ($name === '') {
            return [];
        }

        return [[
            'name' => $name,
            'price' => $fallbackPrice ?? '',
            'discount_type' => '',
            'discount_value' => '',
        ]];
    }

    protected function extractParameters(DOMXPath $xpath): array
    {
        $parameters = [];
        $queries = [
            '//*[@data-aut-id="itemParameters"]//li',
            '//*[@data-aut-id="itemParams"]//li',
            '//ul[contains(@class, "parameters")]//li',
        ];

        foreach ($queries as $query) {
            $nodes = $xpath->query($query);
            if (!$nodes || $nodes->length === 0) {
                continue;
            }

            foreach ($nodes as $node) {
                $text = $this->normalizeText($node->textContent ?? '');
                if ($text === '') {
                    continue;
                }

                $label = '';
                $value = '';
                if (preg_match('/^(.+?)[:\-]\s*(.+)$/u', $text, $matches)) {
                    $label = $this->normalizeText($matches[1]);
                    $value = $this->normalizeText($matches[2]);
                } else {
                    $spans = [];
                    foreach ($node->childNodes as $child) {
                        $childText = $this->normalizeText($child->textContent ?? '');
                        if ($childText !== '') {
                            $spans[] = $childText;
                        }
                    }

                    if (count($spans) >= 2) {
                        $label = $spans[0];
                        $value = $spans[count($spans) - 1];
                    }
                }

                $key = strtolower(preg_replace('/[^a-z]+/i', '', $label) ?? '');
                if ($key !== '' && $value !== '') {
                    $parameters[$key] = $value;
                }
            }

            if ($parameters !== []) {
                break;
            }
        }

        return $parameters;
    }

    protected function firstText(DOMXPath $xpath, array $queries): ?string
    {
        foreach ($queries as $query) {
            $nodes = $xpath->query($query);
            if ($nodes && $nodes->length > 0) {
                $text = trim($nodes->item(0)?->textContent ?? '');
                $text = $this->normalizeText($text);
                if ($text !== '') {
                    return $text;
                }
            }
        }

        return null;
    }

    protected function extractImages(DOMXPath $xpath, string $html, string $url): array
    {
        $images = [];
        $seen = [];
        $candidates = [];

        foreach ($this->extractGalleryDomImages($xpath, $url) as $imageUrl) {
            $candidates[] = $imageUrl;
        }

        if (empty($candidates)) {
            foreach ($this->extractJsonLdImages($xpath) as $imageUrl) {
                $candidates[] = $imageUrl;
            }

            foreach ([
                '//meta[@property="og:image"]/@content',
                '//meta[@property="og:image:secure_url"]/@content',
                '//meta[@name="twitter:image"]/@content',
            ] as $query) {
                $nodes = $xpath->query($query);
                if (!$nodes) {
                    continue;
                }

                foreach ($nodes as $node) {
                    $candidates[] = $node->nodeValue;
                }
            }
        }

        foreach ($candidates as $candidate) {
            $normalized = $this->normalizeUrl($candidate, $url);
            if ($normalized === null) {
                continue;
            }

            $normalized = $this->upgradeImageUrl($normalized);

            $key = $this->canonicalImageKey($normalized);
            if (isset($seen[$key])) {
                continue;
            }

            $lower = strtolower($normalized);
            if ($this->looksLikeNoiseImage($lower)) {
                continue;
            }

            $seen[$key] = true;
            $images[] = $normalized;

            if (count($images) >= 8) {
                break;
            }
        }

        return array_values($images);
    }

    protected function extractGalleryDomImages(DOMXPath $xpath, string $baseUrl): array
    {
        $images = [];

        $slides = $xpath->query('//div[contains(@class, "image-gallery-slides")]//picture');
        if (!$slides) {
            return $images;
        }

        foreach ($slides as $picture) {
            foreach ($xpath->query('.//source/@srcset | .//img/@src | .//img/@data-src', $picture) as $node) {
                $candidate = null;

                if ($node->nodeName === 'srcset') {
                    $candidate = $this->bestFromSrcset($node->nodeValue);
                } else {
                    $candidate = $node->nodeValue;
                }

                $normalized = $this->normalizeUrl($candidate, $baseUrl);
                if ($normalized) {
                    $images[] = $normalized;
                }
            }
        }

        return array_values(array_unique(array_filter($images)));
    }

    protected function extractJsonLdImages(DOMXPath $xpath): array
    {
        $images = [];

        $nodes = $xpath->query('//script[@type="application/ld+json"]');
        if (!$nodes) {
            return $images;
        }

        foreach ($nodes as $node) {
            $json = trim($node->textContent ?? '');
            if ($json === '') {
                continue;
            }

            $decoded = json_decode($json, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                continue;
            }

            foreach ($this->collectJsonLdImages($decoded) as $image) {
                $images[] = $image;
            }
        }

        return array_values(array_unique(array_filter($images)));
    }

    protected function collectJsonLdImages(mixed $payload): array
    {
        $images = [];

        if (is_array($payload)) {
            if (isset($payload['image'])) {
                $images = array_merge($images, $this->collectJsonLdImages($payload['image']));
            }

            foreach ($payload as $value) {
                if (is_array($value)) {
                    $images = array_merge($images, $this->collectJsonLdImages($value));
                } elseif (is_string($value) && filter_var($value, FILTER_VALIDATE_URL)) {
                    $images[] = $value;
                }
            }
        } elseif (is_string($payload) && filter_var($payload, FILTER_VALIDATE_URL)) {
            $images[] = $payload;
        }

        return array_values(array_unique(array_filter($images)));
    }

    protected function looksLikeNoiseImage(string $url): bool
    {
        $noiseTerms = [
            'logo',
            'icon',
            'sprite',
            'avatar',
            'banner',
            'placeholder',
            'favicon',
            'analytics',
            'pixel',
            'tracking',
            'badge',
            'share',
        ];

        foreach ($noiseTerms as $term) {
            if (str_contains($url, $term)) {
                return true;
            }
        }

        $allowedHosts = [
            'olx',
            'olxcdn',
            'apollo',
            'cdn.olx',
        ];

        $host = parse_url($url, PHP_URL_HOST) ?: '';
        if ($host !== '') {
            if (str_contains($host, 'images.olx.com.pk') && str_contains($url, '/thumbnails/')) {
                return false;
            }

            foreach ($allowedHosts as $allowedHost) {
                if (str_contains($host, $allowedHost)) {
                    return false;
                }
            }
        }

        $path = parse_url($url, PHP_URL_PATH) ?: '';
        if ($path === '') {
            return true;
        }

        return !preg_match('/\.(jpe?g|png|gif|webp|avif|bmp|svg)(\?|$)/i', $path);
    }

    /**
     * Pick the largest width candidate from a srcset (not the first/smallest).
     */
    protected function bestFromSrcset(?string $srcset): ?string
    {
        $srcset = trim((string) $srcset);
        if ($srcset === '') {
            return null;
        }

        $bestUrl = null;
        $bestScore = -1;

        foreach (explode(',', $srcset) as $entry) {
            $entry = trim($entry);
            if ($entry === '') {
                continue;
            }

            $parts = preg_split('/\s+/', $entry) ?: [];
            $url = $parts[0] ?? null;
            if (!$url) {
                continue;
            }

            $score = 0;
            $descriptor = $parts[1] ?? '';
            if (preg_match('/(\d+)w/i', $descriptor, $matches)) {
                $score = (int) $matches[1];
            } elseif (preg_match('/([\d.]+)x/i', $descriptor, $matches)) {
                $score = (int) round(((float) $matches[1]) * 1000);
            }

            if ($score >= $bestScore) {
                $bestScore = $score;
                $bestUrl = $url;
            }
        }

        return $bestUrl;
    }

    /**
     * Prefer full OLX asset over sized thumbnail variants.
     * e.g. /thumbnails/123-300x225.jpg → /thumbnails/123.jpg
     */
    protected function upgradeImageUrl(string $url): string
    {
        $upgraded = preg_replace(
            '~/thumbnails/(\d+)-\d+x\d+\.(jpe?g|webp|png)~i',
            '/thumbnails/$1.$2',
            $url
        );

        return is_string($upgraded) && $upgraded !== '' ? $upgraded : $url;
    }

    protected function firstFromSrcset(?string $srcset): ?string
    {
        return $this->bestFromSrcset($srcset);
    }

    protected function normalizeUrl(?string $value, string $baseUrl): ?string
    {
        $value = trim((string) $value);
        if ($value === '') {
            return null;
        }

        if (str_starts_with($value, 'data:')) {
            return null;
        }

        if (str_starts_with($value, '//')) {
            return 'https:' . $value;
        }

        if (str_starts_with($value, '/')) {
            $base = parse_url($baseUrl);
            if (!$base || empty($base['scheme']) || empty($base['host'])) {
                return null;
            }

            return $base['scheme'] . '://' . $base['host'] . $value;
        }

        if (filter_var($value, FILTER_VALIDATE_URL)) {
            return $value;
        }

        return null;
    }

    protected function canonicalImageKey(string $url): string
    {
        $host = strtolower(parse_url($url, PHP_URL_HOST) ?: '');
        $path = strtolower(parse_url($url, PHP_URL_PATH) ?: $url);

        if ($host === 'images.olx.com.pk' && preg_match('~/thumbnails/(\d+)(?:-\d+x\d+)?\.(?:jpe?g|webp|png)$~i', $path, $matches)) {
            return $host . ':' . $matches[1];
        }

        return $host . ':' . preg_replace('~/+$~', '', $path);
    }

    protected function normalizeText(?string $value): string
    {
        return trim(preg_replace('/\s+/u', ' ', (string) $value) ?? '');
    }

    protected function normalizeTitle(?string $value): string
    {
        $title = $this->normalizeText($value);
        return $title ?: 'No title';
    }

    protected function normalizeDescription(?string $value): string
    {
        return $this->normalizeText($value);
    }

    protected function normalizePrice(?string $value): ?string
    {
        $text = $this->normalizeText($value);
        if ($text === '') {
            return null;
        }

        if (preg_match('/Rs\.?\s*([\d,.]+)\s*Lac/i', $text, $matches)) {
            return (string) ((float) str_replace(',', '', $matches[1]) * 100000);
        }

        if (preg_match('/Rs\.?\s*([\d,.]+)/i', $text, $matches)) {
            return str_replace(',', '', $matches[1]);
        }

        if (preg_match('/([\d,.]+)/', $text, $matches)) {
            return str_replace(',', '', $matches[1]);
        }

        return null;
    }
}
