# Project Overview

TypeScript monorepo (pnpm workspaces + Turborepo): Hono backend, React Router v7 SSR frontend, shared types.

## Packages

| Package | Purpose |
|---------|---------|
| `packages/server` | Hono 4 + tRPC v11 + Prisma 7 + PostgreSQL 18 |
| `packages/web` | React 19 + React Router v7 SSR + TailwindCSS 4 + TanStack Query v5 |
| `packages/types` | Shared Zod v4 schemas + TypeScript types |
| `packages/components` | Reusable UI components (TailwindCSS, no business logic) |
| `packages/i18n` | i18n locale resources (zh/en) |
| `packages/miniapp` | Taro 4 + React + WeChat Mini Program |

## Commands

| Command | What it does |
|---------|-------------|
| `make init` | Full project initialization (deps, services, DB migration) |
| `make dev` | Start dev environment (Docker services + dev servers) |
| `make dev-miniapp` | Start miniapp development watch |
| `make build` | Build production (server + web) |
| `make lint` | Biome lint check |
| `make tsc` | TypeScript type check across all packages |
| `pnpm dev` | Turbo dev (server + web concurrently) |
| `pnpm build` | Turbo production build |

### Database

```sh
pnpm --filter @acme/server db:push      # sync schema to DB (dev, no migration files)
pnpm --filter @acme/server db:migrate   # create migration files + apply (production)
pnpm --filter @acme/server db:generate  # regenerate Prisma client after schema change
```

#### Query local DB (one-liner)

```sh
docker exec -it ai-stack-postgres psql -U postgres -d app -c "SELECT * FROM users LIMIT 10;"
```

## File Structure

```
packages/
  server/            # Backend (Hono + tRPC + Prisma)
    src/
      db/client.ts   # Prisma client (PrismaPg adapter)
      trpc/
        init.ts      # tRPC initialization, publicProcedure, protectedProcedure
        context.ts   # Request context (cookie-based auth)
        middlewares.ts # workspaceProtectedProcedure, adminProcedure, superAdminProcedure
        router.ts    # appRouter — registers all module routers
        errors.ts    # AppError factories (notFound, badRequest, etc.)
      modules/
        auth/        # Login, register, logout, rate limiting
        user/        # Profile, password, avatar
        workspace/   # Workspace CRUD, membership
        admin/       # System settings, user mgmt, invitation codes
        wechat/      # WeChat miniapp authentication
        upload/      # Avatar file upload (Hono HTTP routes)
      utils/
        session.ts   # Cookie-based session management
        request-auth.ts # Auth resolution from cookies
      storage/       # S3-compatible storage provider
      logger.ts      # Consola-based logger
    prisma/
      schema.prisma  # Database schema

  web/               # Frontend (React Router v7 SSR)
    src/
      root.tsx       # Root layout with Providers
      routes.ts      # Route configuration
      routes/        # Route modules
        home/        # Landing page
        login/       # Auth pages
        register/
        dashboard/   # Dashboard with workspace context
          $workspace/
            $page/
      components/    # Business components (use tRPC, contain logic)
        auth/        # Login/register forms
        dashboard/   # Dashboard layout, sidebar
        account/     # User settings
        admin/       # Admin panel components
      hooks/         # React custom hooks
        useAuth.tsx
        useTheme.tsx
        useLang.tsx
        useWorkspace.tsx
        useAvatarUpload.ts
      lib/
        trpc.ts      # tRPC client setup
        i18n.ts      # i18next configuration
        preferences.ts # Cookie-based theme/lang persistence
        avatar.ts    # resolveAvatarUrl() helper
    server.mjs       # Bun-based SSR server (proxies /trpc, /upload)
    react-router.config.ts

  components/        # Generic UI components (no business logic)
    src/
      styles/tokens.css  # CSS variables (light/dark design tokens)
      Avatar/
      Button/
      Dropdown/
      FormField/
      Input/
      Modal/
      Select/
      Spinner/
      Toaster/

  i18n/              # i18n locale resources
    src/locales/
      zh/            # Chinese translations
      en/            # English translations

  types/             # Shared types & Zod schemas
    src/
      user.ts
      workspace.ts
      admin.ts
      api.ts
      index.ts

  miniapp/           # WeChat Mini Program (Taro 4)
    src/
      app.tsx
      pages/
      lib/
      custom-tab-bar/
```

## Critical Rules

- **After every change: run `make lint`** — only fix errors _you_ introduced, ignore pre-existing ones
- No antd, no @ant-design/icons — TailwindCSS 4 only
- **Zod v4** only (not v3 — API differs)
- Biome for lint/format (not Prettier/ESLint)
- Single file ≤ 500 lines
- Every tRPC procedure must have `.input()` + `.output()` Zod schemas
- Never expose Prisma entities directly — transform via `toXxxOutput()` mapper helpers

