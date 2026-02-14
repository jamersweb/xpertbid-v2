<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuctionCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AuctionCategoryController extends Controller
{
    public function index()
    {
        $categories = AuctionCategory::with('subCategories.childCategories')
            ->whereNull('parent_id')
            ->whereNull('sub_category_id')
            ->get();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:auction_categories,id',
            'sub_category_id' => 'nullable|exists:auction_categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'seo_content' => 'nullable|string',
            'seo_short_content' => 'nullable|string',
            'schema_markup' => 'nullable|string',
            'slug' => 'nullable|string|max:255|unique:auction_categories,slug',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('/assets/images/category_images/'), $filename);
            $imagePath = '/assets/images/category_images/' . $filename;
        }

        AuctionCategory::create([
            'name' => $request->name,
            'parent_id' => $request->parent_id,
            'sub_category_id' => $request->sub_category_id,
            'image' => $imagePath,
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
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'seo_content' => 'nullable|string',
            'seo_short_content' => 'nullable|string',
            'schema_markup' => 'nullable|string',
            'slug' => 'nullable|string|max:255|unique:auction_categories,slug,' . $id,
        ]);

        if ($request->hasFile('image')) {
            if ($category->image && file_exists(public_path($category->image))) {
                @unlink(public_path($category->image));
            }
            $file = $request->file('image');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('assets/images/category_images'), $filename);
            $category->image = 'assets/images/category_images/' . $filename;
        }

        $category->update([
            'name' => $request->name,
            'parent_id' => $request->parent_id,
            'sub_category_id' => $request->sub_category_id,
            'meta_title' => $request->meta_title,
            'meta_description' => $request->meta_description,
            'seo_content' => $request->seo_content,
            'seo_short_content' => $request->seo_short_content,
            'schema_markup' => $request->schema_markup,
            'slug' => Str::slug($request->slug ?? $request->name),
        ]);

        return redirect()->back()->with('success', 'Category updated successfully!');
    }

    public function destroy($id)
    {
        $category = AuctionCategory::findOrFail($id);
        if ($category->image && file_exists(public_path($category->image))) {
            @unlink(public_path($category->image));
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
