<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Auction;
use App\Models\User;
use App\Models\Bid;
use Illuminate\Support\Facades\Mail;
use App\Mail\CustomBidderMessage;
use App\Services\MsgpkService;
use Inertia\Inertia;

class BidderCommunicationController extends Controller
{
    protected $msgpkService;

    public function __construct(MsgpkService $msgpkService)
    {
        $this->msgpkService = $msgpkService;
    }

    public function index()
    {
        return Inertia::render('Admin/Communication/BidderMessaging');
    }

    public function getProducts(Request $request)
    {
        $type = $request->get('type');
        $query = Auction::query(); 

        if ($type === '1_rupee') {
            $query->where('is_1_rupee', 1);
        } else {
            $query->where(function($q) {
                $q->where('is_1_rupee', 0)->orWhereNull('is_1_rupee');
            });
        }
        
        return response()->json($query->select('id', 'title')->orderBy('created_at', 'desc')->get());
    }

    public function getBidders(Request $request)
    {
        $productId = $request->get('product_id');
        $bidders = Bid::where('auction_id', $productId)
                    ->with('user:id,name,email,phone,profile_pic')
                    ->get()
                    ->pluck('user')
                    ->unique('id')
                    ->values();

        return response()->json($bidders);
    }

    public function searchUsers(Request $request)
    {
        $term = $request->get('q');
        $query = User::query();

        if (!empty($term)) {
            $query->where('name', 'like', "%$term%")
                  ->orWhere('email', 'like', "%$term%")
                  ->orWhere('phone', 'like', "%$term%");
        } else {
            $query->limit(50);
        }

        return response()->json($query->select('id', 'name', 'email', 'phone', 'profile_pic')->get());
    }

    public function send(Request $request)
    {
        $request->validate([
            'subject' => 'required|string',
            'message' => 'required|string',
        ]);

        $userIds = $request->input('user_ids', []);
        $directUserIds = $request->input('direct_user_ids', []);

        if (empty($userIds) && empty($directUserIds)) {
            return redirect()->back()->with('error', 'Please select at least one user.');
        }

        $allUserIds = array_unique(array_merge($userIds ?? [], $directUserIds ?? []));
        $subject = $request->subject;
        $rawMessage = $request->message;
        $sentCount = 0;

        foreach ($allUserIds as $userId) {
            $user = User::find($userId);
            if (!$user) continue;

            $personalMessage = str_replace('{{user_name}}', $user->name, $rawMessage);

            if (!empty($user->email)) {
                try {
                    Mail::to($user->email)->send(new CustomBidderMessage($subject, $personalMessage));
                    $sentCount++;
                    continue;
                } catch (\Exception $e) {
                    \Log::error("Failed to email user {$user->id}: " . $e->getMessage());
                }
            }

            if (!empty($user->phone)) {
                try {
                    $smsContent = strip_tags(html_entity_decode(preg_replace('/<br\s*\/?>/i', "\n", $personalMessage)));
                    $this->msgpkService->sendMessage($user->phone, trim($smsContent));
                    $sentCount++;
                } catch (\Exception $e) {
                    \Log::error("Failed to SMS user {$user->id}: " . $e->getMessage());
                }
            }
        }

        return redirect()->route('admin.bidder-communication.index')->with('success', "Message sent to $sentCount users.");
    }
}
