import { universalVolume } from "./sounds.js";

const shouldPlayMusic = true;

const musicAudio = new Audio("public/sounds/gameMusic.mp3");
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

export const fadeOutMusic = (duration) => {
  const steps = 10; // Antal steg för fade-out
  const interval = duration / steps; // Tid mellan varje steg
  const stepSize = 1.0 / steps; // Stegstorlek för att minska volymen gradvis
  let volume = musicAudio.volume;

  const fadeInterval = setInterval(() => {
    if (volume > 0) {
      volume -= stepSize;
      musicAudio.volume = volume >= 0 ? volume : 0; // Säkerställ att volymen inte blir negativ
    } else {
      clearInterval(fadeInterval);
      musicAudio.pause();
      musicAudio.currentTime = 0;
    }
  }, interval);
};

export const stopMusic = () => {
  musicAudio.pause();
  musicAudio.currentTime = 0;
};

export const startMusic = () => {
  musicAudio.play();
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
  fileName: "public/sounds/gameMusic.mp3",
  volume: 0.7,
};

const funnyMusic = {
  fileName: "public/sounds/alternativeMusic.mp3",
  volume: 1,
};

const battleMusic = {
  fileName: "public/sounds/battle_music.mp3",
  volume: 1,
};

// export const restoreMusicVolume = () => {
//   normalMusic.volume = 0.7;
//   funnyMusic.volume = 1;
//   battleMusic.volume = 1;
//   // changeVolume(musicList.includes(musicAudio).volume);
//   changeMusic(normalMusic);
//   changeVolume(normalMusic.volume);

//   // musicAudio = new Audio("public/sounds/gameMusic.mp3");
// };

let originalVolume = normalMusic.volume;

export const restoreMusicVolume = () => {
  normalMusic.volume = 0.7;
  funnyMusic.volume = 1;
  battleMusic.volume = 1;

  // Återställ volymen för den aktuella låten
  changeVolume(originalVolume);
};

export const musicList = [normalMusic, funnyMusic, battleMusic];
