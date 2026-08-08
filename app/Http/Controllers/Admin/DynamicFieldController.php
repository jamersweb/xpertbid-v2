<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DynamicField;
use App\Models\AuctionCategory;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
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
            'category_id' => 'nullable|integer|exists:auction_categories,id',
            'field_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('dynamic_fields', 'field_name')
                    ->where(fn ($q) => $q
                        ->where('listing_type', $request->listing_type)
                        ->where('category_id', $request->category_id)
                    ),
            ],
            'label' => 'required|string|max:255',
            'input_type' => 'required|string|in:text,number,email,url,tel,date,datetime-local,textarea,select,radio,checkbox',
            'options' => 'nullable|array',
            'is_required' => 'boolean'
        ]);

        DynamicField::create([
            'listing_type' => $request->listing_type,
            'category_id' => $request->filled('category_id') ? (int) $request->category_id : null,
            'field_name' => (string) $request->field_name,
            'label' => (string) $request->label,
            'input_type' => (string) $request->input_type,
            'options' => $request->options,
            'is_required' => $request->boolean('is_required'),
        ]);

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
            'category_id' => 'nullable|integer|exists:auction_categories,id',
            'field_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('dynamic_fields', 'field_name')
                    ->ignore($field->id)
                    ->where(fn ($q) => $q
                        ->where('listing_type', $request->listing_type)
                        ->where('category_id', $request->category_id)
                    ),
            ],
            'label' => 'required|string|max:255',
            'input_type' => 'required|string|in:text,number,email,url,tel,date,datetime-local,textarea,select,radio,checkbox',
            'options' => 'nullable|array',
            'is_required' => 'boolean'
        ]);

        $field->update([
            'listing_type' => $request->listing_type,
            'category_id' => $request->filled('category_id') ? (int) $request->category_id : null,
            'field_name' => (string) $request->field_name,
            'label' => (string) $request->label,
            'input_type' => (string) $request->input_type,
            'options' => $request->options,
            'is_required' => $request->boolean('is_required'),
        ]);

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
