<?php

namespace Database\Seeders;

use App\Models\Listing;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class BathrobesListingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = base_path('scraper/bathrobes_products.json');

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

        // Seed all products
        $productsToSeed = $productsData;

        // Given parameters
        $categoryId = 574;
        $subCategoryId = 580;
        $userId = 733;
        $listingType = 'business';

        // Target directory for listing images
        $targetDirectory = public_path('assets/images/listing_images');
        File::ensureDirectoryExists($targetDirectory);

        $totalCount = count($productsToSeed);
        $this->command?->info("Starting fast seeding for {$totalCount} Bathrobe products with discount data...");

        foreach ($productsToSeed as $index => $prod) {
            $productNum = $index + 1;
            $title = $prod['title'] ?? "Bathrobe Product {$productNum}";

            // Process product album and main images
            $localImages = $prod['local_images'] ?? [];
            $savedDbAlbum = [];
            $coverImageDbPath = null;

            foreach ($localImages as $imgIdx => $imgSource) {
                if (!$imgSource) {
                    continue;
                }

                $filename = "bathrobe_{$prod['id']}_img_" . ($imgIdx + 1) . '.' . pathinfo(parse_url($imgSource, PHP_URL_PATH) ?: 'jpg', PATHINFO_EXTENSION);
                // Sanitize extension
                $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
                if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif'], true)) {
                    $ext = 'jpg';
                    $filename = pathinfo($filename, PATHINFO_FILENAME) . '.jpg';
                }

                $targetPath = $targetDirectory . DIRECTORY_SEPARATOR . $filename;
                $dbPath = "assets/images/listing_images/{$filename}";

                $localScraperPath = base_path('scraper/' . ltrim($imgSource, '/'));

                if (File::exists($localScraperPath)) {
                    if (!File::exists($targetPath)) {
                        File::copy($localScraperPath, $targetPath);
                    }
                    $savedDbAlbum[] = $dbPath;
                    if (!$coverImageDbPath) {
                        $coverImageDbPath = $dbPath;
                    }
                }
            }

            $descriptionHtml = $prod['description_html'] ?? $prod['description'] ?? '';

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
                    'option1' => $v['option1'] ?? null,
                    'option2' => $v['option2'] ?? null,
                    'option3' => $v['option3'] ?? null,
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

        $this->command?->info("✅ Bathrobes seeder executed successfully for {$totalCount} products with discount calculation.");
    }
}
