<?php

namespace App\Http\Controllers;

use App\Models\EmailTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
class EmailTemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $emailTemplate = EmailTemplate::all();
       // dd($emailTemplate);
        return view('emailtemplates.index', compact('emailTemplate'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {  // $emailTemplate = EmailTemplate::findOrFail($id);
        return view('emailtemplates.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|min:2|max:100',
            'type' => 'required',
            'subject' => 'required|min:2|max:100',
            'content' => 'required',
        ]);
    
        EmailTemplate::create($request->all());
    
        return redirect()->route('emailtemplates.index')->with('success', 'Email Template created successfully.');
    }
    
    /**
     * Display the specified resource.
     */
    public function show(EmailTemplate $emailTemplate)
    {
        return view('emailtemplates.show', compact('emailTemplate'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EmailTemplate $emailTemplate)
    {

        $emailTemplate = EmailTemplate::findOrFail($id);
        return view('emailtemplates.create', compact('emailTemplate'));
        //return view('emailtemplates.create', compact('emailTemplate'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, EmailTemplate $emailTemplate)
    {
        $request->validate([
            'title' => 'required|min:2|max:100',
            'type' => 'required',
            'subject' => 'required|min:2|max:100',
            'content' => 'required',
        ]);

        $emailTemplate->update($request->all());

        return redirect()->route('emailtemplates.index')->with('success', 'Email Template updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EmailTemplate $emailTemplate)
    {    
       //dd( $emailTemplate);
       $emailTemplate->delete();
       return redirect()->route('emailtemplates.index')->with('Content Page deleted successfully.');
        //return response()->json(['success' => 'Email Template deleted successfully.']);
    }
}
