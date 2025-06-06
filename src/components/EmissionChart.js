import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-gifted-charts';

const screenWidth = Dimensions.get('window').width;

export default function EmissionChart({ data, type = 'line', theme }) {
  const isDark = theme === 'dark';
  
  if (!data || data.length === 0) {
    return (
      <View className={`h-48 justify-center items-center rounded-lg border ${
        isDark ? 'bg-secondary-800 border-secondary-700' : 'bg-white border-secondary-200'
      }`}>
        <Text className={`text-sm ${isDark ? 'text-secondary-400' : 'text-secondary-500'}`}>
          No data available
        </Text>
      </View>
    );
  }

  // Transform data for gifted-charts
  const chartData = data.map((item, index) => ({
    value: item.totalTon || 0,
    label: item.year || item.month || item.date || index.toString(),
    dataPointText: `${(item.totalTon || 0).toFixed(1)}t`,
  }));

  const maxValue = Math.max(...chartData.map(item => item.value));
  const chartWidth = screenWidth - 40; // Account for padding

  const commonProps = {
    data: chartData,
    width: chartWidth,
    height: 200,
    color: '#0ea5e9',
    thickness: 3,
    startFillColor: '#0ea5e9',
    endFillColor: '#0ea5e980',
    startOpacity: 0.9,
    endOpacity: 0.2,
    backgroundColor: 'transparent',
    hideRules: true,
    hideYAxisText: false,
    hideDataPoints: false,
    dataPointsColor: '#0ea5e9',
    dataPointsRadius: 4,
    textShiftY: -8,
    textShiftX: -5,
    textFontSize: 10,
    showVerticalLines: false,
    rulesColor: isDark ? '#475569' : '#e2e8f0',
    rulesThickness: 1,
    xAxisColor: isDark ? '#64748b' : '#94a3b8',
    yAxisColor: isDark ? '#64748b' : '#94a3b8',
    xAxisLabelTextStyle: {
      color: isDark ? '#cbd5e1' : '#64748b',
      fontSize: 10,
    },
    yAxisTextStyle: {
      color: isDark ? '#cbd5e1' : '#64748b',
      fontSize: 10,
    },
  };

  return (
    <View className={`p-4 rounded-lg shadow-sm border ${
      isDark ? 'bg-secondary-800 border-secondary-700' : 'bg-white border-secondary-200'
    }`}>
      <Text className={`text-lg font-semibold mb-4 ${
        isDark ? 'text-white' : 'text-secondary-900'
      }`}>
        Emission Trends
      </Text>
      
      <View className="items-center">
        {type === 'line' ? (
          <LineChart
            {...commonProps}
            curved={true}
            areaChart={true}
            animateOnDataChange={true}
            animationDuration={1000}
          />
        ) : (
          <BarChart
            {...commonProps}
            barWidth={Math.max(20, chartWidth / chartData.length - 10)}
            spacing={5}
            roundedTop={true}
            gradientColor="#38bdf8"
            frontColor="#0ea5e9"
          />
        )}
      </View>
      
      {maxValue > 0 && (
        <View className="mt-3 flex-row justify-between">
          <Text className={`text-xs ${
            isDark ? 'text-secondary-400' : 'text-secondary-500'
          }`}>
            Total Data Points: {chartData.length}
          </Text>
          <Text className={`text-xs ${
            isDark ? 'text-secondary-400' : 'text-secondary-500'
          }`}>
            Peak: {maxValue.toFixed(1)}t CO₂
          </Text>
        </View>
      )}
    </View>
  );
} 