// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: '/aoc2023'
  },
  ssr: true,
  devtools: { enabled: true },
  css: ["@fontsource/nova-square",
    "~/assets/main.scss"
    ],
})
