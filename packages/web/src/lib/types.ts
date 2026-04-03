import type { Lang } from "@acme/types";

export type { Lang, LangMode, User, UserSettings } from "@acme/types";

export type Theme = "light" | "dark";
export type ThemeMode = "auto" | Theme;

export const LANG_NAMES: Record<Lang, string> = {
  zh: "中文",
  en: "English",
};
