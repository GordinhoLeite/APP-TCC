import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase/config";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";

const { width } = Dimensions.get("window");

export default function EditarGraneleiro() {
  const router = useRouter();
  // Recebe os parâmetros da tela anterior
  const { graneleiroID, nome, volume, lotacaoMaxima } = useLocalSearchParams();

  // Estados para os campos do formulário
  const [novoNome, setNovoNome] = useState(nome as string);
  const [novoVolume, setNovoVolume] = useState(volume as string);
  const [novaLotacao, setNovaLotacao] = useState(lotacaoMaxima as string);
  const [loading, setLoading] = useState(false);

  let [fontsLoaded] = useFonts({
    Poppins_Regular: Poppins_400Regular,
    Poppins_Bold: Poppins_700Bold,
  });

  const handleSalvar = async () => {
    if (!novoNome || !novoVolume || !novaLotacao) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }
    setLoading(true);
    try {
      const graneleiroRef = doc(firestore, "graneleiros", graneleiroID as string);
      await updateDoc(graneleiroRef, {
        nome: novoNome,
        volume: Number(novoVolume),
        lotacaoMaxima: Number(novaLotacao),
      });

      Alert.alert("Sucesso", "Graneleiro atualizado com sucesso!");
      router.back();
    } catch (error) {
      console.error("Erro ao atualizar graneleiro:", error);
      Alert.alert("Erro", "Não foi possível atualizar o graneleiro.");
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#28FD40" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Graneleiro</Text>

      <Text style={styles.label}>Nome do Graneleiro</Text>
      <TextInput
        style={styles.input}
        value={novoNome}
        onChangeText={setNovoNome}
      />

      <Text style={styles.label}>Volume Total (em Toneladas)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={novoVolume}
        onChangeText={setNovoVolume}
      />

      <Text style={styles.label}>Percentual de Lotação Máximo (%)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={novaLotacao}
        onChangeText={setNovaLotacao}
      />

      <TouchableOpacity style={styles.button} onPress={handleSalvar} disabled={loading}>
        <LinearGradient
          colors={["#28FD40", "#C7D61E"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.buttonText}>{loading ? "Salvando..." : "Salvar Alterações"}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins_Bold",
    marginBottom: 30,
    color: "#393939",
  },
  label: {
    width: width * 0.9,
    fontFamily: "Poppins_Bold",
    fontSize: 16,
    color: "#393939",
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    width: width * 0.9,
    height: 55,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontFamily: "Poppins_Regular",
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    width: width * 0.9,
    borderRadius: 50,
    overflow: "hidden",
    marginTop: 40,
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
