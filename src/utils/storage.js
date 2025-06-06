import AsyncStorage from '@react-native-async-storage/async-storage';

// Simple storage utilities using AsyncStorage
export const StorageUtils = {
  // Theme management
  setTheme: async (theme) => {
    try {
      await AsyncStorage.setItem('carbonhub_theme', theme);
    } catch (error) {
      console.error('❌ Error setting theme:', error);
    }
  },
  
  getTheme: async () => {
    try {
      const theme = await AsyncStorage.getItem('carbonhub_theme');
      return theme || 'dark';
    } catch (error) {
      console.error('❌ Error getting theme:', error);
      return 'dark';
    }
  },

  // Generic string storage
  setString: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`❌ Error setting string for key "${key}":`, error);
    }
  },

  getString: async (key, defaultValue = null) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value || defaultValue;
    } catch (error) {
      console.error(`❌ Error getting string for key "${key}":`, error);
      return defaultValue;
    }
  },

  // Boolean storage
  setBoolean: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      console.error(`❌ Error setting boolean for key "${key}":`, error);
    }
  },

  getBoolean: async (key, defaultValue = false) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return defaultValue;
      return value === 'true';
    } catch (error) {
      console.error(`❌ Error getting boolean for key "${key}":`, error);
      return defaultValue;
    }
  },

  // Number storage
  setNumber: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      console.error(`❌ Error setting number for key "${key}":`, error);
    }
  },

  getNumber: async (key, defaultValue = 0) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return defaultValue;
      const parsed = parseFloat(value);
      return isNaN(parsed) ? defaultValue : parsed;
    } catch (error) {
      console.error(`❌ Error getting number for key "${key}":`, error);
      return defaultValue;
    }
  },

  // Object storage (JSON serialization)
  setObject: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`❌ Error setting object for key "${key}":`, error);
    }
  },

  getObject: async (key, defaultValue = null) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue) {
        return JSON.parse(jsonValue);
      }
      return defaultValue;
    } catch (error) {
      console.error(`❌ Error getting object for key "${key}":`, error);
      return defaultValue;
    }
  },

  // Remove key
  remove: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`❌ Error removing key "${key}":`, error);
    }
  },

  // Clear all storage
  clear: async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('❌ Error clearing storage:', error);
    }
  },

  // Check if key exists
  contains: async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null;
    } catch (error) {
      console.error(`❌ Error checking key "${key}":`, error);
      return false;
    }
  },

  // Get all keys
  getAllKeys: async () => {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('❌ Error getting all keys:', error);
      return [];
    }
  }
};

export default StorageUtils; 