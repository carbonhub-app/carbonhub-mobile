import './global.css';
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GluestackUIProvider } from './components/ui/gluestack-ui-provider';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import HomeScreen from './src/screens/HomeScreen';
import CompanyDetailScreen from './src/screens/CompanyDetailScreen';

// Suppress navigation warnings during development
LogBox.ignoreLogs([
  'Couldn\'t find a navigation context',
  'Warning: Error: Couldn\'t find a navigation context',
]);

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { theme, isDark } = useTheme();

  return (
    <GluestackUIProvider mode={theme}>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor="#111827" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animationEnabled: true,
          cardStyle: { backgroundColor: '#111827' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            cardStyle: { backgroundColor: '#111827' },
          }}
        />
        <Stack.Screen
          name="CompanyDetail"
          component={CompanyDetailScreen}
          options={{
            gestureDirection: 'horizontal',
            cardStyle: { backgroundColor: '#111827' },
          }}
        />
      </Stack.Navigator>
    </GluestackUIProvider>
  );
};

const AppContent = () => {
  useEffect(() => {
    // Ensure gesture handler is properly initialized
    console.log('App initialized with navigation');
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#111827' }} edges={['top']}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
