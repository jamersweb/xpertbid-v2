<?php
namespace App\Http\Controllers;

use App\Models\MasterSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class MasterSettingController extends Controller
{
    public function index()
    {
        $masterSettings = MasterSetting::paginate(10);
        return view('master_settings.index', compact('masterSettings'));
    }

    public function create()
    {
        return view('master_settings.create-edit');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'key' => 'required|string|unique:master_settings,key',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'description' => 'nullable|string',
        ]);

        $data = $request->all();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('images/master_settings', 'public');
        }

        MasterSetting::create($data);

        return redirect()->route('master-settings.index')->with('success', 'Master Setting created successfully.');
    }

    public function show(MasterSetting $masterSetting)
    {
        return view('master_settings.show', compact('masterSetting'));
    }

    public function edit(MasterSetting $masterSetting)
    {
        return view('master_settings.create-edit', compact('masterSetting'));
    }

    public function update(Request $request, MasterSetting $masterSetting)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'key' => 'required|string|unique:master_settings,key,' . $masterSetting->id,
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'description' => 'nullable|string',
        ]);

        $data = $request->all();

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($masterSetting->image) {
                Storage::disk('public')->delete($masterSetting->image);
            }
            $data['image'] = $request->file('image')->store('images/master_settings', 'public');
        }

        $masterSetting->update($data);

        return redirect()->route('master-settings.index')->with('success', 'Master Setting updated successfully.');
    }

    public function destroy(MasterSetting $masterSetting)
    {
        if ($masterSetting->image) {
            Storage::disk('public')->delete($masterSetting->image);
        }

        $masterSetting->delete();
        return response()->json(['success' => 'Master Setting deleted successfully.']);
    }
}
