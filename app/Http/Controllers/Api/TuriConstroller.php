<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Turi;
use App\Http\Requests\StoreTuriRequest;
use App\Http\Requests\UpdateTuriRequest;
use App\Http\Resources\TuriResource;
use Illuminate\Http\Request;

class TuriConstroller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $property_id = $request->input('property_id_turi');
        
        // Retrieve turis filtered by property_id_turi
        $turis = Turi::where('property_id_turi', $property_id)->get();
    
        // Return the filtered turis as JSON response
        return TuriResource::collection($turis);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTuriRequest $request)
    {
        $property_id = $request->input('property_id_turi');
        $user_ids = $request->input('user_id_turi');

        // Ensure $user_ids is an array
        if (!is_array($user_ids)) {
            // If $user_ids is not an array, convert it to an array with a single element
            $user_ids = [$user_ids];
        }

        // Loop through each user ID and create a Turi instance for each one
        foreach ($user_ids as $user_id) {
            Turi::create([
                'property_id_turi' => $property_id,
                'user_id_turi' => $user_id
            ]);
        }

        // Return a success response
        return response()->json(['message' => 'Turis created successfully']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Turi $turi)
    {
        return new TuriResource($turi);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTuriRequest $request, Turi $turi)
    {
        $turi->update($request->validated());

        // Return the updated turi as JSON response
        return new TuriResource($turi);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($property_id, $user_id)
    {
        // Find the Turi instance based on the property_id and user_id
        $turi = Turi::where('property_id_turi', $property_id)
            ->where('user_id_turi', $user_id)
            ->firstOrFail();

        // Delete the Turi instance
        $turi->delete();

        // Return a success message as JSON response
        return response()->json(['message' => 'Turi deleted successfully']);
    }
}
