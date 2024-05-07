<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNotificationRequest extends FormRequest
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
            'not_user_id' => 'integer', 
            'message' => 'string', 
            'not_property_id' => 'nullable|integer', 
            'not_task_id' => 'nullable|integer', 
            'not_reservation_id' => 'nullable|integer', 
            'read_at' => 'nullable|date', 
        ];
    }
}
