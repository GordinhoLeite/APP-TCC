// Caminho: app/(tabs)/_layout.tsx

import React from 'react';
import { Tabs } from 'expo-router';
import { Image } from 'react-native';

// Agora este arquivo apenas define a aparência e as telas da barra de abas
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#004369',
          borderTopWidth: 0,
          height: 84,
        },
      }}
    >
      <Tabs.Screen
        name="(auth)/Tela_Inicial/home"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('../../assets/images/inicio-icone-ativado.png')
                  : require('../../assets/images/inicio-icone-desativado.png')
              }
              style={{ width: 40, height: 40 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(auth)/Tela_estatisticas/estatisticas"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('../../assets/images/estatisticas-icone-ativado.png')
                  : require('../../assets/images/estatisticas-icone-desativado.png')
              }
              style={{ width: 40, height: 40 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(auth)/Tela_perfil/perfil"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('../../assets/images/perfil-icone-ativado.png')
                  : require('../../assets/images/perfil-icone-desativado.png')
              }
              style={{ width: 40, height: 40 }}
            />
          ),
        }}
      />
      
      {/* Escondemos todas as outras rotas da barra de abas */}
      <Tabs.Screen name="Tela_Login/login" options={{ href: null }} />
      <Tabs.Screen name="Tela_Cadastro/cadastrar" options={{ href: null }} />
      <Tabs.Screen name="Tela_Login/recuperar_senha" options={{ href: null }} />
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="(auth)/_layout" options={{ href: null }} />
      <Tabs.Screen name="(auth)/Tela_Monitoramento/add-aquario" options={{ href: null }} />
      <Tabs.Screen name="(auth)/Tela_Monitoramento/editarAquario" options={{ href: null }} />
      <Tabs.Screen name="(auth)/Tela_Monitoramento/ScannerQRCode" options={{ href: null }} />
      <Tabs.Screen name="(auth)/Tela_perfil/editarPerfil" options={{ href: null }} />
    </Tabs>
  );
}