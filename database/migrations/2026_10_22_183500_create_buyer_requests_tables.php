<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('buyer_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('category_id')->nullable()->constrained('auction_categories')->nullOnDelete();
            $table->string('location_label')->nullable();
            $table->string('country')->nullable();
            $table->string('state')->nullable();
            $table->string('city')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('status', 32)->default('open'); // open|closed|fulfilled
            $table->unsignedBigInteger('accepted_offer_id')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'category_id']);
            $table->index(['user_id', 'status']);
        });

        Schema::create('buyer_request_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('buyer_request_id')->constrained('buyer_requests')->cascadeOnDelete();
            $table->string('path');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('buyer_request_offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('buyer_request_id')->constrained('buyer_requests')->cascadeOnDelete();
            $table->foreignId('seller_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('price', 16, 2);
            $table->text('message')->nullable();
            $table->string('status', 32)->default('pending'); // pending|accepted|rejected|withdrawn
            $table->timestamps();
            $table->softDeletes();

            $table->index(['buyer_request_id', 'status']);
            $table->index(['seller_id', 'status']);
        });

        Schema::table('buyer_requests', function (Blueprint $table) {
            $table->foreign('accepted_offer_id')
                ->references('id')
                ->on('buyer_request_offers')
                ->nullOnDelete();
        });

        Schema::create('seller_buyer_request_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('seller_buyer_request_preference_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('preference_id')
                ->constrained('seller_buyer_request_preferences')
                ->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('auction_categories')->cascadeOnDelete();
            $table->unique(['preference_id', 'category_id'], 'sbr_pref_category_unique');
        });

        Schema::create('seller_buyer_request_preference_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('preference_id')
                ->constrained('seller_buyer_request_preferences')
                ->cascadeOnDelete();
            $table->string('location_label')->nullable();
            $table->string('country')->nullable();
            $table->string('state')->nullable();
            $table->string('city')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seller_buyer_request_preference_locations');
        Schema::dropIfExists('seller_buyer_request_preference_categories');
        Schema::dropIfExists('seller_buyer_request_preferences');

        Schema::table('buyer_requests', function (Blueprint $table) {
            $table->dropForeign(['accepted_offer_id']);
        });

        Schema::dropIfExists('buyer_request_offers');
        Schema::dropIfExists('buyer_request_images');
        Schema::dropIfExists('buyer_requests');
    }
};
