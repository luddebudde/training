const universalVolume = 0.5

export const playLevelUp = () => {
    const audio = new Audio("public/sounds/wilhelm.mp3");
    audio.volume = 1 * universalVolume;
    audio.play();
  };