<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MedicalRecordController extends Controller
{
    // Admin: Can view all medical records.
    public function getMedicalRecords()
    {
        $medicalRecords = MedicalRecord::all();

        return response()->json([
            'status' => 200,
            'medicalRecords' => $medicalRecords
        ]);
    }

    // Doctor: Can add and update patient medical records.
    public function addMedicalRecord(Request $request)
    {
        // Validate inputs
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|integer|exists:patients,id',
            'doctor_id' => 'required|integer|exists:doctors,id',
            'visit_date' => 'required|date',
            'diagnosis' => 'required|string',
            'treatment' => 'required|string',
            'notes' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages()
            ]);
        }

        // Add medical records
        MedicalRecord::create([
            'patient_id' => $request->patient_id,
            'doctor_id' => $request->doctor_id,
            'visit_date' => $request->visit_date,
            'diagnosis' => $request->diagnosis,
            'treatment' => $request->treatment,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'status' => 201,
            'message' => 'Medical Record successfully created.'
        ]);
    }

    public function updateMedicalRecord(Request $request, $id)
    {
        $medicalRecord = MedicalRecord::find($id);

        if (!$medicalRecord) {
            return response()->json([
                'status' => 404,
                'message' => 'Medical Record not found'
            ]);
        }

        // Validate inputs
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|integer|exists:patients,id',
            'doctor_id' => 'required|integer|exists:doctors,id',
            'visit_date' => 'required|date',
            'diagnosis' => 'required|string',
            'treatment' => 'required|string',
            'notes' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages()
            ]);
        }

        // Update medical records
        $medicalRecord->update([
            'patient_id' => $request->patient_id,
            'doctor_id' => $request->doctor_id,
            'visit_date' => $request->visit_date,
            'diagnosis' => $request->diagnosis,
            'treatment' => $request->treatment,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Medical Record successfully updated.'
        ]);
    }

    public function showMedicalRecords($patient_id)
    {
        $medicalRecords = MedicalRecord::where('patient_id', $patient_id)->get();

        if ($medicalRecords->isEmpty()) {
            return response()->json([
                'status' => 404,
                'message' => 'Medical Records not found'
            ]);
        }

        return response()->json([
            'status' => 200,
            'medicalRecords' => $medicalRecords
        ]);
    }
}
