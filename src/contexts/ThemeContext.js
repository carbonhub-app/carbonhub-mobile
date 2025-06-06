import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageUtils } from '../utils/storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark'); // Default to dark theme
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await StorageUtils.getTheme();
      setTheme(savedTheme);
    } catch (error) {
      console.error('❌ Error loading theme:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      await StorageUtils.setTheme(newTheme);
    } catch (error) {
      console.error('❌ Error saving theme:', error);
    }
  };

  const isDark = theme === 'dark';

  // Theme colors based on Carbon Hub design system
  const colors = isDark
    ? {
        background: '#0f172a',      // slate-900
        surface: '#1e293b',        // slate-800
        card: '#334155',           // slate-700
        text: '#f8fafc',           // slate-50
        textSecondary: '#cbd5e1',  // slate-300
        primary: '#0ea5e9',        // sky-500
        border: '#475569',         // slate-600
        success: '#10b981',        // emerald-500
        warning: '#f59e0b',        // amber-500
        destructive: '#ef4444',    // red-500
      }
    : {
        background: '#ffffff',     // white
        surface: '#f8fafc',        // slate-50
        card: '#ffffff',           // white
        text: '#0f172a',           // slate-900
        textSecondary: '#64748b',  // slate-500
        primary: '#0ea5e9',        // sky-500
        border: '#e2e8f0',         // slate-200
        success: '#10b981',        // emerald-500
        warning: '#f59e0b',        // amber-500
        destructive: '#ef4444',    // red-500
      };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        isDark, 
        colors, 
        toggleTheme 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}; 