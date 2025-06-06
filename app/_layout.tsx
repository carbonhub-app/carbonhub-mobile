import '../global.css';
import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style="light" backgroundColor="#111827" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen 
            name="index" 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="company/[id]" 
            options={{ 
              headerShown: false,
              presentation: 'card',
              gestureDirection: 'horizontal'
            }} 
          />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
} 