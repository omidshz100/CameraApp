import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { MediaProvider } from '@/contexts/MediaContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <MediaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="edit-photo" options={{ presentation: 'modal' }} />
        <Stack.Screen name="edit-video" options={{ presentation: 'modal' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </MediaProvider>
  );
}
