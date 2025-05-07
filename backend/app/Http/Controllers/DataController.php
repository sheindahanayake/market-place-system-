<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Device; // Ensure you have a Device model for interacting with the database

class DataController extends Controller
{
    public function index()
    {
        // Fetch data from the database
        $data = []; // Replace with actual data fetching logic
        return response()->json($data);
    }

    public function store(Request $request)
    {
        // Validate and store data in the database
        $validatedData = $request->validate([
            'existingConnections' => 'required|integer',
            'connectionCategories' => 'required|string',
            // Add other validation rules as needed
        ]);

        // Store data in the database
        // ...

        return response()->json(['message' => 'Data saved successfully']);
    }

    public function searchByAssetOrSerial(Request $request)
    {
        // Get the search query from the request
        $query = $request->query('query');

        // Search for the device by assetNumber or serialNumber
        $device = Device::where('assetNumber', $query)
            ->orWhere('serialNumber', $query)
            ->first();

        // Return the result
        if ($device) {
            return response()->json($device, 200);
        } else {
            return response()->json(['message' => 'Device not found'], 404);
        }
    }
}