<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMasterSettingsTable extends Migration
{
    public function up()
    {
        Schema::create('master_settings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('key')->unique();
            $table->string('image')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('master_settings');
    }
}
