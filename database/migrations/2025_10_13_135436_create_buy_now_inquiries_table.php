<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('buy_now_inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('email');
            $table->string('phone');
            $table->text('message')->nullable();
            $table->unsignedBigInteger('auction_id');
            $table->string('auction_title');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->enum('status', ['pending', 'contacted', 'completed', 'cancelled'])->default('pending');
            $table->timestamps();
            
            $table->index('auction_id');
            $table->index('user_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('buy_now_inquiries');
    }
};