<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('turis', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('property_id_turi');
            $table->unsignedBigInteger('user_id_turi');
            
            $table->foreign('property_id_turi')->references('id')->on('properties');
            $table->foreign('user_id_turi')->references('id')->on('users');
            
            // Optionally, you can add timestamps if needed
            // $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('turis');
    }
};
