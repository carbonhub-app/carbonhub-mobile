import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const chartWidth = width - 80; // Account for padding
const chartHeight = 160;

export default function EmissionChart({ data = [], period = 'annual' }) {
  console.log(`EmissionChart received data for ${period}:`, data);
  
  if (!data || data.length === 0) {
    return (
      <View className="h-40 justify-center items-center bg-gray-700/30 rounded-xl border border-gray-600 mx-2">
        <Feather name="bar-chart" size={32} color="#6b7280" />
        <Text className="text-gray-400 mt-3 text-center">
          No emission data available
        </Text>
      </View>
    );
  }

  // Safety check for data validity
  const validData = data.filter(item => item && typeof item.totalTon === 'number' && !isNaN(item.totalTon));
  
  if (validData.length === 0) {
    return (
      <View className="h-40 justify-center items-center bg-gray-700/30 rounded-xl border border-gray-600 mx-2">
        <Feather name="alert-triangle" size={32} color="#f59e0b" />
        <Text className="text-gray-400 mt-3 text-center">
          Invalid emission data format
        </Text>
      </View>
    );
  }

  const maxValue = Math.max(...validData.map(item => item.totalTon));
  const minValue = Math.min(...validData.map(item => item.totalTon));
  
  const getBarHeight = (value) => {
    if (maxValue === minValue) return chartHeight * 0.5;
    return Math.max(8, (value / maxValue) * chartHeight);
  };

  const formatLabel = (item) => {
    try {
      switch (period) {
        case 'annual':
          return item.year?.toString() || 'N/A';
        case 'monthly':
          // Format "2025-02" to "Feb 25"
          if (item.month) {
            const [year, month] = item.month.split('-');
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${monthNames[parseInt(month) - 1]} ${year.slice(-2)}`;
          }
          return 'N/A';
        case 'daily':
          // Format "2025-02-01" to "02/01"
          if (item.date) {
            const dateParts = item.date.split('-');
            return `${dateParts[1]}/${dateParts[2]}`;
          }
          return 'N/A';
        default:
          return item.year?.toString() || item.month || item.date || 'N/A';
      }
    } catch (error) {
      console.error('Error formatting label:', error, item);
      return 'N/A';
    }
  };

  const getBarColor = (value) => {
    const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
    if (percentage > 80) return '#ef4444'; // Red for high emissions
    if (percentage > 40) return '#f59e0b'; // Yellow for medium emissions
    return '#10b981'; // Green for low emissions
  };

  // Limit data points for better display
  const displayData = validData.slice(0, period === 'daily' ? 15 : period === 'monthly' ? 12 : 8);

  return (
    <View className="bg-gray-700/20 rounded-xl p-4 border border-gray-600">
      {/* Chart Area */}
      <View className="mb-6" style={{ height: chartHeight + 40 }}>
        <View className="flex-row items-end justify-between h-full px-2">
          {displayData.map((item, index) => {
            const barHeight = getBarHeight(item.totalTon);
            const barColor = getBarColor(item.totalTon);
            
            return (
              <View key={index} className="items-center flex-1 mx-1">
                {/* Value Label */}
                <Text className="text-xs text-gray-400 mb-2 text-center">
                  {item.totalTon.toFixed(3)}
                </Text>
                
                {/* Bar */}
                <View
                  className="w-full rounded-t-md"
                  style={{
                    height: barHeight,
                    backgroundColor: barColor,
                    minHeight: 8,
                  }}
                />
                
                {/* Period Label */}
                <Text className="text-xs text-gray-500 mt-2 text-center">
                  {formatLabel(item)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Legend */}
      <View className="flex-row justify-center space-x-6 pt-4 border-t border-gray-600">
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
          <Text className="text-xs text-gray-400">Low</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
          <Text className="text-xs text-gray-400">Medium</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full bg-red-500 mr-2" />
          <Text className="text-xs text-gray-400">High</Text>
        </View>
      </View>
    </View>
  );
} 