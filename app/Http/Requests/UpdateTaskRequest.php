<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class UpdateTaskRequest extends FormRequest
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
        Log::channel('single')->info('Request Data UpdateTaskRequest:', $this->all());
        return [
            'name' => 'required|string|max:55',
            'description' => 'string|max:200',
            'start_date' => 'required|date', 
            'end_date' => 'required|date|after_or_equal:start_date',
            'relevance' => 'required|string|max:255',
            'status' => 'required|string|max:255',
            'property_id_task' => 'required|exists:properties,id', 
            'user_id_task' => '',
        ];
    }
}
