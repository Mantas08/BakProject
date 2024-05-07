<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = ['title','area','type','addres','image_url'];
    
    public function turis()
    {
        return $this->hasMany(Turi::class, 'property_id_turi');
    }
}
