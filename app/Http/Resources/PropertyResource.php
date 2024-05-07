<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;

class PropertyResource extends JsonResource
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
            'title' => $this->title,
            'type' => $this->type,
            'area' => $this->area,
            'addres' => $this->addres,
            'image_url' => $this->image_url,
            //'images' => ImageResource::collection($this->whenLoaded('images')),
        ];
    }
}
