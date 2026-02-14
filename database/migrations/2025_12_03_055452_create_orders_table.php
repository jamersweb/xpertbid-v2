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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('order_number')->unique();
            
            // Billing Details
            $table->string('billing_name');
            $table->string('billing_email');
            $table->string('billing_phone');
            $table->text('billing_address_line1');
            $table->text('billing_address_line2')->nullable();
            $table->string('billing_city');
            $table->string('billing_state');
            $table->string('billing_postal_code');
            $table->string('billing_country');
            
            // Shipping Details
            $table->string('shipping_name');
            $table->string('shipping_email');
            $table->string('shipping_phone');
            $table->text('shipping_address_line1');
            $table->text('shipping_address_line2')->nullable();
            $table->string('shipping_city');
            $table->string('shipping_state');
            $table->string('shipping_postal_code');
            $table->string('shipping_country');
            
            // Order Details
            $table->decimal('subtotal', 15, 2);
            $table->decimal('tax', 15, 2)->default(0);
            $table->decimal('shipping_cost', 15, 2)->default(0);
            $table->decimal('total', 15, 2);
            
            // Payment Details
            $table->enum('payment_method', ['stripe', 'cod'])->default('cod');
            $table->enum('payment_status', ['pending', 'paid', 'failed'])->default('pending');
            $table->string('transaction_id')->nullable();
            
            // Order Status
            $table->enum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])->default('pending');
            
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index('user_id');
            $table->index('order_number');
            $table->index('status');
        });
        
        // Create order_items table
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('auction_id')->constrained()->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->decimal('price', 15, 2);
            $table->decimal('subtotal', 15, 2);
            $table->timestamps();
            
            $table->index('order_id');
            $table->index('auction_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
