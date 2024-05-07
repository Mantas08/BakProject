<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Finance extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = ['start_date', 'end_date', 'sum', 'category', 'property_id_finance'];
    public function property()
    {
        return $this->belongsTo(Property::class, 'property_id_finance', 'id');
    }
}
