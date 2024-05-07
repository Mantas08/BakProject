<?php

namespace App\Http\Controllers;

use App\Models\Finance;
use Illuminate\Http\Request;
use App\Models\User;
use Jimmyjs\ReportGenerator\Facades\PdfReportFacade;
use Jimmyjs\ReportGenerator\ReportMedia\PdfReport;
//use Jimmyjs\ReportGenerator\ReportMedia\PdfReport;
use PhpOffice\PhpSpreadsheet\Writer\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class ReportController extends Controller
{
    public function generatePdfReport(Request $request)
    {
        $period = $request->input('period');
        
        // Start with a query builder instance
        $query = Finance::query();

        // Apply date range if specified
        if (!empty($period) && isset($period['start_date']) && isset($period['end_date'])) {
            $query->whereBetween('start_date', [$period['start_date'], $period['end_date']]);
        }
        
        // Calculate category sums
        $categorySums = $this->calculateCategorySums($query);
        
        // Generate the PDF report
        $reportGenerator = new PdfReport();
        
        // Define report title and meta-information
        $title = 'Finance Report';
        $meta = ['Generated on' => now()];
        
        // Define report columns
        $columns = ['Data' => 'start_date', 'Suma' => 'sum', 'Kategorija' => 'category'];
        
        // Generate the PDF report
        $pdf = $reportGenerator->of($title, $meta, $query, $columns, $categorySums)
                               ->showTotal(['Total Finanace' => 'count'])
                               ->stream();
        
        
        // Pass the PDF and category sums data to the HTML template for rendering
    }

    private function calculateCategorySums($query)
    {
        // Your logic to calculate category sums here
        $categorySums = [];

        // Loop through the query results and calculate category sums
        foreach ($query->get() as $result) {
            // Calculate sum for each category and store it in $categorySums array
            // This part should be adjusted based on your actual data and logic
        }

        return $categorySums;
    }
    
}
