<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\Property\LocationController;
use App\Http\Controllers\Api\V1\Property\PropertyCategoryController;
use App\Http\Controllers\Api\V1\Property\PropertyController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/health', HealthController::class);

    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
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
    });

    Route::get('/properties', [PropertyController::class, 'index']);
    Route::get('/properties/featured', [PropertyController::class, 'featured']);
    Route::get('/properties/sitemap-slugs', [PropertyController::class, 'sitemapSlugs']);
    Route::get('/properties/{slug}', [PropertyController::class, 'show']);
    Route::get('/properties/{slug}/related', [PropertyController::class, 'related']);

    Route::get('/property-categories', [PropertyCategoryController::class, 'index']);

    Route::get('/locations/countries', [LocationController::class, 'countries']);
    Route::get('/locations/states/{countryId}', [LocationController::class, 'states']);
    Route::get('/locations/cities/{stateId}', [LocationController::class, 'cities']);
});
