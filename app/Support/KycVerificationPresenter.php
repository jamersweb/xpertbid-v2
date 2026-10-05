<?php

namespace App\Support;

use App\Models\CorporateVerification;
use App\Models\IndividualVerification;
use App\Services\KycDocumentStorage;
use Illuminate\Support\Facades\File;

class KycVerificationPresenter
{
    public static function individual(?IndividualVerification $verification): ?array
    {
        if (! $verification) {
            return null;
        }

        $storage = app(KycDocumentStorage::class);
        $data = $verification->toArray();

        // Only expose download links when the file actually exists on disk.
        $hasFront = self::documentExists($storage, $verification->id_front_path);
        $hasBack = self::documentExists($storage, $verification->id_back_path);

        unset($data['id_front_path'], $data['id_back_path']);

        $data['has_id_front'] = $hasFront;
        $data['has_id_back'] = $hasBack;
        $data['id_front_url'] = $hasFront
            ? route('kyc.individual.front', $verification->id, absolute: false)
            : null;
        $data['id_back_url'] = $hasBack
            ? route('kyc.individual.back', $verification->id, absolute: false)
            : null;

        return $data;
    }

    public static function corporate(?CorporateVerification $verification): ?array
    {
        if (! $verification) {
            return null;
        }

        $storage = app(KycDocumentStorage::class);
        $data = $verification->toArray();
        $documents = is_array($verification->business_documents)
            ? $verification->business_documents
            : [];

        $urls = [];
        foreach ($documents as $index => $path) {
            if (! self::documentExists($storage, $path)) {
                continue;
            }
            $urls[] = route('kyc.corporate.document', [
                'id' => $verification->id,
                'index' => $index,
            ], absolute: false);
        }

        unset($data['business_documents']);
        $data['document_count'] = count($urls);
        $data['business_document_urls'] = $urls;

        return $data;
    }

    private static function documentExists(KycDocumentStorage $storage, ?string $key): bool
    {
        if (! filled($key) || $storage->isPlaceholder($key)) {
            return false;
        }

        if ($storage->isLegacyPublicPath($key)) {
            return File::isFile(public_path(ltrim($key, '/')));
        }

        return $storage->isStoredKey($key) && $storage->exists($key);
    }
}
