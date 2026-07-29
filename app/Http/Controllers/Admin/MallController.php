<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mall;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MallController extends Controller
{
    protected function makeUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name);
        if ($base === '') {
            $base = 'mall';
        }

        $slug = $base;
        $i = 2;

        while (
            Mall::query()
                ->where('slug', $slug)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $base . '-' . $i;
            $i++;
        }

        return $slug;
    }

    protected function storeMallUpload(Request $request, string $field = 'logo', string $directory = 'assets/images/malls'): ?string
    {
        if (!$request->hasFile($field)) {
            return null;
        }

        $file = $request->file($field);
        $extension = strtolower($file->getClientOriginalExtension());
        $filename = time() . '_' . uniqid() . '.' . $extension;

        if (!is_dir(public_path($directory))) {
            mkdir(public_path($directory), 0755, true);
        }

        $file->move(public_path($directory), $filename);

        return '/' . trim($directory, '/') . '/' . $filename;
    }

    protected function removeStoredFile(?string $path): void
    {
        if (!$path) {
            return;
        }

        $cleanPath = ltrim($path, '/');
        $fullPath = public_path($cleanPath);

        if (file_exists($fullPath)) {
            @unlink($fullPath);
        }
    }

    public function index(Request $request)
    {
        $query = Mall::query()->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && in_array($request->status, ['active', 'inactive'], true)) {
            $query->where('status', $request->status);
        }

        return Inertia::render('Admin/Malls/Index', [
            'malls' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:malls,name'],
            'logo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,gif', 'max:2048'],
            'status' => ['required', 'in:active,inactive'],
        ]);

        Mall::create([
            'name' => $validated['name'],
            'slug' => $this->makeUniqueSlug($validated['name']),
            'logo' => $this->storeMallUpload($request),
            'status' => $validated['status'],
        ]);

        return redirect()->back()->with('success', 'Mall created successfully.');
    }

    public function update(Request $request, Mall $mall)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('malls', 'name')->ignore($mall->id),
            ],
            'logo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,gif', 'max:2048'],
            'status' => ['required', 'in:active,inactive'],
        ]);

        if ($request->hasFile('logo')) {
            $this->removeStoredFile($mall->logo);
            $mall->logo = $this->storeMallUpload($request);
        }

        // Slug is immutable after create for future public URL stability.
        $mall->name = $validated['name'];
        $mall->status = $validated['status'];
        $mall->save();

        return redirect()->back()->with('success', 'Mall updated successfully.');
    }

    public function destroy(Mall $mall)
    {
        $this->removeStoredFile($mall->logo);
        $mall->delete();

        return redirect()->back()->with('success', 'Mall deleted successfully.');
    }
}
