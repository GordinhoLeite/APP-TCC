// lib/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDL8SWRaPskw0Tx7L5Kd7eqI1x_uGbKoVI",
  authDomain: "trabalho-conclusao-de-cu-fbce7.firebaseapp.com",
  databaseURL: "https://trabalho-conclusao-de-cu-fbce7-default-rtdb.firebaseio.com",
  projectId: "trabalho-conclusao-de-cu-fbce7",
  storageBucket: "trabalho-conclusao-de-cu-fbce7.firebasestorage.app",
  messagingSenderId: "504282890408",
  appId: "1:504282890408:web:72b4293fdc40a858f5c29d"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const firestore = getFirestore(app);
const db = getDatabase(app);
const storage = getStorage(app);

export { app, auth, firestore, db, storage };