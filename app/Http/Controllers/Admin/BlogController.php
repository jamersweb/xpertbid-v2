<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::latest()->paginate(10);
        return Inertia::render('Admin/Blogs/Index', [
            'blogs' => $blogs
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Blogs/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'   => 'required|string|max:255',
            'content' => 'required',
            'image'   => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $file     = $request->file('image');
            $filename = time().'_'.$file->getClientOriginalName();
            $file->move(public_path('assets/images/blogs'), $filename);
            $data['image'] = 'assets/images/blogs/'.$filename;
        }

        $data['slug']    = Str::slug($request->title);
        $data['user_id'] = auth()->id();

        Blog::create($data);

        return redirect()->route('admin.blogs.index')->with('success','Blog created successfully.');
    }

    public function edit(Blog $blog)
    {
        return Inertia::render('Admin/Blogs/Edit', [
            'blog' => $blog
        ]);
    }

    public function update(Request $request, Blog $blog)
    {
        $data = $request->validate([
            'title'   => 'required|string|max:255',
            'content' => 'required',
            'image'   => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($blog->image && file_exists(public_path($blog->image))) {
                @unlink(public_path($blog->image));
            }

            $file     = $request->file('image');
            $filename = time().'_'.$file->getClientOriginalName();
            $file->move(public_path('assets/images/blogs'), $filename);
            $data['image'] = 'assets/images/blogs/'.$filename;
        }

        $data['slug'] = Str::slug($request->title);

        $blog->update($data);

        return redirect()->route('admin.blogs.index')->with('success','Blog updated successfully.');
    }

    public function destroy(Blog $blog)
    {
        if ($blog->image && file_exists(public_path($blog->image))) {
            @unlink(public_path($blog->image));
        }
        $blog->delete();

        return redirect()->route('admin.blogs.index')->with('success','Blog deleted.');
    }
}
