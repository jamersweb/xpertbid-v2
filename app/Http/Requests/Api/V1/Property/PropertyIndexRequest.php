<?php

namespace App\Http\Requests\Api\V1\Property;

use Illuminate\Foundation\Http\FormRequest;

class PropertyIndexRequest extends FormRequest
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
            'type' => ['sometimes', 'nullable', 'string', 'max:120'],
            'purpose' => ['sometimes', 'nullable', 'string', 'max:60'],
            'listing_type' => ['sometimes', 'nullable', 'string', 'in:normal,auction,business'],
            'sub_category' => ['sometimes', 'nullable', 'string', 'max:120'],
            'child_category' => ['sometimes', 'nullable', 'string', 'max:120'],
            'price_min' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'price_max' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'bedrooms' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:50'],
            'featured' => ['sometimes', 'nullable', 'in:0,1,true,false'],
            'sort' => ['sometimes', 'nullable', 'string', 'in:latest,price_asc,price_desc,featured'],
        ];
    }
}
