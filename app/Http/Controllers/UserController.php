<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = User::with('IndividualVerification');

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%$search%")
                    ->orWhere('email', 'LIKE', "%$search%")
                    ->orWhere('phone', 'LIKE', "%$search%")
                    ->orWhere('id', 'LIKE', "%$search%");
            });
        }

        // Date Range (Join Date)
        if ($request->has('date_range') && !empty($request->date_range)) {
            $dates = explode(' to ', $request->date_range);
            if (count($dates) == 2) {
                $query->whereDate('created_at', '>=', $dates[0])
                    ->whereDate('created_at', '<=', $dates[1]);
            } else {
                $query->whereDate('created_at', $dates[0]);
            }
        }

        // Sorting
        $sort = $request->get('sort', 'newest_to_oldest');
        switch ($sort) {
            case 'oldest_to_newest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'a_to_z':
                $query->orderBy('name', 'asc');
                break;
            case 'z_to_a':
                $query->orderBy('name', 'desc');
                break;
            case 'newest_to_oldest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $users = $query->paginate(10)->withQueryString();

        if ($request->ajax()) {
            return view('users.table_partial', compact('users'))->render();
        }

        return view('users.index', compact('users'));
    }

    public function export(Request $request)
    {
        $query = User::with(['roles', 'referrer']);

        // Date Range Filter
        if ($request->has('export_date_range') && !empty($request->export_date_range)) {
            $dates = explode(' to ', $request->export_date_range);
            if (count($dates) == 2) {
                $query->whereDate('created_at', '>=', $dates[0])
                    ->whereDate('created_at', '<=', $dates[1]);
            } else {
                $query->whereDate('created_at', $dates[0]);
            }
        }

        $users = $query->get();

        $filename = "users_export_" . date('Y-m-d_H-i-s') . ".csv";

        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $columns = ['ID', 'Name', 'User Type', 'Email', 'Referral Code', 'Referred By', 'Phone', 'Status', 'Created At'];

        $callback = function () use ($users, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($users as $user) {
                $row['ID'] = $user->id;
                $row['Name'] = $user->name;
                $row['User Type'] = $user->getRoleNames()->first() ?? 'N/A';
                $row['Email'] = $user->email;
                $row['Referral Code'] = $user->referral_code;
                $row['Referred By'] = $user->referrer ? $user->referrer->name : 'N/A';
                $row['Phone'] = $user->phone;
                $row['Status'] = $user->status;
                $row['Created At'] = $user->created_at;

                fputcsv($file, array(
                    $row['ID'],
                    $row['Name'],
                    $row['User Type'],
                    $row['Email'],
                    $row['Referral Code'],
                    $row['Referred By'],
                    $row['Phone'],
                    $row['Status'],
                    $row['Created At']
                ));
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Display a listing of users with non-null UTM Campaign.
     *
     * @return \Illuminate\Http\Response
     */
    public function utmCampaign(Request $request)
    {
        $query = User::with('IndividualVerification')->whereNotNull('utm_campaign');

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%$search%")
                    ->orWhere('email', 'LIKE', "%$search%")
                    ->orWhere('phone', 'LIKE', "%$search%")
                    ->orWhere('id', 'LIKE', "%$search%");
            });
        }

        // Date Range (Join Date)
        if ($request->has('date_range') && !empty($request->date_range)) {
            $dates = explode(' to ', $request->date_range);
            if (count($dates) == 2) {
                $query->whereDate('created_at', '>=', $dates[0])
                    ->whereDate('created_at', '<=', $dates[1]);
            } else {
                $query->whereDate('created_at', $dates[0]);
            }
        }

        // Sorting
        $sort = $request->get('sort', 'newest_to_oldest');
        switch ($sort) {
            case 'oldest_to_newest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'a_to_z':
                $query->orderBy('name', 'asc');
                break;
            case 'z_to_a':
                $query->orderBy('name', 'desc');
                break;
            case 'newest_to_oldest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();
        $pageTitle = 'UTM Campaign Users';
        $filterRoute = route('utm_campaign_users.index');

        if ($request->ajax()) {
            return view('users.table_partial', compact('users'))->render();
        }

        return view('users.index', compact('users', 'pageTitle', 'filterRoute'));
    }

    /**
     * Show the form for creating a new user.
     *
     * @return \Illuminate\Http\Response
     */
    // app/Http/Controllers/UserController.php



    public function create()
    {
        $roles = \Spatie\Permission\Models\Role::pluck('name', 'name')->all();

        $user = new User();  // for old('role', $user->role ?? '')
        return view('users.create', compact('roles', 'user'));
    }

    /**
     * Store a newly created user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     * 
     * 
     **/
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'phone' => 'required|string|max:20',
            'role' => 'required|string|exists:roles,name',
        ]);

        $data['password'] = bcrypt($data['password']);

        $user = User::create($data);
        $user->assignRole($data['role']);

        return redirect()
            ->route('users.index')
            ->with('success', 'User created successfully.');
    }
    /**
     * Display the specified user.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        return view('users.profile', compact('user'));
    }

    /**
     * Show the form for editing the specified user.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function edit(User $user)
    {
        $roles = \Spatie\Permission\Models\Role::pluck('name', 'name')->all();
        return view('users.create', compact('roles', 'user'));
    }

    /**
     * Update the specified user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
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
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);
        $user->syncRoles([$data['role']]);

        return redirect()
            ->route('users.index')
            ->with('success', 'User updated successfully.');
    }
    public function updateStatus(User $user, Request $request)
    {
        // If the checkbox is checked, the form submits status="on". 
        // If it’s unchecked, no “status” key is sent.
        $newStatus = $request->has('status')
            ? 'enable'
            : 'disable';

        $user->status = $newStatus;
        $user->save();

        return redirect()
            ->route('users.index')
            ->with('success', "User status updated to {$newStatus}.");
    }


    /**
     * Remove the specified user from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }

    public function account_settings(Request $request)
    {
        return response()->json(['message' => 'Logged out successfully']);
    }
    // In your user model
    public function updateOneSignalPlayerId(Request $request)
    {
        $user = auth()->user();
        $user->onesignal_player_id = $request->player_id;
        $user->save();
    }
    public function getUserProfile()
    {
        $id = Auth::user()->id;
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Check if profile_pic is an external URL (like Google or Facebook)
        if ($user->profile_pic && preg_match('/^https?:\/\//', $user->profile_pic)) {
            // If profile_pic starts with "http" or "https", return it directly (Google, Facebook, etc.)
            $profilePicUrl = $user->profile_pic;
        } else {
            // Otherwise, assume it's a locally uploaded file and construct the correct URL
            $profilePicUrl = asset('' . $user->profile_pic);
        }

        return response()->json([
            'name' => $user->name,
            'profile_pic' => $profilePicUrl, // Now correctly formatted
        ]);
    }

    /**
     * Verify if the specified user exists.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int|string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function verifyUser(Request $request, $id)
    {
        // Optionally, verify the Authorization header if needed.
        // $token = $request->bearerToken();
        // Perform any token validation here if required.

        // Attempt to find the user by ID.
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Return the user data as JSON.
        return response()->json($user, 200);
    }
}





