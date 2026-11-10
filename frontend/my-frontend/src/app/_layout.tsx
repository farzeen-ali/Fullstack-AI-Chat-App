import '@/global.css';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppThemeProvider, useAppTheme } from '@/context/app-theme';

SplashScreen.preventAutoHideAsync();

function RootNavigation() {
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <View
      className={`flex-1 ${isDark ? 'bg-chat-dark-bg' : 'bg-chat-light-bg'}`}>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppThemeProvider>
        <RootNavigation />
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
}
