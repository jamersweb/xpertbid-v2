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
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\LiveAuctionDemoController;
use App\Http\Controllers\ListingLiveChatController;

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
Route::get('/live-auctions/feed', [AuctionController::class, 'liveAuctionsFeed'])->name('live-auctions.feed');
Route::get('/live-auctions', [AuctionController::class, 'liveAuctions'])->name('live-auctions.public');
Route::get('/demo/live-auction-car-showcase', [LiveAuctionDemoController::class, 'show'])->name('demo.live_auction_car_showcase');

Route::get('/live-chat/listings/{listing}/messages', [ListingLiveChatController::class, 'index'])
    ->middleware('throttle:120,1')
    ->name('live-chat.listing.messages.index');
Route::get('/1-rupee-auctions', [AuctionController::class, 'one_rupee_page'])->name('auctions.one_rupee');
Route::get('/search-auctions', [AuctionController::class, 'search'])->name('auctions.search-api');
Route::get('/search', [AuctionController::class, 'filterAuctions'])->name('auctions.index');
Route::get('/marketplace/{slug}/{typeSlug}', [MarketplaceController::class, 'index'])
    ->where('typeSlug', 'auctions|normal-products|business-products')
    ->name('marketplace.type');
Route::get('/marketplace/{slug?}', [MarketplaceController::class, 'index'])->name('marketplace.index');
Route::get('/search-marketplace', [MarketplaceController::class, 'index'])->name('marketplace.search');
Route::get('/products/filter', [MarketplaceController::class, 'mobileIndex'])->name('marketplace.mobile_filter');
Route::get('/categories', [AuctionController::class, 'categoriesPage'])->name('categories.page');

// Static/Info Pages
Route::get('/about', [App\Http\Controllers\StaticPageController::class, 'about'])->name('about');
Route::get('/contact', [App\Http\Controllers\StaticPageController::class, 'contact'])->name('contact');
Route::get('/faq', [App\Http\Controllers\StaticPageController::class, 'faq'])->name('faq');
Route::get('/privacy-policy', [App\Http\Controllers\StaticPageController::class, 'privacy'])->name('privacy.policy');
Route::view('/data-deletion', 'data-deletion')->name('data.deletion');
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
Route::get('/detect-location-ip', [AuctionController::class, 'detect_location_ip']);

// Sliders (Public)
Route::get('/get-slider', [SliderController::class, 'get_slider']);
Route::get('/get-slider-vehicle', [SliderController::class, 'get_slider_vehicle']);
Route::get('/get-slider-realstate', [SliderController::class, 'get_slider_realstate']);
Route::get('/get-slider-service', [SliderController::class, 'get_slider_service']);

// Public Forms
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::post('/buy-now-inquiry', [BuyNowInquiryController::class, 'store'])->name('buy_now.store');
Route::post('/locale', [LocaleController::class, 'update'])->name('locale.update');

