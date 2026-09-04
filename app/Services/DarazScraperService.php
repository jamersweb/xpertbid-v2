<?php

namespace App\Services;

use DOMDocument;
use DOMXPath;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Symfony\Component\Process\ExecutableFinder;
use Symfony\Component\Process\Process;
use RuntimeException;

class DarazScraperService
{
    public function scrape(string $url): array
    {
        $nodeResult = $this->scrapeViaNode($url);
        if ($nodeResult !== null && !empty($nodeResult['title']) && $nodeResult['title'] !== 'No title') {
            return $nodeResult;
        }

        $response = Http::withHeaders([
            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
            'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language' => 'en-US,en;q=0.9',
            'Cache-Control' => 'no-cache',
            'Pragma' => 'no-cache',
        ])->timeout(30)->retry(1, 500)->get($url);

        if (!$response->successful()) {
            throw new RuntimeException('Daraz returned HTTP ' . $response->status());
        }

        $html = $response->body();
        if (trim($html) === '') {
            throw new RuntimeException('Daraz returned an empty response.');
        }

        return $this->parseHtml($html, $url);
    }

    protected function scrapeViaNode(string $url): ?array
    {
        $scriptPath = base_path('tools/daraz_scraper.mjs');
        if (!file_exists($scriptPath)) {
            return null;
        }

        $process = new Process([
            'node',
            $scriptPath,
            $url,
        ]);
        $process->setTimeout(20);

        try {
            $process->mustRun();
            $output = trim($process->getOutput());
            if ($output !== '') {
                $data = json_decode($output, true);
                if (is_array($data) && !empty($data['title']) && empty($data['error'])) {
                    $data['source_url'] = $url;
                    $data['source_domain'] = parse_url($url, PHP_URL_HOST);
                    return $data;
                }
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Daraz scrapeViaNode failed: ' . $e->getMessage());
        }

        return null;
    }

    protected function fetchRenderedHtml(string $url): ?string
    {
        $browser = $this->findBrowserBinary();
        if ($browser === null) {
            return null;
        }

        $tempDir = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'chrome_pdp_' . uniqid();
        @mkdir($tempDir, 0777, true);

        $process = new Process([
            $browser,
            '--headless=new',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-software-rasterizer',
            '--disable-extensions',
            '--user-data-dir=' . $tempDir,
            '--dump-dom',
            '--virtual-time-budget=4000',
            '--no-first-run',
            '--no-default-browser-check',
            '--lang=en-US',
            $url,
        ]);

        $process->setTimeout(8);

        try {
            $process->mustRun();
        } catch (\Throwable $e) {
            return null;
        }

        $output = trim($process->getOutput());
        return $output !== '' ? $output : null;
    }

    protected function findBrowserBinary(): ?string
    {
        $envBrowser = env('DARAZ_BROWSER_PATH');
        if (is_string($envBrowser) && $envBrowser !== '' && file_exists($envBrowser)) {
            return $envBrowser;
        }

        $candidates = [
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
            'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
        ];

        foreach ($candidates as $candidate) {
            if (file_exists($candidate)) {
                return $candidate;
            }
        }

        $finder = new ExecutableFinder();
        return $finder->find('chrome') ?: $finder->find('msedge');
    }

    protected function parseHtml(string $html, string $url): array
    {
        libxml_use_internal_errors(true);

        $dom = new DOMDocument();
        $dom->loadHTML($html, LIBXML_NOWARNING | LIBXML_NOERROR | LIBXML_NONET);
        $xpath = new DOMXPath($dom);

        $title = $this->cleanTitle($this->firstText($xpath, [
            '//meta[@property="og:title"]/@content',
            '//meta[@name="twitter:title"]/@content',
            '//h1[contains(@class, "pdp-mod-product-badge-title")]',
            '//title',
        ]));

        $moduleFields = $this->extractModuleFields($html);
        $price = $this->extractPrice($xpath, $html, $url)
            ?: $this->extractModulePrice($moduleFields);
        $description = $this->extractDescription($xpath);
        if ($description === null || $description === '') {
            $moduleDescription = $moduleFields['product']['desc'] ?? $moduleFields['product']['highlights'] ?? null;
            if (is_string($moduleDescription) && trim($moduleDescription) !== '') {
                $description = $this->normalizeDescriptionHtml($moduleDescription);
            }
        }
        $moduleImages = $this->extractImagesFromModule($moduleFields, $url);
        $domImages = $this->extractImages($xpath, $url);
        // Prefer module gallery (full originals). DOM often mixes one 720px main + many 80px thumbs.
        $images = $moduleImages !== [] ? $moduleImages : $domImages;
        $normalizedPrice = $this->normalizePrice($price) ?? $price;
        $originalPrice = $this->extractOriginalPrice($xpath, $html);

        return [
            'title' => $this->normalizeText($title) ?: 'No title',
            'description' => $this->normalizeMultilineText($description),
            'images' => $images,
            'price' => $normalizedPrice,
            'variations' => $this->extractVariations($moduleFields, $normalizedPrice, $originalPrice),
            'source_url' => $url,
            'source_domain' => parse_url($url, PHP_URL_HOST),
        ];
    }

    protected function extractModuleFields(string $html): array
    {
        if (!preg_match('/(?:var|window\.)\s*__moduleData__\s*=\s*(\{.*?\});\s*(?:var\s+|window\.|<\/script>)/s', $html, $matches)) {
            return [];
        }

        $decoded = json_decode($matches[1], true);
        if (!is_array($decoded)) {
            return [];
        }

        $fields = $decoded['data']['root']['fields'] ?? [];
        return is_array($fields) ? $fields : [];
    }

    protected function extractModulePrice(array $moduleFields): ?string
    {
        $candidates = [
            $moduleFields['tracking']['pdt_price'] ?? null,
            $moduleFields['skuInfos']['0']['price']['salePrice']['text'] ?? null,
            $moduleFields['skuInfos']['0']['price']['salePrice'] ?? null,
        ];

        foreach ($candidates as $candidate) {
            if (is_array($candidate)) {
                $candidate = $candidate['text'] ?? $candidate['value'] ?? null;
            }

            $price = $this->normalizePriceValue((string) $candidate, true);
            if ($price !== null) {
                return $price;
            }
        }

        return null;
    }

    protected function extractImagesFromModule(array $moduleFields, string $baseUrl): array
    {
        $gallery = $moduleFields['skuGalleries']['0'] ?? [];
        if (!is_array($gallery)) {
            return [];
        }

        $images = [];
        $seen = [];
        foreach ($gallery as $item) {
            if (!is_array($item) || strtolower((string) ($item['type'] ?? '')) === 'video') {
                continue;
            }

            $normalized = $this->normalizeUrl($item['src'] ?? $item['poster'] ?? null, $baseUrl);
            if ($normalized === null || $this->looksLikeNoiseImage($normalized)) {
                continue;
            }

            $normalized = $this->upgradeImageUrl($normalized);

            $key = $this->canonicalImageKey($normalized);
            if (isset($seen[$key])) {
                continue;
            }

            $seen[$key] = true;
            $images[] = $normalized;
            if (count($images) >= 10) {
                break;
            }
        }

        return $images;
    }

    protected function extractVariations(array $moduleFields, mixed $fallbackPrice, mixed $fallbackOriginalPrice = null): array
    {
        $skuBase = $moduleFields['productOption']['skuBase'] ?? $moduleFields['skuBase'] ?? [];
        $skus = is_array($skuBase['skus'] ?? null) ? $skuBase['skus'] : [];
        $properties = is_array($skuBase['properties'] ?? null) ? $skuBase['properties'] : [];
        $skuInfos = is_array($moduleFields['skuInfos'] ?? null) ? $moduleFields['skuInfos'] : [];

        if ($skus === [] || $properties === []) {
            return [];
        }

        $propertyMaps = [];
        foreach ($properties as $property) {
            if (!is_array($property)) {
                continue;
            }

            $pid = (string) ($property['pid'] ?? '');
            if ($pid === '') {
                continue;
            }

            $propertyMaps[$pid] = $this->flattenPropertyValues($property);
        }

        $variations = [];
        $seenNames = [];
        $fallback = $this->formatNumericPrice((string) ($this->normalizePriceValue((string) $fallbackPrice, true) ?? ''));
        $fallbackOriginal = $this->formatNumericPrice((string) ($this->normalizePriceValue((string) $fallbackOriginalPrice, true) ?? ''));

        foreach ($skus as $index => $sku) {
            if (!is_array($sku)) {
                continue;
            }

            $name = $this->buildVariationNameFromSku($sku, $propertyMaps, $properties);
            if ($name === '' || isset($seenNames[mb_strtolower($name)])) {
                continue;
            }

            $skuId = (string) ($sku['skuId'] ?? $sku['cartSkuId'] ?? '');
            $skuInfo = $skuInfos[$skuId] ?? $skuInfos[(string) $index] ?? [];
            [$price, $discountType, $discountValue] = $this->extractVariationPricing($skuInfo, $sku, $moduleFields, $fallback, $fallbackOriginal);

            $seenNames[mb_strtolower($name)] = true;
            $variations[] = [
                'name' => Str::limit($name, 255, ''),
                'price' => $price ?? '',
                'discount_type' => $discountType,
                'discount_value' => $discountValue,
            ];

            if (count($variations) >= 60) {
                break;
            }
        }

        if ($this->shouldDropGenericVariations($variations)) {
            return [];
        }

        return $variations;
    }

    protected function flattenPropertyValues(array $property): array
    {
        $map = [];
        $groupFallback = trim((string) ($property['name'] ?? ''));

        foreach ($property['values'] ?? [] as $value) {
            if (!is_array($value)) {
                continue;
            }

            if (isset($value['value']) && is_array($value['value'])) {
                $groupName = trim((string) ($value['name'] ?? $groupFallback));
                foreach ($value['value'] as $child) {
                    if (!is_array($child)) {
                        continue;
                    }

                    $vid = (string) ($child['vid'] ?? '');
                    $childName = trim((string) ($child['name'] ?? ''));
                    if ($vid === '' || $childName === '') {
                        continue;
                    }

                    if ($groupName !== '' && !str_contains(mb_strtolower($childName), mb_strtolower($groupName))) {
                        $childName = $groupName . ' ' . $childName;
                    }

                    $map[$vid] = $childName;
                }

                continue;
            }

            $vid = (string) ($value['vid'] ?? '');
            $name = trim((string) ($value['name'] ?? ''));
            if ($vid !== '' && $name !== '') {
                $map[$vid] = $name;
            }
        }

        return $map;
    }

    protected function buildVariationNameFromSku(array $sku, array $propertyMaps, array $properties): string
    {
        $propPath = trim((string) ($sku['propPath'] ?? ''));
        $selected = [];
        if ($propPath !== '') {
            foreach (explode(';', $propPath) as $pair) {
                $parts = explode(':', $pair, 2);
                if (count($parts) !== 2) {
                    continue;
                }

                $selected[trim($parts[0])] = trim($parts[1]);
            }
        }

        $nameParts = [];
        foreach ($properties as $property) {
            if (!is_array($property)) {
                continue;
            }

            $pid = (string) ($property['pid'] ?? '');
            $vid = $selected[$pid] ?? null;
            if ($vid === null || !isset($propertyMaps[$pid][$vid])) {
                continue;
            }

            $nameParts[] = $propertyMaps[$pid][$vid];
        }

        return $this->composeVariationName($nameParts);
    }

    protected function composeVariationName(array $parts): string
    {
        $cleaned = [];
        foreach ($parts as $part) {
            $part = $this->normalizeText((string) $part);
            if ($part === '') {
                continue;
            }

            foreach ($cleaned as $existing) {
                $pattern = '/^' . preg_quote($existing, '/') . '\s*[,:\/|-]\s*(.+)$/iu';
                if (preg_match($pattern, $part, $matches)) {
                    $part = $this->normalizeText($matches[1] ?? '');
                    break;
                }
            }

            if ($part !== '' && !in_array($part, $cleaned, true)) {
                $cleaned[] = $part;
            }
        }

        return implode(' / ', $cleaned);
    }

    protected function extractVariationPricing(array $skuInfo, array $sku, array $moduleFields, ?string $fallbackPrice, ?string $fallbackOriginalPrice = null): array
    {
        $sale = null;

        $candidates = [
            $skuInfo['price'] ?? null,
            $skuInfo['salePrice'] ?? null,
            $sku['price'] ?? null,
            $sku['salePrice'] ?? null,
            $skuInfo['priceText'] ?? null,
            $sku['priceText'] ?? null,
        ];

        foreach ($candidates as $candidate) {
            if (is_array($candidate)) {
                $saleCandidate = $this->normalizePriceValue((string) ($candidate['salePrice']['text'] ?? $candidate['salePrice']['value'] ?? $candidate['salePrice'] ?? $candidate['text'] ?? $candidate['value'] ?? ''), true);
                if ($saleCandidate !== null && $sale === null) {
                    $sale = $saleCandidate;
                }
            } elseif (is_string($candidate) || is_numeric($candidate)) {
                $saleCandidate = $this->normalizePriceValue((string) $candidate, true);
                if ($saleCandidate !== null && $sale === null) {
                    $sale = $saleCandidate;
                }
            }
        }

        if ($sale === null) {
            $sale = $this->normalizePriceValue((string) ($skuInfo['salePrice'] ?? $skuInfo['priceText'] ?? $sku['salePrice'] ?? $sku['priceText'] ?? ''), true);
        }

        $finalPrice = $sale ?? $fallbackPrice ?? '';

        return [$finalPrice, '', ''];
    }

    protected function shouldDropGenericVariations(array $variations): bool
    {
        if ($variations === []) {
            return true;
        }

        if (count($variations) > 1) {
            return false;
        }

        $name = mb_strtolower(trim((string) ($variations[0]['name'] ?? '')));
        $generic = [
            '',
            'default',
            'as shown',
            'multiple color',
            'multiple colours',
            'متعدد رنگ',
        ];

        return in_array($name, $generic, true);
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

    protected function cleanTitle(?string $title): ?string
    {
        $title = $this->normalizeText($title);
        if ($title === '') {
            return null;
        }

        $title = preg_replace('/\s*\|\s*Daraz\.pk\s*$/i', '', $title) ?? $title;
        $title = preg_replace('/\s*-\s*Daraz\.pk\s*$/i', '', $title) ?? $title;
        $title = preg_replace('/\s+Daraz\.pk\s*$/i', '', $title) ?? $title;

        return $this->normalizeText($title);
    }

    protected function extractPrice(DOMXPath $xpath, string $html, string $url): ?string
    {
        if ($price = $this->extractExactPrice($xpath, $html)) {
            return $price;
        }

        if ($price = $this->extractMetaPrice($xpath)) {
            return $price;
        }

        if ($price = $this->extractStructuredDataPrice($xpath)) {
            return $price;
        }

        if ($price = $this->extractPriceFromUrl($url)) {
            return $price;
        }

        if ($price = $this->extractInlinePrice($html)) {
            return $price;
        }

        return null;
    }

    protected function extractExactPrice(DOMXPath $xpath, string $html): ?string
    {
        $queries = [
            '//span[contains(concat(" ", normalize-space(@class), " "), " pdp-price_type_normal ") and contains(concat(" ", normalize-space(@class), " "), " pdp-price_color_orange ") and contains(concat(" ", normalize-space(@class), " "), " pdp-price_size_xl ")]',
            '//div[@class="pdp-product-price"]//span[contains(concat(" ", normalize-space(@class), " "), " pdp-price_type_normal ") and contains(concat(" ", normalize-space(@class), " "), " pdp-price_color_orange ")]',
        ];

        foreach ($queries as $query) {
            $nodes = $xpath->query($query);
            if ($nodes && $nodes->length > 0) {
                $text = $this->normalizeText($nodes->item(0)?->textContent ?? '');
                if ($text !== '') {
                    $price = $this->normalizePrice($text);
                    if ($price !== null) {
                        return $price;
                    }
                }
            }
        }

        $patterns = [
            '~<span[^>]*class="[^"]*\bpdp-price_type_normal\b[^"]*\bpdp-price_color_orange\b[^"]*\bpdp-price_size_xl\b[^"]*"[^>]*>\s*([^<]+?)\s*</span>~is',
            '~<span[^>]*class="[^"]*\bpdp-price_type_normal\b[^"]*"[^>]*>\s*([^<]+?)\s*</span>~is',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $html, $matches)) {
                $raw = trim((string) ($matches[1] ?? ''));
                $price = $this->normalizePrice($raw);
                if ($price !== null) {
                    return $price;
                }
            }
        }

        return null;
    }

