<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (
            !Schema::hasTable('carts') ||
            !Schema::hasColumn('carts', 'listing_id') ||
            Schema::getConnection()->getDriverName() !== 'mysql'
        ) {
            return;
        }

        try {
            DB::statement('ALTER TABLE carts DROP FOREIGN KEY carts_auction_id_foreign');
        } catch (\Throwable $e) {
            // Constraint may already be absent or renamed in some deployments.
        }

        try {
            DB::statement('ALTER TABLE carts ADD CONSTRAINT carts_listing_id_foreign FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE');
        } catch (\Throwable $e) {
            // Constraint may already exist after a prior deploy.
        }
    }

    public function down(): void
    {
        if (
            !Schema::hasTable('carts') ||
            !Schema::hasColumn('carts', 'listing_id') ||
            Schema::getConnection()->getDriverName() !== 'mysql'
        ) {
            return;
        }

        try {
            DB::statement('ALTER TABLE carts DROP FOREIGN KEY carts_listing_id_foreign');
        } catch (\Throwable $e) {
            // Ignore missing constraint.
        }
    }
};
