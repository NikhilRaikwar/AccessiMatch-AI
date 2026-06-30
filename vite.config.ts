import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const fdKey = env.VITE_FOOTBALL_DATA_API_KEY || "";
  const rapidKey = env.VITE_API_FOOTBALL_KEY || "";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api-football-data": {
          target: "https://api.football-data.org",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-football-data/, ""),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.setHeader("X-Auth-Token", fdKey);
            });
          }
        },
        "/api-football-live": {
          target: "https://free-api-live-football-data.p.rapidapi.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-football-live/, ""),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.setHeader("x-rapidapi-key", rapidKey);
              proxyReq.setHeader("x-rapidapi-host", "free-api-live-football-data.p.rapidapi.com");
            });
          }
        }
      }
    }
  };
});
