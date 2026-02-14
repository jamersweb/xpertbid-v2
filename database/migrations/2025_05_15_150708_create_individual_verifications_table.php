<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIndividualVerificationsTable extends Migration
{
    public function up()
    {
        Schema::create('individual_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('full_legal_name');
            $table->date('dob');
            $table->string('nationality');
            $table->string('residential_address');
            $table->string('id_front_path');
            $table->string('id_back_path');
            $table->string('contact_number');
            $table->string('email_address');
            $table->string('country');
         	$table->string('status')->default('not_verified');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('individual_verifications');
    }
}
