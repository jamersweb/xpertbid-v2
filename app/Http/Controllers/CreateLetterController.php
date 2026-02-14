<?php

namespace App\Http\Controllers;

use App\Models\CreateLetter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
class CreateLetterController extends Controller
{
    public function index()
    {
        $letters = CreateLetter::paginate(10);
        return view('createletters.index', compact('letters'));
    }

    public function create()
    {
        return view('createletters.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'to' => 'required',
            'title' => 'required|min:2|max:50',
            'message' => 'required',
        ]);

        CreateLetter::create($request->all());

        return redirect()->route('createletters.index')
                         ->with('success', 'Letter created successfully.');
    }

    public function show(CreateLetter $createLetter)
    {
        return view('createletters.show', compact('createLetter'));
    }

    public function edit(CreateLetter $createLetter)
    {
        //dd( $createLetter);
        return view('createletters.edit', compact('createLetter'));
    }

    public function update(Request $request, CreateLetter $createLetter)
    {
        $request->validate([
            'to' => 'required',
            'title' => 'required|min:2|max:50',
            'message' => 'required',
        ]);

        $createLetter->update($request->all());

        return redirect()->route('createletters.index')
                         ->with('success', 'Letter updated successfully.');
    }

    public function destroy(CreateLetter $createLetter)
    {
        $createLetter->delete();

        return redirect()->route('createletters.index')
                         ->with('success', 'Letter deleted successfully.');
    }
}
