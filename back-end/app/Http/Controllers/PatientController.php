<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PatientController extends Controller
{
    public function addPatient(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'date_of_birth' => 'required|date',
            'gender' => 'required|string|in:Male,Female,Other',
            'address' => 'required|string',
            'phone' => 'required|string',
            'email' => 'required|email:rfc,dns',
            'emergency_contact' => 'required|string',
            'medical_history' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages()
            ]);
        }

        Patient::create($request->all());

        return response()->json([
            'status' => 201,
            'message' => 'Patient added successfully'
        ]);
    }

    public function updatePatient(Request $request, $id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json([
                'status' => 404,
                'message' => 'Patient not found'
            ]);
        }

        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'date_of_birth' => 'required|date',
            'gender' => 'required|string|in:Male,Female,Other',
            'address' => 'required|string',
            'phone' => 'required|string',
            'email' => 'required|email:rfc,dns',
            'emergency_contact' => 'required|string',
            'medical_history' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages()
            ]);
        }

        $patient->update($request->all());

        return response()->json([
            'status' => 200,
            'message' => 'Patient updated successfully'
        ]);
    }

    public function deletePatient($id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json([
                'status' => 404,
                'message' => 'Patient not found'
            ]);
        }

        $patient->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Patient detail deleted successfully'
        ]);
    }


    public function showPatient(Request $request)
    {
        $patient = Patient::where('email', $request->email)->get();

        if (!$patient) {
            return response()->json([
                'status' => 404,
                'message' => 'Patient not found'
            ]);
        }

        return response()->json([
            'status' => 200,
            'patient' => $patient
        ]);
    }

    public function getPatients()
    {
        $patients = Patient::all();

        return response()->json([
            'status' => 200,
            'patients' => $patients
        ]);
    }
}
