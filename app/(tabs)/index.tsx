// Caminho: app/(tabs)/index.tsx

import { Redirect } from 'expo-router';

export default function TabIndex() {
  // Redireciona o usuário diretamente para a tela de home
  return <Redirect href="/(tabs)/(auth)/Tela_Inicial/home" />;
}