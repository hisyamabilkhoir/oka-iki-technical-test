<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    /**
     * Display a listing of products for the active tenant.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Product::query();

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        $perPage = (int) $request->input('per_page', 15);
        $products = $query->orderBy('name', 'asc')->paginate($perPage);

        return ProductResource::collection($products);
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = Product::create([
            'tenant_id' => $request->user()->tenant_id,
            'name' => $request->validated('name'),
            'price' => $request->validated('price'),
        ]);

        return response()->json([
            'message' => 'Produk berhasil ditambahkan.',
            'product' => new ProductResource($product),
        ], 201);
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product): JsonResponse
    {
        return response()->json([
            'product' => new ProductResource($product),
        ]);
    }

    /**
     * Update the specified product in storage.
     */
    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $product->update($request->validated());

        return response()->json([
            'message' => 'Produk berhasil diperbarui.',
            'product' => new ProductResource($product),
        ]);
    }

    /**
     * Remove the specified product from storage (Soft delete, Owner only).
     */
    public function destroy(Request $request, Product $product): JsonResponse
    {
        if ($request->user()->cannot('delete', $product)) {
            return response()->json([
                'message' => 'Akses ditolak: Hanya Owner yang berhak menghapus produk.',
            ], 403);
        }

        $product->delete();

        return response()->json([
            'message' => 'Produk berhasil dihapus (soft delete).',
        ]);
    }
}
