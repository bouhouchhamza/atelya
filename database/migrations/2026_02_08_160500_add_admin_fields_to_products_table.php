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
        $hasName = Schema::hasColumn('products', 'name');
        $hasImageUrl = Schema::hasColumn('products', 'image_url');
        $hasIsFeatured = Schema::hasColumn('products', 'is_featured');

        if (! $hasName || ! $hasImageUrl || ! $hasIsFeatured) {
            Schema::table('products', function (Blueprint $table) use ($hasName, $hasImageUrl, $hasIsFeatured) {
                if (! $hasName) {
                    $table->string('name')->nullable()->after('title');
                }
                if (! $hasImageUrl) {
                    $table->string('image_url')->nullable()->after('price');
                }
                if (! $hasIsFeatured) {
                    $table->boolean('is_featured')->default(false)->after('image_url');
                }
            });
        }

        if (Schema::hasColumn('products', 'name') && Schema::hasColumn('products', 'title')) {
            DB::table('products')
                ->whereNull('name')
                ->update(['name' => DB::raw('title')]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $hasName = Schema::hasColumn('products', 'name');
        $hasImageUrl = Schema::hasColumn('products', 'image_url');
        $hasIsFeatured = Schema::hasColumn('products', 'is_featured');

        if ($hasName || $hasImageUrl || $hasIsFeatured) {
            Schema::table('products', function (Blueprint $table) use ($hasName, $hasImageUrl, $hasIsFeatured) {
                if ($hasName) {
                    $table->dropColumn('name');
                }
                if ($hasImageUrl) {
                    $table->dropColumn('image_url');
                }
                if ($hasIsFeatured) {
                    $table->dropColumn('is_featured');
                }
            });
        }
    }
};
