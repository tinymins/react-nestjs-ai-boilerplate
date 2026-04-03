import { resolve } from "node:path";
import dotenv from "dotenv";

// 先加载根目录 .env（端口等全局配置），再加载 server 本地 .env（补充）
// turbo 从 monorepo 根目录运行 → process.cwd() = packages/server
dotenv.config({ path: resolve(process.cwd(), "../../.env") });
dotenv.config();
