<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuctionCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AuctionCategoryController extends Controller
{
    protected function formCategories()
    {
        return AuctionCategory::with('subCategories.childCategories')
            ->whereNull('parent_id')
            ->whereNull('sub_category_id')
            ->get();
    }

    protected function storeCategoryUpload(Request $request, string $field, string $directory = 'assets/images/category_images'): ?string
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

    protected function validateUploadExtension(Request $request, string $field, array $allowedExtensions): void
    {
        if (!$request->hasFile($field)) {
            return;
        }

        $extension = strtolower($request->file($field)->getClientOriginalExtension());

        if (!in_array($extension, $allowedExtensions, true)) {
            throw ValidationException::withMessages([
                $field => 'The ' . str_replace('_', ' ', $field) . ' must be a file of type: ' . implode(', ', $allowedExtensions) . '.',
            ]);
        }
    }

    public function index(Request $request)
    {
        $query = AuctionCategory::query();

        if ($request->search) {
            $search = $request->search;
            $query->where('name', 'LIKE', "%$search%")
                  ->orWhere('slug', 'LIKE', "%$search%");
            $categories = $query->limit(50)->get();
        } else {
            $categories = $this->formCategories();
        }

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Categories/Form', [
            'category' => null,
            'categories' => $this->formCategories(),
            'mode' => 'create',
        ]);
    }

    public function edit($id)
    {
        $category = AuctionCategory::findOrFail($id);

        return Inertia::render('Admin/Categories/Form', [
            'category' => $category,
            'categories' => $this->formCategories(),
            'mode' => 'edit',
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:auction_categories,id',
            'sub_category_id' => 'nullable|exists:auction_categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'icon' => 'nullable|file|max:2048',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'seo_content' => 'nullable|string',
            'seo_short_content' => 'nullable|string',
            'schema_markup' => 'nullable|string',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('auction_categories', 'slug')->whereNull('deleted_at'),
            ],
        ]);

        $this->validateUploadExtension($request, 'icon', ['jpeg', 'jpg', 'png', 'svg']);

        $imagePath = $this->storeCategoryUpload($request, 'image');
        $iconPath = $this->storeCategoryUpload($request, 'icon');

        AuctionCategory::create([
            'name' => $request->name,
            'parent_id' => $request->parent_id,
            'sub_category_id' => $request->sub_category_id,
            'image' => $imagePath,
            'icon' => $iconPath,
            'meta_title' => $request->meta_title,
            'meta_description' => $request->meta_description,
            'seo_content' => $request->seo_content,
            'seo_short_content' => $request->seo_short_content,
            'schema_markup' => $request->schema_markup,
            'slug' => Str::slug($request->slug ?? $request->name),
        ]);

        return redirect()->back()->with('success', 'Category added successfully!');
    }

    public function update(Request $request, $id)
    {
        $category = AuctionCategory::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:auction_categories,id',
            'sub_category_id' => 'nullable|exists:auction_categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'icon' => 'nullable|file|max:2048',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'seo_content' => 'nullable|string',
            'seo_short_content' => 'nullable|string',
            'schema_markup' => 'nullable|string',
            'slug' => 'nullable|string|max:255',
        ]);

        $this->validateUploadExtension($request, 'icon', ['jpeg', 'jpg', 'png', 'svg']);

        $nextSlug = Str::slug($request->slug ?: $request->name);
        if ($nextSlug !== $category->slug) {
            $slugExists = AuctionCategory::query()
                ->where('slug', $nextSlug)
                ->where('id', '!=', $category->id)
                ->whereNull('deleted_at')
                ->exists();

            if ($slugExists) {
                throw ValidationException::withMessages([
                    'slug' => 'The slug has already been taken.',
                ]);
            }
        }

        if ($request->hasFile('image')) {
            if ($category->image && file_exists(public_path($category->image))) {
                @unlink(public_path($category->image));
            }
            $category->image = $this->storeCategoryUpload($request, 'image');
        }

        if ($request->hasFile('icon')) {
            if ($category->icon && file_exists(public_path($category->icon))) {
                @unlink(public_path($category->icon));
            }
            $category->icon = $this->storeCategoryUpload($request, 'icon');
        }

        $updateData = [
            'name' => $request->name,
            'parent_id' => $request->parent_id,
            'sub_category_id' => $request->sub_category_id,
            'meta_title' => $request->meta_title,
            'meta_description' => $request->meta_description,
            'seo_content' => $request->seo_content,
            'seo_short_content' => $request->seo_short_content,
            'schema_markup' => $request->schema_markup,
            'slug' => $nextSlug,
        ];

        if ($request->hasFile('image')) {
            $updateData['image'] = $category->image;
        }

        if ($request->hasFile('icon')) {
            $updateData['icon'] = $category->icon;
        }

        $category->update($updateData);

        return redirect()->back()->with('success', 'Category updated successfully!');
    }

    public function destroy($id)
    {
        $category = AuctionCategory::findOrFail($id);
        if ($category->image && file_exists(public_path($category->image))) {
            @unlink(public_path($category->image));
        }
        if ($category->icon && file_exists(public_path($category->icon))) {
            @unlink(public_path($category->icon));
        }
        $category->delete();
        return redirect()->back()->with('success', 'Category deleted successfully!');
    }

    public function getSubcategories($parentId)
    {
        $subs = AuctionCategory::where('parent_id', $parentId)
            ->whereNull('sub_category_id')
            ->get(['id', 'name', 'slug']);
        return response()->json(['subcategories' => $subs]);
    }

    public function getChildren($id)
    {
        $subs = AuctionCategory::where('sub_category_id', $id)->get();
        return response()->json(['subcategories' => $subs]);
    }
}
