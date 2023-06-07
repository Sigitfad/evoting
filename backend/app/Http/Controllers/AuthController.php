<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only(["nik", "password"]);

        if (!$token = auth()->attempt($credentials)) {
            return response()->json([
                "message" => "Unauthorized",
            ], 401);
        }

        $payload = [
            'id' => auth()->user()->id,
            'role' => 'user',
            'iat' => time(),
            // 30 days
            'exp' => time() + (60 * 60 * 24 * 30),
        ];

        $token = JWT::encode($payload, env('JWT_SECRET'), 'HS256');

        return response()->json([
            "message" => "Success",
            "data" => [
                "token" => $token,
                "user" => auth()->user(),
            ],
        ]);
    }

    public function register(Request $request) {
        $v = Validator::make($request->all(), [
            "nik" => "required|unique:users",
            "name" => "required|string",
            "no_hp" => "required|string",
            "password" => "required|string",
            "alamat" => "required|string",
        ]);

        if ($v->fails()) {
            $errs = $v->errors()->all();
            $err = join(", ", $errs);

            return response()->json([
                "message" => "Bad Request",
                "errors" => $err,
            ], 400);
        }
        $user = User::create([
            "nik" => $request->nik,
            "name" => $request->name,
            "no_hp" => $request->no_hp,
            "password" => bcrypt($request->password),
            "alamat" => $request->alamat,
        ]);

        return response()->json([
            "message" => "Success",
            "data" => $user,
        ]);
    }

    public function login_admin(Request $request) {
        $v = Validator::make($request->all(), [
            "email" => "required|email",
            "password" => "required|string",
        ]);

        if ($v->fails()) {
            $errs = $v->errors()->all();
            $err = join(", ", $errs);

            return response()->json([
                "message" => "Bad Request",
                "errors" => $err,
            ], 400);
        }

        $admin = Admin::where("email", $request->email)->first();
        if (!$admin) {
            return response()->json([
                "message" => "Unauthorized",
            ], 401);
        }

        if (!password_verify($request->password, $admin->password)) {
            return response()->json([
                "message" => "Unauthorized",
            ], 401);
        }

        $payload = [
            'id' => $admin->id,
            'role' => 'admin',
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24 * 30),
        ];

        $token = JWT::encode($payload, env('JWT_SECRET'), 'HS256');

        return response()->json([
            "message" => "Success",
            "data" => [
                "token" => $token,
                "admin" => $admin,
            ],
        ]);
    }
}