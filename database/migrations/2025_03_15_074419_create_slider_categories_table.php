<?php
// database/migrations/xxxx_xx_xx_create_slider_categories_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSliderCategoriesTable extends Migration
{
    public function up()
    {
        Schema::create('slider_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Only one field: name
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('slider_categories');
    }
}
