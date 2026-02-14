<?php

namespace App\Http\Controllers;

use App\Models\Slider;
use App\Models\Auction;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\SliderCategory;
class SliderController extends Controller
{
    // Display a listing of the resource
    public function index()
    {
        $sliders = Slider::all();
        return view('sliders.index', compact('sliders'));
    }

    // Show the form for creating a new resource
    public function create()
    {
          $sliderCategories = SliderCategory::all();
    return view('sliders.create', compact('sliderCategories'));
    }

    // Store a newly created resource in storage
public function store(Request $request)
{
    // Validate the incoming request data
    $request->validate([
        'title'              => 'required|string|max:255',
        'subtitle'           => 'nullable|string|max:255',
        'description'        => 'nullable|string|max:500',
        'image'              => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    // Set a default value for the image name
    $imageName = null;
    
    // If an image file is uploaded, process and move it
    if ($request->hasFile('image')) {
        $image = $request->file('image');
        $imageName = time() . '_' . uniqid() . '.' . $image->extension();
        $image->move(public_path('/assets/images/slider'), $imageName);
    }

    // Create the slider record including the slider_category_id field.
    Slider::create([
        'title'              => $request->title,
        'subtitle'           => $request->subtitle,
        'description'        => $request->description,
        'image'              => $imageName ? "/assets/images/slider/" . $imageName : null,
        'slider_category_id' => $request->slider_category_id,
    ]);

    return redirect()->route('sliders.index')->with('success', 'Slider created successfully!');
}

    // Display the specified resource
    public function show(Slider $slider)
    {
        return view('sliders.show', compact('slider'));
    }

    // Show the form for editing the specified resource
    public function edit(Slider $slider)
    {
    $sliderCategories = SliderCategory::all();
    return view('sliders.edit', compact('slider', 'sliderCategories'));
    }

    // Update the specified resource in storage
  public function update(Request $request, Slider $slider)
{
    $validatedData = $request->validate([
        'title'              => 'required|string|max:255',
        'subtitle'           => 'nullable|string|max:255',
        'description'        => 'nullable|string|max:500',
        'image'              => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    // Process new image if one is uploaded
    if ($request->hasFile('image')) {
        $image = $request->file('image');
        $imageName = time() . '_' . uniqid() . '.' . $image->extension();
        $image->move(public_path('/assets/images/slider'), $imageName);
        $validatedData['image'] = "/assets/images/slider/" . $imageName;
    }

    // Update the slider with all validated data including slider_category_id
    $slider->update($validatedData);

    return redirect()->route('sliders.index')->with('success', 'Slider updated successfully!');
}


    // Remove the specified resource from storage
    public function destroy(Slider $slider)
    {
        $slider->delete();
        return redirect()->route('sliders.index')->with('success', 'Slider deleted successfully!');
    }

public function getStats()
{
    // 1) Active auctions ki count (Listings)
    $listingsCount = Auction::where('status', 'active')->count();

    // 2) Creators ki count — un users ka count jinhon ne kam az kam ek auction create kiya
    $creatorsCount = User::whereHas('auctions')->count();

    // 3) Categories ki count — sirf root/main categories (parent_id & sub_category_id dono null)
    $categoriesCount = \App\Models\AuctionCategory::whereNull('parent_id')
        ->whereNull('sub_category_id')
        ->count();

    return response()->json([
        'listings'   => $listingsCount,
        'creators'   => $creatorsCount,
        'categories' => $categoriesCount,
    ]);
}

public function get_slider()
{
    $sliders = Slider::where('slider_category_id', 5)->get();
    return response()->json($sliders);
}

public function get_slider_vehicle(){
    $sliders = Slider::where('slider_category_id', 1)->get();
    return response()->json($sliders);
}
public function get_slider_service(){
    $sliders = Slider::where('slider_category_id', 2)->get();
    return response()->json($sliders);
}
public function get_slider_realstate(){
    $sliders = Slider::where('slider_category_id', 4)->get();
    return response()->json($sliders);
}


}
