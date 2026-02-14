<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIdentityVerificationsTable extends Migration
{
    public function up()
    {
        Schema::create('identity_verifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->index();
            $table->string('front_image');
            $table->string('back_image');
            $table->string('document_type');
            $table->string('issue_country');
            $table->string('full_name');
            $table->date('birth_date');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('identity_verifications');
    }
}