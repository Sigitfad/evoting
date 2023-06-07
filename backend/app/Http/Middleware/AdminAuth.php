<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Admin;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AdminAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            $token = $request->bearerToken();
            $decode = JWT::decode($token, new Key(env("JWT_SECRET"), 'HS256'));

            $admin = Admin::find($decode->id);
            if (!$admin) return response()->json([
                "message" => "Unauthorized",
            ], 401);

            return $next($request);
        } catch (\Throwable $err) {
            return response()->json([
                "message" => "Unauthorized",
            ], 401);
        }
    }
}