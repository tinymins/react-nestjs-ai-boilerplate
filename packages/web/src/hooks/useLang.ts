import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { loadLangMode, saveLangMode } from "../lib/storage";
import type { Lang, LangMode } from "../lib/types";

export function useLang() {
  const { i18n } = useTranslation();
  const [langMode, setLangMode] = useState<LangMode>(() => loadLangMode());

  const normalizeLang = useCallback((value?: string): Lang => {
    const lowerVal = value?.toLowerCase() ?? "";
    if (lowerVal.startsWith("en")) return "en";
    return "zh";
  }, []);

  const detectAutoLang = useCallback((): Lang => {
    if (typeof navigator !== "undefined") {
      const browserLang = navigator.languages?.[0] ?? navigator.language;
      return normalizeLang(browserLang);
    }
    if (typeof document !== "undefined") {
      return normalizeLang(document.documentElement.lang);
    }
    return "zh";
  }, [normalizeLang]);

  const lang: Lang = langMode === "auto" ? detectAutoLang() : langMode;

  useEffect(() => {
    saveLangMode(langMode);
    const nextLang = langMode === "auto" ? detectAutoLang() : langMode;
    if (i18n.language !== nextLang) {
      i18n.changeLanguage(nextLang);
    }
  }, [langMode, i18n, detectAutoLang]);

  return { lang, langMode, setLangMode };
}
