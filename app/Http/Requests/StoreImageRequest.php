<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreImageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'url' => 'string',
            'image_user_id' => 'nullable|integer|exists:users,id',
            'image_property_id' => 'nullable|integer|exists:properties,id',
            'image_task_id' => 'nullable|integer|exists:tasks,id',
        ];
    }
}
