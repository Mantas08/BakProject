<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'not_user_id',
        'message',
        'not_property_id',
        'not_task_id',
        'not_reservation_id',
        'read_at',
    ];
    protected $casts = [
        'read_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'not_user_id'); // Assuming your user ID foreign key column is `not_user_id`
    }

    public function property()
    {
        return $this->belongsTo(Property::class, 'not_property_id'); // Assuming your property ID foreign key column is `not_property_id`
    }

    public function task()
    {
        return $this->belongsTo(Task::class, 'not_task_id'); // Assuming your task ID foreign key column is `not_task_id`
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class, 'not_reservation_id'); // Assuming your reservation ID foreign key column is `not_reservation_id`
    }
}
