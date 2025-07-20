import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
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
    resolve: {
      alias: {
        src: path.resolve(__dirname, "src"),
      },
    },
    test: {
      environment: "jsdom",
      globals: true,
      root: process.cwd(),
      setupFiles: "./test/setupTests.js",
      alias: {
        src: path.resolve(__dirname, "src"),
        __mocks__: path.resolve(__dirname, "__mocks__"),
      },
    },
    define: {
      "import.meta.env": JSON.stringify(env),
    },
  };
});
