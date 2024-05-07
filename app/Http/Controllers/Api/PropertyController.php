<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Http\Requests\StorePropertyRequest;
use App\Http\Requests\UpdatePropertyRequest;
use App\Http\Resources\PropertyResource;
use Illuminate\Support\Facades\Log;

class PropertyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        
        $properties = Property::whereHas('turis', function ($query) {
            $query->where('user_id_turi', auth()->id());
        })->orderBy('id', 'desc')->paginate(10);
    
        // Return the collection of properties
        return PropertyResource::collection($properties);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePropertyRequest $request)
    {
        // Validate the incoming request data
        $validated = $request->validated();
        
        // Retrieve user ID from the authenticated user
        $userId = auth()->id();
    
        // Check if the request contains an uploaded file
        if ($request->hasFile('image')) {
            // Retrieve the uploaded file from the request
            $destinationPath = 'public/images'; // Set your destination path
            $image = $request->file('image');
            $image_name = $image->getClientOriginalName();
            $image->storeAs($destinationPath, $image_name);
    
            // Construct the full image path
            $full_image_path = asset('storage/images/' . $image_name);
    
            // Update the validated data with the full image path
            $validated['image_url'] = $full_image_path;
        }
    
        // Create a new property record in the database
        $property = Property::create($validated);
    
        // Associate the property with the user in the turi table
        $property->turis()->create(['user_id_turi' => $userId]);
    
        // Return the newly created property resource
        return response(new PropertyResource($property), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Property $property)
    {
        return new PropertyResource($property);
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(UpdatePropertyRequest $request, Property $property)
    {
        Log::channel('single')->info('Request Data property controller:', $request->all());
        
        $data = $request->validated();
        
        // Log data before the if condition

        // Handle image upload if present in the request
        if ($request->hasFile('image')) {
            // Log data within the if condition
            Log::debug('Data within if condition: ' . json_encode($data));

            $image = $request->file('image');
            $destinationPath = 'public/images'; // Set your destination path
            $image_name = $image->getClientOriginalName();
            $image->storeAs($destinationPath, $image_name);

            // Construct the full image path
            $full_image_path = asset('storage/images/' . $image_name);

            // Update the data with the full image path
            $data['image_url'] = $full_image_path;
        } else {
            // If no new image uploaded, remove 'image' field from $data to avoid setting 'image_url' to null
            unset($data['image']);
        }

        // Log data after the if condition
        Log::info('Data after if condition: ' . json_encode($data));

        // Update the property with validated data
        $property->update($data);

        return new PropertyResource($property);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Property $property)
    {
        $property->delete();

        return response("", 204);
    }
}
