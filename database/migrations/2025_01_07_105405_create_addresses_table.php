<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAddressesTable extends Migration
{
    public function up()
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->index();
            $table->string('addressLine1');
            $table->string('addressLine2')->nullable();
            $table->string('country');
            $table->string('city');
            $table->string('state');
            $table->string('postalCode');
            $table->string('contactNumber')->nullable();
            $table->string('otherNumber')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('addresses');
    }
}
