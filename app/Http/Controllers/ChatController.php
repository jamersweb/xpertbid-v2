<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatController extends Controller
{
    /**
     * Display the chat interface.
     */
    public function index()
    {
        return Inertia::render('Chat/Index');
    }
}
