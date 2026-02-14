<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Blog;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::latest()->paginate(10);

        return Inertia::render('Blogs/Index', [
            'blogs' => $blogs
        ]);
    }

    public function show($slug)
    {
        $blog = Blog::where('slug', $slug)->firstOrFail();

        return Inertia::render('Blogs/Show', [
            'blog' => $blog
        ]);
    }
}
