<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PatientController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// UserController
Route::post('/user/add', [UserController::class, 'addUser']);
Route::put('/user/{id}/edit', [UserController::class, 'updateUser']);
Route::delete('/user/{id}/delete', [UserController::class, 'deleteUser']);
Route::post('/user/login', [UserController::class, 'loginUser']);
Route::get('user/patient/list', [UserController::class, 'getPatients']);
Route::get('user/doctor/list', [UserController::class, 'getDoctors']);
Route::get('user/receptionist/list', [UserController::class, 'getReceptionists']);

// PatientController
Route::post('/patient/add', [PatientController::class, 'addPatient']);
Route::put('/patient/{id}/edit', [PatientController::class, 'updatePatient']);
Route::delete('/patient/{id}/delete', [PatientController::class, 'deletePatient']);
Route::get('/patient/show', [PatientController::class, 'showPatient']);
Route::get('/patient/list', [PatientController::class, 'getPatients']);

// DoctorController
Route::post('/doctor/add', [DoctorController::class, 'addDoctor']);
Route::put('/doctor/{id}/edit', [DoctorController::class, 'updateDoctor']);
Route::delete('/doctor/{id}/delete', [DoctorController::class, 'deleteDoctor']);
Route::get('/doctor/show', [DoctorController::class, 'showDoctor']);
Route::get('/doctor/list', [DoctorController::class, 'getDoctors']);

// AppointmentController
Route::get('/appointment/list', [AppointmentController::class, 'listAppointments']);
Route::post('/appointment/book', [AppointmentController::class, 'bookAppointment']);
Route::get('/appointment/show', [AppointmentController::class, 'showAppointments']);
Route::put('/appointment/{id}/edit', [AppointmentController::class, 'updateAppointment']);
Route::put('/appointment/{id}/cancel', [AppointmentController::class, 'cancelAppointment']);

// MedicalRecordController
Route::get('/medicalRecord/list', [MedicalRecordController::class, 'getMedicalRecords']);
Route::post('/medicalRecord/add', [MedicalRecordController::class, 'addMedicalRecord']);
Route::put('/medicalRecord/{id}/edit', [MedicalRecordController::class, 'updateMedicalRecord']);
Route::get('/medicalRecord/{patient_id}/show', [MedicalRecordController::class, 'showMedicalRecords']);