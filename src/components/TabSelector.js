import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

export default function TabSelector({ options, selectedOption, onSelect, theme }) {
  const isDark = theme === 'dark';
  
  return (
    <View className={`flex-row p-1 rounded-lg ${
      isDark ? 'bg-secondary-800' : 'bg-secondary-100'
    }`}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          className={`flex-1 py-3 px-4 rounded-md mx-1 ${
            selectedOption === option.value
              ? isDark 
                ? 'bg-primary-600 shadow-sm' 
                : 'bg-primary-500 shadow-sm'
              : 'bg-transparent'
          }`}
          onPress={() => onSelect(option.value)}
          activeOpacity={0.7}
        >
          <Text className={`text-center font-medium ${
            selectedOption === option.value
              ? 'text-white'
              : isDark 
                ? 'text-secondary-300' 
                : 'text-secondary-600'
          }`}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
} 