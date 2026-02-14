<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Auction;
use App\Models\AuctionCategory;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;

class ScraperController extends Controller
{
    public function index()
    {
        return view('scraper.index');
    }

    public function preview(Request $request)
    {
        set_time_limit(120); // Increase timeout for scraper
        
        $request->validate([
            'url' => 'required|url'
        ]);

        $script = env('SCRAPER_SCRIPT_PATH', base_path('tools/scraper/scrape.py'));
        if (!file_exists($script)) {
            $script = base_path('admin/tools/scraper/scrape.py');
        }
        $python = env('SCRAPER_PY_PATH', 'python');

        $cmd = escapeshellcmd($python) . ' ' . escapeshellarg($script) . ' ' . escapeshellarg($request->input('url')) . ' --dry-run';

        $output = null;
        $returnVar = null;
        exec($cmd . ' 2>&1', $lines, $returnVar);
        $stdout = implode("\n", $lines);

        $data = null;
        $error = null;
        if ($returnVar === 0) {
            $json = json_decode($stdout, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $data = $json;
            } else {
                $error = 'Failed to parse JSON output.';
            }
        } else {
            $error = 'Scraper error: ' . $stdout;
        }

        return view('scraper.index', [
            'url' => $request->input('url'),
            'preview' => $data,
            'error' => $error,
            'raw' => $stdout,
            'exitCode' => $returnVar,
        ]);
    }

    public function save(Request $request)
    {
        set_time_limit(120); // Increase timeout for scraper
        
        $request->validate([
            'url' => 'required|url'
        ]);

        $script = env('SCRAPER_SCRIPT_PATH', base_path('tools/scraper/scrape.py'));
        if (!file_exists($script)) {
            $script = base_path('admin/tools/scraper/scrape.py');
        }
        $python = env('SCRAPER_PY_PATH', 'python');

        $cmd = escapeshellcmd($python) . ' ' . escapeshellarg($script) . ' ' . escapeshellarg($request->input('url'));

        $output = null;
        $returnVar = null;
        exec($cmd . ' 2>&1', $lines, $returnVar);
        $stdout = implode("\n", $lines);
        
        \Log::info('Scraper exec result', ['returnVar' => $returnVar, 'stdout_length' => strlen($stdout), 'lines_count' => count($lines), 'first_500_chars' => substr($stdout, 0, 500)]);

        if ($returnVar === 0) {
            // Parse JSON output - find JSON in output
            $jsonStr = $stdout;
            // Try to find JSON object in output
            if (preg_match('/\{.*\}/s', $stdout, $matches)) {
                $jsonStr = $matches[0];
            }
            $json = json_decode($jsonStr, true);
            \Log::info('JSON parse result', ['json_error' => json_last_error(), 'has_data' => !empty($json), 'json_str_first_200' => substr($jsonStr, 0, 200)]);
            if (json_last_error() === JSON_ERROR_NONE && !empty($json)) {
                \Log::info('Scraped data:', $json); // Debug log
                try {
                    // Map category - Use ID 222 for Property (hardcoded as per user request)
                    $categoryId = 222;
                    
                    // Map sub_category
                    $subCategory = AuctionCategory::where('name', 'For Sale')->first();
                    $subCategoryId = $subCategory ? $subCategory->id : null;
                    
                    // Map child_category (property type)
                    $childCategory = null;
                    if (!empty($json['child_category'])) {
                        $childCategory = AuctionCategory::where('name', $json['child_category'])->first();
                    }
                    $childCategoryId = $childCategory ? $childCategory->id : null;
                    
                    // Download and save images
                    $images = $json['images'] ?? [];
                    $savedImages = [];
                    $firstImage = null;
                    
                    foreach ($images as $idx => $imageUrl) {
                        try {
                            // Download image
                            $response = Http::timeout(30)->get($imageUrl);
                            if ($response->successful()) {
                                $imageData = $response->body();
                                $extension = pathinfo(parse_url($imageUrl, PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'jpg';
                                $fileName = time() . '_' . uniqid() . '_' . $idx . '.' . $extension;
                                $savePath = public_path('/assets/images/auction/');
                                
                                // Create directory if not exists
                                if (!file_exists($savePath)) {
                                    mkdir($savePath, 0755, true);
                                }
                                
                                // Save image
                                file_put_contents($savePath . $fileName, $imageData);
                                $localPath = '/assets/images/auction/' . $fileName;
                                $savedImages[] = $localPath;
                                
                                // First image as cover
                                if ($idx === 0) {
                                    $firstImage = $localPath;
                                }
                            }
                        } catch (\Exception $e) {
                            \Log::warning('Failed to download image: ' . $imageUrl, ['error' => $e->getMessage()]);
                        }
                    }
                    
                    $albumJson = json_encode($savedImages);
                    
                    // Get amenities as JSON
                    $amenitiesJson = json_encode($json['amenities'] ?? []);
                    
                    // Truncate title to fit DB column (max 255 chars)
                    $title = $json['title'] ?? 'No title';
                    if (strlen($title) > 255) {
                        $title = substr($title, 0, 252) . '...';
                    }
                    
                    // Create auction
                    Auction::create([
                        'title' => $title,
                        'user_id' => Auth::id() ?? 1,
                        'category_id' => $categoryId,
                        'sub_category_id' => $subCategoryId,
                        'child_category_id' => $childCategoryId,
                        'reserve_price' => $json['reserve_price'] ?? 0,
                        'minimum_bid' => $json['minimum_bid'] ?? 0,
                        'description' => $json['description'] ?? '',
                        'image' => $firstImage,
                        'album' => $albumJson,
                        'amenities' => $amenitiesJson,
                        'status' => 'active',
                        'start_date' => now(),
                        'end_date' => now()->addDays(7), // Default 7 days
                    ]);
                    
                    return redirect()->route('scraper.index')->with('status', 'Auction saved successfully!');
                } catch (\Exception $e) {
                    \Log::error('Save failed: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
                    return redirect()->route('scraper.index')->with('error', 'Failed to save: ' . $e->getMessage());
                }
            }
            return redirect()->route('scraper.index')->with('error', 'No data scraped. Check raw output.');
        }

        \Log::error('Scraper command failed', ['returnVar' => $returnVar, 'stdout' => $stdout]);
        return redirect()->route('scraper.index')->with('error', 'Save failed: ' . $stdout);
    }
}


