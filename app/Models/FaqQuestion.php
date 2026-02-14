<?php

namespace App\Models;
use App\Models\FaqCategory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FaqQuestion extends Model
{
    use HasFactory;

    protected $fillable = ['category_id', 'question_text', 'answer_text', 'status'];

    public function category()
    {
        return $this->belongsTo(FaqCategory::class, 'category_id');
    }
}
