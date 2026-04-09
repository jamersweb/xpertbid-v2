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

    public function create()
    {
        return Inertia::render('Admin/Seo/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'slug'             => 'required|unique:seos,slug',
            'meta_title'       => 'nullable|string',
            'meta_description' => 'nullable|string',
            'meta_keywords'    => 'nullable|string',
            'schema_markup'    => 'nullable|string',
            'canonical_url'    => 'nullable|url',
        ]);

        Seo::create($data);

        return redirect()->route('admin.seo.index')->with('success', 'SEO record created.');
    }

    public function edit(Seo $seo)
    {
        return Inertia::render('Admin/Seo/Edit', [
            'seo' => $seo,
        ]);
    }

    public function update(Request $request, Seo $seo)
    {
        $data = $request->validate([
            'slug'             => 'required|unique:seos,slug,' . $seo->id,
            'meta_title'       => 'nullable|string',
            'meta_description' => 'nullable|string',
            'meta_keywords'    => 'nullable|string',
            'schema_markup'    => 'nullable|string',
            'canonical_url'    => 'nullable|url',
        ]);

        $seo->update($data);

        return redirect()->route('admin.seo.index')->with('success', 'SEO record updated.');
    }

    public function destroy(Seo $seo)
    {
        $seo->delete();

        return redirect()->route('admin.seo.index')->with('success', 'SEO record deleted.');
    }
}
