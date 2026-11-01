<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChatController extends Controller
{
    /**
     * Display the chat interface.
     * Opens a conversation once via session flash (no ID in the public URL).
     */
    public function index(Request $request)
    {
        $openConversationId = $request->session()->pull('open_conversation_id');

        return Inertia::render('Chat/Index', [
            'openConversationId' => $openConversationId ? (int) $openConversationId : null,
        ]);
    }

    /**
     * Authorize membership, flash the conversation, then redirect to clean /chat.
     */
    public function open(Conversation $conversation)
    {
        $userId = Auth::id();

        if ($conversation->user_one_id != $userId && $conversation->user_two_id != $userId) {
            abort(403, 'Unauthorized');
        }

        session()->flash('open_conversation_id', $conversation->id);

        return redirect()->route('chat.index');
    }
}
