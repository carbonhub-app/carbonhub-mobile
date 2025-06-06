import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Filter out navigation context errors that we're handling
    const isNavigationError = error.message && error.message.includes('navigation context');
    
    if (!isNavigationError) {
      this.setState({
        error,
        errorInfo
      });
    } else {
      // For navigation errors, just log and continue
      console.warn('Navigation context error caught and handled:', error.message);
      // Reset error state for navigation errors
      setTimeout(() => {
        this.setState({ hasError: false, error: null, errorInfo: null });
      }, 100);
    }
  }

  render() {
    if (this.state.hasError) {
      const isNavigationError = this.state.error && 
        this.state.error.message && 
        this.state.error.message.includes('navigation context');

      // Don't show error UI for navigation context errors
      if (isNavigationError) {
        return this.props.children;
      }

      // Show error UI for other errors
      return (
        <View className="flex-1 justify-center items-center bg-gray-900 px-6">
          <Feather name="alert-triangle" size={48} color="#ef4444" />
          <Text className="text-xl font-bold text-white mt-4 text-center">
            Something went wrong
          </Text>
          <Text className="text-gray-400 mt-2 text-center">
            {this.state.error && this.state.error.toString()}
          </Text>
          <TouchableOpacity
            onPress={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            className="mt-6 px-6 py-3 bg-blue-600 rounded-lg"
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 