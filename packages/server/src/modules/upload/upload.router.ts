/**
 * Upload routes (Hono sub-app).
 * Mounted at /upload in main.ts.
 *
 * POST /upload/avatar -- authenticated, multipart/form-data, field "file"
 */
import { Hono } from "hono";
import { t } from "@/i18n";
import { Logger } from "@/logger";
import { type AuthVariables, requireAuth } from "@/trpc/hono-auth";
import { uploadService } from "./upload.service";

const logger = new Logger("UploadRoute");

export const uploadRouter = new Hono<{ Variables: AuthVariables }>();

uploadRouter.use("/avatar", requireAuth);

uploadRouter.post("/avatar", async (c) => {
  const userId = c.get("userId");
  const lang = c.get("language");

  let formData: FormData;
  try {
    formData = await c.req.formData();
  } catch {
    return c.json({ error: "Invalid multipart body" }, 400);
  }

  const fileField = formData.get("file");
  if (!(fileField instanceof File)) {
    return c.json({ error: 'Missing "file" field' }, 400);
  }

  const validationError = uploadService.validateAvatarFile(fileField);
  if (validationError === "invalidFileType") {
    return c.json({ error: t(lang, "errors.common.invalidFileType") }, 400);
  }
  if (validationError === "fileTooLarge") {
    return c.json({ error: t(lang, "errors.common.fileTooLarge") }, 400);
  }

  try {
    const result = await uploadService.uploadAvatar(userId, fileField);
    logger.log(`Avatar uploaded for user ${userId} -> key=${result.key}`);
    return c.json(result);
  } catch (err) {
    logger.error(`Avatar upload failed for user ${userId}: ${err}`);
    return c.json({ error: t(lang, "errors.common.requestFailed") }, 500);
  }
});
