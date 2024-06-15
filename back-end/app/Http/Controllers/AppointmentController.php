<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends Controller
{
    public function listAppointments()
    {
        $appointments = Appointment::all();

        return response()->json([
            'status' => 200,
            'appointments' => $appointments
        ]);
    }

    public function bookAppointment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'required|exists:doctors,id',
            'appointment_date' => 'required|date_format:Y-m-d H:i:s',
            'status' => 'required|in:scheduled,completed,cancelled',
            'reason' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors()
            ]);
        }

        Appointment::create([
            'patient_id' => $request->patient_id,
            'doctor_id' => $request->doctor_id,
            'appointment_date' => $request->appointment_date,
            'status' => $request->status,
            'reason' => $request->reason,
        ]);

        return response()->json([
            'status' => 201,
            'message' => 'Appointment book successfully'
        ]);
    }

    public function showAppointments(Request $request)
    {
        $appointments = null;
        $patientId = $request->input('patient_id');
        $doctorId = $request->input('doctor_id');

        // Check if patient_id or doctor_id is provided in the request
        if ($patientId) {
            // Handle patient appointments
            $appointments = Appointment::where('patient_id', $patientId)->get();
        } elseif ($doctorId) {
            // Handle doctor appointments
            $appointments = Appointment::where('doctor_id', $doctorId)->get();
        } else {
            // No patient_id or doctor_id provided
            return response()->json([
                'status' => 422,
                'message' => 'Missing patient_id or doctor_id in the request'
            ]);
        }

        if ($appointments->isEmpty() || $appointments == null) {
            return response()->json([
                'status' => 404,
                'message' => 'No appointments found'
            ]);
        }

        return response()->json([
            'status' => 200,
            'appointments' => $appointments
        ]);
    }


    public function updateAppointment(Request $request, $id)
    {
        $appointment = Appointment::find($id);

        if ($appointment) {
            $validator = Validator::make($request->all(), [
                'appointment_date' => 'required|date_format:Y-m-d H:i:s',
                'status' => 'required|in:scheduled,completed,cancelled',
                'reason' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 422,
                    'errors' => $validator->messages()
                ]);
            }

            $appointment->update([
                'appointment_date' => $request->appointment_date,
                'status' => $request->status,
                'reason' => $request->reason
            ]);
            
            return response()->json([
                'status' => 200,
                'message' => 'Appointment updated successfully'
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Appointment not found'
            ]);
        }
    }

    public function cancelAppointment($id)
    {
        $appointment = Appointment::find($id);

        if ($appointment) {
            $appointment->update(['status' => 'cancelled']);

            return response()->json([
                'status' => 200,
                'message' => 'Appointment cancelled successfully'
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Appointment not found'
            ]);
        }
    }
}
