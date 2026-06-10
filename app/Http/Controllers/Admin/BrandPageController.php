<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BrandPageController extends Controller
{
    protected function storeBrandUpload(Request $request, string $field, string $directory = 'assets/images/brands'): ?string
    {
        if (!$request->hasFile($field)) {
            return null;
        }

        $file = $request->file($field);
        $extension = strtolower($file->getClientOriginalExtension());
        $filename = time() . '_' . Str::random(12) . '.' . $extension;

        Storage::disk('public')->makeDirectory($directory);
        $storedPath = $file->storeAs($directory, $filename, 'public');

        return $storedPath ? '/brand-assets/' . ltrim($storedPath, '/') : null;
    }

    protected function removeStoredFile(?string $path): void
    {
        if (!$path) {
            return;
        }

        $cleanPath = ltrim($path, '/');

        if (str_starts_with($cleanPath, 'storage/')) {
            $diskPath = substr($cleanPath, strlen('storage/'));
            if (Storage::disk('public')->exists($diskPath)) {
                Storage::disk('public')->delete($diskPath);
            }
            return;
        }

        $fullPath = public_path($cleanPath);

        if (file_exists($fullPath)) {
            @unlink($fullPath);
        }
    }

    protected function imageFields(): array
    {
        return [
            'banner_img',
            'banner_img_mob',
            'box_1_img',
            'box_1_img_mob',
            'box_2_img',
            'box_2_img_mob',
            'box_3_img',
            'box_3_img_mob',
        ];
    }

    public function index(Request $request)
    {
        $brands = Brand::query()
            ->orderBy('name')
            ->get();

        $selectedBrandId = $request->integer('brand_id');
        $selectedBrand = $selectedBrandId
            ? $brands->firstWhere('id', $selectedBrandId)
            : $brands->first();

        $brandListings = $selectedBrand
            ? Listing::query()
                ->with(['user:id,name,profile_pic'])
                ->where('brand_id', $selectedBrand->id)
                ->latest()
                ->get()
            : collect();

        return Inertia::render('Admin/Brands/PageBuilder', [
            'brands' => $brands,
            'selectedBrand' => $selectedBrand,
            'brandListings' => $brandListings,
        ]);
    }

    public function update(Request $request, Brand $brand)
    {
        $rules = [];

        foreach ($this->imageFields() as $field) {
            $rules[$field] = ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,gif,avif', 'max:4096'];
        }

        $rules['sections_json'] = ['nullable', 'string'];

        $request->validate($rules);

        $brandListingIds = Listing::query()
            ->where('brand_id', $brand->id)
            ->pluck('id')
            ->map(fn ($id) => (int) $id)
            ->all();

        foreach ($this->imageFields() as $field) {
            if ($request->hasFile($field)) {
                $this->removeStoredFile($brand->{$field});
                $brand->{$field} = $this->storeBrandUpload($request, $field);
            }
        }

        $sectionsJson = $request->input('sections_json', '[]');
        $sections = json_decode($sectionsJson, true);

        if (!is_array($sections)) {
            throw ValidationException::withMessages([
                'sections_json' => 'Sections data is invalid.',
            ]);
        }

        $normalizedSections = [];
        foreach (array_values($sections) as $index => $section) {
            if (!is_array($section)) {
                throw ValidationException::withMessages([
                    'sections_json' => 'Each section must be a valid object.',
                ]);
            }

            $title = trim((string) ($section['title'] ?? ''));
            $listingIds = $section['listing_ids'] ?? [];

            if (!is_array($listingIds)) {
                throw ValidationException::withMessages([
                    'sections_json' => 'Section products must be a valid list.',
                ]);
            }

            $normalizedListingIds = collect($listingIds)
                ->map(fn ($id) => (int) $id)
                ->filter(fn ($id) => $id > 0)
                ->values()
                ->all();

            $validListingIds = [];
            if (!empty($normalizedListingIds)) {
                $validListingIds = Listing::query()
                    ->where('brand_id', $brand->id)
                    ->whereIn('id', $normalizedListingIds)
                    ->pluck('id')
                    ->map(fn ($id) => (int) $id)
                    ->all();

                if (count($validListingIds) !== count($normalizedListingIds)) {
                    throw ValidationException::withMessages([
                        'sections_json' => 'Selected products must belong to the chosen brand.',
                    ]);
                }
            }

            if ($title === '') {
                throw ValidationException::withMessages([
                    'sections_json' => 'Each section needs a title.',
                ]);
            }

            $normalizedSections[] = [
                'title' => $title,
                'listing_ids' => $validListingIds,
                'sort_order' => $index,
            ];
        }

        $brand->page_sections = $normalizedSections;
        $brand->save();

        return redirect()->back()->with('success', 'Brand page updated successfully.');
    }

    public function asset(string $path)
    {
        $path = ltrim($path, '/');

        if (Storage::disk('public')->exists($path)) {
            return response()->file(Storage::disk('public')->path($path));
        }

        $publicPath = public_path($path);
        if (file_exists($publicPath)) {
            return response()->file($publicPath);
        }

        abort(404, 'Asset not found.');
    }
}
