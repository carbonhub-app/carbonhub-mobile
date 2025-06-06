import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function CompanyCard({ company, onPress, isDark }) {
  return (
    <TouchableOpacity
      className={`mb-4 mx-4 p-5 rounded-2xl ${
        isDark ? 'bg-gray-800/80 border border-gray-700' : 'bg-white border border-gray-100'
      }`}
      style={{
        shadowColor: isDark ? '#000' : '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-3">
          <Text className={`text-lg font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {company.name}
          </Text>
          
          {company.industry && (
            <Text className={`text-sm mb-2 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {company.industry}
            </Text>
          )}
          
          {company.location && (
            <Text className={`text-xs ${
              isDark ? 'text-gray-500' : 'text-gray-500'
            }`}>
              📍 {company.location}
            </Text>
          )}
        </View>
        
        <View className="items-end">
          {company.annual_emissions && (
            <View className="mb-2">
              <Text className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Annual Emissions
              </Text>
              <Text className={`text-lg font-bold ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {company.annual_emissions.toLocaleString()} t
              </Text>
            </View>
          )}
          
          <View className={`px-3 py-1 rounded-full ${
            isDark ? 'bg-blue-900/50' : 'bg-blue-50'
          }`}>
            <Text className={`text-xs font-medium ${
              isDark ? 'text-blue-300' : 'text-blue-700'
            }`}>
              View Details →
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
} 