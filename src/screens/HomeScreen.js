import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, RefreshControl, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getCompanies } from '../services/api';

export default function HomeScreen({ navigation }) {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter(company =>
        company.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  }, [searchText, companies]);

  const loadCompanies = async () => {
    try {
      const response = await getCompanies();
      // Handle both direct array and API response with data property
      const data = response.data || response;
      setCompanies(data);
      setFilteredCompanies(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load companies');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCompanies();
  };

  const getScoreColor = (totalEmissions) => {
    // Simple scoring based on emissions (lower is better)
    if (totalEmissions < 0.1) return '#10b981'; // Green for very low emissions
    if (totalEmissions < 1) return '#f59e0b';   // Yellow for moderate emissions
    return '#ef4444'; // Red for high emissions
  };

  const renderCompanyCard = ({ item }) => {
    // Get latest emissions data
    const latestEmission = item.annual_emissions && item.annual_emissions.length > 0 
      ? item.annual_emissions[item.annual_emissions.length - 1] 
      : null;
    
    const totalEmissions = latestEmission ? latestEmission.totalTon : 0;
    const year = latestEmission ? latestEmission.year : 'N/A';
    
    // Calculate a simple sustainability score (0-10) based on emissions
    const sustainabilityScore = totalEmissions < 0.1 ? 8.5 : 
                               totalEmissions < 1 ? 6.0 : 3.5;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('CompanyDetail', { 
          companyId: item.id,
          companyName: item.name 
        })}
        className="mb-8 mx-4 p-6 rounded-2xl bg-gray-800/80 border border-gray-700"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 3,
        }}
        activeOpacity={0.8}
      >
        {/* Header */}
        <View className="flex-row justify-between items-start mb-6">
          <View className="flex-1 mr-4">
            <Text className="text-xl font-bold mb-3 text-white">
              {item.name}
            </Text>
            <View className="flex-row items-center">
              <Feather name="calendar" size={12} color="#9ca3af" />
              <Text className="text-sm text-gray-400 ml-2">
                Latest data: {year}
              </Text>
            </View>
          </View>
          
          <View 
            className="px-4 py-2 rounded-full flex-row items-center"
            style={{ backgroundColor: getScoreColor(totalEmissions) + '20' }}
          >
            <Feather 
              name="award" 
              size={12} 
              color={getScoreColor(totalEmissions)} 
            />
            <Text 
              className="text-xs font-semibold ml-2"
              style={{ color: getScoreColor(totalEmissions) }}
            >
              {sustainabilityScore}/10
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="mb-6">
          <View className="h-2.5 rounded-full bg-gray-700">
            <View 
              className="h-2.5 rounded-full"
              style={{ 
                width: `${sustainabilityScore * 10}%`,
                backgroundColor: getScoreColor(totalEmissions)
              }}
            />
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row justify-between mb-5">
          <View className="items-center">
            <View className="flex-row items-center mb-2">
              <Feather name="trending-down" size={12} color="#9ca3af" />
              <Text className="text-xs text-gray-400 ml-1">CO₂ Emissions</Text>
            </View>
            <Text className="text-sm font-bold text-white">
              {totalEmissions.toFixed(6)}t
            </Text>
          </View>
          
          <View className="items-center">
            <View className="flex-row items-center mb-2">
              <Feather name="shield" size={12} color="#10b981" />
              <Text className="text-xs text-gray-400 ml-1">Impact</Text>
            </View>
            <Text className="text-sm font-bold text-green-500">
              {totalEmissions < 0.1 ? 'Excellent' : totalEmissions < 1 ? 'Good' : 'Needs Work'}
            </Text>
          </View>
          
          <View className="items-center">
            <View className="flex-row items-center mb-2">
              <Feather name="activity" size={12} color="#9ca3af" />
              <Text className="text-xs text-gray-400 ml-1">Status</Text>
            </View>
            <Text className="text-sm font-bold text-white">
              Active
            </Text>
          </View>
        </View>

        {/* View Details Arrow */}
        <View className="flex-row justify-end items-center pt-4 border-t border-gray-700">
          <Text className="text-xs text-gray-400 mr-2">View Details</Text>
          <Feather name="chevron-right" size={14} color="#9ca3af" />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900">
        <Feather name="loader" size={32} color="#3b82f6" />
        <Text className="text-base text-gray-300 mt-4">
          Loading companies...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header with Greeting */}
      <View className="px-6 pt-16 pb-8 bg-gray-900">
        {/* Greeting Section */}
        <View className="mb-10">
          <View className="flex-row items-center mb-4">
            <Feather name="sun" size={20} color="#f59e0b" />
            <Text className="text-lg text-gray-300 ml-3">
              Good {new Date().getHours() < 12 ? 'Morning' : 
                    new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!
            </Text>
          </View>
          <Text className="text-3xl font-bold text-white mb-3">
            Carbon Hub Dashboard
          </Text>
          <View className="flex-row items-center">
            <Feather name="globe" size={14} color="#10b981" />
            <Text className="text-sm text-gray-400 ml-2">
              Track environmental impact across companies
            </Text>
          </View>
        </View>
        
        {/* Search Bar */}
        <View className="rounded-xl px-5 py-4 bg-gray-800 flex-row items-center">
          <Feather name="search" size={16} color="#9ca3af" />
          <TextInput
            placeholder="Search companies..."
            value={searchText}
            onChangeText={setSearchText}
            className="text-base text-white flex-1 ml-4"
            placeholderTextColor="#9ca3af"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Feather name="x" size={16} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Statistics Overview */}
      <View className="px-6 mb-8">
        <View className="flex-row justify-between">
          <View className="flex-1 p-5 rounded-xl bg-gray-800/50 border border-gray-700 mr-3">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-xs text-gray-400 mb-2">Total Companies</Text>
                <Text className="text-xl font-bold text-white">{companies.length}</Text>
              </View>
              <Feather name="users" size={24} color="#3b82f6" />
            </View>
          </View>
          
          <View className="flex-1 p-5 rounded-xl bg-gray-800/50 border border-gray-700 ml-3">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-xs text-gray-400 mb-2">Active Monitoring</Text>
                <Text className="text-xl font-bold text-green-500">{companies.length}</Text>
              </View>
              <Feather name="activity" size={24} color="#10b981" />
            </View>
          </View>
        </View>
      </View>

      {/* Companies List */}
      <FlatList
        data={filteredCompanies}
        renderItem={renderCompanyCard}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3b82f6']}
            tintColor={'#3b82f6'}
          />
        }
        ListEmptyComponent={
          <View className="items-center mt-20 px-4">
            <Feather name="search" size={48} color="#6b7280" />
            <Text className="text-lg font-semibold mb-2 text-gray-300 mt-4">
              No companies found
            </Text>
            <Text className="text-center text-gray-500">
              {searchText ? 'Try adjusting your search terms' : 'No companies available at the moment'}
            </Text>
          </View>
        }
      />
    </View>
  );
} 