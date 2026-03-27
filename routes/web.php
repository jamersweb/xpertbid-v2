<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuctionController;
use App\Http\Controllers\AuctionCategoryController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\BidController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FavoritesController;
use App\Http\Controllers\SliderController;
use App\Http\Controllers\PaymentRequestController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Api\BlogApiController;
use App\Http\Controllers\Api\CurrencyController;
use App\Http\Controllers\Api\BuyNowInquiryController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\VerificationCodeController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\MarketplaceController;
use App\Http\Controllers\InvoiceController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// --- Public Pages (Inertia) ---

Route::get('/', [AuctionController::class, 'home'])->name('home'); // Replaces Welcome
Route::get('/product/{slug}', [AuctionController::class, 'show'])->name('product.show');
Route::get('/1-rupee-auctions', [AuctionController::class, 'one_rupee_page'])->name('auctions.one_rupee');
Route::get('/search-auctions', [AuctionController::class, 'search'])->name('auctions.search-api');
Route::get('/search', [AuctionController::class, 'filterAuctions'])->name('auctions.index');
Route::get('/marketplace/{slug?}', [MarketplaceController::class, 'index'])->name('marketplace.index');
Route::get('/search-marketplace', [MarketplaceController::class, 'index'])->name('marketplace.search');

// Static/Info Pages
Route::get('/about', [App\Http\Controllers\StaticPageController::class, 'about'])->name('about');
Route::get('/contact', [App\Http\Controllers\StaticPageController::class, 'contact'])->name('contact');
Route::get('/faq', [App\Http\Controllers\StaticPageController::class, 'faq'])->name('faq');
Route::get('/privacy-policy', [App\Http\Controllers\StaticPageController::class, 'privacy'])->name('privacy.policy');
Route::get('/refund-policy', [App\Http\Controllers\StaticPageController::class, 'refund'])->name('refund.policy');
Route::get('/shipping-policy', [App\Http\Controllers\StaticPageController::class, 'shipping'])->name('shipping.policy');
Route::get('/terms', [App\Http\Controllers\StaticPageController::class, 'terms'])->name('terms');

// Blog (Public)
Route::get('/blogs', [App\Http\Controllers\BlogController::class, 'index'])->name('blogs.index');
Route::get('/blogs/{slug}', [App\Http\Controllers\BlogController::class, 'show'])->name('blogs.show');

// Public Data Fetching
Route::get('/get-products', [AuctionController::class, 'get_products']);
Route::get('/get-featured', [AuctionController::class, 'get_featured']);
Route::get('/get-featured-vehicle', [AuctionController::class, 'get_featured_vehicle']);
Route::get('/get-featured-service', [AuctionController::class, 'get_featured_service']);
Route::get('/get-featured-realstate', [AuctionController::class, 'get_featured_realstate']);
Route::get('/get-vehicle', [AuctionController::class, 'get_vehicle']);
Route::get('/get-realestate', [AuctionController::class, 'get_realestate']);
Route::get('/get-service', [AuctionController::class, 'get_service']);
Route::get('/get-latest-vehicles', [AuctionController::class, 'get_latest_vehicles']);
Route::get('/get-latest-properties', [AuctionController::class, 'get_latest_properties']);
Route::get('/get-latest-normal-lists', [AuctionController::class, 'get_latest_normal_lists']);
Route::get('/get-one-rupee-auctions', [AuctionController::class, 'get_one_rupee_auctions']);
Route::get('/get-latest-auctions', [AuctionController::class, 'get_latest_auctions']);

// Categories (Public)
Route::get('/get-all-categories', [AuctionCategoryController::class, 'all_categories']);
Route::get('/get-category-sell', [AuctionCategoryController::class, 'get_category_sell']);
Route::get('/get-category', [AuctionCategoryController::class, 'get_category']);
Route::get('/get-subcategories/{id}', [AuctionCategoryController::class, 'getSubcategories']);
Route::get('/get-children/{id}', [AuctionCategoryController::class, 'getChildren']);
Route::get('/get-dynamic-fields/{categoryId}/{listingType}', [\App\Http\Controllers\ListingController::class, 'getDynamicFields']);

