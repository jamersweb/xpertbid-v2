<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAuctions1Table extends Migration
{
    public function up()
    {
        Schema::create('auctions_1', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('slug')->nullable();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('category_id')->nullable()->constrained('auction_categories');
            $table->foreignId('sub_category_id')->nullable()->constrained('auction_categories');
            $table->foreignId('child_category_id')->nullable()->constrained('auction_categories');
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->date('live_auction_date')->nullable();
            $table->time('live_auction_start_time')->nullable();
            $table->time('live_auction_end_time')->nullable();
            $table->decimal('reserve_price', 15, 2)->nullable();
            $table->decimal('minimum_bid', 15, 2)->nullable();
            $table->boolean('is_bid_increment')->default(false);
            $table->decimal('bid_increment', 15, 2)->nullable();
            $table->boolean('is_buynow')->default(false);
            $table->decimal('buy_now_price', 15, 2)->nullable();
            $table->text('description')->nullable();
            $table->boolean('international_shipping')->default(false);
            $table->text('shipping_conditions')->nullable();
            $table->text('shipping_terms')->nullable();
            $table->string('image')->nullable();
            $table->text('album')->nullable();
            $table->string('product_condition')->nullable();
            $table->string('product_year')->nullable();
            $table->string('product_location')->nullable();
            $table->foreignId('state_id')->nullable()->constrained('states');
            $table->foreignId('city_id')->nullable()->constrained('cities');
            $table->integer('views')->default(0);
            $table->string('status')->nullable();
            $table->boolean('is_autobidder_on')->default(false);
            $table->string('featured_name')->nullable();
            $table->foreignId('winner_id')->nullable()->constrained('users');
            $table->string('list_type')->default('auction');
            $table->string('create_category')->nullable();
            $table->text('decline_reason')->nullable();
            $table->decimal('current_highest_bid', 15, 2)->nullable();
            // Property fields
            $table->string('developer')->nullable();
            $table->string('location_url')->nullable();
            $table->date('delivery_date')->nullable();
            $table->date('sale_starts')->nullable();
            $table->text('payment_plan')->nullable();
            $table->integer('number_of_buildings')->nullable();
            $table->string('government_fee')->nullable();
            $table->string('nearby_location')->nullable();
            $table->text('amenities')->nullable();
            $table->text('facilities')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('auctions_1');
    }
}

