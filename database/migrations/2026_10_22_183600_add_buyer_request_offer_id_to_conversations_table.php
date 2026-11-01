<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('conversations')) {
            return;
        }

        if (Schema::hasColumn('conversations', 'buyer_request_offer_id')) {
            return;
        }

        Schema::table('conversations', function (Blueprint $table) {
            $table->foreignId('buyer_request_offer_id')
                ->nullable()
                ->constrained('buyer_request_offers')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('conversations')) {
            return;
        }

        if (! Schema::hasColumn('conversations', 'buyer_request_offer_id')) {
            return;
        }

        Schema::table('conversations', function (Blueprint $table) {
            $table->dropConstrainedForeignId('buyer_request_offer_id');
        });
    }
};
