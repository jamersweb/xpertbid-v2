<?php

namespace App\Http\Controllers;

use App\Models\CorporateVerification;
use App\Models\IndividualVerification;
use App\Models\User;
use App\Services\KycDocumentStorage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class KycDocumentController extends Controller
{
    public function __construct(private KycDocumentStorage $storage)
    {
    }

    public function individualFront(Request $request, int $id): StreamedResponse|BinaryFileResponse
    {
        $verification = IndividualVerification::findOrFail($id);
        $this->authorizeAccess($request->user(), $verification->user_id, 'individual-verification-list');

        return $this->stream($verification->id_front_path);
    }

    public function individualBack(Request $request, int $id): StreamedResponse|BinaryFileResponse
    {
        $verification = IndividualVerification::findOrFail($id);
        $this->authorizeAccess($request->user(), $verification->user_id, 'individual-verification-list');

        return $this->stream($verification->id_back_path);
    }

    public function corporateDocument(Request $request, int $id, int $index): StreamedResponse|BinaryFileResponse
    {
        $verification = CorporateVerification::findOrFail($id);
        $this->authorizeAccess($request->user(), $verification->user_id, 'corporate-verification-list');

        $documents = $verification->business_documents ?? [];
        if (! is_array($documents) || ! array_key_exists($index, $documents)) {
            abort(404);
        }

        return $this->stream($documents[$index]);
    }

    private function authorizeAccess(?User $user, int $ownerId, string $permission): void
    {
        if (! $user) {
            abort(401);
        }

        if ((int) $user->id === (int) $ownerId) {
            return;
        }

        if ($this->canReviewVerifications($user, $permission)) {
            return;
        }

        abort(403);
    }

    private function canReviewVerifications(User $user, string $permission): bool
    {
        $role = strtolower((string) ($user->role ?? ''));
        if (in_array($role, ['admin', 'superadmin'], true)) {
            return true;
        }

        if (method_exists($user, 'can') && $user->can($permission)) {
            return true;
        }

        $matchedRole = Role::query()
            ->whereRaw('LOWER(name) = ?', [$role])
            ->with('permissions:id,name')
            ->first();

        if (! $matchedRole) {
            return false;
        }

        return $matchedRole->permissions->contains('name', $permission);
    }

    private function stream(?string $key): StreamedResponse|BinaryFileResponse
    {
        if ($this->storage->isPlaceholder($key) || ! filled($key)) {
            abort(404);
        }

        // New private-disk keys
        if ($this->storage->isStoredKey($key)) {
            $disk = Storage::disk(KycDocumentStorage::DISK);

            $absolute = null;
            try {
                $absolute = $disk->path($key);
            } catch (\Throwable) {
                $absolute = null;
            }

            if ($disk->exists($key) || ($absolute && is_file($absolute))) {
                if ($absolute && is_file($absolute)) {
                    return response()->file($absolute, [
                        'Content-Disposition' => 'inline; filename="'.basename($absolute).'"',
                    ]);
                }

                return $disk->response(
                    $key,
                    basename($key),
                    ['Content-Disposition' => 'inline; filename="'.basename($key).'"']
                );
            }
        }

        // Legacy public paths (until kyc:migrate-public-documents --apply --delete-public)
        if ($this->storage->isLegacyPublicPath($key)) {
            $absolute = public_path(ltrim($key, '/'));
            if (File::isFile($absolute)) {
                return response()->file($absolute, [
                    'Content-Disposition' => 'inline; filename="'.basename($absolute).'"',
                ]);
            }
        }

        abort(404);
    }
}
