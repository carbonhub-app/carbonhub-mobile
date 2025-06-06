import '../global.css';
import { Stack } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';

// Error Boundary untuk handle navigation context errors
class NavigationErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Check if it's a navigation context error
    if (error.message && error.message.includes("Couldn't find a navigation context")) {
      // Don't show error, just suppress it
      console.warn('Navigation context error suppressed:', error.message);
      return { hasError: false }; // Don't show error UI
    }
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (error.message && error.message.includes("Couldn't find a navigation context")) {
      // Just log it, don't crash the app
      console.warn('Navigation context error caught and suppressed');
      return;
    }
    console.error('App error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111827' }}>
          <Text style={{ color: 'white' }}>Something went wrong.</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function RootLayout() {
  return (
    <NavigationErrorBoundary>
      <Stack screenOptions={{ headerShown: false }} />
    </NavigationErrorBoundary>
  );
} 