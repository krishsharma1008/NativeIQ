import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: false },
  css: ["@/assets/css/main.css"],
  components: [
    {
      path: "@/components",
      pathPrefix: false
    },
    {
      path: "@/sections",
      pathPrefix: false
    }
  ],
  app: {
    head: {
      title: "NativeIQ Dashboard",
      meta: [
        { name: "description", content: "Operator-ready dashboard built with Nuxt + Vue for NativeIQ." },
        { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1" }
      ],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&display=swap"
        }
      ]
    }
  },
  compatibilityDate: "2024-04-12",
  typescript: {
    shim: false,
    tsConfig: {
      compilerOptions: {
        allowJs: true
      }
    }
  },
  nitro: {
    preset: "node-server"
  }
});
