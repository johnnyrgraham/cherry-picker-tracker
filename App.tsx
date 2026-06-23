import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Dashboard } from './src/components/Dashboard';
import { DayPage } from './src/components/DayPage';
import { Settings } from './src/components/Settings';
import { TotalsPage } from './src/components/TotalsPage';
import { DayData, SettingsData, ViewName } from './src/types';
import { colors } from './src/theme';

const MOCK_DAYS: Record<string, DayData> = {
  '2026-06-21': {
    date: '2026-06-21',
    completed: true,
    earnings: { gross: 450, net: 380 },
    bucketCount: 12,
    location: 'Downtown',
    fastestBucket: 185,
    fastestHour: 8,
  },
  '2026-06-22': {
    date: '2026-06-22',
    completed: true,
    earnings: { gross: 520, net: 440 },
    bucketCount: 15,
    location: 'Midtown',
    fastestBucket: 142,
    fastestHour: 10,
  },
  '2026-06-23': {
    date: '2026-06-23',
    completed: true,
    earnings: { gross: 380, net: 320 },
    bucketCount: 10,
    location: 'Uptown',
    fastestBucket: 198,
    fastestHour: 6,
  },
};

export default function App() {
  const [currentView, setCurrentView] = useState<ViewName>('dashboard');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [settings, setSettings] = useState<SettingsData>({
    weekStart: 'monday',
    weekEnd: 'sunday',
    payFrequency: 'weekly',
    defaultBucketRate: 50,
  });
  const [daysData, setDaysData] = useState<Record<string, DayData>>(MOCK_DAYS);

  const handleDayClick = (date: string) => {
    setSelectedDay(date);
    setCurrentView('day');
  };

  const handleDayComplete = (date: string, data: DayData) => {
    setDaysData((prev) => ({ ...prev, [date]: data }));
    setCurrentView('dashboard');
  };

  const isOrangeScreen =
    currentView === 'dashboard' || currentView === 'day';

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        {isOrangeScreen ? (
          <LinearGradient
            colors={[colors.orange[500], colors.orange[600]]}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.lightBackground]} />
        )}

        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          {currentView === 'dashboard' && (
            <Dashboard
              daysData={daysData}
              settings={settings}
              onDayClick={handleDayClick}
              onSettingsClick={() => setCurrentView('settings')}
              onTotalsClick={() => setCurrentView('totals')}
            />
          )}
          {currentView === 'settings' && (
            <Settings
              settings={settings}
              onSettingsChange={setSettings}
              onBack={() => setCurrentView('dashboard')}
            />
          )}
          {currentView === 'day' && selectedDay && (
            <DayPage
              date={selectedDay}
              existingData={daysData[selectedDay]}
              defaultBucketRate={settings.defaultBucketRate}
              onComplete={handleDayComplete}
              onBack={() => setCurrentView('dashboard')}
            />
          )}
          {currentView === 'totals' && (
            <TotalsPage
              daysData={daysData}
              onBack={() => setCurrentView('dashboard')}
            />
          )}
        </SafeAreaView>

        <StatusBar style={isOrangeScreen ? 'light' : 'dark'} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  lightBackground: {
    backgroundColor: '#fef3e8',
  },
});
