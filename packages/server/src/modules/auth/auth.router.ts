import {
  AuthOutputSchema,
  LoginInputSchema,
  LogoutOutputSchema,
  RegisterInputSchema,
} from "@acme/types";
import { z } from "zod";
import { AppError } from "@/trpc/errors";
import { publicProcedure, router } from "@/trpc/init";
import { checkRateLimit, envInt } from "@/utils/rate-limit";
import { clearSessionCookie, setSessionCookie } from "@/utils/session";
import { authService } from "./auth.service";

const LOGIN_RATE_LIMIT = {
  maxRequests: envInt("AUTH_LOGIN_MAX_REQUESTS", 10),
  windowMs: envInt("AUTH_LOGIN_WINDOW_MS", 15 * 60_000),
};
const REGISTER_RATE_LIMIT = {
  maxRequests: envInt("AUTH_REGISTER_MAX_REQUESTS", 5),
  windowMs: envInt("AUTH_REGISTER_WINDOW_MS", 60 * 60_000),
};

const rateLimitedProcedure = (
  prefix: string,
  config: { maxRequests: number; windowMs: number },
) =>
  publicProcedure.use(async ({ ctx, next }) => {
    if (!(await checkRateLimit(`${prefix}:${ctx.clientIp}`, config)))
      throw AppError.tooManyRequests(
        ctx.language,
        "errors.auth.tooManyRequests",
      );
    return next();
  });

export const authRouter = router({
  login: rateLimitedProcedure("login", LOGIN_RATE_LIMIT)
    .input(LoginInputSchema)
    .output(AuthOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const result = await authService.login(input.email, input.password);

      if (!result) {
        throw AppError.badRequest(
          ctx.language,
          "errors.auth.invalidCredentials",
        );
      }

      if (!result.defaultWorkspaceSlug) {
        throw AppError.notFound(
          ctx.language,
          "errors.auth.defaultWorkspaceNotFound",
        );
      }

      const sessionId = await authService.createSession(result.user.id);
      setSessionCookie(ctx.resHeaders, sessionId);

      return {
        user: result.user,
        defaultWorkspaceSlug: result.defaultWorkspaceSlug,
      };
    }),

  register: rateLimitedProcedure("register", REGISTER_RATE_LIMIT)
    .input(RegisterInputSchema)
    .output(AuthOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const result = await authService.registerUser(input, ctx.language);

      const sessionId = await authService.createSession(result.user.id);
      setSessionCookie(ctx.resHeaders, sessionId);

      return {
        user: result.user,
        defaultWorkspaceSlug: result.defaultWorkspaceSlug,
      };
    }),

  logout: publicProcedure
    .input(z.void())
    .output(LogoutOutputSchema)
    .mutation(async ({ ctx }) => {
      if (ctx.sessionId) {
        await authService.deleteSession(ctx.sessionId);
      }
      clearSessionCookie(ctx.resHeaders);
      return { success: true };
    }),
});
