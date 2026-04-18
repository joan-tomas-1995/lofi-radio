import React, { createContext, useState, useContext } from "react";

const LanguageContext = createContext();
const SUPPORTED_LANGUAGES = ["es", "en", "fr", "it", "ru", "zh", "de"];

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const stored = localStorage.getItem("language");
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) return stored;
    const browserLanguage = navigator.language.split(/[-_]/)[0];
    return SUPPORTED_LANGUAGES.includes(browserLanguage) ? browserLanguage : "en";
  });

  const setLanguage = (lang) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      localStorage.setItem("language", lang);
      setLanguageState(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
