import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    cors: true,
    allowedHosts: [
      "instant-jobs.duckdns.org",
      "preprod-instant-jobs.duckdns.org",
      "localhost",
    ],
  },
  resolve: {
    extensions: [".jsx", ".js", ".tsx", ".ts", ".json"],
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
});
