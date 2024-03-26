import React, { useState, useEffect } from "react";

function BackgroundSelector() {
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [selectedBackgroundName, setSelectedBackgroundName] = useState(
    localStorage.getItem("selectedBackgroundName") || "None"
  );

  useEffect(() => {
    // Fetch the JSON file from the public directory
    fetch("/backgroundImages.json")
      .then((response) => response.json())
      .then((data) => {
        setBackgroundImages(data);
      });
  }, []);

  const handleBackgroundChange = (event) => {
    const selectedName = event.target.value;
    setSelectedBackgroundName(selectedName);

    localStorage.setItem("selectedBackgroundName", selectedName);

    if (selectedName === "None") {
      document.body.style.backgroundImage = "none";
      // Set opacity to 0.9 for .app::before
      document.documentElement.style.setProperty("--app-background-opacity", "0.8");
    } else {
      const imageUrl = backgroundImages.find((image) => image.name === selectedName)?.url;
      document.body.style.backgroundImage = `url(${imageUrl})`;
      // Reset the opacity back to default or another value if needed
      document.documentElement.style.setProperty("--app-background-opacity", "0.3");
    }
  };

  useEffect(() => {
    // Apply the stored background if it exists
    const storedBackgroundName = localStorage.getItem("selectedBackgroundName");
    if (storedBackgroundName && storedBackgroundName !== "None") {
      const imageUrl = backgroundImages.find(
        (image) => image.name === storedBackgroundName
      )?.url;
      document.body.style.backgroundImage = `url(${imageUrl})`;
      document.documentElement.style.setProperty("--app-background-opacity", "0.3");
    } else {
      document.body.style.backgroundImage = "none";
      document.documentElement.style.setProperty("--app-background-opacity", "0.8");
    }
  }, [backgroundImages]); // This effect depends on the backgroundImages being loaded

  return (
    <div>
      <select
        className="selector-bg-img"
        onChange={handleBackgroundChange}
        value={selectedBackgroundName}>
        <option value="None">None</option> {/* Option to select no background */}
        {backgroundImages.map((image) => (
          <option
            key={image.name}
            value={image.name}>
            {image.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default BackgroundSelector;
