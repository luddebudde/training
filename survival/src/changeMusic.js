import { universalVolume } from "./sounds.js";

const shouldPlayMusic = true;

const musicAudio = new Audio("/public/sounds/gameMusic.mp3");
musicAudio.loop = true;
musicAudio.volume = 0.7 * universalVolume;
export const playMusic = () => {
  if (!shouldPlayMusic) {
    return;
  }
  const response = musicAudio.play();
  response
    .then((e) => {
      document.body.removeEventListener("mousemove", playMusic);
    })
    .catch((e) => {});
};

export const stopMusic = () => {
  musicAudio.pause();
  musicAudio.currentTime = 0;
};

export const changeMusic = (newMusicSource) => {
  stopMusic();
  musicAudio.src = newMusicSource;
  playMusic();
};

export const changeVolume = (amount) => {
  musicAudio.volume = amount * universalVolume;
};

const normalMusic = {
  fileName: "/public/sounds/gameMusic.mp3",
  volume: 0.7,
};

const funnyMusic = {
  fileName: "/public/sounds/alternativeMusic.mp3",
  volume: 1,
};

const battleMusic = {
  fileName: "/public/sounds/battle_music.mp3",
  volume: 1,
};

export const musicList = [normalMusic, funnyMusic, battleMusic];
