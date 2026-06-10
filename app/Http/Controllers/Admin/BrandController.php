<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BrandController extends Controller
{
    protected function makeUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name);
        if ($base === '') {
            $base = 'brand';
        }

        $slug = $base;
        $i = 2;

        while (
            Brand::query()
                ->where('slug', $slug)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $base . '-' . $i;
            $i++;
        }

        return $slug;
    }

    protected function storeBrandUpload(Request $request, string $field, string $directory = 'assets/images/brands'): ?string
    {
        if (!$request->hasFile($field)) {
            return null;
        }

        $file = $request->file($field);
        $extension = strtolower($file->getClientOriginalExtension());
        $filename = time() . '_' . uniqid() . '.' . $extension;

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

    public function index(Request $request)
    {
        $query = Brand::query()->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }

        return Inertia::render('Admin/Brands/Index', [
            'brands' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,gif', 'max:2048'],
        ]);

        Brand::create([
            'name' => $validated['name'],
            'slug' => $this->makeUniqueSlug($validated['name']),
            'image' => $this->storeBrandUpload($request, 'image'),
        ]);

        return redirect()->back()->with('success', 'Brand created successfully.');
    }

    public function show(Brand $brand)
    {
        return Inertia::render('Admin/Brands/Show', [
            'brand' => $brand,
        ]);
    }

    public function update(Request $request, Brand $brand)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,gif', 'max:2048'],
        ]);

        if ($request->hasFile('image')) {
            $this->removeStoredFile($brand->image);
            $brand->image = $this->storeBrandUpload($request, 'image');
        }

        $brand->name = $validated['name'];
        $brand->slug = $this->makeUniqueSlug($validated['name'], $brand->id);
        $brand->save();

        return redirect()->back()->with('success', 'Brand updated successfully.');
    }

    public function destroy(Brand $brand)
    {
        foreach ([
            'image',
            'banner_img',
            'banner_img_mob',
            'box_1_img',
            'box_1_img_mob',
            'box_2_img',
            'box_2_img_mob',
            'box_3_img',
            'box_3_img_mob',
        ] as $field) {
            $this->removeStoredFile($brand->{$field});
        }

        $brand->delete();

        return redirect()->back()->with('success', 'Brand deleted successfully.');
    }
}