// Guest-friendly Cart & Checkout
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout/process', [CheckoutController::class, 'processCheckout'])->name('checkout.process');


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
    Route::get('/user/address', [ProfileController::class, 'showAddress'])->name('user.address.show');
    Route::post('/user/address', [ProfileController::class, 'updateAddress'])->name('user.address.update');
    Route::post('/user/change-password', [ProfileController::class, 'updatePassword'])->name('user.password.update');
    Route::get('/user/notifications', [ProfileController::class, 'showNotifications'])->name('user.notifications.show');
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
    Route::get('/auction-drafts/{draft}/edit', [\App\Http\Controllers\ListingController::class, 'editDraft'])->name('auctions.drafts.edit');
    Route::match(['POST', 'PUT'], '/auction-drafts/{draft}', [\App\Http\Controllers\ListingController::class, 'updateDraft'])->name('auctions.drafts.update');
    Route::post('/auction-drafts/{draft}/cancel', [\App\Http\Controllers\ListingController::class, 'cancelDraft'])->name('auctions.drafts.cancel');
    Route::get('/auctions/{listing}/edit', [\App\Http\Controllers\ListingController::class, 'edit'])->name('auctions.edit');
    Route::match(['POST', 'PUT'], '/auctions/{listing}', [\App\Http\Controllers\ListingController::class, 'update'])->name('auctions.update');
    Route::post('/auctions/{listing}/cancel', [\App\Http\Controllers\ListingController::class, 'cancel'])->name('auctions.cancel');

    Route::post('/live-chat/listings/{listing}/messages', [ListingLiveChatController::class, 'store'])
        ->middleware('throttle:30,1')
        ->name('live-chat.listing.messages.store');

    // Bidding & Favorites
    Route::post('/bids', [BidController::class, 'placeBid'])->name('bids.store');
    Route::get('/my-bids', [BidController::class, 'index'])->name('bids.index');
    Route::get('/favorites', [FavoritesController::class, 'index'])->name('favorites.index');
    Route::post('/favorites/toggle', [FavoritesController::class, 'toggle'])->name('favorites.toggle'); // Unified add/remove

    // Cart
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::delete('/cart/{id}', [CartController::class, 'remove'])->name('cart.remove');
    Route::get('/my-orders', [CheckoutController::class, 'myOrders'])->name('orders.index');
    Route::get('/order/{orderNumber}', [CheckoutController::class, 'show'])->name('orders.show');

    // Wallet & Payments
    Route::get('/wallet', [WalletController::class, 'index'])->name('wallet.index');
    Route::post('/wallet/add', [WalletController::class, 'addMoney'])->name('wallet.add');
    Route::get('/payment-methods', [PaymentController::class, 'index'])->name('payment_methods.index');
    Route::post('/payment-methods', [PaymentController::class, 'savePaymentMethod'])->name('payment_methods.store');
    Route::post('/make-payment', [PaymentController::class, 'makePayment'])->name('payment.make');
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
    Route::get('/seo/create', [App\Http\Controllers\Admin\SeoController::class, 'create'])->name('seo.create');
    Route::post('/seo', [App\Http\Controllers\Admin\SeoController::class, 'store'])->name('seo.store');
    Route::get('/seo/{seo}/edit', [App\Http\Controllers\Admin\SeoController::class, 'edit'])->name('seo.edit');
    Route::put('/seo/{seo}', [App\Http\Controllers\Admin\SeoController::class, 'update'])->name('seo.update');
    Route::delete('/seo/{seo}', [App\Http\Controllers\Admin\SeoController::class, 'destroy'])->name('seo.destroy');

    // User Management
    Route::get('/users', [App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
    Route::get('/users/{user}', [App\Http\Controllers\Admin\UserController::class, 'show'])->name('users.show');
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
    Route::patch('/bids/{id}', [App\Http\Controllers\Admin\BidController::class, 'update'])->name('bids.update');
    Route::delete('/bids/{id}', [App\Http\Controllers\Admin\BidController::class, 'destroy'])->name('bids.destroy');

    // Order Management
    Route::get('/orders', [App\Http\Controllers\Admin\OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{id}', [App\Http\Controllers\Admin\OrderController::class, 'show'])->name('orders.show');
    Route::patch('/orders/{id}/status', [App\Http\Controllers\Admin\OrderController::class, 'updateStatus'])->name('orders.update-status');

    // Payment Requests (Wallet Top-ups)
    Route::get('/payment-requests', [App\Http\Controllers\Admin\PaymentRequestController::class, 'index'])->name('payment-requests.index');
    Route::patch('/payment-requests/{id}/status', [App\Http\Controllers\Admin\PaymentRequestController::class, 'updateStatus'])->name('payment-requests.update-status');

    // Unified List Management (Refactored)
    Route::get('/live', [App\Http\Controllers\Admin\ListingController::class, 'liveSessions'])->name('live.index');
    Route::patch('/live/{session}/status', [App\Http\Controllers\Admin\ListingController::class, 'updateLiveSessionStatus'])->name('live.update-status');
    Route::get('/live-auctions', [App\Http\Controllers\Admin\ListingController::class, 'liveAuctions'])->name('live-auctions.index');
    Route::get('/live-auctions/create', [App\Http\Controllers\Admin\ListingController::class, 'createLiveAuction'])->name('live-auctions.create');
    Route::get('/live-auctions/setup', [App\Http\Controllers\Admin\ListingController::class, 'setupLiveAuction'])->name('live-auctions.setup');
    Route::post('/live-auctions/setup', [App\Http\Controllers\Admin\ListingController::class, 'launchLiveAuction'])->name('live-auctions.launch');
    Route::get('/live-auctions/session/{session}/edit', [App\Http\Controllers\Admin\ListingController::class, 'editLiveAuctionSession'])->name('live-auctions.session.edit');
    Route::match(['put', 'patch'], '/live-auctions/session/{session}', [App\Http\Controllers\Admin\ListingController::class, 'updateLiveAuctionSession'])->name('live-auctions.session.update');
    Route::get('/live-auctions/room', [App\Http\Controllers\Admin\ListingController::class, 'liveAuctionRoom'])->name('live-auctions.room');
    Route::patch('/live-auctions/session/{session}/close', [App\Http\Controllers\Admin\ListingController::class, 'closeLiveAuctionSession'])->name('live-auctions.session.close');
    Route::patch('/live-auctions/{id}/start', [App\Http\Controllers\Admin\ListingController::class, 'startLiveAuction'])->name('live-auctions.start');
    Route::patch('/live-auctions/{id}/end', [App\Http\Controllers\Admin\ListingController::class, 'endLiveAuction'])->name('live-auctions.end');
    Route::patch('/live-auctions/{id}/close', [App\Http\Controllers\Admin\ListingController::class, 'closeLiveAuction'])->name('live-auctions.close');
    Route::patch('/live-auctions/{id}/award', [App\Http\Controllers\Admin\ListingController::class, 'awardLiveAuction'])->name('live-auctions.award');
    Route::get('/listings', [App\Http\Controllers\Admin\ListingController::class, 'index'])->name('listings.index');
    Route::resource('listings', App\Http\Controllers\Admin\ListingController::class)->except(['index'])->names('listings');
    Route::patch('/listings/{id}/status', [App\Http\Controllers\Admin\ListingController::class, 'updateStatus'])->name('listings.update-status');
    Route::post('/listings/{id}/approve-edit', [App\Http\Controllers\Admin\ListingController::class, 'approveEdit'])->name('listings.approve-edit');

    // Unified Category Management (Refactored to legacy system)
    Route::resource('categories', App\Http\Controllers\Admin\AuctionCategoryController::class)->names('categories');
    Route::resource('dynamic-fields', App\Http\Controllers\Admin\DynamicFieldController::class)->names('dynamic-fields');

    // Content Management
    Route::resource('sliders', App\Http\Controllers\Admin\SliderController::class)->names('sliders');
    Route::resource('faqs', App\Http\Controllers\Admin\FaqQuestionController::class)->names('faqs');
    Route::resource('blogs', App\Http\Controllers\Admin\BlogController::class)->names('blogs');

    // System Settings
    Route::resource('master-settings', App\Http\Controllers\Admin\MasterSettingController::class)->names('master-settings');
    Route::resource('currencies', App\Http\Controllers\Admin\CurrencyController::class)
        ->only(['index', 'create', 'store', 'edit', 'update', 'destroy'])
        ->names('currencies');
    Route::resource('locations', App\Http\Controllers\Admin\LocationController::class)->names('locations');
    Route::get('/languages', [App\Http\Controllers\Admin\LanguageController::class, 'index'])->name('languages.index');
    Route::post('/languages', [App\Http\Controllers\Admin\LanguageController::class, 'store'])->name('languages.store');
    Route::patch('/languages/{language}/toggle-status', [App\Http\Controllers\Admin\LanguageController::class, 'toggleStatus'])->name('languages.toggle-status');
    Route::get('/languages/{language}/edit', [App\Http\Controllers\Admin\LanguageController::class, 'edit'])->name('languages.edit');
    Route::put('/languages/{language}/translations', [App\Http\Controllers\Admin\LanguageController::class, 'updateTranslations'])->name('languages.update-translations');

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
