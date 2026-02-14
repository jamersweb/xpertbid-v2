<?php
// app/Http/Controllers/Api/SeoController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Seo;
use Illuminate\Http\JsonResponse;
use App\Models\Auction;      
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Str;    

class SeoController extends Controller
{
public function show(string $slug): JsonResponse
{
    try {
        $seo = Seo::where('slug', $slug)->firstOrFail();
    } catch (ModelNotFoundException $e) {
        $seo = new Seo([
            'slug'             => $slug,
            'meta_title'       => ucfirst($slug),
            'meta_description' => " {$slug}",
            'meta_keywords'    => "{$slug}",
        ]);
    }
    return response()->json($seo);
}
  // 1) Index – list all records
    public function index()
    {
        $rows = Seo::orderBy('id', 'desc')->paginate(10);
        return view('seo.index', compact('rows'));
    }

    // 2) Create – form dikhayein
    public function create()
    {
        $seo = new Seo();
        return view('seo.create', compact('seo'));
    }

    // 3) Store – naye record ko save karein
    public function store(Request $request)
    {
        $data = $request->validate([
            'slug'             => 'required|string|unique:seos,slug',
            'meta_title'       => 'required|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords'    => 'nullable|string',
            'canonical_url'    => 'nullable|string',
            'schema_markup'    => 'nullable|string',
            'og_title'         => 'nullable|string',
            'og_description'   => 'nullable|string',
            'og_image'         => 'nullable|string',
        ]);

        Seo::create($data);

        return redirect()
            ->route('seo.index')
            ->with('success', 'SEO record created successfully.');
    }

    // 4) Edit  existing record ke liye form
    public function edit(Seo $seo)
    {
        return view('seo.create', compact('seo'));
    }

    // 5) Update – form se aaya hua data update karein
    public function update(Request $request, Seo $seo)
    {
        $data = $request->validate([
            // slug readonly hone par unique rule me ignore karein current ID
            'meta_title'       => 'required|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords'    => 'nullable|string',
            'canonical_url'    => 'nullable|string',
            'schema_markup'    => 'nullable|string',
            'og_title'         => 'nullable|string',
            'og_description'   => 'nullable|string',
            'og_image'         => 'nullable|string',
        ]);

        $seo->update($data);

        return redirect()
            ->route('seo.index')
            ->with('success', 'SEO record updated successfully.');
    }

    // 6) Destroy – record delete karein
    public function destroy(Seo $seo)
    {
        $seo->delete();

        return redirect()
            ->route('seo.index')
            ->with('success', 'SEO record deleted successfully.');
    }
}