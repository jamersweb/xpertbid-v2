<?php

namespace App\Http\Controllers;

use App\Models\ContentPage;
use Illuminate\Http\Request;

class ContentPageController extends Controller
{
    public function index()
    {
        $contentPages = ContentPage::paginate(10);
        return view('content_pages.index', compact('contentPages'));
    }

    public function create()
    {
        return view('content_pages.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:50',
            'description' => 'required|string',
            'status' => 'required|in:Active,Inactive',
        ]);

        ContentPage::create($request->all());
        return redirect()->route('content-pages.index')->with('success', 'Content Page created successfully.');
    }

    public function show(ContentPage $contentPage)
    {
        return view('content_pages.show', compact('contentPage'));
    }

    public function edit(ContentPage $contentPage)
    {
        return view('content_pages.create', compact('contentPage'));
    }

    public function update(Request $request, ContentPage $contentPage)
    {
        $request->validate([
            'title' => 'required|string|max:50',
            'description' => 'required|string',
            'status' => 'required|in:Active,Inactive',
        ]);

        $contentPage->update($request->all());
        return redirect()->route('content-pages.index')->with('success', 'Content Page updated successfully.');
    }

    public function destroy(ContentPage $contentPage)
    {
        $contentPage->delete();
        return redirect()->route('content-pages.index')->with('Content Page deleted successfully.');

       // return response()->json(['success' => 'Content Page deleted successfully.']);
    }
}
