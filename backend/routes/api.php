<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::post("/login", AuthController::class . "@login");
Route::post("/register", AuthController::class . "@register");
Route::post("/login/admin", "App\Http\Controllers\AuthController@login_admin");

Route::middleware('admin.api')->prefix('/admin')->group(function() {
    Route::get("/kandidat", "App\Http\Controllers\AdminController@get_all_kandidat");
    Route::get("/kandidat/{id}", "App\Http\Controllers\AdminController@get_kandidat");
    Route::post("/kandidat", "App\Http\Controllers\AdminController@create_kandidat");
    Route::post("/kandidat/{id}", "App\Http\Controllers\AdminController@update_kandidat");
    Route::delete("/kandidat/{id}", "App\Http\Controllers\AdminController@delete_kandidat");

    Route::get("/user", "App\Http\Controllers\AdminController@get_all_user");
    Route::get("/user/{id}", "App\Http\Controllers\AdminController@get_user");
    Route::post("/user", "App\Http\Controllers\AdminController@create_user");
    Route::put("/user/{id}", "App\Http\Controllers\AdminController@update_user");
    Route::delete("/user/{id}", "App\Http\Controllers\AdminController@delete_user");

    Route::get("/vote", "App\Http\Controllers\AdminController@get_all_vote");
    Route::get("/stats", "App\Http\Controllers\AdminController@get_stats");
});

Route::middleware('user.api')->group(function() {
    Route::get("/kandidat", "App\Http\Controllers\UserController@get_all_kandidat");
    Route::get("/kandidat/{id}", "App\Http\Controllers\UserController@get_kandidat");

    Route::post("/vote/{id}", "App\Http\Controllers\UserController@vote");
});