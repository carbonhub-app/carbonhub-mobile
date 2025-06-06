// Helper functions for formatting chart data

export const formatAnnualData = (data) => {
  if (!data || !Array.isArray(data)) return { labels: [], datasets: [] };

  const labels = data.map(item => item.year);
  const values = data.map(item => parseFloat(item.totalTon));

  return {
    labels,
    datasets: [
      {
        data: values,
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };
};

export const formatMonthlyData = (data) => {
  if (!data || !Array.isArray(data)) return { labels: [], datasets: [] };

  const labels = data.map(item => {
    const [year, month] = item.month.split('-');
    return `${month}/${year.slice(-2)}`;
  });
  const values = data.map(item => parseFloat(item.totalTon));

  return {
    labels,
    datasets: [
      {
        data: values,
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };
};

export const formatDailyData = (data) => {
  if (!data || !Array.isArray(data)) return { labels: [], datasets: [] };

  // For daily data, show only last 30 days to avoid overcrowding
  const recentData = data.slice(-30);
  
  const labels = recentData.map(item => {
    const date = new Date(item.date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });
  const values = recentData.map(item => parseFloat(item.totalTon));

  return {
    labels,
    datasets: [
      {
        data: values,
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };
};

export const getEmissionColor = (totalTon) => {
  if (totalTon < 0.5) return '#22c55e'; // Green for low emissions
  if (totalTon < 2) return '#eab308'; // Yellow for medium emissions
  return '#ef4444'; // Red for high emissions
};

// Helper functions for chart data transformation and formatting

/**
 * Transform annual emissions data for chart consumption
 * @param {Array} data - Array of {year, totalTon} objects
 * @returns {Array} Transformed data for chart rendering
 */
export const transformAnnualData = (data) => {
  if (!Array.isArray(data) || data.length === 0) return [];
  
  return data.map(item => ({
    label: item.year?.toString() || '',
    value: item.totalTon || 0,
    year: item.year,
    totalTon: item.totalTon,
    formatted: `${(item.totalTon || 0).toFixed(1)}t CO₂`,
  })).sort((a, b) => a.year - b.year);
};

/**
 * Transform monthly emissions data for chart consumption
 * @param {Array} data - Array of {month: "YYYY-MM", totalTon} objects
 * @returns {Array} Transformed data for chart rendering
 */
export const transformMonthlyData = (data) => {
  if (!Array.isArray(data) || data.length === 0) return [];
  
  return data.map(item => {
    const monthDate = new Date(item.month + '-01');
    const monthName = monthDate.toLocaleDateString('en-US', { 
      month: 'short',
      year: '2-digit'
    });
    
    return {
      label: monthName,
      value: item.totalTon || 0,
      month: item.month,
      totalTon: item.totalTon,
      formatted: `${(item.totalTon || 0).toFixed(1)}t CO₂`,
      sortKey: item.month,
    };
  }).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
};

/**
 * Transform daily emissions data for chart consumption
 * @param {Array} data - Array of {date: "YYYY-MM-DD", totalTon} objects
 * @returns {Array} Transformed data for chart rendering
 */
export const transformDailyData = (data) => {
  if (!Array.isArray(data) || data.length === 0) return [];
  
  return data.map(item => {
    const date = new Date(item.date);
    const dayLabel = date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric'
    });
    
    return {
      label: dayLabel,
      value: item.totalTon || 0,
      date: item.date,
      totalTon: item.totalTon,
      formatted: `${(item.totalTon || 0).toFixed(1)}t CO₂`,
      sortKey: item.date,
    };
  }).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
};

/**
 * Get chart data based on type and raw data
 * @param {string} type - 'annual', 'monthly', or 'daily'
 * @param {Array} rawData - Raw API response data
 * @returns {Array} Transformed chart data
 */
export const getChartData = (type, rawData) => {
  switch (type) {
    case 'annual':
      return transformAnnualData(rawData);
    case 'monthly':
      return transformMonthlyData(rawData);
    case 'daily':
      return transformDailyData(rawData);
    default:
      return transformAnnualData(rawData);
  }
};

/**
 * Calculate summary statistics for emissions data
 * @param {Array} data - Chart data array
 * @returns {Object} Summary statistics
 */
export const calculateStatistics = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      total: 0,
      average: 0,
      max: 0,
      min: 0,
      count: 0,
    };
  }
  
  const values = data.map(item => item.totalTon || item.value || 0);
  const total = values.reduce((sum, val) => sum + val, 0);
  
  return {
    total: Number(total.toFixed(2)),
    average: Number((total / values.length).toFixed(2)),
    max: Number(Math.max(...values).toFixed(2)),
    min: Number(Math.min(...values).toFixed(2)),
    count: values.length,
  };
};

/**
 * Format number with appropriate units and decimals
 * @param {number} value - Emission value in tons
 * @param {boolean} includeUnit - Whether to include "t CO₂" unit
 * @returns {string} Formatted emission value
 */
export const formatEmissionValue = (value, includeUnit = true) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return includeUnit ? '0.0 t CO₂' : '0.0';
  }
  
  let formatted;
  
  // Format based on magnitude
  if (value >= 1000000) {
    formatted = (value / 1000000).toFixed(1) + 'M';
  } else if (value >= 1000) {
    formatted = (value / 1000).toFixed(1) + 'K';
  } else {
    formatted = value.toFixed(1);
  }
  
  return includeUnit ? `${formatted} t CO₂` : formatted;
};

