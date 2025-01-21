import React, { useState, useEffect } from "react";
import VolumeControl from "./VolumeControl";

function AudioPlayer({ station, isPlaying, onPlayStateChange }) {
  const [player, setPlayer] = useState(null);
  const [apiLoaded, setApiLoaded] = useState(false);

  useEffect(() => {
    if (!apiLoaded) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => setApiLoaded(true);

      window.onYouTubeIframeAPIReady = () => {
        const newPlayer = new window.YT.Player("player", {
          height: "0",
          width: "0",
          videoId: station.videoId,
          playerVars: {
            autoplay: isPlaying ? 1 : 0,
          },
          events: {
            onReady: (event) => setPlayer(event.target),
          },
        });
      };
    }
  }, [apiLoaded, station, isPlaying]);

  useEffect(() => {
    if (player) {
      if (isPlaying && player.getPlayerState() !== window.YT.PlayerState.PLAYING) {
        player.playVideo();
      } else if (!isPlaying && player.getPlayerState() !== window.YT.PlayerState.PAUSED) {
        player.pauseVideo();
      }
    }
  }, [player, isPlaying]);

  useEffect(() => {
    if (player) {
      player.loadVideoById(station.videoId);
    }
  }, [player, station]);

  const setVolume = (volume) => {
    if (player) {
      player.setVolume(volume);
    }
  };

  return (
    <div className="audio-player">
      <VolumeControl setVolume={setVolume} />
      <div id="player"></div>
    </div>
  );
}

export default AudioPlayer;
