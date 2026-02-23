<?php

use App\Http\Controllers\Api\V1\Admin\AdminAnalyticsController;
use App\Http\Controllers\Api\V1\Admin\AdminCategoryController;
use App\Http\Controllers\Api\V1\Admin\AdminCustomerController;
use App\Http\Controllers\Api\V1\Admin\AdminOrderController;
use App\Http\Controllers\Api\V1\Admin\AdminProductCrudController;
use App\Http\Controllers\Api\V1\Admin\AdminStatsController;
use App\Http\Controllers\Api\V1\Admin\AdminSettingController;
use App\Http\Controllers\Api\V1\Admin\DashboardSettingsController;
use App\Http\Controllers\Api\V1\Admin\AdminUploadController;
use App\Http\Controllers\Api\V1\AnalyticsController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\SettingsPublicController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
        });
    });

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/featured', [ProductController::class, 'featured']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);

    Route::post('/analytics/page-view', [AnalyticsController::class, 'storePageView']);
    Route::post('/analytics/event', [AnalyticsController::class, 'storeEvent']);
    Route::post('/track-visit', [AnalyticsController::class, 'storePageView']);
    Route::get('/settings/public', [SettingsPublicController::class, 'show']);

    Route::prefix('admin')
        ->middleware(['auth:sanctum', 'admin'])
        ->group(function () {
            Route::get('/stats', [AdminStatsController::class, 'index']);
            Route::apiResource('products', AdminProductCrudController::class);
            Route::apiResource('categories', AdminCategoryController::class);
            Route::post('/uploads/products', [AdminUploadController::class, 'storeProductImage']);
            Route::post('/upload', [AdminUploadController::class, 'storeProductImage']);

            Route::get('/orders', [AdminOrderController::class, 'index']);
            Route::get('/orders/{order}', [AdminOrderController::class, 'show']);
            Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus']);

            Route::get('/customers', [AdminCustomerController::class, 'index']);
            Route::get('/analytics/overview', [AdminAnalyticsController::class, 'overview']);
            Route::get('/analytics/top-products', [AdminAnalyticsController::class, 'topProducts']);
            Route::get('/dashboard', [AdminAnalyticsController::class, 'dashboard']);
            Route::get('/settings', [AdminSettingController::class, 'show']);
            Route::put('/settings', [AdminSettingController::class, 'update']);

            Route::prefix('dashboard')->group(function () {
                Route::get('/settings', [DashboardSettingsController::class, 'show']);
                Route::put('/settings', [DashboardSettingsController::class, 'update']);
            });
        });
});
