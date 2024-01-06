// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css:['~/assets/main.css'],
  app:{
    head:{
      title: "PlayU",
      link: [{rel:'stylesheet',href:"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,1,0"}]
    }
  },
  modules:['@pinia/nuxt'],
  pinia: {
    autoImports: [
      'defineStore', // import { defineStore } from 'pinia'
      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
      'storeToRefs',
      'acceptHMRUpdate',
    ],
  },
})
