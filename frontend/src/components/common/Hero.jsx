import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const [lookupData, setLookupData] = useState({
    assetNumber: "",
    serialNumber: "",
  });

  const [formData, setFormData] = useState({
    rscManager: "",
    wspWtp: "",
    inChargeEmpNo: "",
    ipAddress: "",
    macAddress: "",
    pcDeviceName: "",
    connectionType: "",
    connectedNetwork: "",
    vpnCircuitId: "",
    vpnDongleUserName: "",
    tightVncInstalled: "",
    anyDeskId: "",
    deviceType: "",
    brand: "",
    model: "",
    serialNumber: "",
    assetNumber: "",
    purchaseDate: "",
    warrantyExpiryDate: "",
    monitorSerialNumber: "",
    condition: "",
    repairAgent: "",
    sentOn: "",
    lastServicedDate: "",
    authorizedAgent: "",
    maintenanceAgreement: "",
    maintenanceAgreementFrom: "",
    maintenanceAgreementTo: "",
    windowsOS: "",
    officeVersion: "",
    virusGuardInstalled: "",
    virusGuardName: "",
    virusGuardExpiryDate: "",
    processorBrand: "",
    processorModel: "",
    cpuSpeed: "",
    ramTypeCapacity: "",
    storageType: "",
    storageCapacity: "",
    dedicatedGpu: "",
    gpuModel: "",
    upgradable: "",
    upgradeOn: "",
    upgradePartSerialNo: "",
    upgradePartInvoiceNoDate: "",
    motherboard: "",
    processor: "",
    ram: "",
    storage: "",
    gpu: "",
    printerType: "",
    supportedPaperSizes: "",
    consumableType: "",
    consumableModel: "",
    printScanSpeed: "",
    monitorBrand: "",
    monitorSerialNumber: "",
    monitorSize: "",
    keyboardBrand: "",
    keyboardSerialNumber: "",
    mouseBrand: "",
    mouseSerialNumber: "",
  });

  const [popupMessage, setPopupMessage] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(true);
  const [noRecordFound, setNoRecordFound] = useState(false);
  const [isReportView, setIsReportView] = useState(false); // State for report view

  const navigate = useNavigate();

  const handleLookupChange = (e) => {
    const { name, value } = e.target;
    setLookupData({ ...lookupData, [name]: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLookup = async (e) => {
    e.preventDefault();

    try {
      if (!lookupData.assetNumber && !lookupData.serialNumber) {
        setPopupMessage("Please enter either Asset Number or Serial Number");
        setIsPopupVisible(true);
        return;
      }

      const response = await fetch(`http://localhost:8000/api/devices/lookup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assetNumber: lookupData.assetNumber || null,
          serialNumber: lookupData.serialNumber || null,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        if (result.found) {
          setFormData({
            ...result.data,
            assetNumber: lookupData.assetNumber,
            serialNumber: lookupData.serialNumber,
          });
          setIsSearching(false);
          setNoRecordFound(false);
          setIsReportView(true); // Show report view
        } else {
          setNoRecordFound(true);
          setFormData({
            ...formData,
            assetNumber: lookupData.assetNumber,
            serialNumber: lookupData.serialNumber,
          });
          setIsSearching(false);
        }
      } else {
        console.error("Failed to look up asset:", response.statusText);
        setPopupMessage("Failed to find asset. Please try again.");
        setIsPopupVisible(true);
      }
    } catch (error) {
      console.error("Error looking up asset:", error);
      setPopupMessage("An error occurred. Please try again.");
      setIsPopupVisible(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your logic to handle form submission here
    console.log("Form submitted:", formData);
    setPopupMessage("Data has been stored successfully!");
    setIsPopupVisible(true);
  };

  const resetForm = () => {
    setIsSearching(true);
    setNoRecordFound(false);  
    setIsReportView(false);
    setLookupData({
      assetNumber: "",
      serialNumber: "",
    });
    setFormData({
      rscManager: "",
      wspWtp: "",
      inChargeEmpNo: "",
      ipAddress: "",
      macAddress: "",
      pcDeviceName: "",
      connectionType: "",
      connectedNetwork: "",
      vpnCircuitId: "",
      vpnDongleUserName: "",
      tightVncInstalled: "",
      anyDeskId: "",
      deviceType: "",
      brand: "",
      model: "",
      serialNumber: "",
      assetNumber: "",
      purchaseDate: "",
      warrantyExpiryDate: "",
      monitorSerialNumber: "",
      condition: "",
      repairAgent: "",
      sentOn: "",
      lastServicedDate: "",
      authorizedAgent: "",
      maintenanceAgreement: "",
      maintenanceAgreementFrom: "",
      maintenanceAgreementTo: "",
      windowsOS: "",
      officeVersion: "",
      virusGuardInstalled: "",
      virusGuardName: "",
      virusGuardExpiryDate: "",
      processorBrand: "",
      processorModel: "",
      cpuSpeed: "",
      ramTypeCapacity: "",
      storageType: "",
      storageCapacity: "",
      dedicatedGpu: "",
      gpuModel: "",
      upgradable: "",
      upgradeOn: "",
      upgradePartSerialNo: "",
      upgradePartInvoiceNoDate: "",
      motherboard: "",
      processor: "",
      ram: "",
      storage: "",
      gpu: "",
      printerType: "",
      supportedPaperSizes: "",
      consumableType: "",
      consumableModel: "",
      printScanSpeed: "",
      monitorBrand: "",
      monitorSerialNumber: "",
      monitorSize: "",
      keyboardBrand: "",
      keyboardSerialNumber: "",
      mouseBrand: "",
      mouseSerialNumber: "",
    });
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    if (popupMessage === "Data has been stored successfully!") {
      resetForm();
    }
  };

  const handleBackToForm = () => {
    setIsReportView(false);
  };

  return (
    <div
      className="relative bg-gradient-to-r from-green-500 to-teal-500 h-full"
      style={{
        backgroundImage:
          "url(/src/assets/images/pexels-tima-miroshnichenko-6169641.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl [text-shadow:_-2px_-2px_0px_black,_2px_-2px_0px_black,_-2px_2px_0px_black,_2px_2px_0px_black]">
            Inventory Management System
          </h1>

          {isReportView ? (
            <div className="mt-8 space-y-6 bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Asset Report</h2>
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Field</th>
                    <th className="border border-gray-300 px-4 py-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(formData).map(([key, value]) => (
                    <tr key={key}>
                      <td className="border border-gray-300 px-4 py-2 font-bold">
                        {key}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {value || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={handleBackToForm}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Back to Form
              </button>
            </div>
          ) : isSearching ? (
            <form onSubmit={handleLookup} className="mt-8 space-y-6">
              <div className="space-y-4 border border-gray-300 p-4 rounded-lg bg-black bg-opacity-40">
                <label className="block text-white text-lg font-bold mb-2">
                  Asset Lookup
                </label>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    name="assetNumber"
                    value={lookupData.assetNumber}
                    onChange={handleLookupChange}
                    placeholder="Asset Number"
                    className="w-full px-4 py-2 rounded-lg shadow-lg focus:outline-none"
                  />
                  <input
                    type="text"
                    name="serialNumber"
                    value={lookupData.serialNumber}
                    onChange={handleLookupChange}
                    placeholder="Serial Number"
                    className="w-full px-4 py-2 rounded-lg shadow-lg focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none"
                >
                  Find Asset
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {noRecordFound && (
                <div className="p-4 mb-4 border border-red-300 bg-red-100 text-red-700 rounded-lg">
                  No records found for this Asset Number and Serial Number.
                  Please fill in the details below.
                </div>
              )}

              <div className="space-y-4 border border-gray-300 p-4 rounded-lg bg-black bg-opacity-40">
                <label className="block text-white text-lg font-bold mb-2">
                  General Information
                </label>
                <div className="flex space-x-4">
                  <select
                    name="deviceType"
                    value={formData.deviceType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg shadow-lg focus:outline-none"
                  >
                    <option value="">Device Type</option>
                    <option value="pc">PC</option>
                    <option value="monitor">Monitor</option>
                    <option value="laptop">Laptop</option>
                    <option value="projector">Projector</option>
                    <option value="tab">Tab</option>
                    <option value="smartBoard">Smart Board</option>
                    <option value="smartDisplay">Smart Display</option>
                    <option value="television">Television</option>
                    <option value="printer">Printer</option>
                    <option value="photocopier">Photocopier</option>
                    <option value="webCam">Web Cam</option>
                    <option value="camera">Camera</option>
                    <option value="externalHard">External Hard</option>
                    <option value="speaker">Speaker</option>
                    <option value="ups">UPS</option>
                    <option value="switch">Switch</option>
                    <option value="router">Router</option>
                    <option value="accessPoint">Access Point</option>
                    <option value="phone">Phone</option>
                  </select>
                  <input
                    type="text"
                    name="rscManager"
                    value={formData.rscManager}
                    onChange={handleChange}
                    placeholder="RSC/Manager"
                    className="w-full px-4 py-2 rounded-lg shadow-lg focus:outline-none"
                  />
                  <input
                    type="text"
                    name="wspWtp"
                    value={formData.wspWtp}
                    onChange={handleChange}
                    placeholder="WSP/WTP"
                    className="w-full px-4 py-2 rounded-lg shadow-lg focus:outline-none"
                  />
                  <input
                    type="text"
                    name="inChargeEmpNo"
                    value={formData.inChargeEmpNo}
                    onChange={handleChange}
                    placeholder="In Charge EMP No"
                    className="w-full px-4 py-2 rounded-lg shadow-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none"
                >
                  Submit Device
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-4 py-2 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none"
                >
                  Search Again
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-bold">{popupMessage}</p>
            <button
              onClick={closePopup}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Hero;