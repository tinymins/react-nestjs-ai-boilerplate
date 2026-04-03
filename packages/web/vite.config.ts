import { resolve } from "node:path";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, resolve(__dirname, "../.."), [
    "SERVER_PORT",
    "WEB_PORT",
    "VITE_",
  ]);

  const serverPort = Number(env.SERVER_PORT) || 4000;
  const webPort = Number(env.WEB_PORT) || 5173;

  return {
    plugins: [reactRouter(), tailwindcss()],
    resolve: {
      tsconfigPaths: true,
      alias: {
        "@/": `${resolve(__dirname, "src")}/`,
      },
    },
    server: {
      host: "0.0.0.0",
      port: webPort,
      proxy: {
        "/trpc": {
          target: `http://localhost:${serverPort}`,
          changeOrigin: true,
        },
        "/upload": {
          target: `http://localhost:${serverPort}`,
          changeOrigin: true,
        },
      },
    },
  };
});
