<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return[
            'id' => $this->id,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'property_id' => $this->property_id,
            'property_title'=> $this->property->title,
            'user_id' => $this->user_id,
            'user_name' => $this->user->name,
        ];
    }
}
