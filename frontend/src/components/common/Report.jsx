import React, { useState } from "react";

function Report() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await fetch("http://localhost:8000/api/devices/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assetNumber: query,
          serialNumber: query,
        }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error("Please provide either an Asset Number or Serial Number.");
        } else if (response.status === 404) {
          throw new Error("Device not found.");
        } else {
          throw new Error("An unexpected error occurred.");
        }
      }

      const result = await response.json();
      setData(result.data); // Assuming the device data is in the `data` field
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-gradient-to-r from-blue-100 to-blue-100">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center bg-gradient-to-r from-blue-500 to-blue-500 text-white py-4 rounded-lg shadow-lg">
        Search Device Data
      </h1>
      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter Asset Number or Serial Number"
          className="border border-gray-300 px-4 py-2 rounded-lg w-full shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className={`px-4 py-2 rounded-lg text-white font-semibold shadow-lg transition-all ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-600 hover:to-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>
      {loading && (
        <div className="flex justify-center items-center my-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      )}
      {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
      {!data && !error && !loading ? (
        <p className="text-center text-gray-500">No data available. Please search for a device.</p>
      ) : (
        data && (
          <div className="border p-6 rounded-lg bg-white shadow-2xl">
            <h2 className="text-3xl font-bold text-blue-700 mb-4 text-center">Device Details</h2>
            <table className="min-w-full bg-gradient-to-r from-blue-50 to-blue-50 border border-gray-300 rounded-lg overflow-hidden shadow-md">
              <tbody>
                {Object.entries(data)
                  .filter(([key, value]) => value !== null && key !== "id")
                  .map(([key, value]) => (
                    <tr key={key} className="hover:bg-blue-100 transition-all">
                      <td className="border px-4 py-2 font-semibold text-blue-700 capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </td>
                      <td className="border px-4 py-2 text-gray-600">
                        {key === "created_at" || key === "updated_at" ? formatDate(value) : value || "N/A"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}

export default Report;