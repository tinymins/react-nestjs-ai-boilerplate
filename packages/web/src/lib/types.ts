import type { Lang } from "@acme/types";

export type { Lang, LangMode, User, UserSettings } from "@acme/types";

export type Theme = "light" | "dark";
export type ThemeMode = "auto" | Theme;

/**
 * Language native names for display in language selectors
 * Each language is displayed in its own script/language
 * Using BCP 47 language tags (IETF standard)
 */
export const LANG_NAMES: Record<Lang, string> = {
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
  "en-US": "English",
  "ja-JP": "日本語",
  "de-DE": "Deutsch",
  yue: "粵語",
  wuu: "吴语",
  hak: "客家話",
  lzh: "文言文",
};
