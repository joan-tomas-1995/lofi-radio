import React from "react";
import ReactDOM from "react-dom/client";
import { IntlProvider } from "react-intl";
import App from "./App.jsx";
import "./index.css";
import SchemaMarkup from "./Components/SchemaMarkup.jsx";
import { LanguageProvider, useLanguage } from "./LanguageContext";
import es from "./translations/es";
import en from "./translations/en";
import fr from "./translations/fr";
import it from "./translations/it";
import ru from "./translations/ru";
import zh from "./translations/zh";

const messages = { es, en, fr, it, ru, zh };

function Root() {
  const { language } = useLanguage();

  return (
    <IntlProvider
      messages={messages[language]}
      locale={language}
      defaultLocale="en">
      <App />
      <SchemaMarkup />
    </IntlProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
      <Root />
    </LanguageProvider>
  </React.StrictMode>
);
