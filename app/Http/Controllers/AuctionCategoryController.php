<?php

namespace App\Http\Controllers;

use App\Models\AuctionCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AuctionCategoryController extends Controller
{
    public function index()
    {
        $categories = AuctionCategory::with('subCategories.childCategories')
            ->whereNull('parent_id')
            ->whereNull('sub_category_id')
            ->get();

        return view('auction_categories.index', compact('categories'));
    }

    public function create()
    {
        $parents = AuctionCategory::whereNull('parent_id')
            ->whereNull('sub_category_id')
            ->get();

        $subCategories = collect();

        return view('auction_categories.create', compact('parents', 'subCategories'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:auction_categories,id',
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
            $albumName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('/assets/images/category_images/'), $albumName);
            $imagePath = '/assets/images/category_images/' . $albumName;
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
            'slug' => \Illuminate\Support\Str::slug($request->slug ?? $request->name),
        ]);

        return redirect()->route('auction_categories.index')->with('success', 'Category added successfully!');
    }

    public function edit($id)
    {
        $category = AuctionCategory::findOrFail($id);
        $parents = AuctionCategory::whereNull('parent_id')
            ->whereNull('sub_category_id')
            ->get();

        $subCategories = $category->parent_id
            ? AuctionCategory::where('parent_id', $category->parent_id)
                ->whereNull('sub_category_id')
                ->get()
            : collect();

        return view('auction_categories.create', compact('category', 'parents', 'subCategories'));
    }

    public function show($id)
    {
        $category = AuctionCategory::with('childrenRecursive')->findOrFail($id);

        return view('auction_categories.show', compact('category'));
    }

    public function update(Request $request, $id)
    {
        $category = AuctionCategory::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:auction_categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'seo_content' => 'nullable|string',
            'seo_short_content' => 'nullable|string',
            'schema_markup' => 'nullable|string',
            'slug' => 'nullable|string|max:255|unique:auction_categories,slug,' . $id,
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');

            if ($category->image && file_exists(public_path($category->image))) {
                unlink(public_path($category->image));
            }

            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('assets/images/category_images'), $filename);
            $category->image = 'assets/images/category_images/' . $filename;
        }

        $category->name = $request->input('name');
        $category->parent_id = $request->input('parent_id');
        $category->meta_title = $request->input('meta_title');
        $category->meta_description = $request->input('meta_description');
        $category->seo_content = $request->input('seo_content');
        $category->seo_short_content = $request->input('seo_short_content');
        $category->schema_markup = $request->input('schema_markup');

        if ($request->filled('slug')) {
            $category->slug = \Illuminate\Support\Str::slug($request->input('slug'));
        }

        $category->save();

        return redirect()
            ->route('auction_categories.index')
            ->with('success', 'Category updated successfully!');
    }

    public function destroy($id)
    {
        $category = AuctionCategory::findOrFail($id);

        if ($category->image) {
            Storage::disk('public')->delete($category->image);
        }

        $category->delete();

        return redirect()->route('auction_categories.index')->with('success', 'Category deleted successfully!');
    }

    public function getSubcategories($parentId)
    {
        $subs = AuctionCategory::where('parent_id', $parentId)
            ->whereNull('sub_category_id')
            ->get(['id', 'name', 'slug']);

        return response()->json(['subcategories' => $subs]);
    }

    protected function activeRootCategories()
    {
        $priority = [222, 311];

        return AuctionCategory::query()
            ->whereNull('parent_id')
            ->whereNull('sub_category_id')
            ->whereHas('listings', function ($q) {
                $q->where('status', 'active');
            })
            ->orderByRaw("FIELD(id, 222, 311) DESC")
            ->orderBy('id')
            ->get()
            ->sortBy(function ($cat) use ($priority) {
                $pos = array_search($cat->id, $priority, true);
                return $pos === false ? PHP_INT_MAX : $pos;
            })
            ->values();
    }

    public function get_category()
    {
        return response()->json([
            'categories' => $this->activeRootCategories(),
        ]);
    }

    public function get_category_sell()
    {
        return response()->json([
            'categories' => $this->activeRootCategories(),
        ]);
    }

    public function getChildren($id)
    {
        if (is_numeric($id)) {
            $category = AuctionCategory::find($id);
        } else {
            $category = AuctionCategory::where('name', $id)->first();
        }

        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }

        $subs = AuctionCategory::where('sub_category_id', $category->id)->get();

        return response()->json(['subcategories' => $subs]);
    }

    public function all_categories()
    {
        return response()->json([
            'category' => $this->activeRootCategories(),
        ]);
    }
}
