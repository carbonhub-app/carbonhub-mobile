import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getAnnualEmissions, getMonthlyEmissions, getDailyEmissions } from '../services/api';
import EmissionChart from '../components/EmissionChart';
import TabSelector from '../components/TabSelector';

const timeRangeOptions = [
  { label: 'Annual', value: 'annual' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Daily', value: 'daily' },
];

export default function CompanyDetailScreen({ route }) {
  const { companyId, companyName } = route.params;
  const { theme } = useTheme();
  const [emissionData, setEmissionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('annual');
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    loadEmissionData();
  }, [selectedTimeRange]);

  const loadEmissionData = async () => {
    try {
      setLoading(true);
      let data = [];
      
      switch (selectedTimeRange) {
        case 'annual':
          data = await getAnnualEmissions(companyId);
          break;
        case 'monthly':
          data = await getMonthlyEmissions(companyId);
          break;
        case 'daily':
          data = await getDailyEmissions(companyId);
          break;
        default:
          data = await getAnnualEmissions(companyId);
      }
      
      setEmissionData(data);
    } catch (error) {
      Alert.alert('Error', `Failed to load ${selectedTimeRange} emissions data`);
      console.error('Error loading emission data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalEmissions = () => {
    return emissionData.reduce((total, item) => total + (item.totalTon || 0), 0);
  };

  const getAverageEmissions = () => {
    if (emissionData.length === 0) return 0;
    return getTotalEmissions() / emissionData.length;
  };

  const isDark = theme === 'dark';

  return (
    <View className="flex-1 bg-white dark:bg-secondary-900">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 py-6 border-b border-secondary-200 dark:border-secondary-700">
          <Text className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
            {companyName}
          </Text>
          <Text className="text-sm text-secondary-600 dark:text-secondary-400">
            Carbon Emissions Overview
          </Text>
        </View>

        {/* Stats Cards */}
        {!loading && emissionData.length > 0 && (
          <View className="px-4 py-4">
            <View className="flex-row gap-4 mb-6">
              <View className={`flex-1 p-4 rounded-lg border ${
                isDark ? 'bg-secondary-800 border-secondary-700' : 'bg-white border-secondary-200'
              }`}>
                <Text className={`text-xs font-medium mb-1 ${
                  isDark ? 'text-secondary-400' : 'text-secondary-500'
                }`}>
                  Total Emissions
                </Text>
                <Text className={`text-xl font-bold ${
                  isDark ? 'text-white' : 'text-secondary-900'
                }`}>
                  {getTotalEmissions().toFixed(2)}t
                </Text>
              </View>
              
              <View className={`flex-1 p-4 rounded-lg border ${
                isDark ? 'bg-secondary-800 border-secondary-700' : 'bg-white border-secondary-200'
              }`}>
                <Text className={`text-xs font-medium mb-1 ${
                  isDark ? 'text-secondary-400' : 'text-secondary-500'
                }`}>
                  Average Per Period
                </Text>
                <Text className={`text-xl font-bold ${
                  isDark ? 'text-white' : 'text-secondary-900'
                }`}>
                  {getAverageEmissions().toFixed(2)}t
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Time Range Selector */}
        <View className="px-4 mb-4">
          <TabSelector
            options={timeRangeOptions}
            selectedOption={selectedTimeRange}
            onSelect={setSelectedTimeRange}
            theme={theme}
          />
        </View>

        {/* Chart Type Selector */}
        <View className="px-4 mb-4">
          <TabSelector
            options={[
              { label: 'Line Chart', value: 'line' },
              { label: 'Bar Chart', value: 'bar' },
            ]}
            selectedOption={chartType}
            onSelect={setChartType}
            theme={theme}
          />
        </View>

        {/* Chart */}
        <View className="px-4 mb-6">
          {loading ? (
            <View className={`h-48 justify-center items-center rounded-lg border ${
              isDark ? 'bg-secondary-800 border-secondary-700' : 'bg-white border-secondary-200'
            }`}>
              <ActivityIndicator size="large" color="#0ea5e9" />
              <Text className={`mt-2 text-sm ${
                isDark ? 'text-secondary-400' : 'text-secondary-500'
              }`}>
                Loading {selectedTimeRange} data...
              </Text>
            </View>
          ) : (
            <EmissionChart
              data={emissionData}
              type={chartType}
              theme={theme}
            />
          )}
        </View>

        {/* Data Points Summary */}
        {!loading && emissionData.length > 0 && (
          <View className="px-4 mb-6">
            <View className={`p-4 rounded-lg border ${
              isDark ? 'bg-secondary-800 border-secondary-700' : 'bg-white border-secondary-200'
            }`}>
              <Text className={`text-lg font-semibold mb-3 ${
                isDark ? 'text-white' : 'text-secondary-900'
              }`}>
                Data Summary
              </Text>
              <Text className={`text-sm mb-2 ${
                isDark ? 'text-secondary-300' : 'text-secondary-600'
              }`}>
                📊 {emissionData.length} data points ({selectedTimeRange})
              </Text>
              <Text className={`text-sm mb-2 ${
                isDark ? 'text-secondary-300' : 'text-secondary-600'
              }`}>
                🏆 Highest: {Math.max(...emissionData.map(d => d.totalTon || 0)).toFixed(2)}t CO₂
              </Text>
              <Text className={`text-sm ${
                isDark ? 'text-secondary-300' : 'text-secondary-600'
              }`}>
                📉 Lowest: {Math.min(...emissionData.map(d => d.totalTon || 0)).toFixed(2)}t CO₂
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
} 