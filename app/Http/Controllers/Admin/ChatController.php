<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\StreamsCsvExports;
use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatController extends Controller
{
    use StreamsCsvExports;

    public function index()
    {
        return Inertia::render('Admin/Chat/Index');
    }

    public function export(Request $request)
    {
        $validated = $this->validateExportDateRange($request);

        $messages = Message::query()
            ->with(['sender', 'conversation.userOne', 'conversation.userTwo', 'conversation.product'])
            ->whereDate('created_at', '>=', $validated['from'])
            ->whereDate('created_at', '<=', $validated['to'])
            ->orderBy('created_at', 'desc')
            ->get();

        $filename = 'chat_messages_' . $validated['from'] . '_to_' . $validated['to'] . '.csv';

        return $this->streamCsv($filename, [
            'Message ID',
            'Conversation ID',
            'Listing',
            'User One',
            'User Two',
            'Sender',
            'Sender Email',
            'Type',
            'Message',
            'Attachment',
            'Read',
            'Sent At',
        ], $messages->map(fn ($message) => [
            $message->id,
            $message->conversation_id,
            $message->conversation?->product?->title,
            $message->conversation?->userOne?->name,
            $message->conversation?->userTwo?->name,
            $message->sender?->name,
            $message->sender?->email,
            $message->type,
            $message->body,
            $message->attachment_path,
            $message->is_read ? 'Yes' : 'No',
            optional($message->created_at)->format('Y-m-d H:i:s'),
        ]));
    }
}
