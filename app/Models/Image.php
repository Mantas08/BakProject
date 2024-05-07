<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    use HasFactory;
    protected $fillable = [
        'url',
        'image_user_id',
        'image_property_id',
        'image_task_id',
    ];

    /**
     * Get the user that owns the image.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'image_user_id');
    }

    /**
     * Get the property that owns the image.
     */
    public function property()
    {
        return $this->belongsTo(Property::class, 'image_property_id');
    }

    /**
     * Get the task that owns the image.
     */
    public function task()
    {
        return $this->belongsTo(Task::class, 'image_task_id');
    }

}
