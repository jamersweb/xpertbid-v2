<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationsTable extends Migration
{
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->index();
            $table->boolean('inspiration');
            $table->boolean('newsletter')->default(false);
            $table->boolean('outbid')->default(false);
            $table->boolean('republished')->default(false);
            $table->boolean('oneDayReminder')->default(false);
            $table->boolean('oneHourReminder')->default(false);
            $table->boolean('fifteenMinutesReminder')->default(false);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('notifications');
    }
}