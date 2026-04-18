import React, { createContext, useState, useContext } from "react";

const LanguageContext = createContext();
const SUPPORTED_LANGUAGES = ["es", "en", "fr", "it", "ru", "zh", "de"];

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const browserLanguage = navigator.language.split(/[-_]/)[0];
    return SUPPORTED_LANGUAGES.includes(browserLanguage) ? browserLanguage : "en";
  });

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
