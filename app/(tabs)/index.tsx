// Caminho: app/(tabs)/index.tsx

import { Redirect } from "expo-router";

export default function Index() {
  // Redireciona direto para a Home, pulando o login
  return <Redirect href="/(tabs)/(auth)/Tela_Inicial/home" />;
}