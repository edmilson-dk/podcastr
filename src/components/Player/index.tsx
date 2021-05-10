import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import styles from "./styles.module.scss";
import { usePlayer } from "../../contexts/PlayerContext";
import { formatAudioDurationToString } from "../../utils/formatAudioDurationToString";

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [ progress, setProgress ] = useState(0);

  const { 
    episodeList, 
    currentEpisodeIndex, 
    isPlaying, 
    togglePlay, 
    setPlayingState,
    playNext, 
    playPrevious,
    hasNext,
    hasPrevious,
    isLooping,
    toggleLoop,
    toggleShuffle
  } = usePlayer();

  const episode = episodeList[currentEpisodeIndex];

  useEffect(() => {
    if (!audioRef.current) return;

    isPlaying
      ? audioRef.current.play()
      : audioRef.current.pause();
  }, [isPlaying]);

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener("timeupdate", () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  return (
    <aside className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora"/>
        <strong>Tocando agora</strong>
      </header>

      {
        episode ? (
          <div className={styles.currentEpisode}>
            <Image 
              width={592}
              height={592}
              objectFit="cover"
              src={episode.thumbnail}
            />
            <strong>{episode.title}</strong>
            <span>{episode.members}</span>
          </div>
        ) : (
          <div className={styles.emptyPlayer}>
            <strong>Selecione um podcast para ouvir</strong>
          </div>
        )
      }

      <footer className={!episode && styles.empty}>
        <div className={styles.progress}>
          <span>{ formatAudioDurationToString(progress) }</span>
          <div className={styles.slider}>
            {
              episode ? (
                <Slider
                  trackStyle={{ backgroundColor: "#04d361"}}
                  handleStyle={{ borderColor: "#04d361", borderWidth: 4 }}
                  railStyle={{ backgroundColor: "#9f75ff"}}
                  max={episode.duration}
                  value={progress}
                />
              ) : (
                <div className={styles.emptySlider}></div>
              )
            }
          </div>
          <span>{ formatAudioDurationToString(episode?.duration ?? 0) }</span>
        </div>

        {
          episode && (
            <audio 
              src={episode.url}
              loop={isLooping}
              autoPlay
              ref={audioRef}
              onPlay={() => setPlayingState(true)}
              onPause={() => setPlayingState(false)}
              onLoadedMetadata={setupProgressListener}
            />
          )
        }
        <div className={styles.buttons}>
          <button type="button" disabled={!episode || episodeList.length === 2} onClick={toggleShuffle}>
            <img src="/shuffle.svg" alt="Embaralhar"/>
          </button>
          <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button 
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {
              isPlaying 
                ? <img src="/pause.svg" alt="Tocar" />
                : <img src="/play.svg" alt="Tocar" />
            }
          </button>
          <button type="button" disabled={!episode || !hasNext}>
            <img src="/play-next.svg" onClick={playNext} alt="Tocar próximo"/>
          </button>
          <button type="button" disabled={!episode} onClick={toggleLoop}>
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </aside>
  );
}