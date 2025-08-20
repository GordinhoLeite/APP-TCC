// Caminho: app/_layout.tsx

import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
// Verifique se você tem as fontes Poppins instaladas, se não, rode no terminal:
// npx expo install @expo-google-fonts/poppins
import { Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';

// Mantém a tela de splash visível
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Carrega as fontes necessárias para o app
  const [fontsLoaded, fontError] = useFonts({
    // Adaptei para as fontes que vi no seu código de login
    Poppins_Regular: Poppins_400Regular,
    Poppins_Bold: Poppins_700Bold,
  });

  useEffect(() => {
    // Esconde a splash screen assim que as fontes carregarem (ou der erro)
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Se as fontes ainda não carregaram, não mostra nada para manter o splash
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // Renderiza a estrutura principal do app, sem o provedor de autenticação
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}