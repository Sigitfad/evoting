<?php

namespace App\Http\Controllers;

use App\Models\Kandidat;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    public function get_all_kandidat()
    {
        $kandidat = Kandidat::with("votes")->get();
        foreach ($kandidat as $k) {
            $k["jumlah_vote"] = count($k->votes);
            $k['foto_kandidat'] = url($k['foto_kandidat']);

            unset($k["votes"]);
        }

        return response()->json([
            "success" => true,
            "message" => "Berhasil mendapatkan semua kandidat",
            "data" => $kandidat,
        ]);
    }

    public function get_kandidat($id)
    {
        $kandidat = Kandidat::with("votes")->find($id);

        if (!$kandidat) return response()->json([
            "success" => false,
            "message" => "Kandidat tidak ditemukan",
        ], 404);

        return response()->json([
            "success" => true,
            "message" => "Berhasil mendapatkan kandidat",
            "data" => $kandidat,
        ]);
    }

    public function create_kandidat(Request $request)
    {
        $v = Validator::make($request->all(), [
            "nama_ketua" => "required|string",
            "nik_ketua" => "required|string",
            "pendidikan_terakhir_ketua" => "required|string",
            "nama_wakil" => "required|string",
            "nik_wakil" => "required|string",
            "pendidikan_terakhir_wakil" => "required|string",
            "foto_kandidat" => "required|image:jpeg,png,jpg",
            "visi" => "required|string",
            "misi" => "required|string",
        ]);

        if ($v->fails()) {
            $errs = $v->errors()->all();
            $err = join(", ", $errs);

            return response()->json([
                "success" => false,
                "message" => "Gagal membuat kandidat",
                "errors" => $err,
            ], 400);
        }

        $image_kandidat = $request->file("foto_kandidat");
        $image_kandidat_name = time() . "_" . $image_kandidat->getClientOriginalName();
        $image_kandidat->move(public_path('images/kandidat'), $image_kandidat_name);

        try {
            $kandidat = Kandidat::create([
                "nama_ketua" => $request->nama_ketua,
                "nik_ketua" => $request->nik_ketua,
                "pendidikan_terakhir_ketua" => $request->pendidikan_terakhir_ketua,
                "nama_wakil" => $request->nama_wakil,
                "nik_wakil" => $request->nik_wakil,
                "pendidikan_terakhir_wakil" => $request->pendidikan_terakhir_wakil,
                "foto_kandidat" => "images/kandidat/" . $image_kandidat_name, // "images/kandidat/1629781231_1.jpg
                "visi" => $request->visi,
                "misi" => $request->misi,
            ]);

            return response()->json([
                "success" => true,
                "message" => "Berhasil membuat kandidat",
                "data" => $kandidat,
            ]);
        } catch (\Throwable $th) {
            if (file_exists(public_path("images/kandidat/" . $image_kandidat_name))) {
                unlink(public_path("images/kandidat/" . $image_kandidat_name));
            }

            return response()->json([
                "success" => false,
                "message" => "Gagal membuat kandidat",
                "data" => $th->getMessage(),
            ], 500);
        }
    }

    public function update_kandidat(Request $request, $id)
    {
        $kandidat = Kandidat::find($id);

        if (!$kandidat) return response()->json([
            "success" => false,
            "message" => "Kandidat tidak ditemukan",
        ], 404);

        $v = Validator::make($request->all(), [
            "nama_ketua" => "required|string",
            "nik_ketua" => "required|string",
            "pendidikan_terakhir_ketua" => "required|string",
            "nama_wakil" => "required|string",
            "nik_wakil" => "required|string",
            "pendidikan_terakhir_wakil" => "required|string",
            "foto_kandidat" => "nullable|mimes:jpg,jpeg,png",
            "visi" => "required|string",
            "misi" => "required|string",
        ]);

        if ($v->fails()) {
            $errs = $v->errors()->all();
            $err = join(", ", $errs);

            return response()->json([
                "success" => false,
                "message" => "Gagal mengubah kandidat",
                "errors" => $err,
            ], 400);
        }

        $image_kandidat = $request->file("foto_kandidat");
        if ($image_kandidat) {
            $image_kandidat_name = time() . "_" . $image_kandidat->getClientOriginalName();
            $image_kandidat->move("images/kandidat", $image_kandidat_name);

            if (file_exists($request->foto_kandidat)) unlink($request->foto_kandidat);

            $kandidat->update([
                "foto_kandidat" => 'images/kandidat/' . $image_kandidat_name, // <-- add this line
            ]);
        }

        try {
            $kandidat->update([
                "nama_ketua" => $request->nama_ketua,
                "nik_ketua" => $request->nik_ketua,
                "pendidikan_terakhir_ketua" => $request->pendidikan_terakhir_ketua,
                "nama_wakil" => $request->nama_wakil,
                "nik_wakil" => $request->nik_wakil,
                "pendidikan_terakhir_wakil" => $request->pendidikan_terakhir_wakil,
                "visi" => $request->visi,
                "misi" => $request->misi,
            ]);

            return response()->json([
                "success" => true,
                "message" => "Berhasil mengubah kandidat",
                "data" => $kandidat,
            ]);
        } catch (\Throwable $th) {
            if (file_exists($request->foto_kandidat)) unlink($request->foto_kandidat);

            return response()->json([
                "success" => false,
                "message" => "Gagal mengubah kandidat",
                "data" => $th->getMessage(),
            ], 500);
        }
    }

    public function delete_kandidat($id)
    {
        $kandidat = Kandidat::find($id);

        if (!$kandidat) return response()->json([
            "success" => false,
            "message" => "Kandidat tidak ditemukan",
        ], 404);

        try {
            $kandidat->delete();

            return response()->json([
                "success" => true,
                "message" => "Berhasil menghapus kandidat",
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "message" => "Gagal menghapus kandidat",
                "data" => $th->getMessage(),
            ], 500);
        }
    }

    public function get_all_user(Request $request) {
        $user = User::all();

        return response()->json([
            "success" => true,
            "message" => "Berhasil mendapatkan semua user",
            "data" => $user,
        ]);
    }

    public function get_user($id) {
        $user = User::find($id);

        if (!$user) return response()->json([
            "success" => false,
            "message" => "User tidak ditemukan",
        ], 404);

        return response()->json([
            "success" => true,
            "message" => "Berhasil mendapatkan user",
            "data" => $user,
        ]);
    }

    public function create_user(Request $request) {
        $v = Validator::make($request->all(), [
            "name" => "required|string",
            "nik" => "required|string",
            "no_hp" => "required|string",
            "password" => "required|string",
            "alamat" => "required|string",
        ]);

        if ($v->fails()) {
            $errs = $v->errors()->all();
            $err = join(", ", $errs);

            return response()->json([
                "success" => false,
                "message" => "Gagal membuat user",
                "errors" => $err,
            ], 400);
        }

        $user = User::where("nik", $request->nik)->first();
        if ($user) return response()->json([
            "success" => false,
            "message" => "NIK sudah terdaftar",
        ], 400);

        try {
            $user = User::create([
                "name" => $request->name,
                "nik" => $request->nik,
                "no_hp" => $request->no_hp,
                "password" => bcrypt($request->password),
                "alamat" => $request->alamat,
            ]);

            return response()->json([
                "success" => true,
                "message" => "Berhasil membuat user",
                "data" => $user,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "message" => "Gagal membuat user",
                "data" => $th->getMessage(),
            ], 500);
        }
    }

    public function update_user(Request $request, $id) {
        $user = User::find($id);

        if (!$user) return response()->json([
            "success" => false,
            "message" => "User tidak ditemukan",
        ], 404);

        $v = Validator::make($request->all(), [
            "name" => "required|string",
            "nik" => "required|string",
            "no_hp" => "required|string",
            "alamat" => "required|string",
        ]);

        if ($v->fails()) {
            $errs = $v->errors()->all();
            $err = join(", ", $errs);

            return response()->json([
                "success" => false,
                "message" => "Gagal mengubah user",
                "errors" => $err,
            ], 400);
        }

        try {
            $user->update([
                "name" => $request->name,
                "nik" => $request->nik,
                "no_hp" => $request->no_hp,
                "alamat" => $request->alamat,
                "updated_at" => now(),
            ]);

            return response()->json([
                "success" => true,
                "message" => "Berhasil mengubah user",
                "data" => $user,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "message" => "Gagal mengubah user",
                "data" => $th->getMessage(),
            ], 500);
        }
    }

    public function delete_user($id) {
        $user = User::find($id);

        if (!$user) return response()->json([
            "success" => false,
            "message" => "User tidak ditemukan",
        ], 404);

        try {
            $user->delete();

            return response()->json([
                "success" => true,
                "message" => "Berhasil menghapus user",
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "message" => "Gagal menghapus user",
                "data" => $th->getMessage(),
            ], 500);
        }
    }

    public function get_all_vote(Request $request) {
        $kandidat = Kandidat::all();

        $total_vote = 0;
        foreach ($kandidat as $k) {
            $vote = Vote::where("kandidat_id", $k->id)->count();
            $k['total_vote'] = $vote;

            $total_vote += $vote;
        }

        return response()->json([
            "success" => true,
            "message" => "Berhasil mendapatkan semua vote",
            "data" => [
                "total_vote" => $total_vote,
                "kandidat" => $kandidat,
            ],
        ]);
    }

    public function get_stats(Request $request) {
        // get total calon
        $total_calon = Kandidat::count();

        // get total pemilih
        $total_pemilih = User::count();

        // get already vote
        $already_vote = Vote::count();

        // get not yet vote
        $not_yet_vote = $total_pemilih - $already_vote;

        return response()->json([
            "success" => true,
            "message" => "Berhasil mendapatkan statistik",
            "data" => [
                "total_calon" => $total_calon,
                "total_pemilih" => $total_pemilih,
                "already_vote" => $already_vote,
                "not_yet_vote" => $not_yet_vote,
            ],
        ]);
    }
}