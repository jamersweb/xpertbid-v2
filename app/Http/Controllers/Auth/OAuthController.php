<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Str;

class OAuthController extends Controller
{
    /**
     * OAuth Sign-In: Login only if user already exists.
     */
    public function login(Request $request)
    {
        $data = $request->validate([
            'provider' => 'required|string',     // "google" or "apple"
            'provider_id' => 'required|string',  // Google/Apple ID
            'email' => 'required|email',
            'name' => 'required|string',
            'avatar' => 'nullable|string',
        ]);

        $user = User::where('provider_id', $data['provider_id'])
                    ->orWhere('email', $data['email'])
                    ->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found. Please sign up first.',
            ], 404);
        }

        // Optionally update info
        $user->update([
            'name' => $data['name'],
            'provider_id' => $data['provider_id'],
            'provider' => $data['provider'],
            'profile_pic' => $data['avatar'] ?? $user->profile_pic,
        ]);
		
        $token = $user->createToken('OAuth Token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * OAuth Sign-Up: Only register if user doesn't exist.
     */
    public function register(Request $request)
    {
        $data = $request->validate([
            'provider' => 'required|string',
            'provider_id' => 'required|string',
            'email' => 'required|email',
            'name' => 'required|string',
            'avatar' => 'nullable|string',
        ]);

        // Check if user already exists
        $existingUser = User::where('provider_id', $data['provider_id'])
                            ->orWhere('email', $data['email'])
                            ->first();

        if ($existingUser) {
            return response()->json([
                'message' => 'User already exists. Please sign in.',
            ], 409); // Conflict
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'provider' => $data['provider'],
            'provider_id' => $data['provider_id'],
            'profile_pic' => $data['avatar'],
            'password' => bcrypt(Str::random(16)), // dummy password
        ]);

        // Optionally, you may not return token yet to prevent auto-login
        return response()->json([
            'user' => $user,
            'token' => null // optional: do not log in automatically
        ]);
    }
}
