import React, { useEffect, useState } from 'react';
import { SplashScreen, Slot, useRouter, Stack } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase/config';

// Impede que a tela de splash seja escondida até que o fluxo de autenticação seja concluído
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [isAuthReady, setAuthReady] = useState(false);

  useEffect(() => {
    // Escuta as mudanças no estado de autenticação do usuário
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Quando o estado de autenticação é carregado, esconde a tela de splash
      SplashScreen.hideAsync();

      if (user) {
        // Se o usuário está logado, redireciona para a tela inicial
        router.replace('/(tabs)/(auth)/Tela_Inicial/home');
      } else {
        // Se o usuário não está logado, redireciona para a tela de login
        router.replace('/(tabs)/Tela_Login/login');
      }
      setAuthReady(true);
    });

    return () => unsubscribe(); // Limpa a assinatura quando o componente é desmontado
  }, []);

  if (!isAuthReady) {
    // Retorna null ou uma tela de carregamento enquanto o estado de autenticação não é carregado
    return null;
  }

  // A partir daqui, o Expo Router lida com o roteamento
  return <Slot />;
}

// O componente de tela precisa ser exportado separadamente
export function LoginLayout() {
  return <Stack />;
}