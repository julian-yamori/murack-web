import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [deno(), react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
