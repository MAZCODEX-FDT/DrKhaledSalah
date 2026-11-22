<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $r)
    {
        $data = $r->validate(['email' => 'required|email', 'password' => 'required|string']);
        $user = User::where('email', $data['email'])->first();
        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Wrong email or password'], 422);
        }
        // One token per sign-in, valid for 12 hours (config/sanctum.php → expiration)
        return ['token' => $user->createToken('dashboard')->plainTextToken, 'user' => ['name' => $user->name, 'email' => $user->email]];
    }

    public function me(Request $r)
    {
        return ['name' => $r->user()->name, 'email' => $r->user()->email];
    }

    public function logout(Request $r)
    {
        $r->user()->currentAccessToken()->delete();

        return response()->noContent();
    }
}
