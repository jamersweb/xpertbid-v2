<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Support\LoggedMail as Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\UserSignupConfirmation;
use App\Mail\AdminNewUserRegistration;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\View\View;

class RegisteredUserController extends Controller
{
    protected function resolveSignupSource(Request $request, string $default = 'web'): string
    {
        return $request->input('signup_source')
            ?? $request->header('X-Client-Source')
            ?? $default;
    }

    protected function adminEmail(): ?string
    {
        return env('ADMIN_EMAIL') ?: config('mail.from.address');
    }

    /**
     * Display the registration view.
     */
    public function create(): \Inertia\Response
    {
        return \Inertia\Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'User',
            'signup_source' => $this->resolveSignupSource($request),
        ]);

        event(new Registered($user));

        try {
            Mail::to($user->email)->send(new UserSignupConfirmation($user));
        } catch (\Throwable $e) {
            Log::warning('User signup confirmation email failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }

        $adminEmail = $this->adminEmail();
        if (!empty($adminEmail)) {
            try {
                Mail::to($adminEmail)->send(new AdminNewUserRegistration($user));
            } catch (\Throwable $e) {
                Log::warning('Admin new user registration email failed', [
                    'user_id' => $user->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
