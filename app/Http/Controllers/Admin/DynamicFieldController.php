<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DynamicField;
use App\Models\AuctionCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DynamicFieldController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $fields = DynamicField::with('category')->latest()->get();
        // Fetch only root categories with their nested children for the dropdown
        $categories = AuctionCategory::with('subCategories.childCategories')
            ->whereNull('parent_id')
            ->whereNull('sub_category_id')
            ->get();
 
        return Inertia::render('Admin/DynamicFields/Index', [
            'fields' => $fields,
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'listing_type' => 'required|in:normal,auction,business,all',
            'category_id' => 'nullable|exists:auction_categories,id',
            'field_name' => 'required|string|max:255',
            'label' => 'required|string|max:255',
            'input_type' => 'required|string',
            'options' => 'nullable|array',
            'is_required' => 'boolean'
        ]);

        DynamicField::create($request->all());

        return redirect()->back()->with('success', 'Dynamic field created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $field = DynamicField::findOrFail($id);

        $request->validate([
            'listing_type' => 'required|in:normal,auction,business,all',
            'category_id' => 'nullable|exists:auction_categories,id',
            'field_name' => 'required|string|max:255',
            'label' => 'required|string|max:255',
            'input_type' => 'required|string',
            'options' => 'nullable|array',
            'is_required' => 'boolean'
        ]);

        $field->update($request->all());

        return redirect()->back()->with('success', 'Dynamic field updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $field = DynamicField::findOrFail($id);
        $field->delete();

        return redirect()->back()->with('success', 'Dynamic field deleted successfully.');
    }
}
