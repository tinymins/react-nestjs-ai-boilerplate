import type { UserSchema } from "./zh.js";

export const userEn: UserSchema = {
  errors: {
    notFound: "User not found",
    emailInUse: "Email already in use",
  },
  ui: {
    profileSettings: "Profile settings",
    signOut: "Sign out",
    name: "Name",
    email: "Email",
    saveSuccess: "Saved successfully",
    saveFailed: "Failed to save",
    avatarRemoved: "Avatar removed",
    avatarUpdated: "Avatar updated",
    uploadFailed: "Upload failed",
    avatarRemoveFailed: "Failed to remove avatar",
  },
};
