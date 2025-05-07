<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;

// Public routes
Route::post('/register', [AuthController::class, 'register']); // User registration
Route::post('/login', [AuthController::class, 'login']); // User login
Route::get('/products', [ProductController::class, 'index']); // Fetch all products
Route::get('/products/{product}', [ProductController::class, 'show']); // Fetch a single product by ID

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Authentication routes
    Route::post('/logout', [AuthController::class, 'logout']); // User logout
    Route::get('/auth/me', [AuthController::class, 'me']); // Fetch authenticated user details
    Route::get('/user', [AuthController::class, 'user']); // Fetch user details

    // User profile routes
    Route::prefix('user')->group(function () {
        Route::get('/profile', [UserController::class, 'profile']); // Fetch user profile
        Route::put('/profile', [UserController::class, 'updateProfile']); // Update user profile
    });

    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::get('/users', [AdminController::class, 'index']); // Fetch all users
        Route::post('/users', [AdminController::class, 'store']); // Create a new user
        Route::put('/users/{user}', [AdminController::class, 'update']); // Update a user
        Route::delete('/users/{user}', [AdminController::class, 'destroy']); // Delete a user
        Route::get('/orders', [OrderController::class, 'index']); // Fetch all orders for admin
    });

    // Supplier routes
    Route::prefix('supplier')->group(function () {
        Route::get('/products', [ProductController::class, 'supplierProducts']); // Supplier-specific products
        Route::get('/products/{product}', [ProductController::class, 'show']); // Fetch a single product by ID
        Route::post('/products', [ProductController::class, 'store']); // Add a new product
        Route::put('/products/{product}', [ProductController::class, 'update']); // Update a product
        Route::delete('/products/{product}', [ProductController::class, 'destroy']); // Delete a product
        Route::post('/clear-cart', [CartController::class, 'clearCartBySupplier']); // Clear cart by supplier
    });

    // Cart routes
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']); // View cart items
        Route::post('/add', [CartController::class, 'addItem']); // Add item to cart
        Route::put('/items/{item}', [CartController::class, 'updateItem']); // Update cart item
        Route::delete('/items/{item}', [CartController::class, 'removeItem']); // Remove cart item
        Route::delete('/', [CartController::class, 'clearCart']); // Clear entire cart
    });

    // Order routes
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']); // View all orders
        Route::get('/{order}', [OrderController::class, 'show']); // View a specific order
        Route::post('/', [OrderController::class, 'store']); // Place a new order
        Route::put('/{order}/status', [OrderController::class, 'updateStatus']); // Update order status
    });
});