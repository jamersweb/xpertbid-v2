<?php

namespace App\Http\Controllers;

use App\Models\FaqQuestion;
//use App\Models\FaqCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
class FaqQuestionController extends Controller
{
    public function index()
    {
        $faqQuestions = FaqQuestion::all();

        return view('faq.index', compact('faqQuestions'));
    }

    public function create()
    {
        //$categories = FaqCategory::all();
        return view('faq.create');
    }

    public function store(Request $request)
    {
        $request->validate([
           'question_text' => 'required|string',
            'answer_text' => 'required|string',
            'status' => 'required|in:Active,Inactive',
        ]);

        FaqQuestion::create($request->all());

        return redirect()->route('faq_questions.index')->with('success', 'FAQ Question created successfully.');
    }

    public function edit(FaqQuestion $faqQuestion)
    {
        //$categories = FaqCategory::all();
        return view('faq.create', compact('faqQuestion'));
    }

    public function update(Request $request, FaqQuestion $faqQuestion)
    {
        $request->validate([
            'question_text' => 'required|string',
            'answer_text' => 'required|string',
            'status' => 'required|in:Active,Inactive',
        ]);

        $faqQuestion->update($request->all());

        return redirect()->route('faq_questions.index')->with('success', 'FAQ Question updated successfully.');
    }

    public function destroy(FaqQuestion $faqQuestion)
    {
        $faqQuestion->delete();
        return redirect()->route('faq_questions.index')->with('success', 'FAQ Question Deleted successfully.');
    }

    public function show(FaqQuestion $faqQuestion)
    {
        return view('faq.show', compact('faqQuestion'));
    }
}