## Architecture Patterns

### tRPC Procedure Chain

| Procedure | Use case |
|-----------|----------|
| `publicProcedure` | No auth required |
| `protectedProcedure` | Requires `ctx.userId` (cookie-based session) |
| `workspaceProtectedProcedure` | Requires workspace membership |
| `adminProcedure` | Requires admin or superadmin role |
| `superAdminProcedure` | Requires superadmin role only |

### Cookie-Based Sessions

Authentication uses HTTP-only cookies (`SESSION_ID`), not JWT tokens:
- `setSessionCookie(resHeaders, sessionId)` — set on login/register
- `clearSessionCookie(resHeaders)` — clear on logout
- `resolveRequestAuth(headers)` — extract userId from cookie in tRPC context

### CSS Variables Theming

Design tokens defined in `packages/components/src/styles/tokens.css` with `:root` and `.dark` variants.
Theme toggling via `document.documentElement.classList.add/remove("dark")`.
User preference stored in cookies (`themeMode`, `langMode`).

### Error Handling

All `AppError` factories require two args: `(language: Language, i18nKey: string)`:

```typescript
throw AppError.notFound(ctx.language, "errors.user.notFound");
throw AppError.badRequest(ctx.language, "errors.auth.invalidCredentials");
throw AppError.unauthorized(ctx.language, "errors.common.unauthorized");
throw AppError.forbidden(ctx.language, "errors.common.adminRequired");
```

### Storage / File URL Rules

Backend stores **file keys** only (e.g. `userId/1234.jpg`), never full URLs.
- `StorageProvider.uploadFile()` returns `void` — no URL returned from storage layer
- Backend API responds with `key`, never full URLs
- Frontend resolves full URLs via `resolveAvatarUrl(key)` using `VITE_STORAGE_PUBLIC_URL` env var

```typescript
import { resolveAvatarUrl } from "@/lib/avatar";
<Avatar url={resolveAvatarUrl(user.settings?.avatarKey)} />
```

## Admin Module

The project includes a comprehensive admin system with role-based access control:

### Roles

| Role | Access | Description |
|------|--------|-------------|
| `superadmin` | Full system access | Manage users, roles, settings, invitation codes |
| `admin` | System settings | View/update system settings |
| `user` | Standard access | Regular user, no admin features |

### Features

- **System Settings**: `allowRegistration`, `singleWorkspaceMode` (admin + superadmin via `adminProcedure`)
- **User Management**: List, create, delete users, force reset passwords (superadmin only via `superAdminProcedure`)
- **Role Management**: Update user roles between user/admin/superadmin (superadmin only)
- **Invitation Codes**: Generate, list, delete invitation codes for controlled registration (superadmin only)
- **Types**: `packages/types/src/admin.ts` — AdminUser, SystemSettings, InvitationCode schemas
- **i18n**: `packages/i18n/src/locales/admin/` — admin-specific translations
- **Frontend**: Admin components in `packages/web/src/components/admin/`

## Coding Guidelines

### General TypeScript Rules

- Always prefer **async/await** over `.then()`
- Use **arrow functions** for consistency (`const fn = () => {}`)
- Avoid `any`; prefer `unknown` with proper type narrowing
- **Zod v4** schemas are mandatory for all runtime validation and API contracts
- **Import order**: Node built-ins → external packages → internal modules → relative imports
- Use `@/` path aliases, not relative paths (configured in tsconfig)

### React Guidelines

- Use **functional components + hooks only** (no class components)
- Type props with `interface Props {}` instead of `type`
- Keep components small and focused on a single responsibility
- Use TanStack Query for all tRPC calls in components
- **Never hardcode UI strings** — always use i18n keys

### Component Architecture

| Type | Location | Rule |
|------|----------|------|
| Generic UI | `packages/components/src/` | Pure UI, no API calls, reusable across projects |
| Business | `packages/web/src/components/` | May call tRPC, contains business logic |

### Naming Conventions

| Entity | Types File | Schema Export | Mapper Function | Router Variable |
|--------|------------|---------------|-----------------|-----------------|
| User | `user.ts` | `UserSchema` | `toUserOutput()` | `userRouter` |
| Workspace | `workspace.ts` | `WorkspaceSchema` | `toWorkspaceOutput()` | `workspaceRouter` |

### Mandatory Lint Check

**Every code change must end with `make lint`**. Before finishing any task — whether it's a new feature, bug fix, refactor, or any file modification — always run:

```bash
make lint
```

Fix all reported errors before considering the task complete. No exceptions.
