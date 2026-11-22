<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\DashboardController;
use Illuminate\Support\Facades\Route;

// Public website
Route::get('/content', [ContentController::class, 'show']);
Route::post('/inquiries', [DashboardController::class, 'inquiry'])->middleware('throttle:6,1');

// Dashboard sign-in
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/content', [ContentController::class, 'admin']);
    Route::put('/content', [ContentController::class, 'update']);
    Route::post('/sync/youtube', [ContentController::class, 'syncYoutube'])->middleware('throttle:10,1');
    Route::post('/sync/google', [ContentController::class, 'syncGoogle'])->middleware('throttle:10,1');
    Route::get('/places', [ContentController::class, 'places'])->middleware('throttle:20,1');

    Route::get('/dashboard', [DashboardController::class, 'show']);
    Route::put('/dashboard', [DashboardController::class, 'update']);
});
