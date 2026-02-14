<?php

namespace App\Http\Controllers;

use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function assignRoleForm(User $user)
    {
        $roles = Role::all();
        return view('users.assign-role', compact('user', 'roles'));
    }

    public function assignRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|exists:roles,name',
        ]);

        $user->syncRoles([$request->role]);

        return redirect()->route('users.index')->with('success', 'Role assigned successfully.');
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Role::query();

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where('name', 'LIKE', "%$search%");
        }

        // Sorting
        $sort = $request->get('sort', 'newest_to_oldest');
        switch ($sort) {
            case 'oldest_to_newest':
                $query->orderBy('id', 'asc');
                break;
            case 'a_to_z':
                $query->orderBy('name', 'asc');
                break;
            case 'z_to_a':
                $query->orderBy('name', 'desc');
                break;
            case 'newest_to_oldest':
            default:
                $query->orderBy('id', 'desc');
                break;
        }

        $roles = $query->paginate(10)->withQueryString();

        if ($request->ajax()) {
            return view('roles.table_partial', compact('roles'))->render();
        }

        return view('roles.index', compact('roles'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $permissions = \Spatie\Permission\Models\Permission::get();
        return view('roles.create', compact('permissions'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles,name',
            'permissions' => 'required|array',
        ]);

        $role = Role::create(['name' => $request->input('name')]);

        // Get permission models by IDs
        $permissions = \Spatie\Permission\Models\Permission::whereIn('id', $request->input('permissions'))->get();
        $role->syncPermissions($permissions);

        return redirect()->route('roles.index')
            ->with('success', 'Role created successfully');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $role = Role::find($id);
        $rolePermissions = \Spatie\Permission\Models\Permission::join("role_has_permissions", "role_has_permissions.permission_id", "=", "permissions.id")
            ->where("role_has_permissions.role_id", $id)
            ->get();

        return view('roles.show', compact('role', 'rolePermissions'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $role = Role::find($id);
        $permissions = \Spatie\Permission\Models\Permission::get();

        // Get the permission IDs that this role has
        $rolePermissions = $role->permissions->pluck('id')->toArray();

        return view('roles.edit', compact('role', 'permissions', 'rolePermissions'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required',
            'permissions' => 'required|array',
        ]);

        $role = Role::find($id);
        $role->name = $request->input('name');
        $role->save();

        // Get permission models by IDs
        $permissions = \Spatie\Permission\Models\Permission::whereIn('id', $request->input('permissions'))->get();
        $role->syncPermissions($permissions);

        return redirect()->route('roles.index')
            ->with('success', 'Role updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        \Illuminate\Support\Facades\DB::table("roles")->where('id', $id)->delete();
        return redirect()->route('roles.index')
            ->with('success', 'Role deleted successfully');
    }
}
