import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getCompanies } from '../services/api';
import CompanyCard from '../components/CompanyCard';
import ThemeToggle from '../components/ThemeToggle';

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const data = await getCompanies();
      setCompanies(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load companies');
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyPress = (company) => {
    navigation.navigate('CompanyDetail', {
      companyId: company.id,
      companyName: company.name,
    });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-secondary-900">
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text className="mt-2 text-secondary-600 dark:text-secondary-400">
          Loading companies...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-secondary-900">
      <View className="px-4 py-3 border-b border-secondary-200 dark:border-secondary-700 flex-row justify-between items-center">
        <Text className="text-xl font-bold text-secondary-900 dark:text-white">
          Companies
        </Text>
        <ThemeToggle />
      </View>

      <FlatList
        data={companies}
        className="flex-1 px-4 py-2"
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CompanyCard
            company={item}
            onPress={() => handleCompanyPress(item)}
            theme={theme}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-secondary-500 dark:text-secondary-400 text-center">
              No companies found
            </Text>
          </View>
        }
      />
    </View>
  );
} 