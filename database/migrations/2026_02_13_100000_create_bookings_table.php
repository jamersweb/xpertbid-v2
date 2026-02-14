<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('cargo_type');
            $table->string('glass_option')->nullable();
            $table->string('glass_size')->nullable();
            $table->string('thickness')->nullable();
            $table->integer('glassquantity')->nullable();
            $table->string('glass_type')->nullable();
            $table->string('container_size')->nullable();
            $table->integer('quantity')->nullable();
            $table->text('goods_description')->nullable();
            $table->string('weight')->nullable();
            $table->string('origin_country');
            $table->string('origin_city');
            $table->string('destination_country');
            $table->string('destination_city');
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
