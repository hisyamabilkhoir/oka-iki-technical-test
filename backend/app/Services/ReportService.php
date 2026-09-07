<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportService
{
    /**
     * Generate tenant-scoped transaction and revenue report with database-level aggregation.
     *
     * @param  User  $user
     * @param  string|null  $startDate
     * @param  string|null  $endDate
     * @return array<string, mixed>
     */
    public function getReport(User $user, ?string $startDate = null, ?string $endDate = null): array
    {
        $tenantId = $user->tenant_id;
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth()->toDateString();
        $endOfMonth = $now->copy()->endOfMonth()->toDateString();

        // 1. Current Month KPIs (Aggregated strictly in DB)
        $currentMonthSummary = Transaction::where('tenant_id', $tenantId)
            ->whereBetween('transaction_date', [$startOfMonth, $endOfMonth])
            ->selectRaw('COUNT(*) as total_transactions, COALESCE(SUM(total), 0) as total_revenue')
            ->first();

        // 2. Filtered Period KPIs
        $filterQuery = Transaction::where('tenant_id', $tenantId);

        if ($startDate && $endDate) {
            $filterQuery->whereBetween('transaction_date', [$startDate, $endDate]);
        } elseif ($startDate) {
            $filterQuery->where('transaction_date', '>=', $startDate);
        } elseif ($endDate) {
            $filterQuery->where('transaction_date', '<=', $endDate);
        } else {
            // Default filter period: current month
            $startDate = $startOfMonth;
            $endDate = $endOfMonth;
            $filterQuery->whereBetween('transaction_date', [$startDate, $endDate]);
        }

        $filteredSummary = (clone $filterQuery)
            ->selectRaw('COUNT(*) as total_transactions, COALESCE(SUM(total), 0) as total_revenue, COALESCE(AVG(total), 0) as avg_order_value')
            ->first();

        // 3. Daily aggregated trend in the filtered period (for charts/analytics)
        $dailyAggregates = (clone $filterQuery)
            ->selectRaw('transaction_date, COUNT(*) as transaction_count, COALESCE(SUM(total), 0) as daily_revenue')
            ->groupBy('transaction_date')
            ->orderBy('transaction_date', 'asc')
            ->get();

        // 4. Recent transactions list in the period with pagination/limit
        $transactions = (clone $filterQuery)
            ->with(['user:id,name,role', 'items.product:id,name'])
            ->orderBy('transaction_date', 'desc')
            ->orderBy('id', 'desc')
            ->limit(50)
            ->get();

        return [
            'tenant' => [
                'id' => $user->tenant->id,
                'name' => $user->tenant->name,
            ],
            'period' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'current_month' => [
                'total_transactions' => (int) ($currentMonthSummary->total_transactions ?? 0),
                'total_revenue' => (string) number_format((float) ($currentMonthSummary->total_revenue ?? 0), 2, '.', ''),
            ],
            'filtered_summary' => [
                'total_transactions' => (int) ($filteredSummary->total_transactions ?? 0),
                'total_revenue' => (string) number_format((float) ($filteredSummary->total_revenue ?? 0), 2, '.', ''),
                'avg_order_value' => (string) number_format((float) ($filteredSummary->avg_order_value ?? 0), 2, '.', ''),
            ],
            'daily_breakdown' => $dailyAggregates,
            'recent_transactions' => $transactions,
        ];
    }
}
