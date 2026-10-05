<?php

namespace App\Support;

use App\Models\CorporateVerification;
use App\Models\IndividualVerification;
use App\Services\KycDocumentStorage;

class KycVerificationPresenter
{
    public static function individual(?IndividualVerification $verification): ?array
    {
        if (! $verification) {
            return null;
        }

        $storage = app(KycDocumentStorage::class);
        $data = $verification->toArray();

        $hasFront = filled($verification->id_front_path)
            && ! $storage->isPlaceholder($verification->id_front_path);
        $hasBack = filled($verification->id_back_path)
            && ! $storage->isPlaceholder($verification->id_back_path);

        unset($data['id_front_path'], $data['id_back_path']);

        $frontUrl = $hasFront
            ? route('kyc.individual.front', $verification->id, absolute: false)
            : null;
        $backUrl = $hasBack
            ? route('kyc.individual.back', $verification->id, absolute: false)
            : null;

        $data['has_id_front'] = $hasFront;
        $data['has_id_back'] = $hasBack;
        $data['id_front_url'] = $frontUrl;
        $data['id_back_url'] = $backUrl;

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
            if (! filled($path) || $storage->isPlaceholder($path)) {
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
}
