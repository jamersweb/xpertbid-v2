<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Country;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserSignupConfirmation;
use App\Mail\AdminNewUserRegistration;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
use Firebase\JWT\JWT;
use Firebase\JWT\JWK;
use GuzzleHttp\Client as GuzzleClient;
use Google_Client;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            // 'phone' => 'required|string|max:20', 

        ]);

        // Referral code generation
        $baseName = \Illuminate\Support\Str::slug($request->name, '');
        if (empty($baseName)) {
            $baseName = 'user';
        }
        $randomNum = rand(100, 999);
        $referralCode = $baseName . $randomNum;

        while (User::where('referral_code', $referralCode)->exists()) {
            $randomNum = rand(100, 999);
            $referralCode = $baseName . $randomNum;
        }

        // ✅ Create user from form input (not Google)
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'referral_code' => $referralCode,
            'provider' => 'email',   // default provider
            'provider_id' => null,
            'profile_pic' => null,
            'utm_source' => $request->utm_source,
            'utm_medium' => $request->utm_medium,
            'utm_campaign' => $request->utm_campaign,
        ]);

        // Generate token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Optional confirmation mail
        // Mail::to($user->email)->send(new UserSignupConfirmation());
        Mail::to(env('ADMIN_EMAIL'))->send(new AdminNewUserRegistration($user));

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function updatePhone(Request $request)
    {
        $request->validate([
            // 'phone' => 'required|string|max:20',
        ]);

        $user = $request->user();
        $user->phone = $request->phone;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Phone number updated successfully.',
            'user' => $user
        ]);
    }


    public function appleLogin(Request $request)
    {
        $request->validate([
            'identity_token' => 'required|string',
        ]);

        try {
            // 1️⃣ Fetch Apple public keys
            $client = new GuzzleClient();
            $response = $client->get('https://appleid.apple.com/auth/keys');
            $keys = json_decode($response->getBody(), true);

            $decoded = JWT::decode(
                $request->identity_token,
                JWK::parseKeySet($keys)
            );
            // 3️⃣ Validate audience (Bundle ID)
            if ($decoded->aud !== 'com.xpertbid.app') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid Apple token audience'
                ], 401);
            }

            $appleId = $decoded->sub;
            $email = $decoded->email ?? null;

            // 4️⃣ Find user by provider + provider_id
            $user = User::where('provider', 'apple')
                ->where('provider_id', $appleId)
                ->first();

            // 2️⃣ If not found, try find by email (VERY IMPORTANT)
            if (!$user && $email) {
                $user = User::where('email', $email)->first();

                // If found by email, LINK Apple account
                if ($user) {
                    $user->update([
                        'provider' => 'apple',
                        'provider_id' => $appleId,
                    ]);
                }
            }

            // 3️⃣ If STILL not found → create new user
            if (!$user) {
                // generate referral code
                $baseName = 'appleuser';
                $randomNum = rand(100, 999);
                $referralCode = $baseName . $randomNum;

                while (User::where('referral_code', $referralCode)->exists()) {
                    $randomNum = rand(100, 999);
                    $referralCode = $baseName . $randomNum;
                }

                $user = User::create([
                    'name' => 'Apple User',
                    'email' => $email, // safe now
                    'provider' => 'apple',
                    'provider_id' => $appleId,
                    'password' => Hash::make(Str::random(16)),
                    'referral_code' => $referralCode,
                    'utm_source' => $request->utm_source,
                    'utm_medium' => $request->utm_medium,
                    'utm_campaign' => $request->utm_campaign,
                ]);

                if ($email) {
                    Mail::to($user->email)->send(new UserSignupConfirmation());
                }
                Mail::to(env('ADMIN_EMAIL'))->send(new AdminNewUserRegistration($user));

                return response()->json([
                    'user' => $user,
                    'token' => $token,
                ]);
            }

            // 6️⃣ Closed account check
            if ($user->status === 'closed') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Account is closed. Please contact support'
                ], 403);
            }

            // 7️⃣ Existing Apple user → login
            $user->tokens()->delete();
            Auth::login($user);
            $token = $user->createToken('AuthToken')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Apple login failed',
                'details' => $e->getMessage(),
            ], 401);
        }
    }



    public function login(Request $request)
    {
        // Allow 'email' parameter to contain email or phone
        $request->validate([
            'email' => 'required', 
            'password' => 'required',
        ]);

        $login = $request->email;
        
        $user = null;
        if (filter_var($login, FILTER_VALIDATE_EMAIL)) {
             $user = User::where('email', $login)->first();
        } else {
             // Assume phone
             // Strip + if present for consistency, or search both
             $cleanPhone = str_replace('+', '', $login);
             $user = User::where('phone', $login)->orWhere('phone', $cleanPhone)->orWhere('phone', '+' . $cleanPhone)->first();
        }

        if (!$user) {
            return response()->json(["status" => "error", "message" => "Account does not exist."], 422);
        }
        if ($user->status == "closed") {
            return response()->json(["status" => "error", "message" => "Account is closed. Please contact to support"], 403);

        }
        if (!Hash::check($request->password, $user->password)) {
            return response()->json(["status" => "error", "message" => "Password is incorrect."], 422);
        }

        // If credentials are valid, proceed with login
        Auth::login($user);
        $token = $user->createToken('auth_token')->plainTextToken;
        $user->load('country');

        return response()->json([
            "status" => "success",
            "token" => $token,
            "user" => $user
        ]);
    }
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out']);

    }


    public function googleLogin(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        $client = new Google_Client(['client_id' => "971421469748-k1qicbfj8298bb9notpe8cfijcvf9t40.apps.googleusercontent.com"]);
        $accessToken = $request->token;

        if (!$accessToken) {
            return response()->json(['error' => 'Access token is required'], 400);
        }
        //$payload = $client->verifyIdToken($request->token);
        $client = new \GuzzleHttp\Client();

        //try {
        $response = $client->get('https://www.googleapis.com/oauth2/v1/userinfo', [
            'headers' => [
                'Authorization' => 'Bearer ' . $accessToken,
            ],
        ]);

        $payload = json_decode($response->getBody());

        if (!$payload) {
            return response()->json(['error' => 'Invalid Google token or authentication failed.'], 401);
        }

        $user = User::where('email', $payload->email)->first();

        if (!$user) {
            $user = User::create([
                'name' => $payload->name ?? 'Google User',
                'email' => $payload->email,
                'provider' => 'google',
                'provider_id' => $payload->id,
                'profile_pic' => $payload->picture ?? null,
                'password' => Hash::make(Str::random(16)),
                'utm_source' => $request->utm_source,
                'utm_medium' => $request->utm_medium,
                'utm_campaign' => $request->utm_campaign,
            ]);
            Auth::login($user);
            $token = $user->createToken('GoogleRegister')->plainTextToken;

            Mail::to($user->email)->send(new UserSignupConfirmation());
            Mail::to(env('ADMIN_EMAIL'))->send(new AdminNewUserRegistration($user));

            return response()->json([
                'user' => $user,
                'token' => $token,
            ]);
        }
        if (!$user && $user->status == "closed") {
            return response()->json(["status" => "error", "message" => "Account is closed. Please contact to support"], 403);

        }
        //dd($payload);
        $user->update([
            'provider' => 'google',
            'provider_id' => $payload->id,
            'profile_pic' => $avatar = $user->profile_pic ?? $payload->picture,
        ]);
        $user->tokens()->delete();                  // pehle se jo bhi tokens hain remove karo
        Auth::login($user);
        $token = $user->createToken('AuthToken')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
        // }  catch (\Exception $e) {
        //     return response()->json(['error' => 'Error during Google login.'], 500);
        // }

    }

    public function googleRegister(Request $request)
    {
        $accessToken = $request->token;

        if (!$accessToken) {
            return response()->json(['error' => 'Access token is required'], 400);
        }

        $client = new \GuzzleHttp\Client();

        try {
            $response = $client->get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                ],
            ]);

            $googleUser = json_decode($response->getBody());

            // If user exists, reject registration
            if (User::where('email', $googleUser->email)->exists()) {
                return response()->json(['error' => 'User already exists. Please login.'], 200);
            }

            //  Referral code generate
            $baseName = $googleUser->name ?? 'googleuser';
            $referralCode = strtolower(str_replace(' ', '', $baseName)) . rand(100, 999);

            // ✅ Generate API token
            $apiToken = Str::random(60);

            $user = User::create([
                'name' => $googleUser->name ?? 'Google User',
                'email' => $googleUser->email,
                'provider' => 'google',
                'provider_id' => $googleUser->id,
                'profile_pic' => $googleUser->picture ?? null,
                'password' => Hash::make(Str::random(16)),
                'referral_code' => $referralCode,
                'utm_source' => $request->utm_source,
                'utm_medium' => $request->utm_medium,
                'utm_campaign' => $request->utm_campaign,
            ]);

            Auth::login($user);

            // ✅ Generate Sanctum token
            $token = $user->createToken('auth_token')->plainTextToken;

            Mail::to($user->email)->send(new UserSignupConfirmation());
            Mail::to(env('ADMIN_EMAIL'))->send(new AdminNewUserRegistration($user));

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'referral_code' => $user->referral_code,
                ],
                'token' => $token,  // ✅ ab sanctum token milega
            ]);


        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Google registration failed',
                'details' => $e->getMessage(),
            ], 500);
        }
    }


    public function closeAccount(Request $r)
    {
        $user = $r->user();

        // Update all user's auctions to 'closed' status
        $user->auctions()->update(['status' => 'closed']);

        $rand = rand(1111, 9999);
        // Mark user status as closed and mutate email
        $user->update([
            'status' => 'closed',
            'email' => $user->email . 'deleted' . $rand
        ]);

        $r->user()->tokens()->delete();
        Auth::logout();
        $r->session()->invalidate();
        return response()->json(['msg' => 'closed']);
    }
}
