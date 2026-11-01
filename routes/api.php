<?php

use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BuyerRequestController;
use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\Property\LocationController;
use App\Http\Controllers\Api\V1\Property\PropertyCategoryController;
use App\Http\Controllers\Api\V1\Property\PropertyController;
use App\Http\Controllers\Api\V1\Renovation\RenovationCategoryController;
use App\Http\Controllers\Api\V1\Renovation\RenovationController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/health', HealthController::class);

    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/auth/validate-reset-otp', [AuthController::class, 'validateResetOtp']);
    Route::post('/auth/reset-password-phone', [AuthController::class, 'resetPasswordWithPhone']);
    Route::post('/auth/send-otp', [AuthController::class, 'sendOtp']);
    Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::post('/auth/session-link', [AuthController::class, 'sessionLink']);

        Route::get('/notifications', [AuthController::class, 'notifications']);
        Route::post('/notifications/read-all', [AuthController::class, 'markAllNotificationsRead']);
        Route::post('/notifications/read/{id}', [AuthController::class, 'markNotificationRead']);
        Route::delete('/notifications/{id}', [AuthController::class, 'deleteNotification']);

        // Buyer Requests (reverse marketplace)
        Route::get('/buyer-requests', [BuyerRequestController::class, 'index']);
        Route::post('/buyer-requests', [BuyerRequestController::class, 'store']);
        Route::get('/buyer-requests/matched', [BuyerRequestController::class, 'matched']);
        Route::get('/buyer-requests/{buyerRequest}', [BuyerRequestController::class, 'show']);
        Route::put('/buyer-requests/{buyerRequest}', [BuyerRequestController::class, 'update']);
        Route::post('/buyer-requests/{buyerRequest}/close', [BuyerRequestController::class, 'close']);
        Route::post('/buyer-requests/{buyerRequest}/offers', [BuyerRequestController::class, 'storeOffer']);
        Route::post('/buyer-requests/{buyerRequest}/offers/{offer}/accept', [BuyerRequestController::class, 'acceptOffer']);
        Route::post('/buyer-requests/{buyerRequest}/offers/{offer}/reject', [BuyerRequestController::class, 'rejectOffer']);
        Route::put('/buyer-request-offers/{offer}', [BuyerRequestController::class, 'updateOffer']);
        Route::delete('/buyer-request-offers/{offer}', [BuyerRequestController::class, 'destroyOffer']);
        Route::get('/seller/buyer-request-preferences', [BuyerRequestController::class, 'preferences']);
        Route::put('/seller/buyer-request-preferences', [BuyerRequestController::class, 'savePreferences']);

        // Chat (Sanctum) — used by property/renovation frontends before bridging to main /chat
        Route::post('/chat/initiate', [ChatController::class, 'initiate']);
    });

    // Property vertical routes
    Route::get('/properties', [PropertyController::class, 'index']);
    Route::get('/properties/featured', [PropertyController::class, 'featured']);
    Route::get('/properties/sitemap-slugs', [PropertyController::class, 'sitemapSlugs']);
    Route::get('/properties/{slug}', [PropertyController::class, 'show']);
    Route::get('/properties/{slug}/related', [PropertyController::class, 'related']);
    Route::get('/property-categories', [PropertyCategoryController::class, 'index']);

    // Home Renovation & Builder vertical routes
    Route::get('/renovations', [RenovationController::class, 'index']);
    Route::get('/renovations/featured', [RenovationController::class, 'featured']);
    Route::get('/renovations/sitemap-slugs', [RenovationController::class, 'sitemapSlugs']);
    Route::get('/renovations/{slug}', [RenovationController::class, 'show']);
    Route::get('/renovations/{slug}/related', [RenovationController::class, 'related']);
    Route::get('/renovation-categories', [RenovationCategoryController::class, 'index']);

    // Location routes (Shared)
    Route::get('/locations/countries', [LocationController::class, 'countries']);
    Route::get('/locations/states/{countryId}', [LocationController::class, 'states']);
    Route::get('/locations/cities/{stateId}', [LocationController::class, 'cities']);
});
