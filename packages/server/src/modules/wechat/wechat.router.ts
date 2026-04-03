import {
  WechatAuthOutputSchema,
  WechatGetPhoneInputSchema,
  WechatLoginInputSchema,
} from "@acme/types";
import { z } from "zod";
import { AppError } from "@/trpc/errors";
import { publicProcedure, router, wechatProtectedProcedure } from "@/trpc/init";
import { checkRateLimit, envInt } from "@/utils/rate-limit";
import {
  clearWechatSessionCookie,
  setWechatSessionCookie,
} from "@/utils/session";
import { toWechatUserOutput } from "./wechat.mapper";
import { wechatService } from "./wechat.service";

const LOGIN_RATE_LIMIT = {
  maxRequests: envInt("WECHAT_LOGIN_MAX_REQUESTS", 20),
  windowMs: envInt("WECHAT_LOGIN_WINDOW_MS", 15 * 60_000),
};

const rateLimitedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!(await checkRateLimit(`wechat-login:${ctx.clientIp}`, LOGIN_RATE_LIMIT)))
    throw AppError.tooManyRequests(ctx.language, "errors.auth.tooManyRequests");
  return next();
});

export const wechatRouter = router({
  login: rateLimitedProcedure
    .input(WechatLoginInputSchema)
    .output(WechatAuthOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const wechatUser = await wechatService.loginWithCode(
        input.code,
        ctx.language,
      );
      const sessionId = await wechatService.createSession(wechatUser.id);
      setWechatSessionCookie(ctx.resHeaders, sessionId);
      return { wechatUser: toWechatUserOutput(wechatUser) };
    }),

  bindPhone: wechatProtectedProcedure
    .input(WechatGetPhoneInputSchema)
    .output(WechatAuthOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const updated = await wechatService.bindPhone(
        ctx.wechatUserId,
        input.code,
        ctx.language,
      );
      return { wechatUser: toWechatUserOutput(updated) };
    }),

  getProfile: wechatProtectedProcedure
    .input(z.void())
    .output(WechatAuthOutputSchema)
    .query(async ({ ctx }) => {
      const wechatUser = await wechatService.getById(ctx.wechatUserId);
      if (!wechatUser)
        throw AppError.notFound(ctx.language, "errors.user.notFound");
      return { wechatUser: toWechatUserOutput(wechatUser) };
    }),

  logout: wechatProtectedProcedure
    .input(z.void())
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx }) => {
      if (ctx.wechatSessionId) {
        await wechatService.deleteSession(ctx.wechatSessionId);
      }
      clearWechatSessionCookie(ctx.resHeaders);
      return { success: true };
    }),
});