    protected function extractOriginalPrice(DOMXPath $xpath, string $html): ?string
    {
        $queries = [
            '//span[contains(concat(" ", normalize-space(@class), " "), " pdp-price_type_deleted ")]',
            '//div[@class="pdp-product-price"]//span[contains(concat(" ", normalize-space(@class), " "), " pdp-price_type_deleted ")]',
        ];

        foreach ($queries as $query) {
            $nodes = $xpath->query($query);
            if ($nodes && $nodes->length > 0) {
                $text = $this->normalizeText($nodes->item(0)?->textContent ?? '');
                if ($text !== '') {
                    $price = $this->normalizePrice($text);
                    if ($price !== null) {
                        return $price;
                    }
                }
            }
        }

        if (preg_match('~<span[^>]*class="[^"]*\bpdp-price_type_deleted\b[^"]*"[^>]*>\s*([^<]+?)\s*</span>~is', $html, $matches)) {
            $raw = trim((string) ($matches[1] ?? ''));
            $price = $this->normalizePrice($raw);
            if ($price !== null) {
                return $price;
            }
        }

        return null;
    }

    protected function extractMetaPrice(DOMXPath $xpath): ?string
    {
        $queries = [
            '//meta[@property="product:price:amount"]/@content',
            '//meta[@property="og:price:amount"]/@content',
            '//meta[@property="product:price"]/@content',
            '//meta[@name="product:price:amount"]/@content',
            '//meta[@name="price"]/@content',
            '//*[@itemprop="price"]/@content',
            '//*[@data-price]/@data-price',
        ];

        foreach ($queries as $query) {
            $nodes = $xpath->query($query);
            if (!$nodes || $nodes->length === 0) {
                continue;
            }

            $price = $this->normalizePriceValue($nodes->item(0)?->nodeValue ?? '', true);
            if ($price !== null) {
                return $price;
            }
        }

        return null;
    }

