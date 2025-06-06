import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import CompanyDetailScreen from '../../src/screens/CompanyDetailScreen';

export default function CompanyDetailPage() {
  const { id, name } = useLocalSearchParams();
  
  // Convert to the format expected by the existing component
  const route = {
    params: {
      companyId: id,
      companyName: name
    }
  };
  
  return <CompanyDetailScreen route={route} />;
} 