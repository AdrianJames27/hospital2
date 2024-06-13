<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class DoctorController extends Controller
{
    // Function to add a new doctor
    public function addDoctor(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'specialization' => 'required|string|max:255',
            'license_number' => 'required|string|max:255|unique:doctors',
            'phone' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:doctors',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages()
            ]);
        }

        Doctor::create($request->all());

        return response()->json([
            'status' => 201,
            'message' => 'Doctor added successfully'
        ]);
    }

    // Function to update an existing doctor
    public function updateDoctor(Request $request, $id)
    {
        $doctor = Doctor::find($id);

        if (!$doctor) {
            return response()->json([
                'status' => 404,
                'message' => 'Doctor not found'
            ]);
        }

        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'specialization' => 'sometimes|required|string|max:255',
            'license_number' => [
                'sometimes', 
                'required', 
                'string', 
                'max:255', 
                Rule::unique('doctors')->ignore($doctor->id)
            ],
            'phone' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes', 
                'required', 
                'string', 
                'email', 
                'max:255', 
                Rule::unique('doctors')->ignore($doctor->id)
            ]
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages()
            ]);
        }

        $doctor->update($request->all());

        return response()->json([
            'status' => 200,
            'message' => 'Doctor updated successfully'
        ]);
    }

    // Function to delete a doctor
    public function deleteDoctor($id)
    {
        $doctor = Doctor::find($id);

        if (!$doctor) {
            return response()->json([
                'status' => 404,
                'message' => 'Doctor not found'
            ]);
        }

        $doctor->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Doctor deleted successfully'
        ]);
    }

    // Function to view all doctors
    public function getDoctors()
    {
        $doctors = Doctor::all();

        return response()->json([
            'status' => 200,
            'doctors' => $doctors
        ]);
    }

    public function showDoctor(Request $request)
    {
        $doctor = Doctor::where('email', $request->email)->get();

        if (!$doctor) {
            return response()->json([
                'status' => 404,
                'message' => 'Doctor not found'
            ]);
        }

        return response()->json([
            'status' => 200,
            'doctor' => $doctor
        ]);
    }
}

