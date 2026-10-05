<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class KycDocumentStorage
{
    public const DISK = 'kyc';

    public const PLACEHOLDER_PREFIX = 'admin/';

    public function disk(): \Illuminate\Contracts\Filesystem\Filesystem
    {
        return Storage::disk(self::DISK);
    }

    /**
     * Store an uploaded KYC file and return a disk-relative key.
     * Example: individual/12/ab12cd34....pdf
     */
    public function store(UploadedFile $file, string $folder): string
    {
        $folder = trim($folder, '/');
        $extension = strtolower($file->getClientOriginalExtension() ?: $file->guessExtension() ?: 'bin');
        $filename = Str::uuid()->toString() . '.' . $extension;

        $path = $this->disk()->putFileAs($folder, $file, $filename);

        if (! $path) {
            throw new \RuntimeException('Failed to store KYC document.');
        }

        return $path;
    }

    public function exists(?string $key): bool
    {
        if (! $this->isStoredKey($key)) {
            return false;
        }

        return $this->disk()->exists($key);
    }

    public function delete(?string $key): bool
    {
        if (! $this->isStoredKey($key)) {
            return false;
        }

        return $this->disk()->delete($key);
    }

    /**
     * @param  array<int, string|null>  $keys
     */
    public function deleteMany(array $keys): void
    {
        foreach ($keys as $key) {
            $this->delete($key);
        }
    }

    public function isPlaceholder(?string $key): bool
    {
        return is_string($key) && str_starts_with($key, self::PLACEHOLDER_PREFIX);
    }

    /**
     * True when the key is a private-disk relative path (not a legacy public URL/path or placeholder).
     */
    public function isStoredKey(?string $key): bool
    {
        if (! is_string($key) || $key === '') {
            return false;
        }

        if ($this->isPlaceholder($key)) {
            return false;
        }

        if (str_starts_with($key, 'assets/images/') || str_starts_with($key, '/assets/images/')) {
            return false;
        }

        if (str_starts_with($key, 'http://') || str_starts_with($key, 'https://')) {
            return false;
        }

        return true;
    }

    /**
     * Whether a DB path still points at the old public web root.
     */
    public function isLegacyPublicPath(?string $path): bool
    {
        if (! is_string($path) || $path === '') {
            return false;
        }

        $normalized = ltrim($path, '/');

        return str_starts_with($normalized, 'assets/images/individuals/')
            || str_starts_with($normalized, 'assets/images/corporate_verifications/');
    }
}
