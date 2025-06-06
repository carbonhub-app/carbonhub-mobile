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

// Get specific company details with annual emissions
export const getCompanyDetail = async (companyId) => {
  try {
    // Get company basic info from companies list
    const allCompanies = await getCompanies();
    const company = allCompanies.find(c => c.id === parseInt(companyId) || c.id === companyId);
    
    if (!company) {
      throw new Error('Company not found');
    }

    // Get annual emissions data for this company
    const annualData = await getAnnualEmissions(companyId);
    
    // Combine company info with annual emissions
    return {
      data: {
        ...company,
        annual_emissions: annualData
      }
    };
  } catch (error) {
    console.error('Error fetching company detail:', error);
    throw error;
  }
};

// Get annual emissions for a specific company
export const getAnnualEmissions = async (companyId) => {
  try {
    console.log(`Fetching annual emissions for company ${companyId}`);
    const url = `${BASE_URL}/emission/annual/${companyId}`;
    console.log(`Annual emissions URL: ${url}`);
    
    const response = await fetch(url);
    const data = await handleResponse(response);
    console.log('Annual emissions data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching annual emissions:', error);
    throw error;
  }
};

// Get monthly emissions for a specific company
export const getMonthlyEmissions = async (companyId) => {
  try {
    console.log(`Fetching monthly emissions for company ${companyId}`);
    const url = `${BASE_URL}/emission/monthly/${companyId}`;
    console.log(`Monthly emissions URL: ${url}`);
    
    const response = await fetch(url);
    const data = await handleResponse(response);
    console.log('Monthly emissions data received:', data);
    console.log(`Monthly data count: ${data ? data.length : 0} items`);
    return data;
  } catch (error) {
    console.error('Error fetching monthly emissions:', error);
    console.error('Error details:', error.message);
    throw error;
  }
};

// Get daily emissions for a specific company
export const getDailyEmissions = async (companyId) => {
  try {
    console.log(`Fetching daily emissions for company ${companyId}`);
    const url = `${BASE_URL}/emission/daily/${companyId}`;
    console.log(`Daily emissions URL: ${url}`);
    
    const response = await fetch(url);
    const data = await handleResponse(response);
    console.log('Daily emissions data received:', data);
    console.log(`Daily data count: ${data ? data.length : 0} items`);
    return data;
  } catch (error) {
    console.error('Error fetching daily emissions:', error);
    console.error('Error details:', error.message);
    throw error;
  }
}; 