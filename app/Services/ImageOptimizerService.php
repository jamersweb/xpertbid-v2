<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\ImageManager;

class ImageOptimizerService
{
    public const TYPE_LISTING = 'listing';
    public const TYPE_AUCTION = 'auction';
    public const TYPE_CATEGORY = 'category';

    public const RASTER_EXTENSIONS = ['jpg', 'jpeg', 'png', 'jfif', 'webp', 'bmp', 'gif'];
    public const NON_OPTIMIZABLE_EXTENSIONS = ['svg', 'mp4', 'mov', 'webm', 'avi', 'mkv'];

    /**
     * Get rule parameters based on target type.
     *
     * @return array{maxWidth: int, quality: int, sizeThreshold: int}
     */
    public function getRulesForType(string $type): array
    {
        return match (strtolower($type)) {
            self::TYPE_CATEGORY => [
                'maxWidth' => 180,
                'quality' => 80,
                'sizeThreshold' => 20 * 1024, // 20 KB
            ],
            default => [ // listing & auction
                'maxWidth' => 600,
                'quality' => 75,
                'sizeThreshold' => 50 * 1024, // 50 KB
            ],
        };
    }

    /**
     * Determine target type from directory name.
     */
    public function getTypeFromPath(string $path): string
    {
        $normalized = str_replace('\\', '/', strtolower($path));

        if (str_contains($normalized, 'category_images')) {
            return self::TYPE_CATEGORY;
        }

        if (str_contains($normalized, 'auction')) {
            return self::TYPE_AUCTION;
        }

        return self::TYPE_LISTING;
    }

