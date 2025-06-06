import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function SimpleChart({ data = [], period = 'annual' }) {
  console.log(`SimpleChart received data for ${period}:`, {
    dataLength: data ? data.length : 0,
    sampleData: data && data.length > 0 ? data.slice(0, 3) : null
  });
  
  if (!data || data.length === 0) {
    return (
      <View className="h-40 justify-center items-center bg-gray-700/30 rounded-xl border border-gray-600">
        <Feather name="bar-chart" size={32} color="#6b7280" />
        <Text className="text-gray-400 mt-3 text-center">
          No emission data available for {period}
        </Text>
        <Text className="text-gray-500 text-xs mt-1">
          Data will appear here once available
        </Text>
      </View>
    );
  }

  // Calculate chart metrics
  const maxValue = Math.max(...data.map(item => item.totalTon));
  const minValue = Math.min(...data.map(item => item.totalTon));
  const avgValue = data.reduce((sum, item) => sum + item.totalTon, 0) / data.length;
  
  // Prepare display data (limit to prevent overcrowding)
  const displayData = period === 'daily' ? data.slice(-30) : data.slice(-12); // Show last 30 days or 12 months/years
  
  // Helper to get formatted label
  const getLabel = (item, index) => {
    switch (period) {
      case 'annual':
        return item.year || (2020 + index);
      case 'monthly':
        if (item.month) {
          const [year, monthNum] = item.month.split('-');
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const month = monthNames[parseInt(monthNum) - 1] || monthNum;
          return `${month} ${year.slice(-2)}`;
        }
        return `M${index + 1}`;
      case 'daily':
        if (item.date) {
          const [year, month, day] = item.date.split('-');
          return `${day}/${month}`;
        }
        return `D${index + 1}`;
      default:
        return index + 1;
    }
  };

  // Get formatted date for display
  const getFormattedDateRange = () => {
    if (displayData.length === 0) return '';
    
    const first = displayData[0];
    const last = displayData[displayData.length - 1];
    
    switch (period) {
      case 'monthly':
        if (first.month && last.month) {
          return `${first.month} to ${last.month}`;
        }
        break;
      case 'daily':
        if (first.date && last.date) {
          return `${first.date} to ${last.date}`;
        }
        break;
      default:
        return '';
    }
    return '';
  };

  return (
    <View className="bg-gray-700/20 rounded-xl border border-gray-600 overflow-hidden">
      {/* Chart Header */}
      <View className="p-4 border-b border-gray-600">
        <View className="flex-row items-center justify-between">
          <Text className="text-white font-bold text-lg">
            {period.charAt(0).toUpperCase() + period.slice(1)} Emissions
          </Text>
          <View className="flex-row items-center">
            <Feather name="trending-up" size={16} color="#3b82f6" />
            <Text className="text-blue-400 text-sm ml-1">
              {data.length} data points
            </Text>
          </View>
        </View>
        
        {/* Date Range */}
        {getFormattedDateRange() && (
          <Text className="text-gray-400 text-xs mt-1">
            Range: {getFormattedDateRange()}
          </Text>
        )}
        
        {/* Quick Stats */}
        <View className="flex-row justify-between mt-3">
          <View className="items-center">
            <Text className="text-xs text-gray-400">MAX</Text>
            <Text className="text-sm font-bold text-red-400">
              {maxValue.toFixed(4)}t
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-gray-400">AVG</Text>
            <Text className="text-sm font-bold text-yellow-400">
              {avgValue.toFixed(4)}t
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-gray-400">MIN</Text>
            <Text className="text-sm font-bold text-green-400">
              {minValue.toFixed(4)}t
            </Text>
          </View>
        </View>
      </View>

      {/* Chart Body */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-4">
        <View className="flex-row items-end justify-between h-32">
          {displayData.map((item, index) => {
            const height = maxValue > 0 ? (item.totalTon / maxValue) * 100 : 10;
            const isAboveAvg = item.totalTon > avgValue;
            
            return (
              <View key={index} className="items-center mx-1" style={{ minWidth: period === 'daily' ? 35 : 45 }}>
                {/* Value Label */}
                <Text className="text-xs text-gray-300 mb-1 text-center">
                  {item.totalTon.toFixed(4)}
                </Text>
                
                {/* Bar */}
                <View className="items-center justify-end" style={{ height: 100 }}>
                  <View
                    className={`w-6 rounded-t-md ${
                      isAboveAvg ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{
                      height: Math.max(8, height),
                    }}
                  >
                    {/* Gradient effect */}
                    <View 
                      className={`w-full h-2 rounded-t-md ${
                        isAboveAvg ? 'bg-red-400' : 'bg-blue-400'
                      }`} 
                    />
                  </View>
                </View>
                
                {/* Label */}
                <Text className="text-xs text-gray-500 mt-2 text-center" numberOfLines={1}>
                  {getLabel(item, index)}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Chart Footer */}
      <View className="p-4 border-t border-gray-600">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded bg-blue-500 mr-2" />
            <Text className="text-xs text-gray-400">Below Average</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded bg-red-500 mr-2" />
            <Text className="text-xs text-gray-400">Above Average</Text>
          </View>
        </View>
        
        {((period === 'daily' && data.length > 30) || (period !== 'daily' && data.length > 12)) && (
          <Text className="text-center text-gray-500 text-xs mt-2">
            Showing last {period === 'daily' ? 30 : 12} of {data.length} data points
          </Text>
        )}
      </View>
    </View>
  );
} 