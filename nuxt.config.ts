// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2024-07-11",
  nitro: {
    preset: "aws-lambda",
    experimental: {
      websocket: true,
    },
  },
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/fonts", "@nuxt/ui"],
  ignore: ["packages/**"],
});
