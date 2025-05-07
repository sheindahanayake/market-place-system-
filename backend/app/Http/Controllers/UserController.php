<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // Fetch user profile
    public function profile()
    {
        $user = Auth::user();

        if ($user) {
            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
            ]);
        }

        return response()->json(['message' => 'User not found'], 404);
    }

    // Update user profile
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        if ($user) {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            ]);

            $user->update($validatedData);

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'message' => 'Profile updated successfully',
            ]);
        }

        return response()->json(['message' => 'User not found'], 404);
    }
}