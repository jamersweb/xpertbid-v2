<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Auction;
use App\Models\AuctionCategory;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OlxScraperController extends Controller
{
    public function index()
    {
        // Get all users for dropdown
        $users = User::select('id', 'name', 'email', 'profile_pic')
            ->orderBy('name')
            ->get();

        // Get all categories for dropdown
        $categories = AuctionCategory::all();

        return view('olx-scraper.index', compact('users', 'categories'));
    }

    public function preview(Request $request)
    {
        set_time_limit(120);
        
        $request->validate([
            'url' => 'required|url'
        ]);

        // Run OLX scraper
        $script = env('SCRAPER_SCRIPT_PATH', base_path('tools/scraper/olx_scrape.py'));
        if (!file_exists($script)) {
            $script = base_path('admin/tools/scraper/olx_scrape.py');
        }
        $python = env('SCRAPER_PY_PATH', 'python');

        if (!file_exists($script)) {
            return view('olx-scraper.index', [
                'url' => $request->input('url'),
                'error' => 'OLX scraper script not found at: ' . $script,
                'users' => User::select('id', 'name', 'email', 'profile_pic')->orderBy('name')->get(),
                'categories' => AuctionCategory::all(),
            ]);
        }

        // Set Playwright browsers path environment variable
        // Try multiple locations within open_basedir restrictions
        $playwrightPaths = [
            '/home/xpertbid.com/.cache/ms-playwright',
            '/tmp/playwright-browsers',
            '/usr/local/share/playwright', // Fallback if open_basedir allows
        ];
        
        $envVars = [];
        foreach ($playwrightPaths as $playwrightPath) {
            if (@file_exists($playwrightPath) && @is_dir($playwrightPath)) {
                $envVars[] = 'PLAYWRIGHT_BROWSERS_PATH=' . escapeshellarg($playwrightPath);
                break;
            }
        }
        
        // Add additional environment variables for memory/address space issues
        $envVars[] = 'MALLOC_ARENA_MAX=2';  // Reduce memory arenas
        $envVars[] = 'MALLOC_MMAP_THRESHOLD_=131072';  // Memory mapping threshold
        
        $envPrefix = implode(' ', $envVars) . ' ';
        
        // Since we're using requests library (no browser needed), we can run directly without sudo
        // Check if we should use root (for backward compatibility)
        $useRoot = env('OLX_SCRAPER_USE_ROOT', false); // Default to false since requests doesn't need browser
        
        if ($useRoot) {
            // Use wrapper script approach for better environment variable handling
            $wrapperScript = base_path('admin/tools/scraper/run_olx_scraper.sh');
            
            if (file_exists($wrapperScript)) {
                // Use wrapper script with sudo (if needed for Playwright fallback)
                $cmd = 'sudo -n -u root ' . escapeshellarg($wrapperScript) . ' ' . escapeshellarg($request->input('url'));
            } else {
                // Fallback: Direct command with environment variables
                $rootBrowserPath = '/root/.cache/ms-playwright';
                
                // Environment variables for root user
                $rootEnvVars = [
                    'PLAYWRIGHT_BROWSERS_PATH=' . escapeshellarg($rootBrowserPath),
                    'MALLOC_ARENA_MAX=2',
                    'MALLOC_MMAP_THRESHOLD_=131072',
                ];
                $rootEnvPrefix = implode(' ', $rootEnvVars) . ' ';
                
                // Use sudo -n (non-interactive) to avoid password prompt
                $cmd = 'sudo -n -u root ' . $rootEnvPrefix . escapeshellcmd($python) . ' ' . escapeshellarg($script) . ' ' . escapeshellarg($request->input('url'));
            }
        } else {
            // Run directly without sudo (requests library doesn't need browser)
            $cmd = escapeshellcmd($python) . ' ' . escapeshellarg($script) . ' ' . escapeshellarg($request->input('url'));
        }

        $output = null;
        $returnVar = null;
        
        // Log the command for debugging
        \Log::info('OLX Scraper: Executing command', ['cmd' => $cmd]);
        
        exec($cmd . ' 2>&1', $lines, $returnVar);
        $stdout = implode("\n", $lines);
        
        \Log::info('OLX Scraper exec result', ['returnVar' => $returnVar, 'stdout_length' => strlen($stdout), 'lines_count' => count($lines), 'first_500_chars' => substr($stdout, 0, 500)]);

        $data = null;
        $error = null;
        if ($returnVar === 0) {
            // Parse JSON output - find JSON in output
            $jsonStr = $stdout;
            
            // Try to find JSON object in output (look for "Fetch completed" marker)
            if (preg_match('/Fetch completed\s*(\{.*\})/s', $stdout, $matches)) {
                $jsonStr = $matches[1];
            } elseif (preg_match('/\{.*\}/s', $stdout, $matches)) {
                $jsonStr = $matches[0];
            }
            
            \Log::info('OLX Scraper: JSON string to parse', ['json_str_length' => strlen($jsonStr), 'first_500' => substr($jsonStr, 0, 500)]);
            
            $json = json_decode($jsonStr, true);
            if (json_last_error() === JSON_ERROR_NONE && !empty($json)) {
                $data = $json;
                \Log::info('OLX Scraper: JSON parsed successfully', ['has_title' => !empty($json['title']), 'has_price' => !empty($json['price'])]);
            } else {
                $error = 'Failed to parse JSON output. JSON Error: ' . json_last_error_msg();
                \Log::error('OLX Scraper: JSON parse failed', ['error' => json_last_error_msg(), 'json_str' => substr($jsonStr, 0, 500)]);
            }
        } else {
            $error = 'Scraper error: ' . $stdout;
            \Log::error('OLX Scraper: Script failed', ['returnVar' => $returnVar, 'stdout' => substr($stdout, 0, 500)]);
        }

        return view('olx-scraper.index', [
            'url' => $request->input('url'),
            'preview' => $data,
            'error' => $error,
            'raw' => $stdout,
            'exitCode' => $returnVar,
            'users' => User::select('id', 'name', 'email', 'profile_pic')->orderBy('name')->get(),
            'categories' => AuctionCategory::all(),
        ]);
    }

    public function save(Request $request)
    {
        set_time_limit(180);
        
        // Log incoming request
        Log::info('OLX Scraper save method called', [
            'url' => $request->input('url'),
            'user_id' => $request->input('user_id'),
            'category_id' => $request->input('category_id'),
            'sub_category_id' => $request->input('sub_category_id'),
            'child_category_id' => $request->input('child_category_id'),
            'all_input' => $request->all()
        ]);
        
        // Convert empty strings to null for nullable fields
        $request->merge([
            'sub_category_id' => $request->input('sub_category_id') ?: null,
            'child_category_id' => $request->input('child_category_id') ?: null,
        ]);
        
        try {
            $request->validate([
                'url' => 'required|url',
                'user_id' => 'required|exists:users,id',
                'category_id' => 'required|exists:auction_categories,id',
                'sub_category_id' => 'nullable|exists:auction_categories,id',
                'child_category_id' => 'nullable|exists:auction_categories,id',
            ]);
            Log::info('OLX Scraper validation passed');
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('OLX Scraper validation failed', [
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);
            return redirect()->route('olx-scraper.index')
                ->withErrors($e->errors())
                ->withInput()
                ->with('error', 'Validation failed: ' . implode(', ', array_map(function($errors) {
                    return implode(', ', $errors);
                }, $e->errors())));
        }

        // Run OLX scraper
        $script = env('SCRAPER_SCRIPT_PATH', base_path('tools/scraper/olx_scrape.py'));
        if (!file_exists($script)) {
            $script = base_path('admin/tools/scraper/olx_scrape.py');
        }
        $python = env('SCRAPER_PY_PATH', 'python');

        if (!file_exists($script)) {
            return redirect()->route('olx-scraper.index')->with('error', 'OLX scraper script not found.');
        }

        // Set Playwright browsers path environment variable
        // Try multiple locations within open_basedir restrictions
        $playwrightPaths = [
            '/home/xpertbid.com/.cache/ms-playwright',
            '/tmp/playwright-browsers',
            '/usr/local/share/playwright', // Fallback if open_basedir allows
        ];
        
        $envVars = [];
        foreach ($playwrightPaths as $playwrightPath) {
            if (@file_exists($playwrightPath) && @is_dir($playwrightPath)) {
                $envVars[] = 'PLAYWRIGHT_BROWSERS_PATH=' . escapeshellarg($playwrightPath);
                break;
            }
        }
        
        // Add additional environment variables for memory/address space issues
        $envVars[] = 'MALLOC_ARENA_MAX=2';  // Reduce memory arenas
        $envVars[] = 'MALLOC_MMAP_THRESHOLD_=131072';  // Memory mapping threshold
        
        $envPrefix = implode(' ', $envVars) . ' ';
        
        // Since we're using requests library (no browser needed), we can run directly without sudo
        // Check if we should use root (for backward compatibility)
        $useRoot = env('OLX_SCRAPER_USE_ROOT', false); // Default to false since requests doesn't need browser
        
        if ($useRoot) {
            // Use wrapper script approach for better environment variable handling
            $wrapperScript = base_path('admin/tools/scraper/run_olx_scraper.sh');
            
            if (file_exists($wrapperScript)) {
                // Use wrapper script with sudo (if needed for Playwright fallback)
                $cmd = 'sudo -n -u root ' . escapeshellarg($wrapperScript) . ' ' . escapeshellarg($request->input('url'));
            } else {
                // Fallback: Direct command with environment variables
                $rootBrowserPath = '/root/.cache/ms-playwright';
                
                // Environment variables for root user
                $rootEnvVars = [
                    'PLAYWRIGHT_BROWSERS_PATH=' . escapeshellarg($rootBrowserPath),
                    'MALLOC_ARENA_MAX=2',
                    'MALLOC_MMAP_THRESHOLD_=131072',
                ];
                $rootEnvPrefix = implode(' ', $rootEnvVars) . ' ';
                
                // Use sudo -n (non-interactive) to avoid password prompt
                $cmd = 'sudo -n -u root ' . $rootEnvPrefix . escapeshellcmd($python) . ' ' . escapeshellarg($script) . ' ' . escapeshellarg($request->input('url'));
            }
        } else {
            // Run directly without sudo (requests library doesn't need browser)
            $cmd = escapeshellcmd($python) . ' ' . escapeshellarg($script) . ' ' . escapeshellarg($request->input('url'));
        }

        $output = null;
        $returnVar = null;
        
        // Log the command for debugging
        \Log::info('OLX Scraper: Executing command', ['cmd' => $cmd]);
        
        exec($cmd . ' 2>&1', $lines, $returnVar);
        $stdout = implode("\n", $lines);
        
        Log::info('OLX Scraper exec result', [
            'returnVar' => $returnVar,
            'stdout_length' => strlen($stdout),
            'lines_count' => count($lines),
            'first_500_chars' => substr($stdout, 0, 500)
        ]);

        if ($returnVar === 0) {
            $jsonStr = $stdout;
            
            // Try to find JSON object in output (look for "Fetch completed" marker)
            if (preg_match('/Fetch completed\s*(\{.*\})/s', $stdout, $matches)) {
                $jsonStr = $matches[1];
            } elseif (preg_match('/\{.*\}/s', $stdout, $matches)) {
                $jsonStr = $matches[0];
            }
            
            $json = json_decode($jsonStr, true);
            $jsonError = json_last_error();
            
            Log::info('OLX JSON parse result', [
                'json_error' => $jsonError,
                'json_error_msg' => json_last_error_msg(),
                'has_data' => !empty($json),
                'has_title' => !empty($json['title'] ?? null),
                'has_price' => !empty($json['price'] ?? null),
                'json_str_first_500' => substr($jsonStr, 0, 500),
                'json_keys' => !empty($json) ? array_keys($json) : []
            ]);
            
            // Check JSON parse error
            if ($jsonError !== JSON_ERROR_NONE) {
                Log::error('OLX JSON parse failed', [
                    'error_code' => $jsonError,
                    'error_msg' => json_last_error_msg(),
                    'json_str' => substr($jsonStr, 0, 1000)
                ]);
                return redirect()->route('olx-scraper.index')
                    ->with('error', 'Failed to parse scraper output. JSON Error: ' . json_last_error_msg())
                    ->withInput();
            }
            
            // Check if JSON is empty
            if (empty($json)) {
                Log::warning('OLX JSON is empty', ['stdout_length' => strlen($stdout)]);
                return redirect()->route('olx-scraper.index')
                    ->with('error', 'No data scraped. Scraper returned empty data.')
                    ->withInput();
            }
            
            if (!empty($json)) {
                Log::info('OLX Scraped data:', $json);
                
                // Validate that we have minimum required data
                if (empty($json['title']) || $json['title'] === 'No title' || $json['title'] === 'Oops!') {
                    Log::warning('OLX: Invalid title in scraped data', ['title' => $json['title'] ?? 'N/A']);
                    return redirect()->route('olx-scraper.index')
                        ->with('error', 'Failed to scrape valid data. Title is missing or invalid.')
                        ->withInput();
                }
                
                try {
                    // Download and save images
                    $images = $json['images'] ?? [];
                    $savedImages = [];
                    $firstImage = null;
                    
                    foreach ($images as $idx => $imageUrl) {
                        try {
                            $response = Http::timeout(30)->get($imageUrl);
                            if ($response->successful()) {
                                $imageData = $response->body();
                                $extension = pathinfo(parse_url($imageUrl, PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'jpg';
                                $fileName = time() . '_olx_' . uniqid() . '_' . $idx . '.' . $extension;
                                $savePath = public_path('/assets/images/auction/');
                                
                                if (!file_exists($savePath)) {
                                    mkdir($savePath, 0755, true);
                                }
                                
                                file_put_contents($savePath . $fileName, $imageData);
                                $localPath = '/assets/images/auction/' . $fileName;
                                $savedImages[] = $localPath;
                                
                                if ($idx === 0) {
                                    $firstImage = $localPath;
                                }
                            }
                        } catch (\Exception $e) {
                            Log::warning('OLX: Failed to download image: ' . $imageUrl, ['error' => $e->getMessage()]);
                        }
                    }
                    
                    $albumJson = json_encode($savedImages);
                    
                    // Truncate title
                    $title = $json['title'] ?? 'No title';
                    if (strlen($title) > 255) {
                        $title = substr($title, 0, 252) . '...';
                    }
                    
                    // Create auction
                    // Set default values for required fields
                    $listType = 'auction'; // Default to auction
                    $productYear = date('Y'); // Default to current year
                    
                    $auctionData = [
                        'title' => $title,
                        'user_id' => $request->input('user_id'),
                        'category_id' => $request->input('category_id'),
                        'sub_category_id' => $request->input('sub_category_id') ?: null,
                        'child_category_id' => $request->input('child_category_id') ?: null,
                        'reserve_price' => $json['reserve_price'] ?? 0,
                        'minimum_bid' => $json['minimum_bid'] ?? 0,
                        'description' => $json['description'] ?? '',
                        'image' => $firstImage,
                        'album' => $albumJson,
                        'amenities' => (!empty($json['amenities']) && is_array($json['amenities']) && count($json['amenities']) > 0) 
                            ? json_encode($json['amenities']) 
                            : null,
                        'status' => 'active',
                        'start_date' => now(),
                        'end_date' => now()->addDays(7),
                        'is_autobidder_on' => 1, // Auto bidder on for OLX products
                        'list_type' => $listType,
                        'product_year' => $productYear,
                    ];
                    
                    // Validate required fields before creating
                    if (empty($auctionData['user_id'])) {
                        Log::error('OLX: user_id is missing');
                        return redirect()->route('olx-scraper.index')
                            ->with('error', 'User ID is required. Please select a user.')
                            ->withInput();
                    }
                    
                    if (empty($auctionData['category_id'])) {
                        Log::error('OLX: category_id is missing');
                        return redirect()->route('olx-scraper.index')
                            ->with('error', 'Category ID is required. Please select a category.')
                            ->withInput();
                    }
                    
                    Log::info('OLX Auction data before create', [
                        'data' => $auctionData,
                        'user_id' => $auctionData['user_id'],
                        'category_id' => $auctionData['category_id'],
                        'title' => $auctionData['title'],
                        'reserve_price' => $auctionData['reserve_price'],
                        'minimum_bid' => $auctionData['minimum_bid'],
                        'is_autobidder_on' => $auctionData['is_autobidder_on'] ?? null,
                        'list_type' => $auctionData['list_type'] ?? null,
                        'product_year' => $auctionData['product_year'] ?? null,
                    ]);
                    
                    // Validate all required fields are present
                    $requiredFields = ['user_id', 'category_id', 'title', 'list_type', 'product_year'];
                    foreach ($requiredFields as $field) {
                        if (empty($auctionData[$field])) {
                            $errorMsg = "Required field '{$field}' is missing or empty";
                            Log::error('OLX: ' . $errorMsg, ['auction_data' => $auctionData]);
                            return redirect()->route('olx-scraper.index')
                                ->with('error', $errorMsg)
                                ->withInput();
                        }
                    }
                    
                    // Try to create auction
                    try {
                        $auction = Auction::create($auctionData);
                        Log::info('OLX Auction created successfully', ['auction_id' => $auction->id]);
                    } catch (\Illuminate\Database\QueryException $dbEx) {
                        // Re-throw to be caught by outer catch block
                        Log::error('OLX: Database exception during create', [
                            'message' => $dbEx->getMessage(),
                            'code' => $dbEx->getCode(),
                            'sql' => $dbEx->getSql() ?? 'N/A'
                        ]);
                        throw $dbEx;
                    } catch (\Exception $ex) {
                        // Re-throw to be caught by outer catch block
                        Log::error('OLX: General exception during create', [
                            'message' => $ex->getMessage(),
                            'trace' => $ex->getTraceAsString()
                        ]);
                        throw $ex;
                    }
                    
                    Log::info('OLX Auction created successfully', [
                        'auction_id' => $auction->id,
                        'title' => $auction->title,
                        'is_autobidder_on' => $auction->is_autobidder_on
                    ]);
                    
                    // Flash success message
                    $successMessage = 'Auction saved successfully! Auction ID: ' . $auction->id;
                    
                    Log::info('OLX Redirecting with success message', [
                        'message' => $successMessage,
                        'auction_id' => $auction->id
                    ]);
                    
                    // Use both session flash and query parameter for reliability
                    return redirect()->route('olx-scraper.index', ['saved' => '1', 'auction_id' => $auction->id])
                        ->with('status', $successMessage)
                        ->with('success_auction_id', $auction->id);
                } catch (\Illuminate\Database\QueryException $e) {
                    $errorMsg = $e->getMessage();
                    Log::error('OLX Save failed - Database error', [
                        'message' => $errorMsg,
                        'code' => $e->getCode(),
                        'sql' => $e->getSql() ?? 'N/A',
                        'bindings' => $e->getBindings() ?? [],
                        'trace' => $e->getTraceAsString()
                    ]);
                    
                    // Extract more user-friendly error message
                    if (strpos($errorMsg, 'SQLSTATE') !== false) {
                        if (strpos($errorMsg, 'Integrity constraint violation') !== false) {
                            $errorMsg = 'Database constraint violation. Please check if user or category exists.';
                        } elseif (strpos($errorMsg, 'Column') !== false && strpos($errorMsg, 'cannot be null') !== false) {
                            $errorMsg = 'Required field is missing. Please check all required fields are filled.';
                        }
                    }
                    
                    return redirect()->route('olx-scraper.index')
                        ->with('error', 'Database error: ' . $errorMsg)
                        ->withInput();
                } catch (\Exception $e) {
                    $errorMsg = $e->getMessage();
                    Log::error('OLX Save failed', [
                        'message' => $errorMsg,
                        'file' => $e->getFile(),
                        'line' => $e->getLine(),
                        'trace' => $e->getTraceAsString()
                    ]);
                    
                    return redirect()->route('olx-scraper.index')
                        ->with('error', 'Failed to save: ' . $errorMsg)
                        ->withInput();
                }
            } else {
                Log::warning('OLX: JSON is empty after parse', [
                    'json_error' => json_last_error(),
                    'stdout_length' => strlen($stdout),
                    'stdout_first_500' => substr($stdout, 0, 500)
                ]);
                return redirect()->route('olx-scraper.index')
                    ->with('error', 'No data scraped. Check raw output below.')
                    ->withInput();
            }
        } else {
            Log::error('OLX Scraper command failed', [
                'returnVar' => $returnVar, 
                'stdout' => substr($stdout, 0, 1000),
                'stdout_length' => strlen($stdout)
            ]);
            return redirect()->route('olx-scraper.index')
                ->with('error', 'Scraper command failed. Return code: ' . $returnVar . '. Check logs for details.')
                ->withInput();
        }
    }
}

