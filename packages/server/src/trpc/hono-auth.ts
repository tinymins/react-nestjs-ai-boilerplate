/**
 * Hono middleware for authenticating raw (non-tRPC) routes.
 * Sets `userId` and `language` as Hono context variables.
 */
import { createMiddleware } from "hono/factory";
import type { Language } from "@/i18n";
import { t } from "@/i18n";
import { resolveRequestAuth } from "@/utils/request-auth";

export type AuthVariables = {
  userId: string;
  language: Language;
};

export const requireAuth = createMiddleware<{ Variables: AuthVariables }>(
  async (c, next) => {
    const { userId, language } = await resolveRequestAuth({
      get: (name: string) => c.req.header(name) ?? null,
    });

    if (!userId) {
      return c.json({ error: t(language, "errors.common.unauthorized") }, 401);
    }

    c.set("userId", userId);
    c.set("language", language);
    await next();
  },
);
