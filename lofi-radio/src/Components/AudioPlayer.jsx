import React, { useState, useEffect, useRef } from "react";
import VolumeControl from "./VolumeControl";

function AudioPlayer({ station, isPlaying }) {
  const [player, setPlayer] = useState(null);
  const [ytReady, setYtReady] = useState(false);
  const playerRef = useRef(null);

  // Load YouTube IFrame API script on mount
  useEffect(() => {
    if (window.YT?.Player) {
      setYtReady(true);
      return;
    }

    window.onYouTubeIframeAPIReady = () => setYtReady(true);

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Create player when YT API is ready (auto-play on load)
  useEffect(() => {
    if (!ytReady || playerRef.current || !station) return;

    playerRef.current = new window.YT.Player("player", {
      height: "0",
      width: "0",
      videoId: station.videoId,
      playerVars: { autoplay: 1 },
      events: {
        onReady: (event) => setPlayer(event.target),
      },
    });
  }, [ytReady, station.videoId]);

  // Handle play/pause
  useEffect(() => {
    if (!player) return;
    if (isPlaying) {
      if (player.getPlayerState() !== window.YT.PlayerState.PLAYING) {
        player.playVideo();
      }
    } else {
      if (player.getPlayerState() === window.YT.PlayerState.PLAYING) {
        player.pauseVideo();
      }
    }
  }, [player, isPlaying]);

  // Handle station change
  useEffect(() => {
    if (player) {
      player.loadVideoById(station.videoId);
    }
  }, [player, station.videoId]);

  const setVolume = (volume) => {
    if (player) player.setVolume(volume);
  };

  return (
    <div className="audio-player">
      <VolumeControl setVolume={setVolume} />
      <div id="player"></div>
    </div>
  );
}

export default AudioPlayer;
