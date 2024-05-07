<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'not_user_id' => $this->not_user_id,
            'message' => $this->message,
            'not_property_id' => $this->not_property_id,
            'not_task_id' => $this->not_task_id,
            'not_reservation_id' => $this->not_reservation_id,
            'read_at' => $this->read_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
