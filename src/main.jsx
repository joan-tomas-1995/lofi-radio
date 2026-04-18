import React from "react";
import ReactDOM from "react-dom/client";
import { IntlProvider } from "react-intl";
import { BrowserRouter } from "react-router-dom";

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
import de from "./translations/de";

const messages = { es, en, fr, it, ru, zh, de };

function Root() {
  const { language } = useLanguage();
  const safeLanguage = messages[language] ? language : "en";

  return (
    <IntlProvider
      messages={messages[safeLanguage]}
      locale={safeLanguage}
      defaultLocale="en">
      <App />
      <SchemaMarkup />
    </IntlProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <React.StrictMode>
      <LanguageProvider>
        <Root />
      </LanguageProvider>
    </React.StrictMode>
  </BrowserRouter>,
);
