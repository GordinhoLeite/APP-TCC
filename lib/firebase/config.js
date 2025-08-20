

// lib/firebase/config.js

// 1. Imports dos módulos necessários
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// 2. Suas credenciais do Firebase
//    É MUITO IMPORTANTE que você guarde essas chaves com segurança.

const firebaseConfig = {
  apiKey: "AIzaSyDL8SWRaPskw0Tx7L5Kd7eqI1x_uGbKoVI",
  authDomain: "trabalho-conclusao-de-cu-fbce7.firebaseapp.com",
  databaseURL: "https://trabalho-conclusao-de-cu-fbce7-default-rtdb.firebaseio.com",
  projectId: "trabalho-conclusao-de-cu-fbce7",
  storageBucket: "trabalho-conclusao-de-cu-fbce7.firebasestorage.app",
  messagingSenderId: "504282890408",
  appId: "1:504282890408:web:72b4293fdc40a858f5c29d"
};

// 3. Inicialização do App (só deve acontecer uma vez)
const app = initializeApp(firebaseConfig);

// 4. Inicialização do Auth com persistência para manter o usuário logado
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// 5. Inicialização do Firestore
const firestore = getFirestore(app);

// 6. Exporta apenas os serviços que o app está utilizando
export { auth, firestore };
