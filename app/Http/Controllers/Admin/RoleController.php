<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')->get();
        $permissions = Permission::all();
        
        return Inertia::render('Admin/Roles/Index', [
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'nullable|array'
        ]);

        $role = Role::create(['name' => $request->name]);
        if ($request->permissions) {
            $role->syncPermissions($request->permissions);
        }

        return redirect()->back()->with('success', 'Role created successfully.');
    }

    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);
        
        $request->validate([
            'name' => 'required|string|unique:roles,name,' . $id,
            'permissions' => 'nullable|array'
        ]);

        $role->update(['name' => $request->name]);
        $role->syncPermissions($request->permissions ?? []);

        return redirect()->back()->with('success', 'Role updated successfully.');
    }

    public function destroy($id)
    {
        Role::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Role deleted successfully.');
    }
}