// Locations (Public)
Route::get('/get-countries', [AuctionController::class, 'get_countries']);
Route::get('/get-states/{id}', [AuctionController::class, 'get_states']);
Route::get('/get-states-by-country-name/{id}', [AuctionController::class, 'get_states_country_name']);
Route::get('/get-cities/{id}', [AuctionController::class, 'get_cities']);
Route::get('/get-cities-by-state-name/{id}', [AuctionController::class, 'get_cities_by_state_name']);

// Sliders (Public)
Route::get('/get-slider', [SliderController::class, 'get_slider']);
Route::get('/get-slider-vehicle', [SliderController::class, 'get_slider_vehicle']);
Route::get('/get-slider-realstate', [SliderController::class, 'get_slider_realstate']);
Route::get('/get-slider-service', [SliderController::class, 'get_slider_service']);

// Public Forms
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::post('/buy-now-inquiry', [BuyNowInquiryController::class, 'store'])->name('buy_now.store');


// --- Authenticated Routes (Inertia + Web Sessions) ---
Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    // Dashboard
    Route::get('/dashboard', [UserController::class, 'dashboard'])->name('dashboard');
    Route::get('/account-settings', [ProfileController::class, 'edit'])->name('profile.edit'); // Unified profile edit

    // Profile & Settings
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/user/update', [ProfileController::class, 'updateProfile'])->name('user.update');
    Route::post('/user/address', [ProfileController::class, 'updateAddress'])->name('user.address.update');
    Route::post('/user/change-password', [ProfileController::class, 'updatePassword'])->name('user.password.update');
    Route::post('/user/notifications', [ProfileController::class, 'updateNotifications'])->name('user.notifications.update');

    // Verification
    Route::get('/identity-verification', [ProfileController::class, 'getIdentityVerification'])->name('verification.identity');
    Route::post('/identity-verification', [ProfileController::class, 'saveIdentityVerification'])->name('verification.identity.store');
    Route::post('/individual-verification', [\App\Http\Controllers\IndividualVerificationController::class, 'store'])->name('individual-verifications.store');
    Route::post('/corporate-verification', [\App\Http\Controllers\CorporateVerificationController::class, 'store'])->name('corporate-verifications.store');

    // Unified Listings (Refactored from Auctions)
    Route::get('/sell', [\App\Http\Controllers\ListingController::class, 'create'])->name('auctions.create');
    Route::post('/auctions', [\App\Http\Controllers\ListingController::class, 'store'])->name('auctions.store');
    Route::get('/my-listings', [\App\Http\Controllers\ListingController::class, 'index'])->name('auctions.mylistings');
    Route::get('/auctions/{listing}/edit', [\App\Http\Controllers\ListingController::class, 'edit'])->name('auctions.edit');
    Route::match(['POST', 'PUT'], '/auctions/{listing}', [\App\Http\Controllers\ListingController::class, 'update'])->name('auctions.update');
    Route::post('/auctions/{listing}/cancel', [\App\Http\Controllers\ListingController::class, 'cancel'])->name('auctions.cancel');

    // Bidding & Favorites
    Route::post('/bids', [BidController::class, 'placeBid'])->name('bids.store');
    Route::get('/my-bids', [BidController::class, 'index'])->name('bids.index');
    Route::get('/favorites', [FavoritesController::class, 'index'])->name('favorites.index');
    Route::post('/favorites/toggle', [FavoritesController::class, 'toggle'])->name('favorites.toggle'); // Unified add/remove

    // Cart & Checkout
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::delete('/cart/{id}', [CartController::class, 'remove'])->name('cart.remove');
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index'); // View Checkout Page
    Route::post('/checkout/process', [CheckoutController::class, 'processCheckout'])->name('checkout.process');
    Route::get('/my-orders', [CheckoutController::class, 'myOrders'])->name('orders.index');
    Route::get('/order/{orderNumber}', [CheckoutController::class, 'show'])->name('orders.show');

    // Wallet & Payments
    Route::get('/wallet', [WalletController::class, 'index'])->name('wallet.index');
    Route::post('/wallet/add', [WalletController::class, 'addMoney'])->name('wallet.add');
    Route::post('/payment-methods', [PaymentController::class, 'savePaymentMethod'])->name('payment_methods.store');
    Route::get('/payment-requests', [\App\Http\Controllers\PaymentRequestController::class, 'index'])->name('payment_requests.index');
    // Notifications
    Route::get('/notifications-page', [App\Http\Controllers\UserNotificationController::class, 'index'])->name('notifications.index');
    
    // Chat Routes
    Route::group(['prefix' => 'chat', 'as' => 'chat.'], function () {
        Route::get('/', [\App\Http\Controllers\ChatController::class, 'index'])->name('index');
        Route::get('/conversations', [\App\Http\Controllers\Api\ChatController::class, 'index'])->name('conversations.index');
        Route::get('/conversations/{id}', [\App\Http\Controllers\Api\ChatController::class, 'show'])->name('conversations.show');
        Route::post('/initiate', [\App\Http\Controllers\Api\ChatController::class, 'initiate'])->name('initiate');
        Route::post('/messages', [\App\Http\Controllers\Api\ChatController::class, 'store'])->name('messages.store');
        Route::delete('/conversations/{id}', [\App\Http\Controllers\Api\ChatController::class, 'deleteConversation'])->name('conversations.destroy');
        Route::post('/conversations/{id}/important', [\App\Http\Controllers\Api\ChatController::class, 'toggleImportant'])->name('conversations.important');
    });

    Route::get('/api/notifications', [App\Http\Controllers\UserNotificationController::class, 'getNotifications'])->name('notifications.api');
    Route::get('/api/notifications/count', [App\Http\Controllers\UserNotificationController::class, 'getUnreadCount'])->name('notifications.count');
    Route::post('/api/notifications/read/{id}', [App\Http\Controllers\UserNotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/api/notifications/read-all', [App\Http\Controllers\UserNotificationController::class, 'markAllAsRead'])->name('notifications.read_all');
    Route::delete('/api/notifications/{id}', [App\Http\Controllers\UserNotificationController::class, 'deleteNotification'])->name('notifications.delete');

    // Invoices
    Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices.index');
    Route::get('/api/invoices', [InvoiceController::class, 'apiIndex'])->name('invoices.api');

});

