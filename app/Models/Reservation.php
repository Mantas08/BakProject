<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = ['start_date', 'end_date', 'property_id', 'user_id'];

    public function property()
    {
        return $this->belongsTo(Property::class, 'property_id', 'id');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    public function scopeFilterByPropertyId($query, $propertyId)
    {
        return $query->where('property_id', $propertyId);
    }
}
