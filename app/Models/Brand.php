<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'image',
        'banner_img',
        'banner_img_mob',
        'box_1_img',
        'box_1_img_mob',
        'box_2_img',
        'box_2_img_mob',
        'box_3_img',
        'box_3_img_mob',
        'page_sections',
    ];

    protected $casts = [
        'page_sections' => 'array',
    ];
}