    protected function extractStructuredDataPrice(DOMXPath $xpath): ?string
    {
        $scripts = $xpath->query('//script[@type="application/ld+json"]');
        if (!$scripts) {
            return null;
        }

        foreach ($scripts as $script) {
            $json = trim($script->textContent ?? '');
            if ($json === '') {
                continue;
            }

            $decoded = json_decode($json, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                continue;
            }

            $price = $this->findStructuredPrice($decoded);
            if ($price !== null) {
                return $price;
            }
        }

        return null;
    }

    protected function findStructuredPrice(mixed $value): ?string
    {
        if (!is_array($value)) {
            return null;
        }

        $priceKeys = [
            'saleprice',
            'price',
            'pricevalue',
            'lowprice',
            'highprice',
        ];

        foreach ($value as $key => $item) {
            if (is_string($key) && in_array(strtolower($key), $priceKeys, true) && !is_array($item)) {
                $price = $this->normalizePriceValue((string) $item, true);
                if ($price !== null) {
                    return $price;
                }
            }
        }

        foreach ($value as $item) {
            $price = $this->findStructuredPrice($item);
            if ($price !== null) {
                return $price;
            }
        }

        return null;
    }

    protected function extractInlinePrice(string $html): ?string
    {
        $patterns = [
            '/"salePrice"\s*:\s*"?(?:Rs\.?\s*)?([\d,.]+)"?/i',
            '/"discountPrice"\s*:\s*"?(?:Rs\.?\s*)?([\d,.]+)"?/i',
            '/"offerPrice"\s*:\s*"?(?:Rs\.?\s*)?([\d,.]+)"?/i',
            '/"priceValue"\s*:\s*"?(?:Rs\.?\s*)?([\d,.]+)"?/i',
            '/"price"\s*:\s*"Rs\.?\s*([\d,.]+)"/i',
            '/"pdt_price"\s*:\s*"?(?:Rs\.?\s*)?([\d,.]+)"?/i',
        ];

        foreach ($patterns as $pattern) {
            if (!preg_match_all($pattern, $html, $matches)) {
                continue;
            }

            foreach ($matches[1] as $match) {
                $price = $this->normalizePriceValue((string) $match, true);
                if ($price !== null) {
                    return $price;
                }
            }
        }

        return null;
    }

