<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function addUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email:rfc,dns|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:admin,doctor,receptionist,patient'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages()
            ]);
        }

        // hash password
        $hashed = Hash::make($request->password);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $hashed,
            'role' => $request->role
        ]);

        return response()->json([
            'status' => 201,
            'message' => 'User created successfully'
        ]);
    }

    public function updateUser(Request $request, $id) {
        $user = User::find($id);
    
        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found'
            ]);
        }
    
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email:rfc,dns',
                Rule::unique('users')->ignore($user->id),
            ],
            'role' => 'required|string|in:admin,doctor,receptionist,patient'
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages()
            ]);
        }
    
        // Update user attributes
        $user->name = $request->name;
        $user->email = $request->email;
        $user->role = $request->role;
    
        // Only hash and update password if a new password is provided
        if ($request->filled('password')) {
            $validator = Validator::make($request->all(), [
                'password' => 'required|string|min:8', // Make password required only if present
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 422,
                    'errors' => $validator->messages()
                ]);
            }

            $user->password = Hash::make($request->password);
        }
    
        $user->save();
    
        return response()->json([
            'status' => 200,
            'message' => 'User successfully updated'
        ]);
    }    

    public function deleteUser($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found'
            ]);
        }

        $user->delete();

        return response()->json([
            'status' => 200,
            'message' => 'User successfully removed'
        ]);
    }

    public function loginUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'email:rfc,dns',
            'password' => 'min:8'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages()
            ]);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status' => 422,
                'message' => 'Wrong Email'
            ]);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 422,
                'message' => 'Wrong Password'
            ]);
        }

        return response()->json([
            'status' => 200,
            'message' => 'User successfully logged in',
            'user' => $user
        ]);
    }

    public function getPatients()
    {
        $patients = User::where('role', 'patient')->get();

        return response()->json([
            'status' => 200,
            'patients' => $patients
        ]);
    }

    public function getDoctors()
    {
        $doctors = User::where('role', 'doctor')->get();

        return response()->json([
            'status' => 200,
            'doctors' => $doctors
        ]);
    }

    public function getReceptionists()
    {
        $receptionist = User::where('role', 'receptionist')->get();

        return response()->json([
            'status' => 200,
            'receptionists' => $receptionist
        ]);
    }
}
