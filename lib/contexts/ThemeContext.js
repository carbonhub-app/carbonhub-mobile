import React, { createContext, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Always use dark theme
  const theme = 'dark';
  const isDark = true;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}; 