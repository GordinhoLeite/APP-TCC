// Caminho do arquivo: app/_layout.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { useFonts, DMSans_400Regular } from '@expo-google-fonts/dm-sans';
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import * as SplashScreen from 'expo-splash-screen';
import { onAuthStateChanged } from 'firebase/auth';
// CORREÇÃO 1: O caminho para seu arquivo Firebase foi ajustado
import { auth } from '../lib/firebase/config';
import { Stack, useRouter } from 'expo-router';

// Impede que a splash screen se esconda automaticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSerifDisplay_400Regular,
  });

  // CORREÇÃO 2: Adicionamos o tipo <boolean | undefined> para o TypeScript
  const [userIsAuthenticated, setUserIsAuthenticated] = useState<boolean | undefined>(undefined);
  const router = useRouter();

  // Efeito para verificar a autenticação e redirecionar o usuário
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  // CORREÇÃO 3, 4 e 5: Lógica de redirecionamento ajustada para suas rotas
  useEffect(() => {
    if (userIsAuthenticated === undefined) {
      // Ainda estamos verificando, não faça nada
      return;
    }

    // Se o usuário estiver logado, manda para a tela inicial do app
    if (userIsAuthenticated) {
      router.replace('/(tabs)/(auth)/Tela_Inicial/home');
    }
    // Se o usuário NÃO estiver logado, manda para a tela de login
    else {
      router.replace('/(tabs)/Tela_Login/login');
    }
  }, [userIsAuthenticated]);


  // Função para esconder a splash screen quando tudo estiver pronto
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && userIsAuthenticated !== undefined) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, userIsAuthenticated]);

  // Se as fontes não carregaram ou a autenticação não foi verificada, não renderiza nada
  if (!fontsLoaded || userIsAuthenticated === undefined) {
    return null; // A splash screen continuará visível
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        {/*
          Seu Stack principal que define os grupos de rotas.
          Verifique se os nomes "(tabs)" correspondem às suas pastas.
        */}
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
        </Stack>
    </View>
  );
}