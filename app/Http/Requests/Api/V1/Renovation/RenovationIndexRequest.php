<?php

namespace App\Http\Requests\Api\V1\Renovation;

use Illuminate\Foundation\Http\FormRequest;

class RenovationIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:48'],
            'q' => ['sometimes', 'nullable', 'string', 'max:200'],
            'city' => ['sometimes', 'nullable', 'string', 'max:120'],
            'city_id' => ['sometimes', 'nullable', 'integer', 'min:1'],
            'state_id' => ['sometimes', 'nullable', 'integer', 'min:1'],
            'country_id' => ['sometimes', 'nullable', 'integer', 'min:1'],
            'service_type' => ['sometimes', 'nullable', 'string', 'max:120'],
            'listing_type' => ['sometimes', 'nullable', 'string', 'in:normal,auction,business'],
            'sub_category' => ['sometimes', 'nullable', 'string', 'max:120'],
            'child_category' => ['sometimes', 'nullable', 'string', 'max:120'],
            'price_min' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'price_max' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'featured' => ['sometimes', 'nullable', 'in:0,1,true,false'],
            'sort' => ['sometimes', 'nullable', 'string', 'in:latest,price_asc,price_desc,featured,views'],
        ];
    }
}
