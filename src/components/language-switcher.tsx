"use client";

import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Globe } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
    if (i18n) {
      setCurrentLang(i18n.language || "en");
    }
  }, [i18n]);

  if (!mounted) return null;

  const changeLanguage = (lng: string) => {
    if (lng === currentLang) return; // Don't do anything if language is already selected

    // Set cookie for server-side language detection
    document.cookie = `i18next=${lng}; path=/; max-age=${60 * 60 * 24 * 365}`;

    // Store in localStorage as backup
    localStorage.setItem("i18nextLng", lng);

    // Update UI immediately
    setCurrentLang(lng);

    // Try to change language in i18n instance
    try {
      if (i18n && typeof i18n.changeLanguage === "function") {
        i18n.changeLanguage(lng);
        console.log("Language changed to:", lng);
      }
    } catch (error) {
      console.error("Error changing language:", error);
    }

    // Force a page reload to ensure the language change takes effect server-side
    window.location.href = window.location.pathname;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => changeLanguage("en")}
          className={currentLang === "en" ? "bg-secondary" : ""}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage("ru")}
          className={currentLang === "ru" ? "bg-secondary" : ""}
        >
          Русский
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
