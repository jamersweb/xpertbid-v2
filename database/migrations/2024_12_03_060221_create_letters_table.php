<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLettersTable extends Migration
{
    public function up()
    {
        Schema::create('create_letters', function (Blueprint $table) {
            $table->id();
            $table->string('to');
            $table->string('title');
            $table->text('message');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('create_letters');
    }
}
