<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TuriResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'property_id' => $this->property_id_turi,
            'user_id' => $this->user_id_turi,
            'property_title' => $this->property->title,
            'user_name' => $this->user->name,
        ];
    }
}
