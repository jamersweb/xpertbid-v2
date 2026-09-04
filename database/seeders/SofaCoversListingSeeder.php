<?php

namespace Database\Seeders;

use App\Models\Listing;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class SofaCoversListingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = base_path('scraper/sofa_covers_products.json');

        if (!File::exists($jsonPath)) {
            $this->command?->error("Scraper JSON file not found at: {$jsonPath}");
            return;
        }

        $jsonContent = File::get($jsonPath);
        $productsData = json_decode($jsonContent, true);

        if (!is_array($productsData) || empty($productsData)) {
            $this->command?->error("Invalid or empty JSON in scraper file.");
            return;
        }

        // Limit to 5 products as requested
        $productsToSeed = array_slice($productsData, 0, 84);

        // Given parameters
        $categoryId = 574;
        $subCategoryId = 580;
        $userId = 733;
        $listingType = 'business';

        // Target directory for listing images
        $targetDirectory = public_path('assets/images/listing_images');
        File::ensureDirectoryExists($targetDirectory);

        $this->command?->info("Starting seeding for 84 Sofa Cover products with discount data...");

        foreach ($productsToSeed as $index => $prod) {
            $productNum = $index + 1;
            $title = $prod['title'] ?? "Sofa Cover Product {$productNum}";
            $this->command?->info("[{$productNum}/84] Seeding: {$title}");

            // Process product album and main images
            $localImages = $prod['local_images'] ?? [];
            $remoteImages = $prod['images_url'] ?? [];

            $savedDbAlbum = [];
            $coverImageDbPath = null;

            $imageSources = !empty($localImages) ? $localImages : $remoteImages;

            foreach ($imageSources as $imgIdx => $imgSource) {
                if (!$imgSource) {
                    continue;
                }

                $filename = "sofa_cover_{$prod['id']}_img_" . ($imgIdx + 1) . '.' . pathinfo(parse_url($imgSource, PHP_URL_PATH) ?: 'jpg', PATHINFO_EXTENSION);
                // Sanitize extension
                $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
                if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif'], true)) {
                    $ext = 'jpg';
                    $filename = pathinfo($filename, PATHINFO_FILENAME) . '.jpg';
                }

                $targetPath = $targetDirectory . DIRECTORY_SEPARATOR . $filename;
                $dbPath = "assets/images/listing_images/{$filename}";

                // Copy from local scraper images or download if remote
                $copied = false;
                $localScraperPath = base_path('scraper/' . ltrim($imgSource, '/'));

                if (File::exists($localScraperPath)) {
                    File::copy($localScraperPath, $targetPath);
                    $copied = true;
                } elseif (filter_var($imgSource, FILTER_VALIDATE_URL)) {
                    try {
                        $response = Http::timeout(15)->get($imgSource);
                        if ($response->successful()) {
                            File::put($targetPath, $response->body());
                            $copied = true;
                        }
                    } catch (\Throwable $e) {
                        $this->command?->warn("Failed downloading image {$imgSource}: " . $e->getMessage());
                    }
                } elseif (isset($remoteImages[$imgIdx]) && filter_var($remoteImages[$imgIdx], FILTER_VALIDATE_URL)) {
                    try {
                        $response = Http::timeout(15)->get($remoteImages[$imgIdx]);
                        if ($response->successful()) {
                            File::put($targetPath, $response->body());
                            $copied = true;
                        }
                    } catch (\Throwable $e) {
                        $this->command?->warn("Failed downloading remote image: " . $e->getMessage());
                    }
                }

                if ($copied || File::exists($targetPath)) {
                    $savedDbAlbum[] = $dbPath;
                    if (!$coverImageDbPath) {
                        $coverImageDbPath = $dbPath;
                    }
                }
            }

            // Process HTML description inline images
            $descriptionHtml = $prod['description_html'] ?? $prod['description'] ?? '';

            if ($descriptionHtml && preg_match_all('/<img[^>]+src=["\']([^"\']+)["\']/i', $descriptionHtml, $matches)) {
                $htmlImageUrls = array_unique($matches[1]);

                foreach ($htmlImageUrls as $htmlImgIdx => $htmlImgUrl) {
                    if (str_contains($htmlImgUrl, 'assets/images/listing_images/')) {
                        continue;
                    }

                    $ext = strtolower(pathinfo(parse_url($htmlImgUrl, PHP_URL_PATH) ?: '', PATHINFO_EXTENSION));
                    if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif'], true)) {
                        $ext = 'jpg';
                    }

                    $descImgName = "sofa_cover_{$prod['id']}_desc_" . ($htmlImgIdx + 1) . ".{$ext}";
                    $descTargetPath = $targetDirectory . DIRECTORY_SEPARATOR . $descImgName;
                    $webPath = "/assets/images/listing_images/{$descImgName}";

                    try {
                        if (filter_var($htmlImgUrl, FILTER_VALIDATE_URL)) {
                            $res = Http::timeout(15)->get($htmlImgUrl);
                            if ($res->successful()) {
                                File::put($descTargetPath, $res->body());
                                $descriptionHtml = str_replace($htmlImgUrl, $webPath, $descriptionHtml);
                            }
                        }
                    } catch (\Throwable $e) {
                        $this->command?->warn("Failed downloading description image {$htmlImgUrl}: " . $e->getMessage());
                    }
                }
            }

            // Variations & Discount Calculation
            $rawVariations = $prod['variations_by_price'] ?? [];
            $variations = [];
            $minSalePrice = null;
            $minComparePrice = null;

            foreach ($rawVariations as $v) {
                $vTitle = $v['title'] ?? '';
                if ($vTitle === '') {
                    continue;
                }

                $salePrice = isset($v['raw_price']) && is_numeric($v['raw_price']) ? (float) $v['raw_price'] : 0;
                $comparePrice = isset($v['raw_compare_at_price']) && is_numeric($v['raw_compare_at_price']) ? (float) $v['raw_compare_at_price'] : 0;

                $hasVDiscount = ($comparePrice > $salePrice && $salePrice > 0);
                $vDiscountPercent = $hasVDiscount ? round((($comparePrice - $salePrice) / $comparePrice) * 100, 2) : 0;

                $variations[] = [
                    'name' => $vTitle,
                    'price' => $hasVDiscount ? $comparePrice : $salePrice,
                    'discount_type' => $hasVDiscount ? 'percent' : null,
                    'discount_value' => $hasVDiscount ? $vDiscountPercent : null,
                    'sku' => $v['sku'] ?? '',
                    'available' => $v['available'] ?? true,
                ];

                if ($salePrice > 0 && ($minSalePrice === null || $salePrice < $minSalePrice)) {
                    $minSalePrice = $salePrice;
                    $minComparePrice = $hasVDiscount ? $comparePrice : $salePrice;
                }
            }

            if ($minSalePrice === null) {
                $minSalePrice = isset($prod['raw_price']) ? (float) $prod['raw_price'] : 0;
                $minComparePrice = $minSalePrice;
            }

            $hasMainDiscount = ($minComparePrice > $minSalePrice && $minSalePrice > 0);
            $mainDiscountPercent = $hasMainDiscount ? round((($minComparePrice - $minSalePrice) / $minComparePrice) * 100, 2) : 0;
            $basePrice = $hasMainDiscount ? $minComparePrice : $minSalePrice;

            $listingData = [
                'price' => $basePrice,
                'buy_now_price' => $basePrice,
                'minimum_bid' => $basePrice,
                'discount_type' => $hasMainDiscount ? 'percent' : null,
                'discount_value' => $hasMainDiscount ? $mainDiscountPercent : null,
                'stock' => 50,
                'variations' => $variations,
                'image' => $coverImageDbPath,
                'album' => $savedDbAlbum,
                'source_url' => $prod['product_url'] ?? null,
                'scraped_title' => $title,
            ];

            $slug = Str::slug($title);

            Listing::updateOrCreate(
                [
                    'user_id' => $userId,
                    'title' => $title,
                ],
                [
                    'user_id' => $userId,
                    'category_id' => $categoryId,
                    'sub_category_id' => $subCategoryId,
                    'listing_type' => $listingType,
                    'title' => $title,
                    'slug' => $slug,
                    'description' => $descriptionHtml,
                    'image' => $coverImageDbPath,
                    'album' => $savedDbAlbum,
                    'status' => 'active',
                    'listing_data' => $listingData,
                ]
            );
        }

        $this->command?->info("✅ Sofa Covers seeder executed successfully for 5 products with discount calculation.");
    }
}
