import React, { useState } from "react";
import "./VolumeControl.css";

function VolumeControl({ setVolume }) {
  const [volume, setVolumeState] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(100); // Add state to remember the previous volume

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolumeState(newVolume); // Update the local component's volume
    setVolume(newVolume); // This might be a prop function to update the volume in a parent component
    setIsMuted(newVolume === "0");
    if (newVolume !== "0") {
      setPrevVolume(newVolume); // Remember the last non-zero volume
    }
  };

  const toggleMute = () => {
    setIsMuted((prevIsMuted) => {
      const newVolume = prevIsMuted ? prevVolume : "0"; // If currently muted, restore previous volume; otherwise, mute
      setVolumeState(newVolume);
      setVolume(newVolume); // Assuming setVolume is to communicate the volume change externally
      if (!prevIsMuted) {
        setPrevVolume(volume); // Save the current volume before muting
      }
      return !prevIsMuted;
    });
  };

  return (
    <div className="volume-control">
      <div className="sound-off-on-buttons">
        <button
          className="boton-volumen"
          onClick={toggleMute}>
          <img
            className={isMuted ? "off-volume" : "on-volume"}
            src={isMuted ? "icon-off.svg" : "icon-on.svg"}
            alt={isMuted ? "Muted" : "Unmuted"}
            width={16}
          />
        </button>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolumeChange}
        className="volume-slider"
      />
      <div className="volume-label">{volume}</div>
    </div>
  );
}

export default VolumeControl;
