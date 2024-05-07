<?php

use \App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FinanceConstroller;
use App\Http\Controllers\Api\ImageController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\TaskConstroller;
use App\Http\Controllers\Api\TuriConstroller;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\ReportController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::apiResource('/users', UserController::class);
    Route::apiResource('/propertys', PropertyController::class);
    Route::apiResource('/reservations', ReservationController::class);
    Route::get('/tasks/filtered-by-property/{propertyId}', [TaskConstroller::class, 'getByPropertyId']);
    Route::apiResource('/tasks', TaskConstroller::class);
    Route::apiResource('/turi', TuriConstroller::class);
    Route::delete('/turi/{property_id}/{user_id}', [TuriConstroller::class, 'destroy']);
    Route::apiResource('/images', ImageController::class);
    Route::get('/finances/by-date-range', [FinanceConstroller::class, 'fetchByDateRange']); 
    Route::get('/finances/filtered-by-property/{propertyId}', [FinanceConstroller::class, 'getByPropertyId']); 
    Route::apiResource('/finances', FinanceConstroller::class);
    
    Route::get('/users-not-associated/{property_id}', [UserController::class, 'getUsersNotAssociated']);
    //Route::match(['get', 'post'], '/generate-pdf-report', [ReportController::class, 'generatePdfReport'])->name('generate.pdf.report');
    Route::put('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead']);
    Route::apiResource('/notifications', NotificationController::class);
    
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::match(['get','post'],'generate-pdf', [App\Http\Controllers\PDFController::class, 'generatePDF']);
Route::match(['get', 'post'], '/generate-pdf-report', [ReportController::class, 'generatePdfReport'])->name('generate.pdf.report');

