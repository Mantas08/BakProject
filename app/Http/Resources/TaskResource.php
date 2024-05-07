<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
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
            'name' => $this->name,
            'description' => $this->description,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'relevance' => $this->relevance,
            'status' => $this->status,
            'property_id_task' => $this->property_id_task,
            'property_title' => $this->property->title,
            'user_id_task' => $this->user_id_task,
            'user_name' => optional($this->user)->name,
        ];
    }
}
