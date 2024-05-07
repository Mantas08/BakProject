<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = ['name','description','start_date', 'end_date', 'relavance','status', 'property_id_task', 'user_id_task'];

    public function property()
    {
        return $this->belongsTo(Property::class,'property_id_task', 'id');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id_task', 'id');
    }
    public function images()
    {
        return $this->hasMany(Image::class, 'image_task_id');
    }
}
