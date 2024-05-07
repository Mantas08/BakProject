<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Turi extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = ['property_id_turi','user_id_turi'];

    public function property()
    {
        return $this->belongsTo(Property::class, 'property_id_turi');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id_turi');
    }

}
