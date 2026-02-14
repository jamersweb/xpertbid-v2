<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\NewNotification;
use Inertia\Inertia;

class UserNotificationController extends Controller
{
    /**
     * Display the notifications page (Inertia).
     */
    public function index()
    {
        $user = Auth::id(); // Get authenticated user ID
        
        $notifications = NewNotification::where('user_id', $user)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications
        ]);
    }

    public function getNotifications(Request $request)
    {
        $user = Auth::id(); // Get authenticated user ID

        // Fetch all notifications for the user, ordered by latest
        $notifications = NewNotification::where('user_id', $user)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notifications, 200);
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead($id)
    {
        $user = Auth::id(); // Get authenticated user ID

        // Find the notification & ensure it belongs to the logged-in user
        $notification = NewNotification::where('id', $id)
            ->where('user_id', $user) // ✅ Ensure it belongs to the logged-in user
            ->first();

        // If notification does not exist, return a 404 error
        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }

        // Mark as read
        $notification->read_at = now();
        $notification->save();

        return response()->json([
            'message' => 'Notification marked as read',
            'notification' => $notification
        ], 200);
    }

    /**
     * Delete a notification.
     */
    public function deleteNotification($id)
    {
        $user = Auth::user(); // Make sure the user is authenticated

        $notification = NewNotification::where('id', $id)->where('user_id', $user->id)->first();

        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }

        // Delete the notification.
        $notification->delete();

        return response()->json(['message' => 'Notification deleted successfully'], 200);
    }

    /**
     * Get unread notifications count.
     */
    public function getUnreadCount()
    {
        $user = Auth::user();

        // Count unread notifications.
        $unreadCount = $user->NewNotification()->whereNull('read_at')->count();

        return response()->json(['unread_count' => $unreadCount], 200);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead()
    {
        $user = Auth::user();

        // Update all unread notifications for the user.
        $user->NewNotification()->whereNull('read_at')->update(['read_at' => now()]);

        return redirect()->back();
    }
}