    /**
     * Optimize an image file.
     *
     * @param string $path File path (relative or absolute)
     * @param string|null $type 'listing', 'auction', or 'category' (auto-detected if null)
     * @param bool $dryRun When true, simulates optimization without writing/updating DB
     * @return array
     */
    public function optimize(string $path, ?string $type = null, bool $dryRun = false): array
    {
        $fullPath = $this->resolveFullPath($path);

        if (!File::exists($fullPath) || !is_file($fullPath)) {
            return [
                'success' => false,
                'status' => 'skipped',
                'reason' => 'file_not_found',
                'file' => $path,
                'full_path' => $fullPath,
                'original_size' => 0,
                'new_size' => 0,
                'bytes_saved' => 0,
            ];
        }

        $extension = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));

        if (in_array($extension, self::NON_OPTIMIZABLE_EXTENSIONS, true) || !in_array($extension, self::RASTER_EXTENSIONS, true)) {
            return [
                'success' => true,
                'status' => 'skipped',
                'reason' => 'non_raster_format',
                'file' => $path,
                'full_path' => $fullPath,
                'original_size' => @filesize($fullPath) ?: 0,
                'new_size' => @filesize($fullPath) ?: 0,
                'bytes_saved' => 0,
            ];
        }

        $resolvedType = $type ?: $this->getTypeFromPath($fullPath);
        $rules = $this->getRulesForType($resolvedType);

        $originalSize = filesize($fullPath);
        $imageDimensions = @getimagesize($fullPath);
        $currentWidth = $imageDimensions ? $imageDimensions[0] : 0;

        // Rule for existing WebP
        if ($extension === 'webp') {
            $needsResize = $currentWidth > $rules['maxWidth'];
            $needsCompression = $originalSize > $rules['sizeThreshold'];

            if (!$needsResize && !$needsCompression) {
                return [
                    'success' => true,
                    'status' => 'skipped',
                    'reason' => 'already_optimized',
                    'file' => $path,
                    'full_path' => $fullPath,
                    'original_size' => $originalSize,
                    'new_size' => $originalSize,
                    'bytes_saved' => 0,
                ];
            }

            // In-place WebP re-compression/resize
            return $this->optimizeWebpInPlace($fullPath, $originalSize, $rules, $dryRun);
        }

        // Converting non-WebP (jpg, png, etc.) to WebP
        return $this->convertNonWebpToWebp($fullPath, $originalSize, $rules, $dryRun);
    }

    /**
     * Optimize existing .webp file in place.
     */
    protected function optimizeWebpInPlace(string $fullPath, int $originalSize, array $rules, bool $dryRun): array
    {
        $tempPath = $fullPath . '.tmp.' . uniqid() . '.webp';

        try {
            $encodedBytes = $this->encodeImageToWebp($fullPath, $rules['maxWidth'], $rules['quality']);

            if (!$encodedBytes) {
                return [
                    'success' => false,
                    'status' => 'failed',
                    'reason' => 'encoding_failed',
                    'full_path' => $fullPath,
                    'original_size' => $originalSize,
                    'new_size' => $originalSize,
                    'bytes_saved' => 0,
                ];
            }

            $newSize = strlen($encodedBytes);

            // If dry run, return simulated savings
            if ($dryRun) {
                return [
                    'success' => true,
                    'status' => 'optimized',
                    'action' => 'in_place_webp',
                    'dry_run' => true,
                    'full_path' => $fullPath,
                    'new_path' => $fullPath,
                    'original_size' => $originalSize,
                    'new_size' => $newSize,
                    'bytes_saved' => max(0, $originalSize - $newSize),
                ];
            }

            // Write to disk
            file_put_contents($fullPath, $encodedBytes);
            clearstatcache(true, $fullPath);
            $actualNewSize = filesize($fullPath);

            return [
                'success' => true,
                'status' => 'optimized',
                'action' => 'in_place_webp',
                'dry_run' => false,
                'full_path' => $fullPath,
                'new_path' => $fullPath,
                'original_size' => $originalSize,
                'new_size' => $actualNewSize,
                'bytes_saved' => max(0, $originalSize - $actualNewSize),
            ];
        } catch (\Throwable $e) {
            Log::error("Failed in-place optimization for {$fullPath}: " . $e->getMessage());

            return [
                'success' => false,
                'status' => 'failed',
                'reason' => $e->getMessage(),
                'full_path' => $fullPath,
                'original_size' => $originalSize,
                'new_size' => $originalSize,
                'bytes_saved' => 0,
            ];
        }
    }

    /**
     * Convert a non-WebP image to WebP, update database references, and delete old file.
     */
    protected function convertNonWebpToWebp(string $fullPath, int $originalSize, array $rules, bool $dryRun): array
    {
        $dir = dirname($fullPath);
        $oldFilename = basename($fullPath);
        $nameWithoutExt = pathinfo($oldFilename, PATHINFO_FILENAME);
        $newFilename = $nameWithoutExt . '.webp';
        $targetFullPath = $dir . DIRECTORY_SEPARATOR . $newFilename;

        try {
            $encodedBytes = $this->encodeImageToWebp($fullPath, $rules['maxWidth'], $rules['quality']);

            if (!$encodedBytes) {
                return [
                    'success' => false,
                    'status' => 'failed',
                    'reason' => 'encoding_failed',
                    'full_path' => $fullPath,
                    'original_size' => $originalSize,
                    'new_size' => $originalSize,
                    'bytes_saved' => 0,
                ];
            }

            $newSize = strlen($encodedBytes);

            if ($dryRun) {
                return [
                    'success' => true,
                    'status' => 'optimized',
                    'action' => 'convert_to_webp',
                    'dry_run' => true,
                    'full_path' => $fullPath,
                    'new_path' => $targetFullPath,
                    'old_filename' => $oldFilename,
                    'new_filename' => $newFilename,
                    'original_size' => $originalSize,
                    'new_size' => $newSize,
                    'bytes_saved' => max(0, $originalSize - $newSize),
                ];
            }

            // Write target WebP file
            file_put_contents($targetFullPath, $encodedBytes);
            clearstatcache(true, $targetFullPath);

            if (!File::exists($targetFullPath) || filesize($targetFullPath) === 0) {
                return [
                    'success' => false,
                    'status' => 'failed',
                    'reason' => 'target_webp_not_saved',
                    'full_path' => $fullPath,
                    'original_size' => $originalSize,
                    'new_size' => $originalSize,
                    'bytes_saved' => 0,
                ];
            }

            $actualNewSize = filesize($targetFullPath);

            // Update database references
            $updatedRows = $this->updateDatabaseReferences($oldFilename, $newFilename);

            // Safe deletion: delete old file ONLY after new file exists and DB update executed
            @unlink($fullPath);
            clearstatcache(true, $fullPath);

            return [
                'success' => true,
                'status' => 'optimized',
                'action' => 'convert_to_webp',
                'dry_run' => false,
                'full_path' => $fullPath,
                'new_path' => $targetFullPath,
                'old_filename' => $oldFilename,
                'new_filename' => $newFilename,
                'original_size' => $originalSize,
                'new_size' => $actualNewSize,
                'bytes_saved' => max(0, $originalSize - $actualNewSize),
                'db_updated_rows' => $updatedRows,
            ];
        } catch (\Throwable $e) {
            Log::error("Failed converting {$fullPath} to WebP: " . $e->getMessage());

            return [
                'success' => false,
                'status' => 'failed',
                'reason' => $e->getMessage(),
                'full_path' => $fullPath,
                'original_size' => $originalSize,
                'new_size' => $originalSize,
                'bytes_saved' => 0,
            ];
        }
    }

    /**
     * Encode an image to WebP using Intervention Image v3 with fallback to native GD.
     */
    protected function encodeImageToWebp(string $srcPath, int $maxWidth, int $quality): ?string
    {
        // Try Intervention Image v3 first
        try {
            if (class_exists(ImageManager::class) && class_exists(GdDriver::class)) {
                $manager = new ImageManager(new GdDriver());
                $image = $manager->read($srcPath);
                $image->scaleDown(width: $maxWidth);
                $encoded = $image->encode(new WebpEncoder($quality));
                $bytes = (string) $encoded;

                if (!empty($bytes)) {
                    return $bytes;
                }
            }
        } catch (\Throwable $e) {
            Log::warning("Intervention image processing failed for {$srcPath}, falling back to native GD: " . $e->getMessage());
        }

        // Fallback: Native PHP GD
        return $this->encodeUsingNativeGd($srcPath, $maxWidth, $quality);
    }

    /**
     * Native PHP GD fallback for WebP conversion.
     */
    protected function encodeUsingNativeGd(string $srcPath, int $maxWidth, int $quality): ?string
    {
        $info = @getimagesize($srcPath);
        if (!$info) {
            return null;
        }

        $mime = $info['mime'] ?? '';
        $srcImg = match ($mime) {
            'image/jpeg' => @imagecreatefromjpeg($srcPath),
            'image/png' => @imagecreatefrompng($srcPath),
            'image/webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($srcPath) : false,
            'image/gif' => @imagecreatefromgif($srcPath),
            default => false,
        };

        if (!$srcImg) {
            return null;
        }

        $origW = imagesx($srcImg);
        $origH = imagesy($srcImg);

        if ($origW > $maxWidth) {
            $newW = $maxWidth;
            $newH = (int) round($origH * ($maxWidth / $origW));
        } else {
            $newW = $origW;
            $newH = $origH;
        }

        $targetImg = imagecreatetruecolor($newW, $newH);
        imagealphablending($targetImg, false);
        imagesavealpha($targetImg, true);

        imagecopyresampled($targetImg, $srcImg, 0, 0, 0, 0, $newW, $newH, $origW, $origH);

        ob_start();
        $ok = imagewebp($targetImg, null, $quality);
        $data = ob_get_clean();

        imagedestroy($srcImg);
        imagedestroy($targetImg);

        return ($ok && !empty($data)) ? $data : null;
    }

    /**
     * Update database references in listings, auctions, and auction_categories.
     */
    public function updateDatabaseReferences(string $oldFilename, string $newFilename): int
    {
        $affected = 0;

        // 1. listings table (image, album, listing_data)
        try {
            $affected += DB::update(
                "UPDATE listings SET image = REPLACE(image, ?, ?) WHERE image LIKE ?",
                [$oldFilename, $newFilename, "%{$oldFilename}%"]
            );

            $affected += DB::update(
                "UPDATE listings SET album = REPLACE(album, ?, ?) WHERE album LIKE ?",
                [$oldFilename, $newFilename, "%{$oldFilename}%"]
            );

            $affected += DB::update(
                "UPDATE listings SET listing_data = REPLACE(listing_data, ?, ?) WHERE listing_data LIKE ?",
                [$oldFilename, $newFilename, "%{$oldFilename}%"]
            );
        } catch (\Throwable $e) {
            Log::error("Failed updating listings table for {$oldFilename}: " . $e->getMessage());
        }

        // 2. auctions table (image, album)
        try {
            $affected += DB::update(
                "UPDATE auctions SET image = REPLACE(image, ?, ?) WHERE image LIKE ?",
                [$oldFilename, $newFilename, "%{$oldFilename}%"]
            );

            $affected += DB::update(
                "UPDATE auctions SET album = REPLACE(album, ?, ?) WHERE album LIKE ?",
                [$oldFilename, $newFilename, "%{$oldFilename}%"]
            );
        } catch (\Throwable $e) {
            Log::error("Failed updating auctions table for {$oldFilename}: " . $e->getMessage());
        }

        // 3. auction_categories table (image, icon)
        try {
            $affected += DB::update(
                "UPDATE auction_categories SET image = REPLACE(image, ?, ?) WHERE image LIKE ?",
                [$oldFilename, $newFilename, "%{$oldFilename}%"]
            );

            $affected += DB::update(
                "UPDATE auction_categories SET icon = REPLACE(icon, ?, ?) WHERE icon LIKE ?",
                [$oldFilename, $newFilename, "%{$oldFilename}%"]
            );
        } catch (\Throwable $e) {
            Log::error("Failed updating auction_categories table for {$oldFilename}: " . $e->getMessage());
        }

        return $affected;
    }

    /**
     * Resolve path to absolute filesystem path.
     */
    public function resolveFullPath(string $path): string
    {
        $normalized = str_replace('\\', '/', $path);

        $isAbsolute = str_starts_with($normalized, '/')
            || (strlen($normalized) > 2 && ctype_alpha($normalized[0]) && $normalized[1] === ':');

        if ($isAbsolute && file_exists($normalized)) {
            return $normalized;
        }

        return public_path(ltrim($normalized, '/'));
    }
}
