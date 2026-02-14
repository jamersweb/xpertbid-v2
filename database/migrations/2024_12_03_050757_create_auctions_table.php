<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAuctionsTable extends Migration
{
    public function up()
    {
        Schema::create('auctions', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('category_id')->constrained('auction_categories');
            $table->foreignId('sub_category_id')->nullable()->constrained('subcategories');
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->date('live_auction_date')->nullable();
            $table->time('live_auction_start_time')->nullable();
            $table->time('live_auction_end_time')->nullable();
            $table->decimal('reserve_price', 15, 2);
            $table->decimal('minimum_bid', 15, 2)->nullable();
            $table->boolean('is_bid_increment')->default(false);
            $table->decimal('bid_increment', 15, 2)->nullable();
            $table->boolean('is_buynow')->default(false);
            $table->decimal('buy_now_price', 15, 2)->nullable();
            $table->text('description')->nullable();
            $table->boolean('international_shipping')->default(false);
            $table->text('shipping_conditions')->nullable();
            $table->text('shipping_terms')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('auctions');
    }
}
