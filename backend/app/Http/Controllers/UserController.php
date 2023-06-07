<?php

namespace App\Http\Controllers;

use App\Models\Kandidat;
use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function get_all_kandidat(Request $request)
    {
        $bearer = $request->bearerToken();
        $decode = JWT::decode($bearer, new Key(env("JWT_SECRET"), 'HS256'));

        $kandidat = Kandidat::with("votes")->get();

        foreach ($kandidat as $k) {
            $k["jumlah_vote"] = count($k->votes);
            $k['foto_kandidat'] = url($k['foto_kandidat']);

            unset($k["votes"]);
        }

        // check if user already vote
        $user = User::find($decode->id);
        $vote = $user->votes()->where("user_id", $user->id)->first();

        return response()->json([
            "success" => true,
            "message" => "Berhasil mendapatkan semua kandidat",
            "data" => [
                "kandidat" => $kandidat,
                "already_vote" => $vote ? true : false,
            ]
        ]);
    }

    public function get_kandidat(Request $request, $id)
    {
        $bearer = $request->bearerToken();
        $decode = JWT::decode($bearer, new Key(env("JWT_SECRET"), 'HS256'));

        $kandidat = Kandidat::with("votes")->find($id);

        if (!$kandidat) return response()->json([
            "success" => false,
            "message" => "Kandidat tidak ditemukan",
        ]);

        $kandidat["jumlah_vote"] = count($kandidat->votes);

        // check if user already vote
        $user = User::find($decode->id);
        $vote = $user->votes()->where("kandidat_id", $kandidat->id)->first();
        if ($vote)
            $kandidat["already_vote"] = true;
        else
            $kandidat["already_vote"] = false;

        unset($kandidat["votes"]);

        return response()->json([
            "success" => true,
            "message" => "Berhasil mendapatkan kandidat",
            "data" => $kandidat,
        ]);
    }

    public function vote(Request $request, $id)
    {
        $bearer = $request->bearerToken();
        $decode = JWT::decode($bearer, new Key(env("JWT_SECRET"), 'HS256'));

        $user = User::find($decode->id);
        $kandidat = Kandidat::find($id);

        if (!$kandidat) return response()->json([
            "success" => false,
            "message" => "Kandidat tidak ditemukan",
        ], 404);

        // check if already vote
        $vote = $user->votes()->where("kandidat_id", $kandidat->id)->first();
        if ($vote) return response()->json([
            "success" => false,
            "message" => "Anda sudah melakukan vote",
        ], 400);

        $vote = $user->votes()->create([
            "kandidat_id" => $kandidat->id,
            "user_id" => $user->id,
        ]);

        return response()->json([
            "success" => true,
            "message" => "Berhasil melakukan vote",
            "data" => $vote,
        ]);
    }
}