Route::get('/api/currencies', [App\Http\Controllers\CurrencyController::class, 'index']);

// Admin Routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Admin\AdminDashboardController::class, 'index'])->name('dashboard');

    // SEO Management
    Route::get('/seo', [App\Http\Controllers\Admin\SeoController::class, 'index'])->name('seo.index');
    Route::post('/seo', [App\Http\Controllers\Admin\SeoController::class, 'store'])->name('seo.store');

    // User Management
    Route::get('/users', [App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
    Route::post('/users', [App\Http\Controllers\Admin\UserController::class, 'store'])->name('users.store');
    Route::put('/users/{user}', [App\Http\Controllers\Admin\UserController::class, 'update'])->name('users.update');
    Route::patch('/users/{user}/status', [App\Http\Controllers\Admin\UserController::class, 'updateStatus'])->name('users.update-status');
    Route::delete('/users/{user}', [App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('users.destroy');

    // Verifications
    Route::prefix('verifications')->name('verifications.')->group(function () {
        Route::get('/individual', [App\Http\Controllers\Admin\IndividualVerificationController::class, 'index'])->name('individual.index');
        Route::post('/individual/{id}/accept', [App\Http\Controllers\Admin\IndividualVerificationController::class, 'accept'])->name('individual.accept');
        Route::post('/individual/{id}/decline', [App\Http\Controllers\Admin\IndividualVerificationController::class, 'decline'])->name('individual.decline');

        Route::get('/corporate', [App\Http\Controllers\Admin\CorporateVerificationController::class, 'index'])->name('corporate.index');
        Route::post('/corporate/{id}/accept', [App\Http\Controllers\Admin\CorporateVerificationController::class, 'accept'])->name('corporate.accept');
        Route::post('/corporate/{id}/decline', [App\Http\Controllers\Admin\CorporateVerificationController::class, 'decline'])->name('corporate.decline');

        Route::get('/vehicle', [App\Http\Controllers\Admin\VehicleVerificationController::class, 'index'])->name('vehicle.index');
        Route::post('/vehicle/{id}/accept', [App\Http\Controllers\Admin\VehicleVerificationController::class, 'accept'])->name('vehicle.accept');
        Route::post('/vehicle/{id}/decline', [App\Http\Controllers\Admin\VehicleVerificationController::class, 'decline'])->name('vehicle.decline');

        Route::get('/property', [App\Http\Controllers\Admin\PropertyVerificationController::class, 'index'])->name('property.index');
        Route::post('/property/{id}/accept', [App\Http\Controllers\Admin\PropertyVerificationController::class, 'accept'])->name('property.accept');
        Route::post('/property/{id}/decline', [App\Http\Controllers\Admin\PropertyVerificationController::class, 'decline'])->name('property.decline');

        // Auction Verification (Publish Approval)
        Route::get('/auctions', [App\Http\Controllers\Admin\AuctionStatusController::class, 'index'])->name('auctions.index');
        Route::post('/auctions/{id}/accept', [App\Http\Controllers\Admin\AuctionStatusController::class, 'accept'])->name('auctions.accept');
        Route::post('/auctions/{id}/decline', [App\Http\Controllers\Admin\AuctionStatusController::class, 'decline'])->name('auctions.decline');
    });

    // Auction Management
    Route::resource('auctions', App\Http\Controllers\Admin\AuctionController::class)->names('auctions');
    Route::get('/bids', [App\Http\Controllers\Admin\BidController::class, 'index'])->name('bids.index');
    Route::get('/bids/{id}', [App\Http\Controllers\Admin\BidController::class, 'show'])->name('bids.show');

    // Order Management
    Route::get('/orders', [App\Http\Controllers\Admin\OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{id}', [App\Http\Controllers\Admin\OrderController::class, 'show'])->name('orders.show');
    Route::patch('/orders/{id}/status', [App\Http\Controllers\Admin\OrderController::class, 'updateStatus'])->name('orders.update-status');

    // Payment Requests (Wallet Top-ups)
    Route::get('/payment-requests', [App\Http\Controllers\Admin\PaymentRequestController::class, 'index'])->name('payment-requests.index');
    Route::patch('/payment-requests/{id}/status', [App\Http\Controllers\Admin\PaymentRequestController::class, 'updateStatus'])->name('payment-requests.update-status');

    // Unified List Management (Refactored)
    Route::get('/listings', [App\Http\Controllers\Admin\ListingController::class, 'index'])->name('listings.index');
    Route::resource('listings', App\Http\Controllers\Admin\ListingController::class)->except(['index'])->names('listings');
    Route::patch('/listings/{id}/status', [App\Http\Controllers\Admin\ListingController::class, 'updateStatus'])->name('listings.update-status');

    // Unified Category Management (Refactored to legacy system)
    Route::resource('categories', App\Http\Controllers\Admin\AuctionCategoryController::class)->names('categories');
    Route::resource('dynamic-fields', App\Http\Controllers\Admin\DynamicFieldController::class)->names('dynamic-fields');

    // Content Management
    Route::resource('sliders', App\Http\Controllers\Admin\SliderController::class)->names('sliders');
    Route::resource('faqs', App\Http\Controllers\Admin\FaqQuestionController::class)->names('faqs');
    Route::resource('blogs', App\Http\Controllers\Admin\BlogController::class)->names('blogs');

    // System Settings
    Route::resource('master-settings', App\Http\Controllers\Admin\MasterSettingController::class)->names('master-settings');
    Route::resource('locations', App\Http\Controllers\Admin\LocationController::class)->names('locations');

    // Bidder Communication
    Route::get('/bidder-communication', [App\Http\Controllers\Admin\BidderCommunicationController::class, 'index'])->name('bidder-communication.index');
    Route::get('/bidder-communication/products', [App\Http\Controllers\Admin\BidderCommunicationController::class, 'getProducts'])->name('bidder-communication.get-products');
    Route::get('/bidder-communication/bidders', [App\Http\Controllers\Admin\BidderCommunicationController::class, 'getBidders'])->name('bidder-communication.get-bidders');
    Route::get('/bidder-communication/search-users', [App\Http\Controllers\Admin\BidderCommunicationController::class, 'searchUsers'])->name('bidder-communication.search-users');
    Route::post('/bidder-communication/send', [App\Http\Controllers\Admin\BidderCommunicationController::class, 'send'])->name('bidder-communication.send');

    // CRM & Secondary Tools
    Route::get('/crm', [App\Http\Controllers\Admin\CustomerOutreachController::class, 'index'])->name('crm.index');
    Route::put('/crm/{id}', [App\Http\Controllers\Admin\CustomerOutreachController::class, 'update'])->name('crm.update');
    Route::get('/email-logs', [App\Http\Controllers\Admin\EmailLogController::class, 'index'])->name('email-logs.index');
    Route::resource('roles', App\Http\Controllers\Admin\RoleController::class)->names('roles');
});

require __DIR__ . '/auth.php';
