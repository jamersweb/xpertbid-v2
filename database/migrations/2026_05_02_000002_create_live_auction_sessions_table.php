<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('live_auction_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('live_url', 500);
            $table->string('youtube_video_id')->nullable();
            $table->json('selected_listing_ids');
            $table->string('status')->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('live_auction_sessions');
    }
};