/**
 * Get color scheme based on emission levels
 * @param {number} value - Emission value
 * @param {number} maxValue - Maximum value in dataset
 * @returns {Object} Color scheme with hex values
 */
export const getEmissionColorScheme = (value, maxValue) => {
  const ratio = maxValue > 0 ? value / maxValue : 0;
  
  if (ratio <= 0.3) {
    return {
      primary: '#10b981',   // Green - Low emissions
      secondary: '#d1fae5',
      text: '#065f46',
    };
  } else if (ratio <= 0.7) {
    return {
      primary: '#f59e0b',   // Yellow - Medium emissions
      secondary: '#fef3c7',
      text: '#92400e',
    };
  } else {
    return {
      primary: '#ef4444',   // Red - High emissions
      secondary: '#fee2e2',
      text: '#991b1b',
    };
  }
};

/**
 * Generate trend analysis for emissions data
 * @param {Array} data - Time series emissions data (sorted by time)
 * @returns {Object} Trend analysis results
 */
export const analyzeTrend = (data) => {
  if (!Array.isArray(data) || data.length < 2) {
    return {
      trend: 'insufficient_data',
      direction: 'neutral',
      percentage: 0,
      description: 'Not enough data for trend analysis',
    };
  }
  
  const values = data.map(item => item.totalTon || item.value || 0);
  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));
  
  const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
  
  const change = secondAvg - firstAvg;
  const percentageChange = firstAvg > 0 ? (change / firstAvg) * 100 : 0;
  
  let trend, direction, description;
  
  if (Math.abs(percentageChange) < 5) {
    trend = 'stable';
    direction = 'neutral';
    description = 'Emissions are relatively stable';
  } else if (percentageChange > 0) {
    trend = 'increasing';
    direction = 'up';
    description = `Emissions increasing by ${Math.abs(percentageChange).toFixed(1)}%`;
  } else {
    trend = 'decreasing';
    direction = 'down';
    description = `Emissions decreasing by ${Math.abs(percentageChange).toFixed(1)}%`;
  }
  
  return {
    trend,
    direction,
    percentage: Number(percentageChange.toFixed(1)),
    description,
    firstPeriodAvg: Number(firstAvg.toFixed(2)),
    secondPeriodAvg: Number(secondAvg.toFixed(2)),
  };
};

/**
 * Prepare data for export (CSV format)
 * @param {Array} data - Chart data
 * @param {string} companyName - Company name
 * @param {string} dataType - Type of data (annual/monthly/daily)
 * @returns {string} CSV formatted string
 */
export const exportToCSV = (data, companyName, dataType) => {
  if (!Array.isArray(data) || data.length === 0) {
    return 'No data available for export';
  }
  
  const headers = ['Period', 'Emissions (tons CO₂)'];
  const rows = data.map(item => [
    item.year || item.month || item.date || item.label,
    item.totalTon || item.value || 0,
  ]);
  
  const csvContent = [
    `Company: ${companyName}`,
    `Data Type: ${dataType}`,
    `Generated: ${new Date().toISOString()}`,
    '',
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');
  
  return csvContent;
}; 