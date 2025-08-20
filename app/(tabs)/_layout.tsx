import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// *** CORREÇÃO 1: Importar o tipo para as props da TabBar ***
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

// Componente customizado para o botão flutuante (FAB)
const FloatingAddButton = () => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.fabContainer}
      onPress={() => router.push("/(tabs)/(auth)/Tela_Monitoramento/add-aquario")}
    >
      <LinearGradient colors={["#28FD40", "#C7D61E"]} style={styles.fab}>
        <Text style={styles.fabIcon}>+</Text>
      </LinearGradient>
      <Text style={styles.fabLabel}>Adicionar novo graneleiro</Text>
    </TouchableOpacity>
  );
};

// Componente customizado para a barra de abas
// *** CORREÇÃO 2: Aplicar o tipo importado às props ***
const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.footer}>
      <FloatingAddButton />
      <View style={styles.tabBarContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const icon = options.tabBarIcon ? options.tabBarIcon({ focused: isFocused, color: '', size: 0 }) : null;

          // *** CORREÇÃO 3: Garantir que o label seja uma string antes de renderizar ***
          // O componente <Text> não pode renderizar uma função, que é um tipo possível para tabBarLabel.
          if (typeof label !== 'string') {
            return null; // Não renderiza a aba se o label não for um texto simples.
          }

          return (
            <TouchableOpacity key={index} onPress={onPress} style={styles.tabItem}>
              {icon}
              <Text style={isFocused ? styles.tabTextActive : styles.tabText}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default function TabsLayout() {
  return (
    <Tabs
      // Passamos nosso componente customizado para renderizar a barra
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(auth)/home"
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('@/assets/images/inicio-icone-ativado.png') : require('@/assets/images/inicio-icone-desativado.png')}
              style={styles.tabIcon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(auth)/estatisticas"
        options={{
          tabBarLabel: 'Estatísticas',
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('@/assets/images/estatisticas-icone-ativado.png') : require('@/assets/images/estatisticas-icone-desativado.png')}
              style={styles.tabIcon}
            />
          ),
        }}
      />
       <Tabs.Screen
        name="(auth)/perfil"
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('@/assets/images/perfil-icone-ativado.png') : require('@/assets/images/perfil-icone-desativado.png')}
              style={styles.tabIcon}
            />
          ),
        }}
      />
      
      {/* Telas que não aparecem na barra de abas */}
      <Tabs.Screen name="Tela_Login/login" options={{ href: null }} />
      <Tabs.Screen name="Tela_Cadastro/cadastrar" options={{ href: null }} />
      <Tabs.Screen name="Tela_Login/recuperar_senha" options={{ href: null }} />
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="(auth)/_layout" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center' },
  fabContainer: { alignItems: 'center', marginBottom: -25, zIndex: 1 },
  fab: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  fabIcon: { fontSize: 40, color: '#000000', lineHeight: 45 },
  fabLabel: { fontFamily: 'Poppins_Regular', color: '#28FD40', marginTop: 8 },
  tabBarContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 40, paddingBottom: 10, height: 90, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  tabItem: { alignItems: 'center', flex: 1 },
  tabIcon: { width: 28, height: 28, marginBottom: 4 },
  tabText: { fontSize: 12, fontFamily: "Poppins_Regular", color: "#A1AFC3" },
  tabTextActive: { fontSize: 12, fontFamily: "Poppins_Bold", color: "#28FD40" },
});
