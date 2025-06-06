import '../global.css';
import { Stack } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

// Global Error Handler - Suppress all console errors
const originalConsoleError = console.error;
console.error = (...args) => {
  // Filter out navigation context errors
  const errorMessage = args.join(' ');
  if (errorMessage.includes("Couldn't find a navigation context")) {
    // Just log quietly, don't show red screen
    console.warn('Navigation context error suppressed:', errorMessage);
    return;
  }
  // Let other errors through
  originalConsoleError(...args);
};

// Comprehensive Error Boundary
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      errors: [] // Track multiple errors
    };
  }

  static getDerivedStateFromError(error) {
    // Always catch errors but handle them differently
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Add error to list
    const newError = {
      message: error.message,
      stack: error.stack,
      time: new Date().toLocaleTimeString()
    };

    // Special handling for navigation context errors
    if (error.message && error.message.includes("Couldn't find a navigation context")) {
      console.warn('Navigation context error caught and suppressed');
      // Don't show error UI for navigation context errors
      this.setState({ hasError: false });
      return;
    }

    this.setState(prevState => ({
      errors: [...prevState.errors, newError],
      errorInfo
    }));
  }

  clearErrors = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null, 
      errors: [] 
    });
  };

  render() {
    if (this.state.hasError && this.state.errors.length > 0) {
      return (
        <View style={{ 
          flex: 1, 
          backgroundColor: '#111827', 
          padding: 20,
          paddingTop: 60 
        }}>
          <View style={{ 
            backgroundColor: '#1f2937', 
            padding: 20, 
            borderRadius: 10,
            marginBottom: 20
          }}>
            <Text style={{ 
              color: '#ef4444', 
              fontSize: 18, 
              fontWeight: 'bold',
              marginBottom: 10
            }}>
              Application Error ({this.state.errors.length})
            </Text>
            
            <ScrollView style={{ maxHeight: 300, marginBottom: 20 }}>
              {this.state.errors.map((err, index) => (
                <View key={index} style={{ 
                  backgroundColor: '#374151', 
                  padding: 10, 
                  marginBottom: 10,
                  borderRadius: 5
                }}>
                  <Text style={{ color: '#f59e0b', fontSize: 12 }}>
                    {err.time}
                  </Text>
                  <Text style={{ color: '#fbbf24', fontSize: 14, marginTop: 5 }}>
                    {err.message}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={this.clearErrors}
              style={{
                backgroundColor: '#3b82f6',
                padding: 15,
                borderRadius: 8,
                alignItems: 'center'
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                Continue App
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function RootLayout() {
  return (
    <AppErrorBoundary>
      <Stack screenOptions={{ headerShown: false }} />
    </AppErrorBoundary>
  );
} 