<?php

namespace App\Http\Controllers;

use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;

class PermissionsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Permission::query();

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

        $permissions = $query->paginate(15)->withQueryString();

        if ($request->ajax()) {
            return view('permissions.table_partial', compact('permissions'))->render();
        }

        return view('permissions.index', compact('permissions'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('permissions.create');
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
            'name' => 'required|unique:permissions,name',
        ]);

        Permission::create(['name' => $request->input('name')]);

        return redirect()->route('permissions.index')
            ->with('success', 'Permission created successfully');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $permission = Permission::find($id);
        return view('permissions.edit', compact('permission'));
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
            'name' => 'required'
        ]);

        $permission = Permission::find($id);
        $permission->name = $request->input('name');
        $permission->save();

        return redirect()->route('permissions.index')
            ->with('success', 'Permission updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Permission::find($id)->delete();
        return redirect()->route('permissions.index')
            ->with('success', 'Permission deleted successfully');
    }
}
