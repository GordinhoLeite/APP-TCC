const { getDefaultConfig } = require("expo/metro-config");
const { mergeConfig } = require("metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Configuração para lidar com arquivos SVG e alias "@"
const svgConfig = {
  transformer: {
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  },
  resolver: {
    assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...config.resolver.sourceExts, "svg"],
    extraNodeModules: {
      "@": path.resolve(__dirname), // ou path.resolve(__dirname, "app") se quiser que @/ aponte direto para a pasta app
    },
  },
};

module.exports = mergeConfig(config, svgConfig);
