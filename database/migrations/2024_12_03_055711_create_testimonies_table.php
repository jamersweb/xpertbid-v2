<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTestimoniesTable extends Migration
{
    public function up()
    {
        Schema::create('testimonies', function (Blueprint $table) {
            $table->id();
            $table->text('user_name')->nullable();
            $table->text('testimony');
            $table->enum('status', ['Active', 'Inactive']);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('testimonies');
    }
}
