import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  define: {
    // seems to be needed for the browser build
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  },
  build: {
    sourcemap: true,
    lib: {
      entry: "src/main.ts",
      name: "zyt",
      fileName: "zyt",
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") {
            return "zyt.css";
          } else {
            return assetInfo.name;
          }
        },
      },
    },
  },
});
