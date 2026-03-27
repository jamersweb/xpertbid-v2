<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Events\MessageSent;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
// use App\Mail\UnreadMessageNotification; // Need to migrate this if needed
// use App\Models\NewNotification; // Need to check if NewNotification exists in V2

class ChatController extends Controller
{
    // List all conversations for the authenticated user
    public function index(Request $request)
    {
        try {
            $userId = Auth::id();

            $conversations = Conversation::with(['userOne', 'userTwo'])
                ->where(function ($query) use ($userId) {
                    $query->where('user_one_id', $userId)
                        ->where('user_one_deleted', false);
                })
                ->orWhere(function ($query) use ($userId) {
                    $query->where('user_two_id', $userId)
                        ->where('user_two_deleted', false);
                })
                ->orderByDesc('updated_at')
                ->get()
                ->map(function ($conversation) use ($userId) {
                    // Determine the other user
                    $otherUser = $conversation->user_one_id == $userId ? $conversation->userTwo : $conversation->userOne;
                    $conversation->other_user = $otherUser;

                    // Determine is_important
                    $conversation->is_important = ($conversation->user_one_id == $userId)
                        ? $conversation->user_one_important
                        : $conversation->user_two_important;

                    $conversation->last_message = $conversation->messages()->latest()->first();
                    return $conversation;
                });

            return response()->json($conversations);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Get messages for a specific conversation
    public function show($id)
    {
        $userId = Auth::id();
        $conversation = Conversation::with(['messages.sender', 'product', 'userOne', 'userTwo'])->findOrFail($id);

        if ($conversation->user_one_id != $userId && $conversation->user_two_id != $userId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $otherUser = $conversation->user_one_id == $userId ? $conversation->userTwo : $conversation->userOne;
        $conversation->other_user = $otherUser;

        $conversation->is_important = ($conversation->user_one_id == $userId)
            ? $conversation->user_one_important
            : $conversation->user_two_important;

        return response()->json($conversation);
    }

    // Initiate or get existing conversation
    public function initiate(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'product_id' => 'nullable|exists:auctions,id',
        ]);

        $authUserId = Auth::id();
        $otherUserId = $request->user_id;

        if ($authUserId == $otherUserId) {
            return response()->json(['message' => 'Cannot chat with yourself'], 400);
        }

        $conversation = Conversation::where(function ($query) use ($authUserId, $otherUserId) {
            $query->where('user_one_id', $authUserId)->where('user_two_id', $otherUserId);
        })->orWhere(function ($query) use ($authUserId, $otherUserId) {
            $query->where('user_one_id', $otherUserId)->where('user_two_id', $authUserId);
        })->where('product_id', $request->product_id)
            ->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'user_one_id' => $authUserId,
                'user_two_id' => $otherUserId,
                'product_id' => $request->product_id,
            ]);
        }

        return response()->json($conversation);
    }

    // Send a message
    public function store(Request $request)
    {
        $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
            'body' => 'nullable|string',
            'attachment' => 'nullable|file|max:10240',
        ]);

        if (!$request->body && !$request->hasFile('attachment')) {
            return response()->json(['message' => 'Message cannot be empty'], 400);
        }

        $conversation = Conversation::findOrFail($request->conversation_id);

        if ($conversation->user_one_id != Auth::id() && $conversation->user_two_id != Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $type = 'text';
        $attachmentPath = null;

        if ($request->hasFile('attachment')) {
            $type = 'image';
            $file = $request->file('attachment');
            $filename = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
            $file->move(public_path('assets/images/chat'), $filename);
            $attachmentPath = 'assets/images/chat/' . $filename;
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => Auth::id(),
            'body' => $request->body,
            'type' => $type,
            'attachment_path' => $attachmentPath,
        ]);
        
        $conversation->touch();

        try {
            broadcast(new MessageSent($message))->toOthers();
        } catch (\Exception $e) {
            \Log::error("Broadcast failed: " . $e->getMessage());
        }

        // TODO: Implement notifications if needed

        return response()->json($message);
    }

    public function deleteConversation($id)
    {
        $conversation = Conversation::findOrFail($id);
        $userId = Auth::id();

        if ($conversation->user_one_id == $userId) {
            $conversation->user_one_deleted = true;
        } elseif ($conversation->user_two_id == $userId) {
            $conversation->user_two_deleted = true;
        } else {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $conversation->save();

        return response()->json(['message' => 'Conversation deleted']);
    }

    public function toggleImportant($id)
    {
        $conversation = Conversation::findOrFail($id);
        $userId = Auth::id();

        if ($conversation->user_one_id == $userId) {
            $conversation->user_one_important = !$conversation->user_one_important;
        } elseif ($conversation->user_two_id == $userId) {
            $conversation->user_two_important = !$conversation->user_two_important;
        } else {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $conversation->save();

        return response()->json(['message' => 'Conversation importance toggled', 'conversation' => $conversation]);
    }
}
