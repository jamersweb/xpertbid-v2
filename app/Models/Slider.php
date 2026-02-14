<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Slider extends Model
{
    use HasFactory;

    protected $table = 'sliders'; // Table name
    protected $fillable = ['title', 'subtitle', 'description', 'image','status','slider_category_id']; // Fillable fields
}
