export default {
  expo: {
    name: "TCC Lucca",
    slug: "h2ocontrol",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon_tcc.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      package: "com.lucca03.tcc", // certifique-se de que este é o mesmo do Firebase
      googleServicesFile: "./google-services.json", // <- Essencial para notificações push
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon_tcc.png",
        backgroundColor: "#000000"
      },
      permissions: [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO"//
      ]
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      '@react-native-google-signin/google-signin',
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash_tcc.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      [
        "expo-camera",
        {
          cameraPermission: "O aplicativo precisa de acesso à câmera para escanear QR codes."
        }
      ],
      "expo-font",
      "expo-asset"
      
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "dedc3356-54d9-4873-96f5-0e77cfc12b02"
      }
    },
  }
};