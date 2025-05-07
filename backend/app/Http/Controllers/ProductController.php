<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('supplier')->get();
        return response()->json(['products' => $products]);
    }

    public function show(Product $product)
    {
        if (!auth()->user()->isSupplier() || auth()->id() !== $product->supplier_id) {
            Log::warning('Unauthorized access to product ID: ' . $product->id . ' by user ID: ' . auth()->id());
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json(['product' => $product->load('supplier')]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->isSupplier()) {
            Log::warning('Unauthorized attempt to create a product by user ID: ' . auth()->id());
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed for product creation by user ID: ' . auth()->id(), $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $productData = [
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock,
            'supplier_id' => auth()->id(),
        ];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $productData['image'] = $path;
        }

        $product = Product::create($productData);

        Log::info('Product created successfully by user ID: ' . auth()->id(), $product->toArray());

        return response()->json(['product' => $product], 201);
    }

    public function update(Request $request, Product $product)
    {
        if (!auth()->user()->isSupplier() || auth()->id() !== $product->supplier_id) {
            Log::warning('Unauthorized update attempt for product ID: ' . $product->id . ' by user ID: ' . auth()->id());
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed for product update by user ID: ' . auth()->id(), $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->has('name')) {
            $product->name = $request->name;
        }

        if ($request->has('description')) {
            $product->description = $request->description;
        }

        if ($request->has('price')) {
            $product->price = $request->price;
        }

        if ($request->has('stock')) {
            $product->stock = $request->stock;
        }

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
                Log::info('Old image deleted for product ID: ' . $product->id);
            }

            $path = $request->file('image')->store('products', 'public');
            $product->image = $path;
            Log::info('New image uploaded for product ID: ' . $product->id, ['path' => $path]);
        }

        $product->save();

        Log::info('Product updated successfully by user ID: ' . auth()->id(), $product->toArray());

        return response()->json(['product' => $product]);
    }

    public function destroy(Product $product)
    {
        if (!auth()->user()->isSupplier() || auth()->id() !== $product->supplier_id) {
            Log::warning('Unauthorized delete attempt for product ID: ' . $product->id . ' by user ID: ' . auth()->id());
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
            Log::info('Image deleted for product ID: ' . $product->id);
        }

        $product->delete();

        Log::info('Product deleted successfully by user ID: ' . auth()->id());

        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function supplierProducts()
    {
        if (!auth()->user()->isSupplier()) {
            Log::warning('Unauthorized access to supplier products by user ID: ' . auth()->id());
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $products = Product::where('supplier_id', auth()->id())->get();
        Log::info('Supplier products retrieved for user ID: ' . auth()->id(), ['product_count' => $products->count()]);

        return response()->json(['products' => $products]);
    }
}