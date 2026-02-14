<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSlidersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sliders', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('title'); // Slider title
            $table->string('subtitle')->nullable(); // Optional subtitle
            $table->text('description')->nullable(); // Optional description
            $table->string('image')->nullable(); // Optional image path
            $table->unsignedBigInteger('slider_category_id')->nullable(); // New: slider category id
            $table->timestamps(); // Created_at and Updated_at

            // Optionally, add a foreign key constraint
            $table->foreign('slider_category_id')
                  ->references('id')->on('slider_categories')
                  ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sliders', function (Blueprint $table) {
            $table->dropForeign(['slider_category_id']);
        });
        Schema::dropIfExists('sliders');
    }
}
