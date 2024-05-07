<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Image;
use App\Http\Requests\StoreImageRequest;
use App\Http\Requests\UpdateImageRequest;
use App\Http\Resources\ImageResource;

class ImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ImageResource::collection(Image::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreImageRequest $request)
    {
        $validated = $request->validated();
    
        // Check if the request contains an uploaded file
        if ($request->hasFile('image')) {
            // Retrieve the uploaded file from the request
            $destinationPath = 'public/images';
            $image = $request->file('image');
            $image_name = $image->getClientOriginalName();
            $image->storeAs($destinationPath, $image_name);
    
            // Update the validated data with the image name
            $validated['url'] = $image_name;
        }
    
        // Create a new image record in the database
        $image = Image::create($validated);
    
        // Return the newly created image resource
        return new ImageResource($image);
    }

    /**
     * Display the specified resource.
     */
    public function show(Image $image)
    {
        return new ImageResource($image);
    }
    
    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateImageRequest $request, Image $image)
    {
        $data = $request->validated();
        $image->update($data);

        return new ImageResource($image);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Image $image)
    {
        $image->delete();

        return response("", 204);
    }
}
