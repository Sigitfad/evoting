<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kandidat extends Model
{
    use HasFactory;

    protected $table = "kandidat";

    protected $fillable = [
        "nama_ketua",
        "nik_ketua",
        "pendidikan_terakhir_ketua",
        "nama_wakil",
        "nik_wakil",
        "pendidikan_terakhir_wakil",
        "foto_kandidat",
        "visi",
        "misi",
    ];

    protected $casts = [
        "created_at" => "datetime",
        "updated_at" => "datetime",
    ];

    // get all votes for this kandidat
    public function votes()
    {
        return $this->hasMany(Vote::class, "kandidat_id", "id");
    }
}
