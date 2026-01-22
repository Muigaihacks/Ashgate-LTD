<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ExpertController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public routes
Route::post('/applications', [ApplicationController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Password setup routes (for new users)
Route::post('/validate-password-token', [AuthController::class, 'validatePasswordToken']);
Route::post('/set-password', [AuthController::class, 'setPassword']);

// Public property routes (read-only for listings)
Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{id}', [PropertyController::class, 'show']);
Route::get('/properties/categories/counts', [PropertyController::class, 'categories']);
Route::get('/properties/locations/list', [PropertyController::class, 'locations']);

// Public expert routes
Route::get('/experts', [ExpertController::class, 'index']);
Route::get('/experts/{id}', [ExpertController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Application routes (for users to view their own application)
    Route::get('/my-application', [ApplicationController::class, 'index']);
    
    // Property management routes
    Route::post('/properties', [PropertyController::class, 'store']);
    Route::put('/properties/{id}', [PropertyController::class, 'update']);
    Route::delete('/properties/{id}', [PropertyController::class, 'destroy']);
    
    // Dashboard routes
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/properties', [DashboardController::class, 'properties']);
});
