<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CorporateVerification;
use App\Models\IndividualVerification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with(['individualVerification', 'corporateVerification', 'roles']);

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%$search%")
                    ->orWhere('email', 'LIKE', "%$search%")
                    ->orWhere('phone', 'LIKE', "%$search%")
                    ->orWhere('id', 'LIKE', "%$search%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        $users->through(function (User $user) {
            $roleName = $user->getRoleNames()->first() ?? $user->role ?? 'User';

            return array_merge($user->toArray(), [
                'role_name' => $roleName,
                'is_email_verified' => ! is_null($user->email_verified_at),
                'individual_verification_status' => $user->individualVerification?->status,
                'corporate_verification_status' => $user->corporateVerification?->status,
            ]);
        });

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search']),
            'roles' => Role::query()->orderBy('name')->pluck('name')->values(),
        ]);
    }

    public function export(Request $request)
    {
        $validated = $request->validate([
            'from' => ['required', 'date'],
            'to' => ['required', 'date', 'after_or_equal:from'],
            'search' => ['nullable', 'string', 'max:255'],
        ]);

        $query = User::query()
            ->with(['roles', 'referrer'])
            ->whereDate('created_at', '>=', $validated['from'])
            ->whereDate('created_at', '<=', $validated['to']);

        if (!empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%")
                    ->orWhere('phone', 'LIKE', "%{$search}%")
                    ->orWhere('id', 'LIKE', "%{$search}%");
            });
        }

        $hasStatusColumn = Schema::hasColumn('users', 'status');
        $users = $query->orderBy('created_at', 'desc')->get();
        $filename = 'admin_users_' . $validated['from'] . '_to_' . $validated['to'] . '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $columns = [
            'ID',
            'Name',
            'Email',
            'Phone',
            'Role',
            'Signup Source',
            'Referral Code',
            'Referred By',
            'Status',
            'Created At',
        ];

        $callback = function () use ($users, $columns, $hasStatusColumn) {
            $file = fopen('php://output', 'w');
            fwrite($file, "\xEF\xBB\xBF");
            fputcsv($file, $columns);

            foreach ($users as $user) {
                fputcsv($file, [
                    $user->id,
                    $user->name,
                    $user->email,
                    $user->phone,
                    $user->getRoleNames()->first() ?? $user->role ?? 'N/A',
                    $user->signup_source ?? 'web',
                    $user->referral_code,
                    $user->referrer?->name ?? 'N/A',
                    $hasStatusColumn ? ($user->status ?? 'N/A') : ($user->approved ? 'Approved' : 'Pending'),
                    optional($user->created_at)->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function show(User $user)
    {
        $user->load(['wallet', 'individualVerification', 'corporateVerification', 'auctions', 'bids']);

        return Inertia::render('Admin/Users/Show', [
            'user' => $user
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'phone' => 'required|string|max:20',
            'role' => 'required|string|exists:roles,name',
            'is_email_verified' => ['sometimes', 'boolean'],
            'is_individual_verified' => ['sometimes', 'boolean'],
            'is_corporate_verified' => ['sometimes', 'boolean'],
        ]);

        $data['password'] = Hash::make($data['password']);
        $data['signup_source'] = 'admin';
        $data['email_verified_at'] = $request->boolean('is_email_verified') ? now() : null;
        unset($data['is_email_verified'], $data['is_individual_verified'], $data['is_corporate_verified']);

        $user = User::create($data);
        $user->assignRole($data['role']);
        $this->syncAdminVerificationStates($user, $request);

        return redirect()->route('admin.users.index')->with('success', 'User created successfully.');
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => "required|email|max:255|unique:users,email,{$user->id}",
            'password' => 'nullable|string|min:8',
            'phone' => 'required|string|max:20',
            'role' => 'required|string|exists:roles,name',
            'is_email_verified' => ['sometimes', 'boolean'],
            'is_individual_verified' => ['sometimes', 'boolean'],
            'is_corporate_verified' => ['sometimes', 'boolean'],
        ]);

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $data['email_verified_at'] = $request->boolean('is_email_verified') ? ($user->email_verified_at ?? now()) : null;
        unset($data['is_email_verified'], $data['is_individual_verified'], $data['is_corporate_verified']);

        $user->update($data);
        $user->syncRoles([$data['role']]);
        $this->syncAdminVerificationStates($user, $request);

        return redirect()->route('admin.users.index')->with('success', 'User updated successfully.');
    }

    private function syncAdminVerificationStates(User $user, Request $request): void
    {
        if ($request->boolean('is_individual_verified')) {
            IndividualVerification::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'full_legal_name' => $user->name,
                    'dob' => now()->subYears(25)->toDateString(),
                    'nationality' => 'Pakistan',
                    'residential_address' => $user->address ?: 'Admin verified dummy account',
                    'id_front_path' => 'admin/verified-placeholder.jpg',
                    'id_back_path' => 'admin/verified-placeholder.jpg',
                    'contact_number' => $user->phone ?: '0000000000',
                    'email_address' => $user->email ?: "user-{$user->id}@example.test",
                    'country' => 'Pakistan',
                    'document_type' => 'cnic',
                    'status' => 'verified',
                    'decline_reason' => null,
                ]
            );
        } elseif ($user->individualVerification) {
            $user->individualVerification->update([
                'status' => 'not_verified',
                'decline_reason' => null,
            ]);
        }

        if ($request->boolean('is_corporate_verified')) {
            CorporateVerification::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'legal_entity_name' => $user->company_name ?: "{$user->name} Company",
                    'registered_address' => $user->address ?: 'Admin verified dummy company address',
                    'date_of_incorporation' => now()->subYears(3)->toDateString(),
                    'entity_type' => 'Private Limited',
                    'business_documents' => ['admin/verified-placeholder.pdf'],
                    'country' => 'Pakistan',
                    'status' => 'verified',
                    'decline_reason' => null,
                ]
            );
        } elseif ($user->corporateVerification) {
            $user->corporateVerification->update([
                'status' => 'not_verified',
                'decline_reason' => null,
            ]);
        }
    }

    public function updateStatus(User $user, Request $request)
    {
        $user->status = $request->status === 'enable' ? 'enable' : 'disable';
        $user->save();

        return redirect()->back()->with('success', "User status updated to {$user->status}.");
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->back()->with('success', 'User deleted successfully.');
    }
}
