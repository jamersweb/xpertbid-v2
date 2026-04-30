<?php

namespace App\Http\Controllers;

use App\Events\ListingLiveChatMessageSent;
use App\Models\Listing;
use App\Models\ListingLiveChatMessage;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ListingLiveChatController extends Controller
{
    /**
     * Recent messages for a listing (public read, throttled).
     */
    public function index(Listing $listing)
    {
        if ($listing->listing_type !== 'auction') {
            return response()->json(['messages' => []]);
        }

        $messages = ListingLiveChatMessage::query()
            ->where('listing_id', $listing->id)
            ->with('user:id,name')
            ->orderByDesc('id')
            ->limit(100)
            ->get()
            ->reverse()
            ->values()
            ->map(fn (ListingLiveChatMessage $m) => $this->messagePayload($m));

        return response()->json(['messages' => $messages]);
    }

    /**
     * Post a message (verified users only; active auctions only).
     */
    public function store(Request $request, Listing $listing)
    {
        if ($listing->listing_type !== 'auction') {
            abort(403, 'Live chat is only available for auctions.');
        }

        if ($listing->status !== 'active') {
            abort(403, 'Live chat is not available for this listing.');
        }

        $end = $listing->end_date ? Carbon::parse($listing->end_date) : null;
        if ($end && now()->greaterThan($end)) {
            abort(403, 'This auction has ended.');
        }

        $validated = $request->validate([
            'body' => 'required|string|min:1|max:1000',
        ]);

        $body = trim(strip_tags($validated['body']));
        if ($body === '') {
            return response()->json(['message' => 'Message cannot be empty.'], 422);
        }

        $message = ListingLiveChatMessage::create([
            'listing_id' => $listing->id,
            'user_id' => Auth::id(),
            'body' => $body,
        ]);

        $message->load('user:id,name');

        broadcast(new ListingLiveChatMessageSent($message))->toOthers();

        return response()->json($this->messagePayload($message));
    }

    /**
     * @return array<string, mixed>
     */
    private function messagePayload(ListingLiveChatMessage $m): array
    {
        return [
            'id' => $m->id,
            'listing_id' => $m->listing_id,
            'body' => $m->body,
            'created_at' => $m->created_at?->toIso8601String(),
            'user' => [
                'id' => $m->user?->id,
                'name' => $m->user?->name ?? 'User',
            ],
        ];
    }
}
