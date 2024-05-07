<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use PgSql\Lob;

class UpdatePropertyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
/*
    public function prepareForValidation()
    {
        $this->merge(json_decode($this->payload, true, 512, JSON_THROW_ON_ERROR));
    }*/
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        Log::channel('single')->info('Request Data UpdatePropertyRequest:', $this->all());
        return [
            'title' => 'required|string|max:55',
            'area' => 'required|integer|max:99999',
            'type' => 'required|string|max:55',
            'addres' => 'required|string|max:100',
            'image_url' => 'string',
        ];
    }
}
