import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { collection, doc, getDoc, onSnapshot, query, where, getDocs } from "firebase/firestore";
import { firestore, auth } from "@/lib/firebase/config";
import { AnimatedCircularProgress } from 'react-native-circular-progress';

// Tipos de dados
type Graneleiro = { id: string; sensorID: string; nome: string; };
type SensorData = { temperatura: number; umidade: number; nivel: number; };

export default function HomeScreen() {
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [graneleiro, setGraneleiro] = useState<Graneleiro | null>(null);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);

  let [fontsLoaded] = useFonts({
    Poppins_Regular: Poppins_400Regular,
    Poppins_Bold: Poppins_700Bold,
  });

  useEffect(() => {
    // A lógica para carregar dados permanece a mesma
    const user = auth.currentUser;
    if (!user) { setLoading(false); return; }

    const carregarDadosIniciais = async () => {
      const usuarioRef = doc(firestore, "usuarios", user.uid);
      const usuarioSnap = await getDoc(usuarioRef);
      if (usuarioSnap.exists()) { setNomeUsuario(usuarioSnap.data().nome || ""); }

      const graneleirosQuery = query(collection(firestore, "graneleiros"), where("usuarioID", "==", user.uid));
      const querySnapshot = await getDocs(graneleirosQuery);

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        const id = querySnapshot.docs[0].id;
        const novoGraneleiro: Graneleiro = { id, sensorID: data.sensorID, nome: data.nome };
        setGraneleiro(novoGraneleiro);
        return novoGraneleiro;
      } else {
        setGraneleiro(null);
        setLoading(false);
        return null;
      }
    };

    carregarDadosIniciais().then(graneleiroAtual => {
      if (graneleiroAtual?.sensorID) {
        const sensorRef = doc(firestore, "sensores", graneleiroAtual.sensorID);
        const unsubscribe = onSnapshot(sensorRef, (docSnap) => {
          if (docSnap.exists()) { setSensorData(docSnap.data() as SensorData); }
          setLoading(false);
        });
        return () => unsubscribe();
      }
    });
  }, []);

  if (!fontsLoaded || loading) {
    return <View style={[styles.container, { justifyContent: "center" }]}><ActivityIndicator size="large" color="#4CAF50" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bem vindo, {nomeUsuario}</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {!graneleiro ? (
          <View style={styles.emptyContainer}>
            <Image source={require("@/assets/images/imagem da tela inicial-sem aquario.png")} style={styles.emptyImage} />
            <Text style={styles.emptyTitle}><Text style={styles.boldText}>Ops.</Text> Não há nenhum graneleiro cadastrado</Text>
          </View>
        ) : (
          <View style={styles.dashboardContainer}>
            <View style={styles.headerCard}>
              <Image source={require("@/assets/images/graneleiro-icon.png")} style={styles.headerIcon} />
              <Text style={styles.headerTitle}>{graneleiro.nome}</Text>
              <Text style={styles.headerMenu}>...</Text>
            </View>
            <View style={styles.mainCard}>
              <View style={styles.dataRow}>
                <View style={styles.dataCircle}>
                  <AnimatedCircularProgress
                    size={120} width={8} fill={sensorData?.temperatura ?? 0} tintColor="#28FD40" backgroundColor="#E8F5E9" rotation={-90} lineCap="round"
                    dashedBackground={{ width: 2, gap: 5 }} renderCap={({ center }) => <View style={[styles.progressCap, { transform: [{ translateX: center.x }, { translateY: center.y }] }]} />}
                  >
                    {(fill: number) => <Text style={styles.dataValue}>{Math.round(fill)}°C</Text>}
                  </AnimatedCircularProgress>
                  <Text style={styles.dataLabel}>TEMPERATURA</Text>
                </View>
                <View style={styles.dataCircle}>
                  <AnimatedCircularProgress
                    size={120} width={8} fill={sensorData?.nivel ?? 0} tintColor="#28FD40" backgroundColor="#E8F5E9" rotation={-90} lineCap="round"
                    dashedBackground={{ width: 2, gap: 5 }} renderCap={({ center }) => <View style={[styles.progressCap, { transform: [{ translateX: center.x }, { translateY: center.y }] }]} />}
                  >
                    {(fill: number) => <Text style={styles.dataValue}>{Math.round(fill)}%</Text>}
                  </AnimatedCircularProgress>
                  <Text style={styles.dataLabel}>NÍVEL DO TANQUE</Text>
                </View>
              </View>
              <View style={[styles.dataRow, { marginTop: 20 }]}>
                 <View style={styles.dataCircle}>
                  <AnimatedCircularProgress
                    size={120} width={8} fill={sensorData?.umidade ?? 0} tintColor="#28FD40" backgroundColor="#E8F5E9" rotation={-90} lineCap="round"
                    dashedBackground={{ width: 2, gap: 5 }} renderCap={({ center }) => <View style={[styles.progressCap, { transform: [{ translateX: center.x }, { translateY: center.y }] }]} />}
                  >
                    {(fill: number) => <Text style={styles.dataValue}>{Math.round(fill)}%</Text>}
                  </AnimatedCircularProgress>
                  <Text style={styles.dataLabel}>UMIDADE</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// Estilos atualizados (sem a TabBar e o FAB)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  welcomeText: { fontSize: 22, fontFamily: "Poppins_Bold", color: "#FFFFFF", textAlign: 'center', paddingTop: 60, paddingBottom: 20 },
  scrollContent: { flexGrow: 1, paddingBottom: 120 },
  dashboardContainer: { paddingHorizontal: 20 },
  headerCard: { backgroundColor: '#4CAF50', borderRadius: 25, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerIcon: { width: 40, height: 40, resizeMode: 'contain' },
  headerTitle: { fontSize: 20, fontFamily: 'Poppins_Bold', color: '#FFFFFF' },
  headerMenu: { fontSize: 24, fontFamily: 'Poppins_Bold', color: '#FFFFFF', transform: [{ rotate: '90deg' }] },
  mainCard: { backgroundColor: '#FFFFFF', borderRadius: 25, padding: 25, marginTop: -20, paddingTop: 40, alignItems: 'center', zIndex: -1 },
  dataRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  dataCircle: { alignItems: 'center' },
  dataValue: { fontSize: 28, fontFamily: 'Poppins_Bold', color: '#393939' },
  dataLabel: { fontSize: 12, fontFamily: 'Poppins_Regular', color: '#6c757d', marginTop: 10, textTransform: 'uppercase' },
  progressCap: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#28FD40', position: 'absolute', borderWidth: 2, borderColor: '#FFFFFF' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  emptyImage: { width: 150, height: 150, marginBottom: 40 },
  emptyTitle: { fontSize: 20, fontFamily: "Poppins_Regular", textAlign: "center", color: "#FFFFFF" },
  boldText: { fontFamily: "Poppins_Bold" },
});
