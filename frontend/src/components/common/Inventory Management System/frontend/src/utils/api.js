import axios from 'axios';

const API_URL = 'http://localhost:8000/api/devices';

export const fetchDevices = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching devices:', error);
    throw error;
  }
};

export const submitDevice = async (deviceData) => {
  try {
    const response = await axios.post(API_URL, deviceData);
    return response.data;
  } catch (error) {
    console.error('Error submitting device:', error);
    throw error;
  }
};