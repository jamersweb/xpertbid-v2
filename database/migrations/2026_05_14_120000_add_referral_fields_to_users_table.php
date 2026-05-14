<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'referral_code')) {
                $table->string('referral_code')->nullable()->unique()->after('company_logo');
            }

            if (!Schema::hasColumn('users', 'referred_by')) {
                $table->foreignId('referred_by')
                    ->nullable()
                    ->after('referral_code')
                    ->constrained('users')
                    ->nullOnDelete();
            }
        });

        $this->backfillMissingReferralCodes();
        $this->fixDuplicateReferralCodes();

        if (Schema::hasColumn('users', 'referral_code') && !$this->indexExists('users_referral_code_unique')) {
            Schema::table('users', function (Blueprint $table) {
                $table->unique('referral_code', 'users_referral_code_unique');
            });
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'referred_by')) {
                $table->dropConstrainedForeignId('referred_by');
            }
        });
    }

    private function backfillMissingReferralCodes(): void
    {
        User::query()
            ->where(function ($query) {
                $query->whereNull('referral_code')->orWhere('referral_code', '');
            })
            ->select(['id', 'name'])
            ->chunkById(100, function ($users) {
                foreach ($users as $user) {
                    $user->forceFill(['referral_code' => $this->generateUniqueCode($user->name)])->save();
                }
            });
    }

    private function fixDuplicateReferralCodes(): void
    {
        $duplicates = User::query()
            ->select('referral_code')
            ->whereNotNull('referral_code')
            ->where('referral_code', '!=', '')
            ->groupBy('referral_code')
            ->havingRaw('COUNT(*) > 1')
            ->pluck('referral_code');

        foreach ($duplicates as $duplicateCode) {
            $users = User::query()
                ->where('referral_code', $duplicateCode)
                ->orderBy('id')
                ->get(['id', 'name']);

            $users->shift();

            $users->each(function ($user) {
                $user->forceFill(['referral_code' => $this->generateUniqueCode($user->name)])->save();
            });
        }
    }

    private function generateUniqueCode(?string $name = null): string
    {
        $base = Str::upper(Str::slug($name ?: 'USER', ''));
        $base = Str::limit($base !== '' ? $base : 'USER', 8, '');

        do {
            $code = $base . random_int(1000, 9999);
        } while (User::query()->where('referral_code', $code)->exists());

        return $code;
    }

    private function indexExists(string $indexName): bool
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'sqlite') {
            $indexes = DB::select("PRAGMA index_list('users')");
            return collect($indexes)->contains(fn ($index) => ($index->name ?? null) === $indexName);
        }

        $indexes = DB::select(
            'SELECT INDEX_NAME FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?',
            ['users', $indexName]
        );

        return !empty($indexes);
    }
};
