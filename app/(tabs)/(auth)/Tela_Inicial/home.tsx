import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { collection, doc, getDoc, onSnapshot, query, where, getDocs } from "firebase/firestore";
import { firestore, auth } from "@/lib/firebase/config";

const { width } = Dimensions.get("window");

// --- MUDANÇA 1: Renomeando os tipos e variáveis ---
type Graneleiro = {
  id: string;
  sensorID: string;
  nome: string;
  // Adicione aqui os campos específicos do graneleiro se forem diferentes
};

export default function HomeScreen() {
  const [nomeUsuario, setNomeUsuario] = useState("");
  // Renomeado de 'aquario' para 'graneleiro'
  const [graneleiro, setGraneleiro] = useState<Graneleiro | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  let [fontsLoaded] = useFonts({
    Poppins_Regular: Poppins_400Regular,
    Poppins_Bold: Poppins_700Bold,
  });

  useEffect(() => {
    const carregarDados = async () => {
      const user = auth.currentUser;
      if (user) {
        const usuarioRef = doc(firestore, "usuarios", user.uid);
        const usuarioSnap = await getDoc(usuarioRef);

        if (usuarioSnap.exists()) {
          setNomeUsuario(usuarioSnap.data().nome || "");

          // --- MUDANÇA 2: Buscando na coleção "graneleiros" ---
          const graneleirosQuery = query(
            collection(firestore, "graneleiros"), // Alterado de "aquarios"
            where("usuarioID", "==", user.uid)
          );
          const querySnapshot = await getDocs(graneleirosQuery);

          if (!querySnapshot.empty) {
            const graneleiroData = querySnapshot.docs[0].data();
            const graneleiroID = querySnapshot.docs[0].id;

            const novoGraneleiro: Graneleiro = {
              id: graneleiroID,
              sensorID: graneleiroData.sensorID,
              nome: graneleiroData.nome,
            };
            setGraneleiro(novoGraneleiro);
            
            // A lógica do sensor continua a mesma, se aplicável
            // ...
          } else {
            setGraneleiro(null);
          }
        }
      }
      setLoading(false);
    };

    carregarDados();
  }, []);

  if (!fontsLoaded || loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", backgroundColor: '#F8F9FA' }]}>
        <ActivityIndicator size="large" color="#28FD40" />
      </View>
    );
  }

  // --- MUDANÇA 3: Renderização condicional para a nova tela ---
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bem vindo, {nomeUsuario}</Text>
      </View>

      {!graneleiro ? (
        <View style={styles.content}>
          {/* Você pode criar uma imagem específica para "sem graneleiro" */}
          <Image source={require("@/assets/images/imagem da tela inicial-sem aquario.png")} style={styles.image} />
          
          <Text style={styles.title}>
            <Text style={styles.boldText}>Ops.</Text>{" "}
            {/* Texto e cor de destaque atualizados */}
            <Text style={styles.highlightText}>Não há nenhum graneleiro cadastrado</Text>
          </Text>
          <Text style={styles.description}>Comece adicionando o graneleiro que deseja monitorar</Text>

          <TouchableOpacity
            style={styles.button}
            // Mude a rota se o scanner for diferente
            onPress={() => router.push("/(tabs)/(auth)/Tela_Monitoramento/ScannerQRCode")}
          >
            {/* Novo gradiente do botão */}
            <LinearGradient
              colors={["#28FD40", "#C7D61E"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              <Text style={styles.buttonText}>Adicionar graneleiro</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.content}>
          {/* Aqui virá o código da tela QUANDO HÁ um graneleiro cadastrado */}
          <Text style={styles.title}>Dados do Graneleiro: {graneleiro.nome}</Text>
        </View>
      )}

      {/* A barra de navegação inferior permanece a mesma */}
      <View style={styles.bottomNav}>
        {/* ... seu código da TabBar ... */}
      </View>
    </View>
  );
}

// --- MUDANÇA 4: Estilos atualizados para o novo design ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Fundo claro como no protótipo
  },
  header: {
    width: "100%",
    paddingTop: 60, // Espaçamento superior
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center', // Centraliza o texto de boas-vindas
  },
  welcomeText: {
    fontSize: 22,
    fontFamily: "Poppins_Bold",
    color: "#393939", // Cor escura para contraste
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center', // Centraliza o conteúdo verticalmente
    alignItems: "center",
  },
  image: {
    width: 150, // Ajuste o tamanho conforme necessário
    height: 150,
    marginBottom: 40,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins_Regular",
    textAlign: "center",
    color: "#393939",
    marginBottom: 10,
  },
  boldText: {
    fontFamily: "Poppins_Bold",
  },
  highlightText: {
    color: "#28FD40", // Cor de destaque principal do novo tema
    fontFamily: "Poppins_Bold",
  },
  description: {
    fontSize: 16,
    fontFamily: "Poppins_Regular",
    textAlign: "center",
    color: "#6c757d", // Um cinza para o texto secundário
    marginBottom: 30,
  },
  button: {
    width: "90%",
    borderRadius: 50, // Totalmente arredondado
    overflow: "hidden",
    elevation: 5, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#393939", // Texto escuro para melhor leitura no botão claro
    fontSize: 18,
    fontFamily: "Poppins_Bold",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
    // Estilos da sua barra de navegação...
  },
});
