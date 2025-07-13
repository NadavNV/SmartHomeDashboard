import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command, mode }) => {
  // Load default root-level .env
  const rootEnv = loadEnv(mode, process.cwd());
  // Load additional .env from config/constants.env
  const constantsEnv = loadEnv(mode, path.resolve(__dirname, "config"));
  // Merge without overwriting existing keys
  const env = {
    ...constantsEnv,
    ...rootEnv, // rootEnv takes precedence
  };
  return {
    plugins: [react()],
    server: {
      port: 3001,
      host: true,
      watch: {
        usePolling: true,
      },
      esbuild: {
        target: "esnext",
        platform: "linux",
      },
    },
    define: {
      VITE_API_URL: JSON.stringify(env.VITE_API_URL),
    },
  };
});
