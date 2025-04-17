import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

// Only initialize i18n on the client side
if (typeof window !== "undefined") {
  // Get initial language from window config if available
  const initialLanguage = window.i18nextConfig?.lng || "en";

  i18n
    // Load translations from the /public/locales folder
    .use(Backend)
    // Detect user language
    .use(LanguageDetector)
    // Pass the i18n instance to react-i18next
    .use(initReactI18next)
    // Initialize i18next
    .init({
      lng: initialLanguage,
      fallbackLng: "en",
      supportedLngs: ["en", "ru"],
      debug: process.env.NODE_ENV === "development",
      interpolation: {
        escapeValue: false, // React already escapes values
      },
      detection: {
        order: ["cookie", "localStorage", "navigator"],
        lookupCookie: "i18next",
        caches: ["cookie", "localStorage"],
      },
      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
      },
    });
}

export default i18n;
