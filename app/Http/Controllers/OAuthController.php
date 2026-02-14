<?php
use Google_Client;
use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Http\Request;

public function googleLogin(Request $request)
{
    $request->validate([
        'token' => 'required|string',
    ]);

    // 1) ID token verify karna (agar ID token hai)
    $client = new Google_Client([
      'client_id' => '971421469748-k1qicbfj8298bb9notpe8cfijcvf9t40.apps.googleusercontent.com',
    ]);
    $payload = $client->verifyIdToken($request->token);
    if (!$payload) {
        // agar access_token hai, to userinfo end-point se bhi check kar sakte
        return response()->json(['error'=>'Invalid Google token'], 401);
    }

    // 2) User find/create
    $user = User::where('provider_id', $payload['sub'])
                ->orWhere('email', $payload['email'])
                ->first();

    if (!$user) {
        $user = User::create([
            'name'        => $payload['name'],
            'email'       => $payload['email'],
            'provider'    => 'google',
            'provider_id' => $payload['sub'],
            'profile_pic' => $payload['picture'] ?? null,
            'password'    => bcrypt(Str::random(16)),
            'provider'    => 'google',
            'provider_id' => $payload['sub'],
            'profile_pic' => $payload['picture'] ?? $user->profile_pic,
        ]);
    } else {
        $user->update([
            'name'        => $payload['name'],
            'provider'    => 'google',
            'provider_id' => $payload['sub'],
            'profile_pic' => $payload['picture'] ?? $user->profile_pic,
        ]);
    }

    // 3) Personal access token generate
    $plainToken = $user->createToken('OAuth Token')->plainTextToken;

    return response()->json([
        'user'  => $user,
        'token' => $plainToken,
    ]);
}