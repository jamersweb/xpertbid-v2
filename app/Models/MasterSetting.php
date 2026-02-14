<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterSetting extends Model
{
    protected $fillable = [
        'title', 'key', 'image', 'description'
    ];
}
