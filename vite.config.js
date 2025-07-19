import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

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
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./test/setupTests.js",
      deps: {
        moduleDirectories: ["node_modules", path.resolve(__dirname, "src")],
      },
      alias: {
        src: path.resolve(__dirname, "src"),
      },
    },
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
    resolve: {
      alias: {
        src: path.resolve(__dirname, "src"),
      },
    },
  };
});
