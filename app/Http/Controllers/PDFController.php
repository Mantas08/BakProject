<?php

namespace App\Http\Controllers;

use App\Models\Finance;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Charts\SampleChart;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class PDFController extends Controller
{
    public function generatePDF(Request $request)
    {

        App::setLocale('lt');
        // Get the period and property ID from the request
        $period = $request->input('period');
        $propertyId = $request->input('property_id');

        // Start with a query builder instance
        $query = Finance::query();

        // Apply date range if specified
        if (!empty($period) && isset($period['start_date']) && isset($period['end_date'])) {
            $query->whereBetween('start_date', [$period['start_date'], $period['end_date']]);
        }

        // Filter by property ID
        if (!empty($propertyId)) {
            $query->where('property_id_finance', $propertyId);
        }

        // Get the finance data
        $financeData = $query->get();

        // Calculate category sums
        $categorySums = $query->select('category', DB::raw('SUM(sum) as total_sum'))
            ->groupBy('category')
            ->get();

        // Prepare data for the chart
        $labels = $categorySums->pluck('category');
        $values = $categorySums->pluck('total_sum');

        // Create a new chart instance
        $chart = new SampleChart;
        $chart->labels($labels);
        $chart->dataset('Category Sums', 'pie', $values)
            ->options([
                'backgroundColor' => ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'],
            ]);

        // Pass the chart to the view
        $data = [
            'title' => 'Išlaidų ataskaita',
            'date' => date('m/d/Y'),
            'financeData' => $financeData,
            'categorySums' => $categorySums,
            'chart' => $chart,
        ];

        // Load the view and generate the PDF
        $pdf = PDF::loadView('pdf.generate-finance-pdf', $data);
        $pdf->setOption('font-family', 'DejaVu Sans');

        return $pdf->download('finance.pdf');
    }
}
