<?php

// app/Http/Controllers/SliderCategoryController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SliderCategory;

class SliderCategoryController extends Controller
{
    // Show the create form
    public function create()
    {
        return view('slider_categories.create');
    }

    // Handle form submission and create a new slider category
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255'
        ]);

        SliderCategory::create([
            'name' => $request->input('name')
        ]);

        return redirect()->back()->with('success', 'Slider category created successfully!');
    }
}
