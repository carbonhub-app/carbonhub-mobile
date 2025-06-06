import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <TouchableOpacity
      className={`flex-row items-center p-2 rounded-lg ${
        isDark ? 'bg-secondary-700' : 'bg-secondary-100'
      }`}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <View className={`w-12 h-6 rounded-full p-1 flex-row items-center ${
        isDark ? 'bg-primary-600 justify-end' : 'bg-secondary-300 justify-start'
      }`}>
        <View className="w-4 h-4 rounded-full bg-white shadow-sm" />
      </View>
      
      <Text className={`ml-3 text-sm font-medium ${
        isDark ? 'text-white' : 'text-secondary-900'
      }`}>
        {isDark ? '🌙' : '☀️'}
      </Text>
    </TouchableOpacity>
  );
} 