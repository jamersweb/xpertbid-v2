<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasColumn('listings', 'winner_id')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->foreignId('winner_id')->nullable()->constrained('users')->nullOnDelete();
            });
        }

        DB::table('listings')
            ->select('id', 'listing_data')
            ->orderBy('id')
            ->chunkById(500, function ($listings) {
                $candidateWinnerIds = [];

                foreach ($listings as $listing) {
                    $listingData = json_decode($listing->listing_data ?? '', true);
                    $winnerId = $listingData['winner_id'] ?? null;

                    if (!empty($winnerId)) {
                        $candidateWinnerIds[(int) $winnerId] = true;
                    }
                }

                $validWinnerIds = DB::table('users')
                    ->whereIn('id', array_keys($candidateWinnerIds))
                    ->pluck('id')
                    ->all();

                $validWinnerIdMap = array_flip($validWinnerIds);

                foreach ($listings as $listing) {
                    $listingData = json_decode($listing->listing_data ?? '', true);
                    $winnerId = (int) ($listingData['winner_id'] ?? 0);

                    if ($winnerId > 0 && isset($validWinnerIdMap[$winnerId])) {
                        DB::table('listings')
                            ->where('id', $listing->id)
                            ->update(['winner_id' => $winnerId]);
                    }
                }
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropConstrainedForeignId('winner_id');
        });
    }
};
