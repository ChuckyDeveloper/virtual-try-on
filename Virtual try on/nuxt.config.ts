import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ["c15c-49-228-102-228.ngrok-free.app"], // ✅ หรือใช้ '.ngrok-free.app' สำหรับ wildcard
    },
  },
});
