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

import ModalInfo from "./Components/ModalInfo";
import { useLanguage } from "./LanguageContext";

function App() {
  const intl = useIntl();
  const { language, setLanguage } = useLanguage();

  const [categories, setCategories] = useState([]);
  const [currentStation, setCurrentStation] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState([]);
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

  const [background, setBackground] = useState(
    localStorage.getItem("background") || "defaultBackground"
  );
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
    localStorage.setItem("background", background);
  }, [background]);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
  }, []);

  useEffect(() => {
    fetch("/stations.json")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.categories);
        if (data.categories.length > 0) {
          setSelectedCategoryName(data.categories[0].name);
          if (data.categories[0].stations.length > 0) {
            setCurrentStation(data.categories[0].stations[0]);
            setIsPlaying(true);
          }
        }
      });
  }, []);

  useEffect(() => {
    const lastStation = JSON.parse(localStorage.getItem("lastStation"));
    if (lastStation) {
      setCurrentStation(lastStation);
      setIsPlaying(true);
    }
  }, []);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const handleStationChange = (newStation) => {
    setCurrentStation(newStation);
    setIsPlaying(true);
    localStorage.setItem("lastStation", JSON.stringify(newStation));
  };

  const onTogglePlay = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  const toggleFavorite = (station) => {
    let updatedFavorites = JSON.parse(localStorage.getItem("favorites")) || {};
    const category = station.category;

    if (!updatedFavorites[category]) updatedFavorites[category] = [];

    if (updatedFavorites[category].some((fav) => fav.videoId === station.videoId)) {
      updatedFavorites[category] = updatedFavorites[category].filter(
        (fav) => fav.videoId !== station.videoId
      );
    } else {
      updatedFavorites[category].push(station);
    }

    if (updatedFavorites[category].length === 0) {
      delete updatedFavorites[category];
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
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
          href="https://lofimusicradio.com/"
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
          content="https://lofimusicradio.com/"
        />
        <meta
          property="og:type"
          content="website"
        />
        <meta
          property="og:locale"
          content={language}
        />
        <meta
          property="og:locale:alternate"
          content={language === "es" ? "en" : "es"}
        />
      </Helmet>

      <div
        className={`app ${isCollapsed ? "app2" : ""} app-wrapper ${
          isAppVisible ? "" : "hidden"
        }`}
        data-theme={theme}>
        <header className="top-container">
          <h1 className="main-title">{intl.formatMessage({ id: "mainTitle" })}</h1>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="selector-bg-img">
            <option value="es">Español</option>
            <option value="en">English</option>
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
