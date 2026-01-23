import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// 直接匯入 JSON
import en from "./locales/en.json"; // 英文
import zhTW from "./locales/zh-TW.json"; // 繁體中文
import ja from "./locales/ja.json"; // 日本語

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      "zh-TW": { translation: zhTW },
      ja: { translation: ja },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;