import React, { useState, useEffect, useRef } from "react";
import { useIntl } from "react-intl";

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
  const scrollRef = useRef(null);
  const intl = useIntl();

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
        category.name.toLowerCase().includes(searchValue.toLowerCase()),
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
      (station) => station.videoId === currentStation.videoId,
    );
    const nextIndex =
      direction === "next"
        ? (currentIndex + 1) % stations.length
        : (currentIndex - 1 + stations.length) % stations.length;
    onStationChange(stations[nextIndex]);
  };

  // Scroll the category container
  const scrollCategories = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.offsetWidth * 0.6;
    el.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
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
        <div className="carousel-native">
          <button
            className="button-back"
            onClick={() => scrollCategories("prev")}
            aria-label="Previous categories">
            {"<"}
          </button>
          <div
            className="carousel-scroll"
            ref={scrollRef}>
            {filteredCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleSelectCategory(category.name)}
                className={
                  category.name === selectedCategoryName
                    ? "carousel-item selected-category"
                    : "carousel-item"
                }>
                {category.name}
              </button>
            ))}
          </div>
          <button
            className="button-next"
            onClick={() => scrollCategories("next")}
            aria-label="Next categories">
            {">"}
          </button>
        </div>
      ) : (
        <div className="no-results">No results found.</div>
      )}

      {/* Stations Display */}
      <h3 className="title-cat-stat">{intl.formatMessage({ id: "stations" })}</h3>

      <div className="stations-container">
        {stations.map((station, index) =>
          index % 2 === 0 ? (
            <div
              className="station-row"
              key={index}>
              <button
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
                  height={24}
                  loading="lazy"
                />
                {station.name}
              </button>

              {/* Check if there is a next station to form the pair */}
              {stations[index + 1] && (
                <button
                  onClick={() => onStationChange(stations[index + 1])}
                  className={
                    stations[index + 1].videoId === currentStation.videoId
                      ? "btn-station active-station"
                      : "btn-station"
                  }>
                  <img
                    className="station-picture"
                    src={stations[index + 1].picture}
                    alt={stations[index + 1].name}
                    width={24}
                    height={24}
                    loading="lazy"
                  />
                  {stations[index + 1].name}
                </button>
              )}
            </div>
          ) : null,
        )}
      </div>

      {/* Play/Pause Button */}
      <div className="pause-play-buttons">
        <button onClick={() => changeStation("prev")}>
          <img
            className="previous-button"
            src="previous.svg"
            alt="Previous button"
            width={20}
            height={20}
          />
        </button>
        <button onClick={onTogglePlay}>
          <img
            className={isPlaying ? "pause-button" : "play-button"}
            src={isPlaying ? "pause.svg" : "play.svg"}
            alt={isPlaying ? "Pause" : "Play"}
            width={20}
            height={20}
          />
        </button>
        <button onClick={() => changeStation("next")}>
          {" "}
          <img
            className="next-button"
            src="next.svg"
            alt="Next button"
            width={20}
            height={20}
          />{" "}
        </button>
      </div>
    </div>
  );
}

export default PlayerControls;
