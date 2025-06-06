import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getCompanyDetail, getAnnualEmissions, getMonthlyEmissions, getDailyEmissions } from '../services/api';
import SimpleChart from '../components/SimpleChart';
import ErrorBoundary from '../components/ErrorBoundary';

export default function CompanyDetailScreen({ route }) {
  const { companyId, companyName } = route.params || {};
  const [company, setCompany] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Annual');
  const router = useRouter();

  const handleTabChange = useCallback((newTab) => {
    try {
      console.log('Tab change requested:', newTab);
      setSelectedTab(newTab);
    } catch (error) {
      console.error('Error changing tab:', error);
    }
  }, []);

  useEffect(() => {
    if (companyId) {
      loadCompanyDetail();
    }
  }, [companyId]);

  useEffect(() => {
    if (company && companyId) {
      loadChartData();
    }
  }, [selectedTab, company, companyId]);

  const loadCompanyDetail = async () => {
    try {
      const response = await getCompanyDetail(companyId);
      setCompany(response.data);
      setChartData(response.data.annual_emissions || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load company details');
    } finally {
      setLoading(false);
    }
  };

  const loadChartData = useCallback(async () => {
    if (!company) return;
    
    try {
      setChartLoading(true);
      let data = [];
      
      console.log(`Loading ${selectedTab} data for company ${companyId}`);
      
      switch (selectedTab) {
        case 'Annual':
          console.log('Fetching annual emissions...');
          data = await getAnnualEmissions(companyId);
          break;
        case 'Monthly':
          console.log('Fetching monthly emissions...');
          data = await getMonthlyEmissions(companyId);
          console.log('Monthly data format check:', data);
          break;
        case 'Daily':
          console.log('Fetching daily emissions...');
          data = await getDailyEmissions(companyId);
          console.log('Daily data format check:', data);
          break;
        default:
          data = company.annual_emissions || [];
      }
      
      console.log(`${selectedTab} data loaded successfully:`, {
        dataCount: data ? data.length : 0,
        firstItem: data && data.length > 0 ? data[0] : null,
        lastItem: data && data.length > 0 ? data[data.length - 1] : null
      });
      
      // Ensure data is an array
      if (!Array.isArray(data)) {
        console.warn(`${selectedTab} data is not an array:`, data);
        data = [];
      }
      
      setChartData(data);
    } catch (error) {
      console.error(`Error loading ${selectedTab} data:`, error);
      console.error('Error stack:', error.stack);
      Alert.alert('Error', `Failed to load ${selectedTab.toLowerCase()} data: ${error.message}`);
      // Set empty data on error to prevent crash
      setChartData([]);
    } finally {
      setChartLoading(false);
    }
  }, [company, selectedTab, companyId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900">
        <Feather name="loader" size={32} color="#3b82f6" />
        <Text className="text-base text-gray-300 mt-4">
          Loading company details...
        </Text>
      </View>
    );
  }

  if (!company) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900">
        <Feather name="alert-circle" size={48} color="#ef4444" />
        <Text className="text-lg text-gray-300 mt-4 text-center px-6">
          Company not found
        </Text>
      </View>
    );
  }

  // Process emissions data
  const emissions = company.annual_emissions || [];
  const totalEmissions = emissions.reduce((sum, emission) => sum + emission.totalTon, 0);
  const avgEmissions = emissions.length > 0 ? totalEmissions / emissions.length : 0;
  const maxEmissions = Math.max(...emissions.map(e => e.totalTon), 0);
  const minEmissions = Math.min(...emissions.map(e => e.totalTon), 0);

  const sustainabilityScore = totalEmissions < 0.1 ? 8.5 : 
                             totalEmissions < 1 ? 6.0 : 3.5;
  
  const getScoreColor = (score) => {
    if (score >= 8) return '#10b981'; // Green
    if (score >= 6) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const getSustainabilityStatus = (score) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    return 'Needs Improvement';
  };

  const getTrendStatus = () => {
    if (emissions.length < 2) return 'N/A';
    const recent = emissions[emissions.length - 1].totalTon;
    const previous = emissions[emissions.length - 2].totalTon;
    return recent < previous ? 'Improving' : recent > previous ? 'Declining' : 'Stable';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'Improving': return 'trending-down';
      case 'Declining': return 'trending-up';
      case 'Stable': return 'minus';
      default: return 'minus';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'Improving': return '#10b981';
      case 'Declining': return '#ef4444';
      case 'Stable': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="px-6 pt-16 pb-6 bg-gray-900">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center"
          >
            <Feather name="chevron-left" size={20} color="#3b82f6" />
            <Text className="text-base text-blue-500 ml-2">Back</Text>
          </TouchableOpacity>
        </View>
        
        <View className="flex-row items-center">
          <Feather name="users" size={24} color="#10b981" />
          <Text className="text-2xl font-bold text-white ml-3">
            {companyName}
          </Text>
        </View>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Sustainability Overview Card */}
        <View className="mx-6 mb-8 p-6 rounded-2xl bg-gray-800/80 border border-gray-700">
          <View className="flex-row items-center mb-4">
            <Feather name="shield" size={20} color="#10b981" />
            <Text className="text-xl font-bold text-white ml-3">
              Sustainability Overview
            </Text>
          </View>
          
          <Text className="text-gray-400 mb-6">
            Current performance metrics and environmental impact
          </Text>
          
          {/* Progress Bar */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Feather name="award" size={14} color={getScoreColor(sustainabilityScore)} />
                <Text className="text-base font-semibold ml-2" style={{ color: getScoreColor(sustainabilityScore) }}>
                  {sustainabilityScore}/10
                </Text>
              </View>
            </View>
            
            <View className="h-3 rounded-full bg-gray-700">
              <View 
                className="h-3 rounded-full"
                style={{ 
                  width: `${sustainabilityScore * 10}%`,
                  backgroundColor: getScoreColor(sustainabilityScore)
                }}
              />
            </View>
          </View>
          
          <View className="flex-row items-center">
            <Feather name="minus" size={14} color="#6b7280" />
            <Text className="text-sm text-gray-400 ml-2">
              Trend: {getTrendStatus()}
            </Text>
          </View>
        </View>

        {/* Statistics Cards */}
        <View className="px-6 mb-8">
          <View className="flex-row justify-between">
            <View className="flex-1 p-4 rounded-xl bg-gray-800/50 border border-gray-700 mr-2">
              <View className="items-center">
                <Feather name="globe" size={18} color="#3b82f6" />
                <Text className="text-sm font-bold text-white mt-2">
                  {totalEmissions.toFixed(3)}t
                </Text>
                <Text className="text-xs text-gray-400 text-center mt-1">
                  Total CO₂
                </Text>
              </View>
            </View>
            
            <View className="flex-1 p-4 rounded-xl bg-gray-800/50 border border-gray-700 mx-1">
              <View className="items-center">
                <Feather name="bar-chart" size={18} color="#f59e0b" />
                <Text className="text-sm font-bold text-white mt-2">
                  {avgEmissions.toFixed(3)}t
                </Text>
                <Text className="text-xs text-gray-400 text-center mt-1">
                  Average
                </Text>
              </View>
            </View>
            
            <View className="flex-1 p-4 rounded-xl bg-gray-800/50 border border-gray-700 ml-2">
              <View className="items-center">
                <Feather 
                  name={getTrendIcon(getTrendStatus())} 
                  size={18} 
                  color={getTrendColor(getTrendStatus())} 
                />
                <Text 
                  className="text-sm font-bold mt-2"
                  style={{ color: getTrendColor(getTrendStatus()) }}
                >
                  {getTrendStatus()}
                </Text>
                <Text className="text-xs text-gray-400 text-center mt-1">
                  Trend
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Emission Analytics Section */}
        <View className="px-6 mb-8">
          <View className="flex-row items-center mb-6">
            <Feather name="activity" size={20} color="#10b981" />
            <Text className="text-xl font-bold text-white ml-3">
              Emission Analytics
            </Text>
          </View>
          
          {/* Tab Selector */}
          <ErrorBoundary>
            <View className="flex-row bg-gray-800/60 rounded-xl p-2 border border-gray-700">
              {['Annual', 'Monthly', 'Daily'].map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => handleTabChange(option)}
                  className={`flex-1 py-3 px-4 rounded-lg mx-1 ${
                    selectedTab === option
                      ? 'bg-blue-600 shadow-lg'
                      : 'bg-transparent'
                  }`}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-center font-semibold ${
                      selectedTab === option
                        ? 'text-white'
                        : 'text-gray-400'
                    }`}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ErrorBoundary>
        </View>

        {/* Chart Section */}
        <View className="mx-6 mb-8 p-6 rounded-2xl bg-gray-800/80 border border-gray-700">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <Feather name="trending-up" size={18} color="#3b82f6" />
              <Text className="text-lg font-bold text-white ml-3">
                {selectedTab} Emissions
              </Text>
            </View>
            <View className="flex-row items-center">
              <Feather name="info" size={14} color="#6b7280" />
              <Text className="text-xs text-gray-400 ml-2">
                CO₂ Tons
              </Text>
            </View>
          </View>

          {/* Loading indicator for chart */}
          {chartLoading ? (
            <View className="h-40 justify-center items-center">
              <Feather name="loader" size={24} color="#3b82f6" />
              <Text className="text-gray-400 mt-2">Loading {selectedTab.toLowerCase()} data...</Text>
            </View>
          ) : (
            <>
              {/* Statistics Row */}
              <View className="flex-row justify-between mb-6">
                <View className="items-center">
                  <View className="flex-row items-center mb-2">
                    <Feather name="arrow-up" size={12} color="#ef4444" />
                    <Text className="text-xs text-gray-400 ml-1">Max</Text>
                  </View>
                  <Text className="text-sm font-bold text-white">
                    {chartData.length > 0 ? Math.max(...chartData.map(e => e.totalTon)).toFixed(3) : '0.000'}t
                  </Text>
                </View>
                
                <View className="items-center">
                  <View className="flex-row items-center mb-2">
                    <Feather name="arrow-down" size={12} color="#10b981" />
                    <Text className="text-xs text-gray-400 ml-1">Min</Text>
                  </View>
                  <Text className="text-sm font-bold text-white">
                    {chartData.length > 0 ? Math.min(...chartData.map(e => e.totalTon)).toFixed(3) : '0.000'}t
                  </Text>
                </View>
                
                <View className="items-center">
                  <View className="flex-row items-center mb-2">
                    <Feather name="bar-chart" size={12} color="#f59e0b" />
                    <Text className="text-xs text-gray-400 ml-1">Avg</Text>
                  </View>
                  <Text className="text-sm font-bold text-white">
                    {chartData.length > 0 ? (chartData.reduce((sum, e) => sum + e.totalTon, 0) / chartData.length).toFixed(3) : '0.000'}t
                  </Text>
                </View>
              </View>

              {/* Chart */}
              <ErrorBoundary>
                <SimpleChart 
                  data={chartData}
                  period={selectedTab.toLowerCase()}
                />
              </ErrorBoundary>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
} 