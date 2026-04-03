import { TRPCError } from "@trpc/server";
import { getMessage, type Language } from "@/i18n";
/**
 * Shorthand factories for common TRPCError codes.
 * Pass `language` + i18n key — no need to call getMessage at the call site.
 *
 * @example
 *   throw AppError.notFound(ctx.language, "errors.user.notFound");
 *   throw AppError.forbidden(ctx.language, "dev only"); // raw string also works
 */
export const AppError = {
  badRequest: (language: Language, key: string) =>
    new TRPCError({ code: "BAD_REQUEST", message: getMessage(language, key) }),
  unauthorized: (language: Language, key: string) =>
    new TRPCError({ code: "UNAUTHORIZED", message: getMessage(language, key) }),
  forbidden: (language: Language, key: string) =>
    new TRPCError({ code: "FORBIDDEN", message: getMessage(language, key) }),
  notFound: (language: Language, key: string) =>
    new TRPCError({ code: "NOT_FOUND", message: getMessage(language, key) }),
  tooManyRequests: (language: Language, key: string) =>
    new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: getMessage(language, key),
    }),
};
