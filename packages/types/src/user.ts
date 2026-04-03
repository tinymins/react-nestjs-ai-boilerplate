import { z } from "zod";

export type Theme = "light" | "dark";
export type ThemeMode = "auto" | Theme;
export type Lang = "zh" | "en";
export type LangMode = "auto" | Lang;

export const UserSettingsSchema = z.object({
  avatarKey: z.string().nullable().optional(),
  langMode: z.enum(["auto", "zh", "en"]).optional(),
  themeMode: z.enum(["auto", "light", "dark"]).optional(),
});

export const UserSettingsPatchSchema = UserSettingsSchema.partial();

export type UserSettings = z.infer<typeof UserSettingsSchema>;

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "user"]),
  settings: UserSettingsSchema.nullable().optional(),
});

export type User = z.infer<typeof UserSchema>;
