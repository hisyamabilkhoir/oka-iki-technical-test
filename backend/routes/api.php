<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Mini ERP Multi-Tenant SaaS
| PT Oka Iki Indonesia Technical Test
|--------------------------------------------------------------------------
*/

// Public Authentication
Route::post('/login', [AuthController::class, 'login']);

// Authenticated Tenant-Scoped Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth & Session
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Products Module
    Route::apiResource('products', ProductController::class);

    // Transactions Module
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::get('/transactions/{transaction}', [TransactionController::class, 'show']);
    Route::delete('/transactions/{transaction}', [TransactionController::class, 'destroy']);

    // Reports Module (Strictly protected by role:owner middleware)
    Route::middleware('role:owner')->group(function () {
        Route::get('/reports', [ReportController::class, 'index']);
    });
});
