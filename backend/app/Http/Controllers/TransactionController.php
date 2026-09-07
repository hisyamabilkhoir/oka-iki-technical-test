<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use App\Services\TransactionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TransactionController extends Controller
{
    /**
     * Display a listing of transactions for the active tenant.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Transaction::with(['user', 'items.product']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('transaction_code', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('items.product', function ($pq) use ($search) {
                        $pq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($startDate = $request->input('start_date')) {
            $query->where('transaction_date', '>=', $startDate);
        }

        if ($endDate = $request->input('end_date')) {
            $query->where('transaction_date', '<=', $endDate);
        }

        if ($userId = $request->input('user_id')) {
            $query->where('user_id', $userId);
        }

        $sortBy = $request->input('sort_by', 'transaction_date');
        $sortDir = strtolower($request->input('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';

        if (in_array($sortBy, ['transaction_date', 'total', 'transaction_code', 'id'])) {
            $query->orderBy($sortBy, $sortDir)->orderBy('id', $sortDir);
        } else {
            $query->orderBy('transaction_date', 'desc')->orderBy('id', 'desc');
        }

        $perPage = (int) $request->input('per_page', 10);
        $transactions = $query->paginate($perPage);

        return TransactionResource::collection($transactions);
    }

    /**
     * Store a newly created transaction with snapshot pricing and database transaction integrity.
     */
    public function store(StoreTransactionRequest $request, TransactionService $service): JsonResponse
    {
        $transaction = $service->createTransaction($request->user(), $request->validated());

        return response()->json([
            'message' => 'Transaksi berhasil dibuat.',
            'transaction' => new TransactionResource($transaction),
        ], 201);
    }

    /**
     * Display the specified transaction.
     */
    public function show(Transaction $transaction): JsonResponse
    {
        return response()->json([
            'transaction' => new TransactionResource($transaction->load(['items.product', 'user'])),
        ]);
    }

    /**
     * Disallow transaction deletion (Strict ERP Rule: Transactions are immutable).
     */
    public function destroy(): JsonResponse
    {
        return response()->json([
            'message' => 'Transaksi tidak dapat dihapus demi integritas data ERP.',
        ], 405);
    }
}