    protected function extractPriceFromUrl(string $url): ?string
    {
        $query = parse_url($url, PHP_URL_QUERY);
        if (!is_string($query) || $query === '') {
            return null;
        }

        parse_str($query, $params);
        $clickTrackInfo = $params['clickTrackInfo'] ?? null;
        if (!is_string($clickTrackInfo) || $clickTrackInfo === '') {
            return null;
        }

        $decoded = urldecode($clickTrackInfo);
        if (preg_match('/__\d+__(\d+(?:\.\d+)?)__(?=\d{5,}|[0-9,]{10,})/', $decoded, $matches)) {
            return $this->formatNumericPrice($matches[1]);
        }

        return null;
    }

    protected function normalizePriceValue(string $value, bool $allowPlainNumber = false): ?string
    {
        $price = $this->normalizePrice($value);
        if ($price !== null) {
            return $this->formatNumericPrice($price);
        }

        if (!$allowPlainNumber) {
            return null;
        }

        if (!preg_match('/([\d,.]+)/', $value, $matches)) {
            return null;
        }

        $price = $this->formatNumericPrice($matches[1]);
        if ($price === null || (float) $price <= 0) {
            return null;
        }

        return $price;
    }

    protected function formatNumericPrice(string $value): ?string
    {
        $value = str_replace(',', '', trim($value));
        if ($value === '' || !is_numeric($value)) {
            return null;
        }

        $float = (float) $value;
        return fmod($float, 1.0) === 0.0
            ? (string) (int) $float
            : rtrim(rtrim(number_format($float, 2, '.', ''), '0'), '.');
    }

