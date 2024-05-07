<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class StorePropertyRequest extends FormRequest
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
        Log::channel('single')->info('StorePropertyRequest:');
        return [
            'title' => 'required|string|max:55',
            'type' => 'required|string|max:55',
            'area' => 'required|integer|max:99999',
            'addres' => 'required|string|max:100',
            'image_url' => 'string',
        ];
    }
}
