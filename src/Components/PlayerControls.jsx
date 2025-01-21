import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";

import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";

function PlayerControls({
  onTogglePlay,
  isPlaying,
  onStationChange,
  currentStation,
  categories,
  selectedCategoryName,
  onSelectCategory,
}) {
  const [searchInput, setSearchInput] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [visibleSlides, setVisibleSlides] = useState(3);
  const [stepsCategories, setStepsCategories] = useState(3);
  const intl = useIntl();

  useEffect(() => {
    const updateVisibleSlides = () => {
      const screenWidth = window.innerWidth;
      setVisibleSlides(screenWidth < 768 ? 2 : 3);
      setStepsCategories(screenWidth < 768 ? 2 : 3);
    };

    updateVisibleSlides();
    window.addEventListener("resize", updateVisibleSlides);

    return () => window.removeEventListener("resize", updateVisibleSlides); // Cleanup on unmount
  }, []);

  const stations =
    categories.find((category) => category.name === selectedCategoryName)?.stations || [];

  // Update filteredCategories when categories prop changes
  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const searchValue = e.target.value;
    setSearchInput(searchValue);

    // Filter categories based on search input
    if (searchValue.trim() !== "") {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  };

  // Clear search input when a category is selected
  const handleSelectCategory = (categoryName) => {
    onSelectCategory(categoryName);
    setSearchInput("");
    setFilteredCategories(categories);
  };
  const changeStation = (direction) => {
    const currentIndex = stations.findIndex(
      (station) => station.videoId === currentStation.videoId
    );
    const nextIndex =
      direction === "next"
        ? (currentIndex + 1) % stations.length
        : (currentIndex - 1 + stations.length) % stations.length;
    onStationChange(stations[nextIndex]);
  };

  return (
    <div className="player-controls">
      <h3 className="title-cat-stat">{intl.formatMessage({ id: "category" })}</h3>
      <input
        type="text"
        value={searchInput}
        onChange={handleSearchInputChange}
        placeholder={intl.formatMessage({ id: "SearchCategory" })}
      />
      {filteredCategories.length > 0 ? (
        <CarouselProvider
          naturalSlideWidth={100}
          naturalSlideHeight={125}
          totalSlides={filteredCategories.length}
          visibleSlides={visibleSlides}
          infinite={true}
          step={stepsCategories}
          className="carousel-container">
          <ButtonBack className="button-back">{"<"}</ButtonBack>
          <Slider>
            {filteredCategories.map((category, index) => (
              <Slide
                className="my-slide"
                index={index}
                key={index}>
                <button
                  onClick={() => handleSelectCategory(category.name)}
                  className={
                    category.name === selectedCategoryName ? "selected-category" : ""
                  }>
                  {category.name}
                </button>
              </Slide>
            ))}
          </Slider>
          <ButtonNext className="button-next">{">"}</ButtonNext>
        </CarouselProvider>
      ) : (
        <div className="no-results">No results found.</div>
      )}

      {/* Stations Display */}
      <h3 className="title-cat-stat">{intl.formatMessage({ id: "stations" })}</h3>

      {stations.map((station, index) => (
        <button
          key={index}
          onClick={() => onStationChange(station)}
          className={
            station.videoId === currentStation.videoId
              ? "btn-station active-station"
              : "btn-station"
          }>
          <img
            className="station-picture"
            src={station.picture}
            alt={station.name}
            width={24}
          />
          {station.name}
        </button>
      ))}

      {/* Play/Pause Button */}
      <div className="pause-play-buttons">
        <button onClick={() => changeStation("prev")}>
          <img
            className="previous-button"
            src="previous.svg"
            alt="Previous button"
            width={20}
          />
        </button>
        <button onClick={onTogglePlay}>
          <img
            className={isPlaying ? "pause-button" : "play-button"}
            src={isPlaying ? "pause.svg" : "play.svg"}
            alt={isPlaying ? "Pause" : "Play"}
            width={20}
          />
        </button>
        <button onClick={() => changeStation("next")}>
          {" "}
          <img
            className="next-button"
            src="next.svg"
            alt="next-button"
            width={20}
          />{" "}
        </button>
      </div>
    </div>
  );
}

export default PlayerControls;
