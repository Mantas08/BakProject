<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Finance;
use App\Http\Requests\StoreFinanceRequest;
use App\Http\Requests\UpdateFinanceRequest;
use App\Http\Resources\FinanceResource;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class FinanceConstroller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Finance::query();
        if ($request->has('property_id_finances')) {
            $propertyId = $request->input('property_id_finances');
            $query->where('property_id_finances', $propertyId);
        }

        $query->with('property');
        return FinanceResource::collection($query->orderBy('id', 'desc')->paginate(10));
        //$finance = Finance::with(['property'])->orderBy('id', 'desc')->paginate(10);

        // Return the paginated tasks as a collection of TaskResource
        //return FinanceResource::collection($finance);
    }
    public function getByPropertyId($propertyId)
    {
        $finances = Finance::where('property_id_finance', $propertyId)->orderBy('id', 'desc')->paginate(10);
        return FinanceResource::collection($finances);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFinanceRequest $request)
    {
        $data = $request->validated();

        // Parse and format the datetime strings using Carbon
        $start_date = Carbon::parse($data['start_date'])->toDateTimeString();
        $end_date = Carbon::parse($data['end_date'])->toDateTimeString();

        // Create the reservation record with properly formatted datetime values
        $finance = Finance::create([
            'start_date' => $start_date,
            'end_date' => $end_date,
            'sum' => $data['sum'],
            'category' => $data['category'],
            'property_id_finance' => $data['property_id_finance'],
        ]);
        return response(new FinanceResource($finance), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Finance $finance)
    {
        return new FinanceResource($finance);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFinanceRequest $request, Finance $finance)
    {
        $data = $request->validated();
        $finance->update($data);

        return new FinanceResource($finance);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Finance $finance)
    {
        $finance->delete();

        return response("", 204);
    }
    public function fetchByDateRange(Request $request)
    {
        $startDate = substr($request->input('start_date'), 0, strpos($request->input('start_date'), 'GMT'));
        $endDate = substr($request->input('end_date'), 0, strpos($request->input('end_date'), 'GMT'));

        // Parse the dates to Carbon instances
        $startDate = Carbon::parse($startDate)->toDateString();
        $endDate = Carbon::parse($endDate)->toDateString();

        // Log the retrieved data
        Log::channel('single')->info('fetchByDateRange:', ['start_date' => $startDate, 'end_date' => $endDate]);

        // Query the database for finances where only the start date is within the specified date range
        $finances = Finance::where('start_date', '>=', $startDate)
            ->where('start_date', '<=', $endDate)
            ->get();

        // Return the finances as a collection of resources
        return FinanceResource::collection($finances);
    }
}
