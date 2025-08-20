import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { auth, firestore } from "@/lib/firebase/config";
import { collection, addDoc } from "firebase/firestore";

const { width } = Dimensions.get("window");

export default function AdicionarGraneleiro() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [volume, setVolume] = useState("");
  const [lotacaoMaxima, setLotacaoMaxima] = useState("");
  const [loading, setLoading] = useState(false);

  let [fontsLoaded] = useFonts({
    Poppins_Regular: Poppins_400Regular,
    Poppins_Bold: Poppins_700Bold,
  });

  const handleAdicionarGraneleiro = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    if (!nome || !volume || !lotacaoMaxima) {
      Alert.alert("Campos obrigatórios", "Por favor, preencha todos os campos.");
      return;
    }
    
    // Validação para garantir que a lotação máxima seja um número entre 1 e 100
    const lotacaoNum = Number(lotacaoMaxima);
    if (isNaN(lotacaoNum) || lotacaoNum < 1 || lotacaoNum > 100) {
      Alert.alert("Valor inválido", "O percentual de lotação máxima deve ser um número entre 1 e 100.");
      return;
    }

    setLoading(true);
    try {
      const novoGraneleiro = {
        nome,
        volume: Number(volume),
        lotacaoMaxima: lotacaoNum,
        usuarioID: user.uid,
        // Você precisará associar um sensorID real aqui no futuro
        // Por agora, podemos deixar um placeholder ou gerar um ID aleatório
        sensorID: "sensor_manual_" + new Date().getTime(), 
      };

      // Salva na coleção "graneleiros"
      await addDoc(collection(firestore, "graneleiros"), novoGraneleiro);

      Alert.alert("Sucesso", "Graneleiro adicionado com sucesso!");
      router.replace("/(tabs)/(auth)/home"); // Navega para a home (ajuste o caminho se necessário)

    } catch (error) {
      console.error("Erro ao salvar graneleiro:", error);
      Alert.alert("Erro", "Não foi possível adicionar o graneleiro.");
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#28FD40" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Adicionar Graneleiro</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#393939" />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nome do Graneleiro</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Silo Principal"
          placeholderTextColor="#999"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Volume Total (em Toneladas)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 1000"
          placeholderTextColor="#999"
          value={volume}
          onChangeText={setVolume}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Percentual de Lotação Máximo (%)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 85"
          placeholderTextColor="#999"
          value={lotacaoMaxima}
          onChangeText={setLotacaoMaxima}
          keyboardType="numeric"
        />
        <Text style={styles.inputHint}>
          Você será notificado quando o nível atingir este percentual.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleAdicionarGraneleiro} disabled={loading}>
          <LinearGradient
            colors={["#28FD40", "#C7D61E"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Text style={styles.buttonText}>
              {loading ? "Adicionando..." : "Adicionar Graneleiro"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    position: "relative",
  },
  headerText: {
    fontFamily: "Poppins_Bold",
    fontSize: 22,
    color: "#393939",
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  form: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  label: {
    fontFamily: "Poppins_Bold",
    fontSize: 16,
    color: "#393939",
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    width: "100%",
    height: 55,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontFamily: "Poppins_Regular",
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputHint: {
    fontSize: 12,
    fontFamily: "Poppins_Regular",
    color: "#6c757d",
    marginTop: 5,
  },
  button: {
    marginTop: 40,
    width: "100%",
    borderRadius: 50,
    overflow: "hidden",
    elevation: 3,
  },
  gradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  buttonText: {
    color: "#393939",
    fontSize: 18,
    fontFamily: "Poppins_Bold",
  },
});
