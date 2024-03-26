import React, { useState, useEffect } from "react";
import AudioPlayer from "./Components/AudioPlayer";
import PlayerControls from "./Components/PlayerControls";
import Footer from "./Components/Footer";
import "./index.css";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import BackgroundSelector from "./Components/BackgroundSelector";
import { FaInfoCircle } from "react-icons/fa";
import ModalInfo from "./Components/ModalInfo";

function App() {
  const [categories, setCategories] = useState([]);
  const [currentStation, setCurrentStation] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [background, setBackground] = useState(
    localStorage.getItem("background") || "defaultBackground"
  );

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    localStorage.setItem("background", background);
  }, [background]);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light"; // Default to light
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
      setIsPlaying(true); // Or set this based on another stored preference
    }
  }, []);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    // Set your state or context with these favorites
    setFavorites(savedFavorites);
  }, []);

  const handleStationChange = (newStation) => {
    setCurrentStation(newStation);
    setIsPlaying(true);
    // Store the new station in localStorage
    localStorage.setItem("lastStation", JSON.stringify(newStation));
  };

  const onTogglePlay = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  const toggleFavorite = (station) => {
    let updatedFavorites = JSON.parse(localStorage.getItem("favorites")) || {};
    const category = station.category; // Assuming station objects now have a 'category' property

    if (!updatedFavorites[category]) updatedFavorites[category] = [];

    if (updatedFavorites[category].some((fav) => fav.videoId === station.videoId)) {
      updatedFavorites[category] = updatedFavorites[category].filter(
        (fav) => fav.videoId !== station.videoId
      );
    } else {
      updatedFavorites[category].push(station);
    }

    if (updatedFavorites[category].length === 0) {
      delete updatedFavorites[category]; // Remove the category if it's empty
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  if (!currentStation) return <div>Loading stations...</div>; // Or any other loading state representation

  return (
    <div
      className="app"
      data-theme={theme}>
      <div className="top-container">
        {" "}
        <h2 className="main-title">Select background:</h2>
        <BackgroundSelector />
        <button onClick={toggleTheme}>
          {theme === "light" ? <MdDarkMode /> : <MdLightMode />}
        </button>
        <button onClick={() => setIsModalOpen(true)}>
          {" "}
          <FaInfoCircle />
        </button>
        <ModalInfo
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}>
          <p>
            This web-based radio player combines seamless music streaming with
            customizable features, offering a unique and immersive listening experience.
            <br />
            <br />
            <b> Diverse Radio Streaming: </b> Instantly access a wide range of radio
            stations across various genres. Switch effortlessly to suit your mood or
            discover new music favorites.
            <br />
            <br />
            <b>Customizable Backgrounds:</b> Enhance your listening by personalizing the
            app’s background with your choice of images or animated GIFs.
            <br />
            <br />
            <b>Theme Flexibility:</b> Switch between light and dark themes to match your
            visual preference or ambient lighting.
            <br />
            <br />
            <b>User-Friendly Controls:</b> Enjoy simple, intuitive controls to play,
            pause, and navigate through stations.
            <br />
            <br />
            <b>No ads:</b> No ads in all the radio stations, listen to all the music
            without interruptions.
          </p>
        </ModalInfo>
      </div>

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
      <Footer />
    </div>
  );
}

export default App;
