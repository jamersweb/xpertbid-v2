<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CorporateVerification;
use App\Models\Country;
use App\Models\Mall;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MallSellerController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()
            ->with(['corporateVerification.mall', 'roles'])
            ->whereHas('corporateVerification', function ($q) {
                $q->whereNotNull('mall_id');
            });

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%")
                    ->orWhere('phone', 'LIKE', "%{$search}%")
                    ->orWhere('id', 'LIKE', "%{$search}%")
                    ->orWhereHas('corporateVerification', function ($cq) use ($search) {
                        $cq->where('legal_entity_name', 'LIKE', "%{$search}%");
                    });
            });
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        $users->through(function (User $user) {
            $corp = $user->corporateVerification;

            return array_merge($user->toArray(), [
                'role_name' => $user->getRoleNames()->first() ?? $user->role ?? 'User',
                'is_email_verified' => ! is_null($user->email_verified_at),
                'corporate_verification_status' => $corp?->status,
                'legal_entity_name' => $corp?->legal_entity_name,
                'mall_name' => $corp?->mall?->name,
                'mall_id' => $corp?->mall_id,
                'registered_address' => $corp?->registered_address,
                'date_of_incorporation' => $corp?->date_of_incorporation,
                'entity_type' => $corp?->entity_type,
                'country' => $corp?->country,
                'business_documents' => $corp?->business_documents ?? [],
            ]);
        });

        return Inertia::render('Admin/MallSellers/Index', [
            'users' => $users,
            'filters' => $request->only(['search']),
            'malls' => Mall::query()
                ->where('status', 'active')
                ->orderBy('name')
                ->get(['id', 'name']),
            'countries' => Country::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validatePayload($request);

        $user = DB::transaction(function () use ($request, $data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'password' => Hash::make($data['password']),
                'signup_source' => 'admin',
                'role' => 'User',
                'status' => 'enable',
                'email_verified_at' => $request->boolean('is_email_verified') ? now() : null,
            ]);

            $user->assignRole('User');

            CorporateVerification::create([
                'user_id' => $user->id,
                'legal_entity_name' => $data['legal_entity_name'],
                'registered_address' => $data['registered_address'],
                'date_of_incorporation' => $data['date_of_incorporation'],
                'entity_type' => $data['entity_type'],
                'business_documents' => $this->storeDocuments($request),
                'country' => $data['country'],
                'mall_id' => $data['mall_id'],
                'status' => 'verified',
                'decline_reason' => null,
            ]);

            return $user;
        });

        return redirect()
            ->route('admin.mall-sellers.index')
            ->with('success', 'Mall seller created successfully. User ID: ' . $user->id);
    }

    public function update(Request $request, User $user)
    {
        $this->ensureMallSeller($user);

        $data = $this->validatePayload($request, $user);

        $corp = $user->corporateVerification;
        $existingDocs = $corp?->business_documents ?? [];
        $documents = $request->hasFile('business_documents')
            ? $this->storeDocuments($request)
            : $existingDocs;

        if (empty($documents)) {
            return redirect()
                ->back()
                ->withErrors(['business_documents' => 'At least one business document is required.'])
                ->withInput();
        }

        DB::transaction(function () use ($request, $data, $user, $documents) {
            $userPayload = [
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'email_verified_at' => $request->boolean('is_email_verified')
                    ? ($user->email_verified_at ?? now())
                    : null,
            ];

            if (! empty($data['password'])) {
                $userPayload['password'] = Hash::make($data['password']);
            }

            $user->update($userPayload);

            CorporateVerification::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'legal_entity_name' => $data['legal_entity_name'],
                    'registered_address' => $data['registered_address'],
                    'date_of_incorporation' => $data['date_of_incorporation'],
                    'entity_type' => $data['entity_type'],
                    'business_documents' => $documents,
                    'country' => $data['country'],
                    'mall_id' => $data['mall_id'],
                    'status' => 'verified',
                    'decline_reason' => null,
                ]
            );
        });

        return redirect()
            ->route('admin.mall-sellers.index')
            ->with('success', 'Mall seller updated successfully.');
    }

    public function updateStatus(User $user, Request $request)
    {
        $this->ensureMallSeller($user);

        $user->status = $request->status === 'enable' ? 'enable' : 'disable';
        $user->save();

        return redirect()->back()->with('success', "User status updated to {$user->status}.");
    }

    public function destroy(User $user)
    {
        $this->ensureMallSeller($user);

        $user->delete();

        return redirect()->back()->with('success', 'Mall seller deleted successfully.');
    }

    protected function validatePayload(Request $request, ?User $user = null): array
    {
        $isUpdate = $user !== null;

        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user?->id),
            ],
            'phone' => ['required', 'string', 'max:20'],
            'password' => [$isUpdate ? 'nullable' : 'required', 'string', 'min:8'],
            'is_email_verified' => ['sometimes', 'boolean'],
            'legal_entity_name' => ['required', 'string', 'max:255'],
            'registered_address' => ['required', 'string'],
            'date_of_incorporation' => ['required', 'date'],
            'entity_type' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:255'],
            'mall_id' => ['required', 'integer', 'exists:malls,id'],
            'business_documents' => [
                $isUpdate ? 'nullable' : 'required',
                'array',
                'max:3',
            ],
            'business_documents.*' => ['file', 'mimes:jpg,jpeg,png,pdf', 'max:10240'],
        ];

        if (! $isUpdate) {
            $rules['business_documents'][] = 'min:1';
        } elseif (count($user->corporateVerification?->business_documents ?? []) === 0) {
            $rules['business_documents'] = ['required', 'array', 'min:1', 'max:3'];
        }

        return $request->validate($rules);
    }

    protected function storeDocuments(Request $request): array
    {
        $destination = public_path('assets/images/corporate_verifications');
        if (! file_exists($destination)) {
            mkdir($destination, 0755, true);
        }

        $relativePaths = [];
        foreach ($request->file('business_documents', []) as $file) {
            if (! $file || ! $file->isValid()) {
                continue;
            }

            $filename = Str::random(12) . '.' . $file->getClientOriginalExtension();
            $file->move($destination, $filename);
            $relativePaths[] = 'assets/images/corporate_verifications/' . $filename;
        }

        return $relativePaths;
    }

    protected function ensureMallSeller(User $user): void
    {
        $user->loadMissing('corporateVerification');

        if (! $user->corporateVerification || ! $user->corporateVerification->mall_id) {
            abort(404);
        }
    }
}
