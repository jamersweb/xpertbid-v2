<?php

namespace App\Support;

use App\Models\BuyerRequest;
use App\Models\Listing;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class BuyerRequestSiteScope
{
    public const SITE_PROPERTY = 'property';

    public const SITE_RENOVATION = 'renovation';

    public static function resolve(?Request $request = null): ?string
    {
        $request ??= request();

        $site = strtolower(trim((string) (
            $request->query('site')
            ?? $request->header('X-Site')
            ?? ''
        )));

        if (in_array($site, [self::SITE_PROPERTY, self::SITE_RENOVATION], true)) {
            return $site;
        }

        return null;
    }

    /**
     * @return list<int>
     */
    public static function categoryIdsForSite(string $site): array
    {
        return match ($site) {
            self::SITE_PROPERTY => Listing::propertyCategoryIds(),
            self::SITE_RENOVATION => Listing::renovationCategoryIds(),
            default => [],
        };
    }

    public static function applyToQuery(Builder $query, ?string $site): Builder
    {
        if ($site === null) {
            return $query;
        }

        $ids = self::categoryIdsForSite($site);
        if ($ids === []) {
            return $query->whereRaw('1 = 0');
        }

        return $query->where(function (Builder $q) use ($ids) {
            $q->whereIn('category_id', $ids)
                ->orWhereIn('sub_category_id', $ids)
                ->orWhereIn('child_category_id', $ids);
        });
    }

    public static function requestBelongsToSite(BuyerRequest $request, ?string $site): bool
    {
        if ($site === null) {
            return true;
        }

        $ids = self::categoryIdsForSite($site);
        if ($ids === []) {
            return false;
        }

        return in_array((int) $request->category_id, $ids, true)
            || in_array((int) $request->sub_category_id, $ids, true)
            || in_array((int) $request->child_category_id, $ids, true);
    }

    public static function assertCategoryAllowed(
        ?string $site,
        ?int $categoryId,
        ?int $subCategoryId = null,
        ?int $childCategoryId = null
    ): void {
        if ($site === null) {
            return;
        }

        $ids = self::categoryIdsForSite($site);
        if ($ids === []) {
            throw ValidationException::withMessages([
                'category_id' => 'No categories are configured for this site.',
            ]);
        }

        $primary = (int) ($categoryId ?? 0);
        if ($primary <= 0 || ! in_array($primary, $ids, true)) {
            throw ValidationException::withMessages([
                'category_id' => 'Selected category is not available on this site.',
            ]);
        }

        if ($subCategoryId && ! in_array((int) $subCategoryId, $ids, true)) {
            throw ValidationException::withMessages([
                'sub_category_id' => 'Selected sub-category is not available on this site.',
            ]);
        }

        if ($childCategoryId && ! in_array((int) $childCategoryId, $ids, true)) {
            throw ValidationException::withMessages([
                'child_category_id' => 'Selected child category is not available on this site.',
            ]);
        }
    }

    /**
     * @param  list<int>  $categoryIds
     * @return list<int>
     */
    public static function filterCategoryIds(?string $site, array $categoryIds): array
    {
        if ($site === null) {
            return array_values(array_unique(array_map('intval', $categoryIds)));
        }

        $allowed = self::categoryIdsForSite($site);

        return array_values(array_intersect(
            array_map('intval', $categoryIds),
            $allowed
        ));
    }

    /**
     * Detect which satellite site a buyer request belongs to (if any).
     */
    public static function siteForRequest(BuyerRequest $request): ?string
    {
        if (self::requestBelongsToSite($request, self::SITE_PROPERTY)) {
            return self::SITE_PROPERTY;
        }

        if (self::requestBelongsToSite($request, self::SITE_RENOVATION)) {
            return self::SITE_RENOVATION;
        }

        return null;
    }

    /**
     * Absolute frontend origin for a site key, or null for the main Inertia app.
     */
    public static function frontendBaseUrl(?string $site): ?string
    {
        $base = match ($site) {
            self::SITE_PROPERTY => (string) config('property.frontend_url', ''),
            self::SITE_RENOVATION => (string) config('renovation.frontend_url', ''),
            default => '',
        };

        $base = rtrim($base, '/');

        return $base !== '' ? $base : null;
    }
}
