import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function CompanyCard({ company, onPress, theme }) {
  const isDark = theme === 'dark';
  
  return (
    <TouchableOpacity
      className={`mb-4 p-4 rounded-lg shadow-sm border ${
        isDark 
          ? 'bg-secondary-800 border-secondary-700' 
          : 'bg-white border-secondary-200'
      }`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className={`text-lg font-semibold mb-2 ${
            isDark ? 'text-white' : 'text-secondary-900'
          }`}>
            {company.name}
          </Text>
          
          {company.industry && (
            <Text className={`text-sm mb-2 ${
              isDark ? 'text-secondary-300' : 'text-secondary-600'
            }`}>
              {company.industry}
            </Text>
          )}
          
          {company.location && (
            <Text className={`text-xs ${
              isDark ? 'text-secondary-400' : 'text-secondary-500'
            }`}>
              📍 {company.location}
            </Text>
          )}
        </View>
        
        <View className="items-end">
          {company.annual_emissions && (
            <View className="mb-1">
              <Text className={`text-xs ${
                isDark ? 'text-secondary-400' : 'text-secondary-500'
              }`}>
                Annual Emissions
              </Text>
              <Text className={`text-lg font-bold ${
                isDark ? 'text-primary-400' : 'text-primary-600'
              }`}>
                {company.annual_emissions.toLocaleString()} t
              </Text>
            </View>
          )}
          
          <View className={`px-2 py-1 rounded-full ${
            isDark ? 'bg-primary-900' : 'bg-primary-50'
          }`}>
            <Text className={`text-xs font-medium ${
              isDark ? 'text-primary-300' : 'text-primary-700'
            }`}>
              View Details →
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
} 