    protected function extractDescription(DOMXPath $xpath): ?string
    {
        $queries = [
            '//meta[@property="og:description"]/@content',
            '//meta[@name="description"]/@content',
            '//div[contains(@class, "pdp-product-highlights")]',
            '//div[contains(@class, "detail-content")]',
            '//div[contains(@class, "pdp-product-desc")]',
            '//div[contains(@class, "pdp-product-detail")]',
            '//*[@id="module_product_detail"]//div[contains(@class, "html-content")]',
            '//*[@id="module_product_detail"]',
        ];

        foreach ($queries as $query) {
            $nodes = $xpath->query($query);
            if ($nodes && $nodes->length > 0) {
                $node = $nodes->item(0);
                if ($node) {
                    if ($node->nodeType === XML_ATTRIBUTE_NODE) {
                        $text = $this->normalizeDescriptionHtml($node->nodeValue ?? '');
                    } else {
                        $html = $node->ownerDocument?->saveHTML($node) ?? '';
                        $text = $this->normalizeDescriptionHtml($html);
                    }
                    if ($text !== '') {
                        return $text;
                    }
                }
            }
        }

        return null;
    }

    protected function normalizeDescriptionHtml(?string $value): string
    {
        $html = html_entity_decode((string) $value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $html = preg_replace('/^.*?<div[^>]*pdp-product-desc[^>]*>/is', '', $html) ?? $html;
        $html = preg_replace('/^Product details of\s*/i', '', $html) ?? $html;
        $html = preg_replace('/<li[^>]*>/i', "\n- ", $html) ?? $html;
        $html = preg_replace('/<\/li>/i', "\n", $html) ?? $html;
        $html = preg_replace('/<br\s*\/?>/i', "\n", $html) ?? $html;
        $html = preg_replace('/<\/(p|div|article|ul|ol|h[1-6])>/i', "\n", $html) ?? $html;
        $html = strip_tags($html);
        $text = preg_replace("/\r\n|\r/", "\n", $html) ?? $html;
        $text = preg_split('/\b(?:Specifications(?: of)?|What(?:’|\'|’)s in the box)\b/i', $text, 2)[0] ?? $text;
        $text = preg_replace("/[ \t]+\n/", "\n", $text) ?? $text;
        $text = preg_replace("/\n{3,}/", "\n\n", $text) ?? $text;
        $lines = array_map('trim', explode("\n", $text));
        $lines = array_values(array_filter($lines, fn ($line) => $line !== ''));

        return implode("\n", $lines);
    }

    protected function extractImages(DOMXPath $xpath, string $baseUrl): array
    {
        $candidates = [];

        // Prefer main preview panel first; skip tiny thumbnail strip classes.
        foreach ([
            '//img[contains(@class, "gallery-preview-panel__image")]/@src',
            '//div[contains(@class, "gallery-preview-panel")]//img/@src',
            '//img[contains(@class, "pdp-mod-common-image")]/@src',
        ] as $query) {
            $nodes = $xpath->query($query);
            if (!$nodes) {
                continue;
            }

            foreach ($nodes as $node) {
                $candidates[] = $node->nodeValue;
            }
        }

        // Thumbnail strip only as fallback when no main images found.
        if ($candidates === []) {
            $nodes = $xpath->query('//img[contains(@class, "item-gallery__thumbnail-image")]/@src');
            if ($nodes) {
                foreach ($nodes as $node) {
                    $candidates[] = $node->nodeValue;
                }
            }
        }

        $images = [];
        $seen = [];

        foreach ($candidates as $candidate) {
            $normalized = $this->normalizeUrl($candidate, $baseUrl);
            if ($normalized === null) {
                continue;
            }

            $normalized = $this->upgradeImageUrl($normalized);

            $key = $this->canonicalImageKey($normalized);
            if (isset($seen[$key])) {
                continue;
            }

            if ($this->looksLikeNoiseImage($normalized)) {
                continue;
            }

            $seen[$key] = true;
            $images[] = $normalized;

            if (count($images) >= 10) {
                break;
            }
        }

        return array_values($images);
    }

    /**
     * Strip Daraz/Lazada CDN resize suffixes so we keep the original asset.
     * e.g. file.jpg_80x80q80.jpg_.webp → file.jpg
     */
    protected function upgradeImageUrl(string $url): string
    {
        $upgraded = preg_replace(
            '/_\d+x\d+q\d+\.[a-z0-9]+_?(?:\.(?:webp|jpe?g|png))?$/i',
            '',
            $url
        );

        if (!is_string($upgraded) || $upgraded === '') {
            return $url;
        }

        // Drop trailing resize crumbs like "_.webp" left on some CDN URLs.
        $upgraded = preg_replace('/_\.(?:webp|jpe?g|png)$/i', '', $upgraded) ?? $upgraded;

        return $upgraded !== '' ? $upgraded : $url;
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
        $path = preg_replace('/_(?:\d+x\d+)?q\d+\.[a-z0-9]+_?\.(?:webp|jpg|jpeg|png)$/i', '', $path) ?? $path;
        $path = preg_replace('/_\d+x\d+q\d+\.[a-z0-9]+_?$/i', '', $path) ?? $path;

        return $host . ':' . preg_replace('~/+$~', '', $path);
    }

    protected function looksLikeNoiseImage(string $url): bool
    {
        $lowerUrl = strtolower($url);
        if (preg_match('/\.(mp4|webm|mov|m3u8)(\?|$)/i', $url)) {
            return true;
        }

        $path = parse_url($url, PHP_URL_PATH) ?: '';
        $lowerPath = strtolower($path);
        if (str_contains($lowerPath, '/g/tps/') || str_contains($lowerPath, '/tps/tfs/')) {
            return true;
        }

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
            'video',
            'play',
            'vod',
        ];

        foreach ($noiseTerms as $term) {
            if (str_contains($lowerUrl, $term)) {
                return true;
            }
        }

        if ($path === '') {
            return true;
        }

        return !preg_match('/\.(jpe?g|png|gif|webp|avif|bmp)(\?|$)/i', $path);
    }

    protected function normalizeText(?string $value): string
    {
        return trim(preg_replace('/\s+/u', ' ', (string) $value) ?? '');
    }

    protected function normalizeMultilineText(?string $value): string
    {
        $text = (string) $value;
        $text = preg_replace("/\r\n|\r/", "\n", $text) ?? $text;
        $lines = array_map(
            fn ($line) => trim(preg_replace('/\s+/u', ' ', $line) ?? ''),
            explode("\n", $text)
        );
        $lines = array_values(array_filter($lines, fn ($line) => $line !== ''));

        return implode("\n", $lines);
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

        if (preg_match('/\bPKR\b|\bRs\b|\bRs\.\b/i', $text)) {
            if (preg_match('/([\d,.]+)/', $text, $matches)) {
                return str_replace(',', '', $matches[1]);
            }
        }

        return null;
    }
}
