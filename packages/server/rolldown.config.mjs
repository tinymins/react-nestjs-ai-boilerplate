import { defineConfig } from "rolldown";

export default defineConfig({
  input: "src/main.ts",
  output: {
    format: "es",
    dir: "dist",
    entryFileNames: "[name].js",
    chunkFileNames: "[name].js",
    preserveModules: true,
    preserveModulesRoot: "src",
    sourcemap: true,
  },
  // npm 包和 node: 内置标记为外部；@acme/* 工作区包和 @/ 内部别名由 rolldown 直接打包
  external: (id) =>
    id.startsWith("node:") ||
    (!id.startsWith(".") &&
      !id.startsWith("/") &&
      !id.startsWith("@/") &&
      !id.startsWith("@acme/")),
  resolve: {
    extensionAlias: {
      ".js": [".ts", ".js"],
    },
  },
});
