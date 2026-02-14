<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MasterSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MasterSettingController extends Controller
{
    public function index()
    {
        $settings = MasterSetting::all();
        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'key' => 'required|string|unique:master_settings,key',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'description' => 'nullable|string',
        ]);

        $data = $request->except('image');

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('images/master_settings', 'public');
            $data['image'] = Storage::url($path);
        }

        MasterSetting::create($data);

        return redirect()->back()->with('success', 'Setting created successfully.');
    }

    public function update(Request $request, $id)
    {
        $setting = MasterSetting::findOrFail($id);
        
        $request->validate([
            'title' => 'required|string|max:255',
            'key' => 'required|string|unique:master_settings,key,' . $id,
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'description' => 'nullable|string',
        ]);

        $data = $request->except(['image', '_method']);

        if ($request->hasFile('image')) {
            if ($setting->image) {
                // Try to delete old image
                $oldPath = str_replace('/storage/', '', $setting->image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('images/master_settings', 'public');
            $data['image'] = Storage::url($path);
        }

        $setting->update($data);

        return redirect()->back()->with('success', 'Setting updated successfully.');
    }

    public function destroy($id)
    {
        $setting = MasterSetting::findOrFail($id);
        
        if ($setting->image) {
            $oldPath = str_replace('/storage/', '', $setting->image);
            Storage::disk('public')->delete($oldPath);
        }

        $setting->delete();
        return redirect()->back()->with('success', 'Setting deleted successfully.');
    }
}
