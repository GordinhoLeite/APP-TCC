import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from "react-native";
import { useRouter } from "expo-router";
// 1. Importe 'auth' e 'firestore' da nossa configuração central
import { auth, firestore } from "@/lib/firebase/config";
// 2. Importe as funções necessárias do SDK
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const { width } = Dimensions.get("window");

export default function RegisterScreen() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false); // Adicionado para feedback visual

  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    setLoading(true);

    try {
      // 3. Use a função do SDK com a instância 'auth' importada
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // 4. Salve as informações adicionais no Firestore
      await setDoc(doc(firestore, "usuarios", user.uid), {
        nome: nome,
        email: email, // Boa prática salvar o email aqui também
        createdAt: new Date()
      });

      // 5. Envie o e-mail de verificação
      await sendEmailVerification(user);

      Alert.alert(
        "Verificação Necessária",
        "Sua conta foi criada! Enviamos um link de verificação para o seu e-mail. Por favor, verifique-o antes de fazer o login."
      );
      
      router.replace("/(tabs)/Tela_Login/login");

    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      // Melhora o feedback de erro para o usuário
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Erro', 'Este endereço de e-mail já está sendo utilizado.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Erro', 'A senha precisa ter no mínimo 6 caracteres.');
      } else {
        Alert.alert("Erro ao Cadastrar", "Não foi possível criar sua conta. Verifique os dados e tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      
      <TouchableOpacity 
        style={styles.registerButton} 
        onPress={handleRegister} 
        disabled={loading} // Desabilita o botão enquanto cadastra
      >
        <Text style={styles.registerButtonText}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.replace("/(tabs)/Tela_Login/login")}>
        <Text style={styles.loginLink}>Já é usuário? Faça Login</Text>
      </TouchableOpacity>
    </View>
  );
}

// Seus estilos permanecem os mesmos...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins_Bold",
    color: "#393939",
    marginBottom: 75,
  },
  input: {
    width: width * 0.85,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 20,
    fontFamily: "Poppins_Regular",
  },
  policyText: {
    fontSize: 16,
    color: "#393939",
    textAlign: "center",
    marginBottom: 15,
    fontFamily: "Poppins_Regular",
  },
  policyBold: {
    fontFamily: "Poppins_Bold",
  },
  registerButton: {
    backgroundColor: "#393939",
    paddingVertical: 15,
    width: width * 0.85,
    borderRadius: 50,
    alignItems: "center",
    marginVertical: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins_Bold",
  },
  loginText: {
    fontSize: 16,
    color: "#393939",
    fontFamily: "Poppins_Regular",
  },
  loginLink: {
    fontSize: 16,
    fontFamily: "Poppins_Bold",
    color: "#393939",
  },
});