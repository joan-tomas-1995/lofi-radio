import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import AudioPlayer from "./Components/AudioPlayer";
import PlayerControls from "./Components/PlayerControls";
import Footer from "./Components/Footer";
import "./index.css";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import BackgroundSelector from "./Components/BackgroundSelector";
import { FaInfoCircle, FaArrowDown, FaArrowUp } from "react-icons/fa";
import { BsFullscreen, BsFullscreenExit } from "react-icons/bs";
import { MdCloseFullscreen } from "react-icons/md";
import { IoMdOpen } from "react-icons/io";
import { Routes, Route, useLocation } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Navbar from "./Components/Navbar";
import Blog from "./pages/Blog";
import SchemaMarkup from "./Components/SchemaMarkup";
import BlogPost from "./pages/BlogPost";
import CategoryPage from "./pages/CategoryPage";

import ModalInfo from "./Components/ModalInfo";
import { useLanguage } from "./LanguageContext";

const LOCALE_MAP = {
  es: "es_ES",
  en: "en_US",
  de: "de_DE",
  fr: "fr_FR",
  it: "it_IT",
  ru: "ru_RU",
  zh: "zh_CN",
};

const BASE_URL = "https://lofimusicradio.com";

function App() {
  const intl = useIntl();
  const { language, setLanguage } = useLanguage();
  const location = useLocation();

  const isContentRoute =
    location.pathname.startsWith("/blog") || location.pathname.startsWith("/stations/");

  if (isContentRoute) {
    return (
      <>
        <Helmet>
          <html lang={language} />
        </Helmet>
        <SchemaMarkup />
        <div className="content-layout">
          <Navbar />
          <Routes>
            <Route
              path="/blog"
              element={<Blog />}
            />
            <Route
              path="/blog/:slug"
              element={<BlogPost />}
            />
            <Route
              path="/stations/:category"
              element={<CategoryPage />}
            />
            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </div>
      </>
    );
  }

  const canonicalUrl = `${BASE_URL}${location.pathname === "/" ? "/" : location.pathname}`;
  const ogLocale = LOCALE_MAP[language] || "en_US";
  const alternateLocales = Object.entries(LOCALE_MAP)
    .filter(([lang]) => lang !== language)
    .map(([, locale]) => locale);

  const safeJSONParse = (rawValue, fallbackValue) => {
    if (!rawValue) return fallbackValue;

    try {
      return JSON.parse(rawValue);
    } catch (error) {
      console.warn("Valor inválido en localStorage, usando fallback", error);
      return fallbackValue;
    }
  };

  const [categories, setCategories] = useState([]);
  const [currentStation, setCurrentStation] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isAppVisible, setIsAppVisible] = useState(true);

  const hideApp = () => setIsAppVisible(false);
  const showApp = () => setIsAppVisible(true);

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullScreen(true))
        .catch((err) => console.error("Error al activar pantalla completa", err));
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullScreen(false))
        .catch((err) => console.error("Error al salir de pantalla completa", err));
    }
  };

  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
  }, []);

  useEffect(() => {
    const loadStations = async () => {
      try {
        const response = await fetch("/stations.json");
        const contentType = response.headers.get("content-type") || "";

        if (!response.ok || !contentType.includes("application/json")) {
          throw new Error(`No se pudo cargar stations.json (${response.status})`);
        }

        const data = await response.json();
        const loadedCategories = Array.isArray(data.categories) ? data.categories : [];

        setCategories(loadedCategories);
        if (loadedCategories.length > 0) {
          setSelectedCategoryName(loadedCategories[0].name);
          if (loadedCategories[0].stations.length > 0) {
            setCurrentStation(loadedCategories[0].stations[0]);
            setIsPlaying(true);
          }
        }
      } catch (error) {
        console.error("Error cargando estaciones", error);
      }
    };

    loadStations();
  }, []);

  useEffect(() => {
    const lastStation = safeJSONParse(localStorage.getItem("lastStation"), null);
    if (lastStation) {
      setCurrentStation(lastStation);
      setIsPlaying(true);
    }
  }, []);

  const handleStationChange = (newStation) => {
    setCurrentStation(newStation);
    setIsPlaying(true);
    localStorage.setItem("lastStation", JSON.stringify(newStation));
  };

  const onTogglePlay = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  if (!currentStation) return <div>{intl.formatMessage({ id: "loadingStations" })}</div>;

  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>{intl.formatMessage({ id: "title" })}</title>
        <meta
          name="description"
          content={intl.formatMessage({ id: "description" })}
        />
        <meta
          name="keywords"
          content={intl.formatMessage({ id: "keywords" })}
        />
        <link
          rel="canonical"
          href={canonicalUrl}
        />
        <meta
          property="og:title"
          content={intl.formatMessage({ id: "ogTitle" })}
        />
        <meta
          property="og:description"
          content={intl.formatMessage({ id: "ogDescription" })}
        />
        <meta
          property="og:url"
          content={canonicalUrl}
        />
        <meta
          property="og:type"
          content="website"
        />
        <meta
          property="og:locale"
          content={ogLocale}
        />
        {alternateLocales.map((loc) => (
          <meta
            key={loc}
            property="og:locale:alternate"
            content={loc}
          />
        ))}
        <meta
          property="og:image"
          content={`${BASE_URL}/lofi-radio-logo-blue.webp`}
        />
        <meta
          property="og:image:width"
          content="512"
        />
        <meta
          property="og:image:height"
          content="512"
        />
        <meta
          name="twitter:card"
          content="summary"
        />
        <meta
          name="twitter:title"
          content={intl.formatMessage({ id: "ogTitle" })}
        />
        <meta
          name="twitter:description"
          content={intl.formatMessage({ id: "ogDescription" })}
        />
        <meta
          name="twitter:image"
          content={`${BASE_URL}/lofi-radio-logo-blue.webp`}
        />
      </Helmet>
      <SchemaMarkup />

      <div
        className={`app ${isCollapsed ? "app2" : ""} app-wrapper ${
          isAppVisible ? "" : "hidden"
        }`}
        data-theme={theme}>
        <header className="top-container">
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
          <h1 className="main-title">{intl.formatMessage({ id: "mainTitle" })}</h1>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="selector-bg-img"
            aria-label={intl.formatMessage({ id: "selectLanguage" })}>
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
            <option value="fr">Français</option>
            <option value="it">Italiano</option>
            <option value="ru">Русский</option>
            <option value="zh">中文</option>
          </select>
          <Footer />
        </header>

        <div className="now-playing">
          {currentStation ? (
            <div className="circle-container">
              <div className="playing-text">
                {intl.formatMessage({ id: "nowPlaying" })} {currentStation.name}
              </div>
              <div className="pulsing-circle"></div>
            </div>
          ) : (
            <div>{intl.formatMessage({ id: "loadingStationInfo" })}</div>
          )}
        </div>

        <div className="top-container-buttons">
          <div className="background-container">
            <BackgroundSelector />
          </div>
          <button
            onClick={toggleTheme}
            aria-label={intl.formatMessage({ id: "changeTheme" })}>
            {theme === "light" ? <MdDarkMode /> : <MdLightMode />}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            aria-label={intl.formatMessage({ id: "information" })}>
            <FaInfoCircle />
          </button>
          <button
            onClick={toggleFullScreen}
            aria-label="Activar o desactivar pantalla completa">
            {isFullScreen ? <BsFullscreenExit /> : <BsFullscreen />}
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={intl.formatMessage({ id: "collapseExpand" })}>
            {isCollapsed ? <FaArrowDown /> : <FaArrowUp />}
          </button>

          <button onClick={hideApp}>
            <MdCloseFullscreen />
          </button>

          <ModalInfo
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}>
            <h2 className="texto-description">
              {intl.formatMessage({ id: "aboutLofiRadio" })}
            </h2>
            <p>{intl.formatMessage({ id: "aboutDescription" })}</p>
            <h3 className="texto-description">
              {intl.formatMessage({ id: "mainFeatures" })}
            </h3>
            <ul>
              <li>{intl.formatMessage({ id: "feature1" })}</li>
              <li>{intl.formatMessage({ id: "feature2" })}</li>
              <li>{intl.formatMessage({ id: "feature3" })}</li>
              <li>{intl.formatMessage({ id: "feature4" })}</li>
              <li>{intl.formatMessage({ id: "feature5" })}</li>
            </ul>
            <p>
              Created by <a href="https://joantomasmiralles.es">Joan Tomás</a>
            </p>
            <p>
              Working at <a href="https://www.wiberrentacar.com">Wiber Rent a Car</a>
            </p>
          </ModalInfo>
        </div>
        <main className={`colappse-body ${isCollapsed ? "collapsed" : ""}`}>
          <PlayerControls
            onTogglePlay={onTogglePlay}
            isPlaying={isPlaying}
            onStationChange={handleStationChange}
            currentStation={currentStation}
            categories={categories}
            selectedCategoryName={selectedCategoryName}
            onSelectCategory={setSelectedCategoryName}
          />
          <AudioPlayer
            station={currentStation}
            onStationChange={handleStationChange}
            isPlaying={isPlaying}
          />
        </main>
      </div>
      {!isAppVisible && (
        <button
          onClick={showApp}
          className="show-app-button">
          <IoMdOpen />
        </button>
      )}
    </>
  );
}

export default App;
