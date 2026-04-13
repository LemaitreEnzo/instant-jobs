import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
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
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
});
