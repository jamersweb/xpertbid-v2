<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use App\Models\SliderCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SliderController extends Controller
{
    public function index()
    {
        $sliders = Slider::with('category')->get();
        return Inertia::render('Admin/Sliders/Index', [
            'sliders' => $sliders
        ]);
    }

    public function create()
    {
        $categories = SliderCategory::all();
        return Inertia::render('Admin/Sliders/Create', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'              => 'required|string|max:255',
            'subtitle'           => 'nullable|string|max:255',
            'description'        => 'nullable|string|max:500',
            'image'              => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'slider_category_id' => 'required|exists:slider_categories,id',
        ]);

        $imageName = null;
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->extension();
            $image->move(public_path('assets/images/slider'), $imageName);
        }

        Slider::create([
            'title'              => $request->title,
            'subtitle'           => $request->subtitle,
            'description'        => $request->description,
            'image'              => $imageName ? "/assets/images/slider/" . $imageName : null,
            'slider_category_id' => $request->slider_category_id,
        ]);

        return redirect()->route('admin.sliders.index')->with('success', 'Slider created successfully!');
    }

    public function edit(Slider $slider)
    {
        $categories = SliderCategory::all();
        return Inertia::render('Admin/Sliders/Edit', [
            'slider' => $slider,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, Slider $slider)
    {
        $data = $request->validate([
            'title'              => 'required|string|max:255',
            'subtitle'           => 'nullable|string|max:255',
            'description'        => 'nullable|string|max:500',
            'image'              => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'slider_category_id' => 'required|exists:slider_categories,id',
        ]);

        if ($request->hasFile('image')) {
            if ($slider->image && file_exists(public_path($slider->image))) {
                @unlink(public_path($slider->image));
            }
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->extension();
            $image->move(public_path('assets/images/slider'), $imageName);
            $data['image'] = "/assets/images/slider/" . $imageName;
        }

        $slider->update($data);

        return redirect()->route('admin.sliders.index')->with('success', 'Slider updated successfully!');
    }

    public function destroy(Slider $slider)
    {
        if ($slider->image && file_exists(public_path($slider->image))) {
            @unlink(public_path($slider->image));
        }
        $slider->delete();
        return redirect()->route('admin.sliders.index')->with('success', 'Slider deleted successfully!');
    }
}
