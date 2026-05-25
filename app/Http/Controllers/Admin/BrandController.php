<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
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

        if (!is_dir(public_path($directory))) {
            mkdir(public_path($directory), 0755, true);
        }

        $file->move(public_path($directory), $filename);

        return '/' . trim($directory, '/') . '/' . $filename;
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
            if ($brand->image && file_exists(public_path($brand->image))) {
                @unlink(public_path($brand->image));
            }
            $brand->image = $this->storeBrandUpload($request, 'image');
        }

        $brand->name = $validated['name'];
        $brand->slug = $this->makeUniqueSlug($validated['name'], $brand->id);
        $brand->save();

        return redirect()->back()->with('success', 'Brand updated successfully.');
    }

    public function destroy(Brand $brand)
    {
        if ($brand->image && file_exists(public_path($brand->image))) {
            @unlink(public_path($brand->image));
        }

        $brand->delete();

        return redirect()->back()->with('success', 'Brand deleted successfully.');
    }
}
