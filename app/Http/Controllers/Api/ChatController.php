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
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\Encoders\WebpEncoder;
// use App\Mail\UnreadMessageNotification; // Need to migrate this if needed
// use App\Models\NewNotification; // Need to check if NewNotification exists in V2

class ChatController extends Controller
{
    protected function storeOptimizedAttachment($file): array
    {
        $mimeType = $file->getMimeType() ?: '';

        if (str_starts_with($mimeType, 'image/')) {
            return [
                'type' => 'image',
                'path' => $this->storeOptimizedImage($file),
            ];
        }

        return [
            'type' => 'file',
            'path' => $this->storeDocumentFile($file),
        ];
    }

    protected function storeOptimizedImage($file): string
    {
        $directory = public_path('assets/images/chat');
        File::ensureDirectoryExists($directory);

        $manager = new ImageManager(new GdDriver());
        $image = $manager->read($file->getRealPath());
        $image->scaleDown(width: 1600, height: 1600);

        $filename = now()->timestamp . '_' . Str::random(12) . '.webp';
        $encoded = $image->encode(new WebpEncoder(82));
        $encoded->save($directory . DIRECTORY_SEPARATOR . $filename);

        return 'assets/images/chat/' . $filename;
    }

    protected function storeDocumentFile($file): string
    {
        $directory = public_path('assets/files/chat');
        File::ensureDirectoryExists($directory);

        $extension = strtolower($file->getClientOriginalExtension() ?: 'bin');
        $filename = now()->timestamp . '_' . Str::random(12) . '.' . $extension;
        $file->move($directory, $filename);

        return 'assets/files/chat/' . $filename;
    }

    protected function touchPresence(): void
    {
        $user = Auth::user();

        if ($user && Schema::hasColumn('users', 'last_active_at')) {
            $user->forceFill([
                'last_active_at' => now(),
            ])->saveQuietly();
        }
    }

    // List all conversations for the authenticated user
    public function index(Request $request)
    {
        try {
            $this->touchPresence();
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
        $this->touchPresence();
        $userId = Auth::id();
        $conversation = Conversation::with(['messages.sender', 'product', 'userOne', 'userTwo'])->findOrFail($id);

        if ($conversation->user_one_id != $userId && $conversation->user_two_id != $userId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $conversation->messages()
            ->where('sender_id', '!=', $userId)
            ->where(function ($query) {
                $query->whereNull('is_read')
                    ->orWhere('is_read', false);
            })
            ->update(['is_read' => true]);

        $conversation->load(['messages.sender']);

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
        $this->touchPresence();
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'product_id' => 'nullable|exists:listings,id',
        ]);

        $authUserId = Auth::id();
        $otherUserId = $request->user_id;

        if ($authUserId == $otherUserId) {
            return response()->json(['message' => 'Cannot chat with yourself'], 400);
        }

        $conversation = Conversation::where(function ($query) use ($authUserId, $otherUserId) {
            $query->where(function ($nested) use ($authUserId, $otherUserId) {
                $nested->where('user_one_id', $authUserId)
                    ->where('user_two_id', $otherUserId);
            })->orWhere(function ($nested) use ($authUserId, $otherUserId) {
                $nested->where('user_one_id', $otherUserId)
                    ->where('user_two_id', $authUserId);
            });
        })
            ->where('product_id', $request->product_id)
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
        $this->touchPresence();
        $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
            'body' => 'nullable|string',
            'attachment' => 'nullable|file|max:15360',
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
            $storedAttachment = $this->storeOptimizedAttachment($request->file('attachment'));
            $type = $storedAttachment['type'];
            $attachmentPath = $storedAttachment['path'];
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => Auth::id(),
            'body' => $request->body,
            'type' => $type,
            'attachment_path' => $attachmentPath,
            'is_read' => false,
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
        $this->touchPresence();
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
        $this->touchPresence();
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
