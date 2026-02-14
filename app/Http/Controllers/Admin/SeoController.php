<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Seo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SeoController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Seo/Index', [
            'rows' => Seo::paginate(20)
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id'               => 'nullable|exists:seos,id',
            'slug'             => 'required|unique:seos,slug' . ($request->id ? ',' . $request->id : ''),
            'meta_title'       => 'nullable|string',
            'meta_description' => 'nullable|string',
            'meta_keywords'    => 'nullable|string',
            'schema_markup'    => 'nullable|string',
            'canonical_url'    => 'nullable|url',
        ]);

        if ($request->id) {
            $seo = Seo::findOrFail($request->id);
            $seo->update($data);
            $message = 'SEO record updated.';
        } else {
            Seo::create($data);
            $message = 'SEO record created.';
        }

        return redirect()->route('admin.seo.index')->with('success', $message);
    }

    public function destroy($id)
    {
        $seo = Seo::findOrFail($id);
        $seo->delete();

        return redirect()->route('admin.seo.index')->with('success', 'SEO record deleted.');
    }
}
