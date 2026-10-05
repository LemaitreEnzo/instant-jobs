import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, loadEnv } from "vite";
export default defineConfig(({ mode }) => {
  // Force Vite to load all variables, even without the VITE_ prefix
  const env = loadEnv(mode, process.cwd(), "");

  // 3. Fallback logic using the freshly loaded env variables
  const serverPort = env.PORT ? Number(env.PORT) : 5173;

  return {
    server: {
      host: "0.0.0.0",
      port: serverPort,
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
  };
});
