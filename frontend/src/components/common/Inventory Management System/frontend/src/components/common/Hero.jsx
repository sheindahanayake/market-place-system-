// filepath: f:\Inventory Management System\frontend\src\components\common\ViewReport.jsx
import React, { useEffect, useState } from 'react';
import { fetchDevices } from '../../utils/api';

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
      <h1 className="text-3xl font-bold mb-4">Device Repair Reports</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Device Type</th>
            <th className="border px-4 py-2">RSC/Manager</th>
            <th className="border px-4 py-2">WSP/WTP</th>
            <th className="border px-4 py-2">In Charge EMP No</th>
            <th className="border px-4 py-2">Brand</th>
            <th className="border px-4 py-2">Model</th>
            <th className="border px-4 py-2">Serial Number</th>
            <th className="border px-4 py-2">Asset Number</th>
            <th className="border px-4 py-2">Purchase Date</th>
            <th className="border px-4 py-2">Warranty Expiry Date</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device.serialNumber}>
              <td className="border px-4 py-2">{device.deviceType}</td>
              <td className="border px-4 py-2">{device.rscManager}</td>
              <td className="border px-4 py-2">{device.wspWtp}</td>
              <td className="border px-4 py-2">{device.inChargeEmpNo}</td>
              <td className="border px-4 py-2">{device.brand}</td>
              <td className="border px-4 py-2">{device.model}</td>
              <td className="border px-4 py-2">{device.serialNumber}</td>
              <td className="border px-4 py-2">{device.assetNumber}</td>
              <td className="border px-4 py-2">{device.purchaseDate}</td>
              <td className="border px-4 py-2">{device.warrantyExpiryDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewReport;