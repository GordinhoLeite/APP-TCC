import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, Dimensions } from "react-native";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { collection, doc, onSnapshot, query, where, getDocs } from "firebase/firestore";
import { firestore, auth } from "@/lib/firebase/config";
import { AnimatedCircularProgress } from 'react-native-circular-progress';

// Tipos de dados
type Graneleiro = { id: string; sensorID: string; nome: string; };
type SensorData = { temperatura: number; umidade: number; porcentagem: number; };

const GAUGE_SIZE = 150;

export default function HomeScreen() {
  const [graneleiro, setGraneleiro] = useState<Graneleiro | null>(null);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);

  let [fontsLoaded] = useFonts({
    Poppins_Regular: Poppins_400Regular,
    Poppins_Bold: Poppins_700Bold,
  });

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) { setLoading(false); return; }

    const carregarDadosIniciais = async () => {
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
          if (docSnap.exists()) { 
            setSensorData(docSnap.data() as SensorData); 
          }
          setLoading(false);
        });
        return () => unsubscribe();
      }
    });
  }, []);

  if (!fontsLoaded || loading) {
    return <View style={[styles.container, { justifyContent: "center", backgroundColor: '#FFFFFF' }]}><ActivityIndicator size="large" color="#4CAF50" /></View>;
  }

  return (
    <View style={styles.container}>
      {/* HEADER FIXO NO TOPO (Sem o ícone agora) */}
      <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>Colheitadeira</Text>
      </View>

      {/* CONTEÚDO COM SCROLL CENTRALIZADO */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {!graneleiro ? (
          <View style={styles.emptyContainer}>
            <Image source={require("@/assets/images/imagem da tela inicial-sem aquario.png")} style={styles.emptyImage} />
            <Text style={styles.emptyTitle}><Text style={styles.boldText}>Ops.</Text> Não há nenhum equipamento cadastrado</Text>
          </View>
        ) : (
          <View style={styles.gaugesContainer}>
            
            {/* LINHA SUPERIOR */}
            <View style={styles.dataRow}>
              {/* TEMPERATURA */}
              <View style={styles.dataCircle}>
                <AnimatedCircularProgress
                  size={GAUGE_SIZE} width={10} fill={sensorData?.temperatura ?? 0} tintColor="#28FD40" backgroundColor="#E8F5E9" rotation={-90} lineCap="round"
                  dashedBackground={{ width: 2, gap: 5 }} renderCap={({ center }) => <View style={[styles.progressCap, { transform: [{ translateX: center.x }, { translateY: center.y }] }]} />}
                >
                  {(fill: number) => <Text style={styles.dataValue}>{Math.round(fill)}°C</Text>}
                </AnimatedCircularProgress>
                <Text style={styles.dataLabel}>TEMPERATURA</Text>
              </View>

              {/* NÍVEL DO TANQUE */}
              <View style={styles.dataCircle}>
                <AnimatedCircularProgress
                  size={GAUGE_SIZE} width={10} fill={sensorData?.porcentagem ?? 0} tintColor="#28FD40" backgroundColor="#E8F5E9" rotation={-90} lineCap="round"
                  dashedBackground={{ width: 2, gap: 5 }} renderCap={({ center }) => <View style={[styles.progressCap, { transform: [{ translateX: center.x }, { translateY: center.y }] }]} />}
                >
                  {(fill: number) => <Text style={styles.dataValue}>{Math.round(fill)}%</Text>}
                </AnimatedCircularProgress>
                <Text style={styles.dataLabel}>NÍVEL DO TANQUE</Text>
              </View>
            </View>
            
            {/* LINHA INFERIOR */}
            <View style={[styles.dataRow, { marginTop: 40 }]}>
                 {/* UMIDADE */}
                 <View style={styles.dataCircle}>
                  <AnimatedCircularProgress
                    size={GAUGE_SIZE} width={10} fill={sensorData?.umidade ?? 0} tintColor="#28FD40" backgroundColor="#E8F5E9" rotation={-90} lineCap="round"
                    dashedBackground={{ width: 2, gap: 5 }} renderCap={({ center }) => <View style={[styles.progressCap, { transform: [{ translateX: center.x }, { translateY: center.y }] }]} />}
                  >
                    {(fill: number) => <Text style={styles.dataValue}>{Math.round(fill)}%</Text>}
                  </AnimatedCircularProgress>
                  <Text style={styles.dataLabel}>UMIDADE</Text>
                </View>
            </View>

          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  
  headerBar: { 
    backgroundColor: '#4CAF50', 
    paddingTop: 60, 
    paddingBottom: 25, 
    paddingHorizontal: 20,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },
  // Removi o estilo headerIcon pois não é mais usado
  headerTitle: { fontSize: 22, fontFamily: 'Poppins_Bold', color: '#FFFFFF' },
  
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    paddingBottom: 50 
  },
  
  gaugesContainer: {
    padding: 30, 
    alignItems: 'center',
  },

  dataRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  dataCircle: { alignItems: 'center' },
  dataValue: { fontSize: 32, fontFamily: 'Poppins_Bold', color: '#393939' },
  dataLabel: { fontSize: 14, fontFamily: 'Poppins_Regular', color: '#6c757d', marginTop: 15, textTransform: 'uppercase' },
  progressCap: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#28FD40', position: 'absolute', borderWidth: 2, borderColor: '#FFFFFF' },
  
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  emptyImage: { width: 150, height: 150, marginBottom: 40, opacity: 0.8 },
  emptyTitle: { fontSize: 20, fontFamily: "Poppins_Regular", textAlign: "center", color: "#333333" },
  boldText: { fontFamily: "Poppins_Bold" },
});