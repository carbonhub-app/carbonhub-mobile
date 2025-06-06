import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function TabSelector({ options, selectedOption, onSelect }) {
  return (
    <View className="flex-row bg-gray-800/60 rounded-xl p-2 border border-gray-700">
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => onSelect(option)}
          className={`flex-1 py-3 px-4 rounded-lg mx-1 ${
            selectedOption === option
              ? 'bg-blue-600 shadow-lg'
              : 'bg-transparent'
          }`}
          activeOpacity={0.7}
        >
          <Text
            className={`text-center font-semibold ${
              selectedOption === option
                ? 'text-white'
                : 'text-gray-400'
            }`}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
} 