import React, { useEffect, useState } from "react";
import { fetchDevices } from "../../utils/api";

function ViewReport() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const data = await fetchDevices();
        setDevices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getDevices();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold mb-6">Device Repair Reports</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Device Type</th>
            <th className="py-2 px-4 border-b">RSC/Manager</th>
            <th className="py-2 px-4 border-b">WSP/WTP</th>
            <th className="py-2 px-4 border-b">In Charge EMP No</th>
            <th className="py-2 px-4 border-b">Brand</th>
            <th className="py-2 px-4 border-b">Model</th>
            <th className="py-2 px-4 border-b">Serial Number</th>
            <th className="py-2 px-4 border-b">Asset Number</th>
            <th className="py-2 px-4 border-b">Purchase Date</th>
            <th className="py-2 px-4 border-b">Warranty Expiry Date</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device.serialNumber}>
              <td className="py-2 px-4 border-b">{device.deviceType}</td>
              <td className="py-2 px-4 border-b">{device.rscManager}</td>
              <td className="py-2 px-4 border-b">{device.wspWtp}</td>
              <td className="py-2 px-4 border-b">{device.inChargeEmpNo}</td>
              <td className="py-2 px-4 border-b">{device.brand}</td>
              <td className="py-2 px-4 border-b">{device.model}</td>
              <td className="py-2 px-4 border-b">{device.serialNumber}</td>
              <td className="py-2 px-4 border-b">{device.assetNumber}</td>
              <td className="py-2 px-4 border-b">{device.purchaseDate}</td>
              <td className="py-2 px-4 border-b">{device.warrantyExpiryDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewReport;