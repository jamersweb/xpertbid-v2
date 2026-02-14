<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

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
