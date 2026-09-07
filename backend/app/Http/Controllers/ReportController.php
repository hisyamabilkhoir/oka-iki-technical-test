<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReportFilterRequest;
use App\Services\ReportService;
use Illuminate\Http\JsonResponse;

class ReportController extends Controller
{
    /**
     * Display tenant-scoped transaction and revenue reports.
     * Accessible only by Owner.
     */
    public function index(ReportFilterRequest $request, ReportService $service): JsonResponse
    {
        $reportData = $service->getReport(
            $request->user(),
            $request->validated('start_date'),
            $request->validated('end_date')
        );

        return response()->json([
            'data' => $reportData,
        ]);
    }
}
