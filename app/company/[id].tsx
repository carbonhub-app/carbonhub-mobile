import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getCompanyDetail, getMonthlyEmissions, getDailyEmissions } from '../../lib/services/api';
import SimpleChart from '../../lib/components/SimpleChart';

// Safe hooks with error handling
function useSafeRouter() {
  try {
    const { useRouter } = require('expo-router');
    return useRouter();
  } catch (error) {
    return { back: () => console.log('Router back called') };
  }
}

function useSafeParams() {
  try {
    const { useLocalSearchParams } = require('expo-router');
    return useLocalSearchParams();
  } catch (error) {
    return { id: '1', name: 'Default Company' };
  }
}

export default function CompanyDetailPage() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  
  const router = useSafeRouter();
  const params = useSafeParams();
  
  const { id: companyId, name: companyName } = params;
  const cleanCompanyId = Array.isArray(companyId) ? companyId[0] : companyId;
  const cleanCompanyName = Array.isArray(companyName) ? companyName[0] : companyName;

  useEffect(() => {
    if (cleanCompanyId) {
      loadCompanyDetail();
    }
  }, [cleanCompanyId]);

  const loadCompanyDetail = async () => {
    try {
      const [companyResponse, monthlyResponse, dailyResponse] = await Promise.all([
        getCompanyDetail(cleanCompanyId),
        getMonthlyEmissions(cleanCompanyId),
        getDailyEmissions(cleanCompanyId)
      ]);
      
      setCompany(companyResponse.data);
      setMonthlyData(monthlyResponse.data || []);
      setDailyData(dailyResponse.data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load company details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111827' }}>
        <Feather name="loader" size={32} color="#3b82f6" />
        <Text style={{ fontSize: 16, color: '#d1d5db', marginTop: 16 }}>
          Loading company details...
        </Text>
      </View>
    );
  }

  if (!company) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111827' }}>
        <Feather name="alert-circle" size={48} color="#ef4444" />
        <Text style={{ fontSize: 18, color: '#d1d5db', marginTop: 16, textAlign: 'center', paddingHorizontal: 24 }}>
          Company not found
        </Text>
      </View>
    );
  }

  // Process emissions data
  const emissions = company.annual_emissions || [];
  const totalEmissions = emissions.reduce((sum, emission) => sum + emission.totalTon, 0);
  const avgEmissions = emissions.length > 0 ? totalEmissions / emissions.length : 0;

  const sustainabilityScore = totalEmissions < 0.1 ? 8.5 : 
                             totalEmissions < 1 ? 6.0 : 3.5;
  
  const getScoreColor = (score) => {
    if (score >= 8) return '#10b981';
    if (score >= 6) return '#f59e0b';
    return '#ef4444';
  };

  const getTrendStatus = () => {
    if (emissions.length < 2) return 'N/A';
    const recent = emissions[emissions.length - 1].totalTon;
    const previous = emissions[emissions.length - 2].totalTon;
    return recent < previous ? 'Improving' : recent > previous ? 'Declining' : 'Stable';
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'Improving': return '#10b981';
      case 'Declining': return '#ef4444';
      case 'Stable': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#111827' }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 64, paddingBottom: 24, backgroundColor: '#111827' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Feather name="chevron-left" size={20} color="#3b82f6" />
            <Text style={{ fontSize: 16, color: '#3b82f6', marginLeft: 8 }}>Back</Text>
          </TouchableOpacity>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Feather name="home" size={24} color="#10b981" />
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', marginLeft: 12 }}>
            {cleanCompanyName}
          </Text>
        </View>
        
        <Text style={{ fontSize: 16, color: '#9ca3af', marginTop: 8, marginLeft: 36 }}>
          Carbon Emissions Overview
        </Text>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Sustainability Score Card */}
        <View style={{ 
          marginHorizontal: 24, 
          marginBottom: 32, 
          padding: 24, 
          borderRadius: 16, 
          backgroundColor: '#1f2937',
          borderWidth: 1,
          borderColor: '#374151'
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Feather name="award" size={20} color="#10b981" />
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginLeft: 12 }}>
              Sustainability Score
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ 
              fontSize: 32, 
              fontWeight: 'bold', 
              color: getScoreColor(sustainabilityScore) 
            }}>
              {sustainabilityScore}
            </Text>
            <Text style={{ fontSize: 20, color: '#9ca3af', marginLeft: 4 }}>/10</Text>
            <View style={{ 
              marginLeft: 16, 
              paddingHorizontal: 12, 
              paddingVertical: 4, 
              borderRadius: 8,
              backgroundColor: getScoreColor(sustainabilityScore) + '20'
            }}>
              <Text style={{ fontSize: 12, color: getScoreColor(sustainabilityScore), fontWeight: 'bold' }}>
                {getTrendStatus()}
              </Text>
            </View>
          </View>
          
          {/* Progress Bar */}
          <View style={{ height: 8, borderRadius: 4, backgroundColor: '#374151', marginBottom: 16 }}>
            <View style={{ 
              height: 8, 
              borderRadius: 4,
              width: `${sustainabilityScore * 10}%`,
              backgroundColor: getScoreColor(sustainabilityScore)
            }} />
          </View>
          
          <Text style={{ fontSize: 14, color: '#9ca3af' }}>
            Based on total emissions of {totalEmissions.toFixed(3)} tons CO₂
          </Text>
        </View>

        {/* Emissions Statistics */}
        <View style={{ marginHorizontal: 24, marginBottom: 32 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 16 }}>
            Emissions Statistics
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ 
              flex: 1, 
              padding: 16, 
              borderRadius: 12, 
              backgroundColor: '#1f2937',
              marginRight: 8,
              borderWidth: 1,
              borderColor: '#374151'
            }}>
              <Feather name="globe" size={18} color="#3b82f6" style={{ alignSelf: 'center', marginBottom: 8 }} />
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                {totalEmissions.toFixed(3)}t
              </Text>
              <Text style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 4 }}>
                Total CO₂
              </Text>
            </View>
            
            <View style={{ 
              flex: 1, 
              padding: 16, 
              borderRadius: 12, 
              backgroundColor: '#1f2937',
              marginLeft: 8,
              borderWidth: 1,
              borderColor: '#374151'
            }}>
              <Feather name="bar-chart" size={18} color="#f59e0b" style={{ alignSelf: 'center', marginBottom: 8 }} />
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                {avgEmissions.toFixed(3)}t
              </Text>
              <Text style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 4 }}>
                Average
              </Text>
            </View>
          </View>
        </View>

        {/* Annual Emissions Chart */}
        <View style={{ 
          marginHorizontal: 24, 
          marginBottom: 32, 
          padding: 24, 
          borderRadius: 16, 
          backgroundColor: '#1f2937',
          borderWidth: 1,
          borderColor: '#374151'
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Feather name="trending-up" size={20} color="#3b82f6" />
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginLeft: 12 }}>
              Annual Carbon Footprint
            </Text>
          </View>
          
          <Text style={{ fontSize: 14, color: '#9ca3af', marginBottom: 20 }}>
            Historical emissions data showing environmental impact trends
          </Text>

          {/* Chart Statistics */}
          {emissions.length > 0 && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>Max</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#ef4444' }}>
                  {Math.max(...emissions.map(e => e.totalTon)).toFixed(3)}t
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>Min</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#10b981' }}>
                  {Math.min(...emissions.map(e => e.totalTon)).toFixed(3)}t
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>Years</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#3b82f6' }}>
                  {emissions.length}
                </Text>
              </View>
            </View>
          )}

          {/* Chart */}
          {emissions.length > 0 ? (
            <SimpleChart 
              data={emissions}
              period="annual"
            />
          ) : (
            <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
              <Feather name="bar-chart-2" size={48} color="#374151" />
              <Text style={{ fontSize: 16, color: '#9ca3af', marginTop: 16 }}>
                No emissions data available
              </Text>
            </View>
          )}
        </View>

        {/* Monthly Emissions Chart */}
        <View style={{ 
          marginHorizontal: 24, 
          marginBottom: 32, 
          padding: 24, 
          borderRadius: 16, 
          backgroundColor: '#1f2937',
          borderWidth: 1,
          borderColor: '#374151'
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Feather name="calendar" size={20} color="#f59e0b" />
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginLeft: 12 }}>
              Monthly Carbon Footprint
            </Text>
          </View>
          
          <Text style={{ fontSize: 14, color: '#9ca3af', marginBottom: 20 }}>
            Monthly breakdown of emissions showing seasonal patterns
          </Text>

          {/* Chart */}
          {monthlyData.length > 0 ? (
            <SimpleChart 
              data={monthlyData}
              period="monthly"
            />
          ) : (
            <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
              <Feather name="bar-chart-2" size={48} color="#374151" />
              <Text style={{ fontSize: 16, color: '#9ca3af', marginTop: 16 }}>
                No monthly data available
              </Text>
            </View>
          )}
        </View>

        {/* Daily Emissions Chart */}
        <View style={{ 
          marginHorizontal: 24, 
          marginBottom: 32, 
          padding: 24, 
          borderRadius: 16, 
          backgroundColor: '#1f2937',
          borderWidth: 1,
          borderColor: '#374151'
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Feather name="clock" size={20} color="#ef4444" />
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginLeft: 12 }}>
              Daily Carbon Footprint
            </Text>
          </View>
          
          <Text style={{ fontSize: 14, color: '#9ca3af', marginBottom: 20 }}>
            Daily emissions tracking for detailed monitoring
          </Text>

          {/* Chart */}
          {dailyData.length > 0 ? (
            <SimpleChart 
              data={dailyData}
              period="daily"
            />
          ) : (
            <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
              <Feather name="bar-chart-2" size={48} color="#374151" />
              <Text style={{ fontSize: 16, color: '#9ca3af', marginTop: 16 }}>
                No daily data available
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
} 