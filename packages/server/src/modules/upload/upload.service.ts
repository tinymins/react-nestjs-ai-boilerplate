import { toUserOutput } from "@/modules/user/user.mapper";
import { userService } from "@/modules/user/user.service";
import { storage } from "@/storage/index";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export type AvatarValidationError = "invalidFileType" | "fileTooLarge";

export class UploadService {
  validateAvatarFile(file: File): AvatarValidationError | null {
    if (!ALLOWED_MIME.has(file.type)) return "invalidFileType";
    if (file.size > MAX_FILE_SIZE) return "fileTooLarge";
    return null;
  }

  async uploadAvatar(userId: string, file: File) {
    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const key = `${userId}/${Date.now()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await storage.uploadFile(key, buffer, file.type);

    let updated: Awaited<
      ReturnType<typeof userService.updateAvatarKey>
    >["updated"];
    let previousAvatarKey: string | null;
    try {
      ({ updated, previousAvatarKey } = await userService.updateAvatarKey(
        userId,
        key,
      ));
    } catch (err) {
      storage.deleteFile(key).catch(() => {});
      throw err;
    }

    if (previousAvatarKey) {
      storage.deleteFile(previousAvatarKey).catch(() => {});
    }

    return { key, user: toUserOutput(updated) };
  }
}

export const uploadService = new UploadService();
