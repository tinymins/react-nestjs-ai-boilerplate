# AI Stack — Full-Stack TypeScript Monorepo

TypeScript 全栈 Monorepo 应用，使用 pnpm workspaces + Turborepo 管理。

## 技术栈

| Layer | Tech |
|-------|------|
| **Backend** | Hono · tRPC v11 · Prisma 7 · PostgreSQL 18 |
| **Frontend** | React 19 · React Router v7 (SSR) · TailwindCSS 4 · TanStack Query v5 |
| **Types** | Zod v4 · TypeScript 5.9 |
| **Build** | Turborepo · Vite 8 · rolldown |
| **Dev Tools** | Biome · Docker Compose · pnpm 10.15 |
| **Miniapp** | Taro 4 · React 18 · WeChat |

## 快速开始

```bash
# 首次初始化（创建 .env、安装依赖、启动 DB/Redis/MinIO、迁移）
make init

# 启动开发环境
make dev
```

开发服务器：
- 前端: http://localhost:5173
- 后端 API: http://localhost:4000
- MinIO 控制台: http://localhost:9001

## 核心命令

```bash
make init     # 首次初始化（破坏性操作，会重建数据库）
make dev      # 启动开发环境（DB + Redis + MinIO + 开发服务器）
make build    # 生产构建
make docker   # Docker 构建并启动所有服务
make lint     # Biome lint + format 检查
make tsc      # TypeScript 类型检查
```

## 项目结构

```
packages/
  server/       Hono + tRPC + Prisma 后端
  web/          React Router v7 SSR 前端
  types/        共享 Zod 模式 + TypeScript 类型
  components/   通用 UI 组件（TailwindCSS，无业务逻辑）
  i18n/         国际化资源（zh/en）
  miniapp/      微信小程序（Taro 4）
```

## 特色功能

- **端到端类型安全**: tRPC + Zod，从数据库到 UI 全链路类型安全
- **SSR 支持**: React Router v7 服务端渲染，SEO 友好
- **多工作空间**: 支持多工作空间切换
- **管理后台**: 超级管理员/管理员/用户三级角色，系统设置、用户管理、邀请码
- **对象存储**: S3 兼容（MinIO 开发 / AWS S3 生产）
- **国际化**: 中英文双语
- **主题系统**: 明暗主题 + CSS 变量 + 跟随系统

## 数据库

```bash
pnpm --filter @acme/server db:push      # 同步 Schema（开发用）
pnpm --filter @acme/server db:migrate   # 创建迁移文件（生产用）
pnpm --filter @acme/server db:generate  # 重新生成 Prisma Client
```

## 部署

参见 [DEPLOY.md](DEPLOY.md) 了解生产部署流程。

Docker Compose 包含 7 个服务：PostgreSQL、Redis、MinIO、数据库迁移、后端、前端。

## 相关文档

- [Hono](https://hono.dev/) · [tRPC](https://trpc.io/) · [Prisma](https://www.prisma.io/)
- [React](https://react.dev/) · [React Router](https://reactrouter.com/) · [TailwindCSS](https://tailwindcss.com/)
- [Turborepo](https://turbo.build/) · [Biome](https://biomejs.dev/)

## License

[MIT](LICENSE)
