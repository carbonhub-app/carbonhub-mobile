const BASE_URL = 'https://api.carbonhub.app';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Check API response format
  if (data.status === 'success') {
    return data.data;
  } else {
    throw new Error(data.message || 'API request failed');
  }
};

// Get all companies with annual emissions preview
export const getCompanies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/emission/companies`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

// Get annual emissions for a specific company
export const getAnnualEmissions = async (companyId) => {
  try {
    const response = await fetch(`${BASE_URL}/emission/annual/${companyId}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching annual emissions:', error);
    throw error;
  }
};

// Get monthly emissions for a specific company
export const getMonthlyEmissions = async (companyId) => {
  try {
    const response = await fetch(`${BASE_URL}/emission/monthly/${companyId}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching monthly emissions:', error);
    throw error;
  }
};

// Get daily emissions for a specific company
export const getDailyEmissions = async (companyId) => {
  try {
    const response = await fetch(`${BASE_URL}/emission/daily/${companyId}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching daily emissions:', error);
    throw error;
  }
}; 