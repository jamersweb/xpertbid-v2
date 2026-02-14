<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FaqQuestion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqQuestionController extends Controller
{
    public function index()
    {
        $faqQuestions = FaqQuestion::all();
        return Inertia::render('Admin/Faqs/Index', [
            'faqs' => $faqQuestions
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Faqs/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'question_text' => 'required|string',
            'answer_text' => 'required|string',
            'status' => 'required|in:Active,Inactive',
        ]);

        FaqQuestion::create($request->all());

        return redirect()->route('admin.faqs.index')->with('success', 'FAQ Question created successfully.');
    }

    public function edit(FaqQuestion $faq)
    {
        return Inertia::render('Admin/Faqs/Edit', [
            'faq' => $faq
        ]);
    }

    public function update(Request $request, FaqQuestion $faq)
    {
        $request->validate([
            'question_text' => 'required|string',
            'answer_text' => 'required|string',
            'status' => 'required|in:Active,Inactive',
        ]);

        $faq->update($request->all());

        return redirect()->route('admin.faqs.index')->with('success', 'FAQ Question updated successfully.');
    }

    public function destroy(FaqQuestion $faq)
    {
        $faq->delete();
        return redirect()->route('admin.faqs.index')->with('success', 'FAQ Question Deleted successfully.');
    }
}
