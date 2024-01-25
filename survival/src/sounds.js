export const universalVolume = 0.5;

export const playLevelUp = () => {
  const audio = new Audio("/public/sounds/levelUp.mp3");
  audio.volume = 1 * universalVolume;
  audio.play();
};
export const playLevelUpSpecial = () => {
  const audio = new Audio("/public/sounds/levelUpSpecial.mp3");
  audio.volume = 1 * universalVolume;
  audio.play();
};

export const playShotgun = () => {
  const audio = new Audio("/public/sounds/shotgunFire.mp3");
  audio.volume = 0.3 * universalVolume;
  audio.play();
};

export const playMinigun = () => {
  const audio = new Audio("/public/sounds/minigunFire.mp3");
  audio.volume = 1 * universalVolume;
  audio.play();
};

export const playMinigunOverheat = () => {
  const audio = new Audio("/public/sounds/minigunOverheat.mp3");
  audio.volume = 1 * universalVolume;
  audio.play();
};
