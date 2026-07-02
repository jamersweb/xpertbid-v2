<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('IndividualVerification');

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

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search'])
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
        ]);

        $data['password'] = Hash::make($data['password']);
        $data['signup_source'] = 'admin';

        $user = User::create($data);
        $user->assignRole($data['role']);

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
        ]);

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);
        $user->syncRoles([$data['role']]);

        return redirect()->route('admin.users.index')->with('success', 'User updated successfully.');
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
