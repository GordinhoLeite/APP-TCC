module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@": "./",
          },
        },
      ],
      // O plugin do Reanimated OBRIGATORIAMENTE precisa ser o último da lista
      "react-native-reanimated/plugin",
    ],
  };
};