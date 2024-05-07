<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationRequest;
use App\Http\Resources\ReservationResource;
use Carbon\Carbon;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    /*public function index()
    {
        return ReservationResource::collection(Reservation::with('property', 'user')->orderBy('id', 'desc')->paginate(10));
    }*/
    public function index(Request $request)
    {
        $query = Reservation::query();

        // Check for user_id filter
        if ($request->has('user_id')) {
            $userId = $request->input('user_id');
            $query->where('user_id', $userId);
        }

        // Check for property_id filter
        if ($request->has('property_id')) {
            $propertyId = $request->input('property_id');
            $query->where('property_id', $propertyId);
        }

        $query->with('property', 'user');
        return ReservationResource::collection($query->orderBy('id', 'desc')->paginate(10));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReservationRequest $request)
    {
        $validatedData = $request->validated();

        // Parse and format the datetime strings using Carbon
        $start_date = Carbon::parse($validatedData['start_date'])->toDateTimeString();
        $end_date = Carbon::parse($validatedData['end_date'])->toDateTimeString();
    
        // Create the reservation record with properly formatted datetime values
        $reservation = Reservation::create([
            'start_date' => $start_date,
            'end_date' => $end_date,
            'property_id' => $validatedData['property_id'],
            'user_id' => $validatedData['user_id'],
        ]);
        return response(new ReservationResource($reservation), 201);
        
    }

    /**
     * Display the specified resource.
     */
    public function show(Reservation $reservation)
    {
        $reservation->load('property', 'user');

        // Return the reservation resource with property and user data included
        return new ReservationResource($reservation);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReservationRequest $request, Reservation $reservation)
    {
        $data = $request->validated();
        $reservation->update($data);

        return new ReservationResource($reservation);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reservation $reservation)
    {
        $reservation->delete();

        return response("", 204);
    }
}
