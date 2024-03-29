export const universalVolume = 0;

export const playLevelUp = () => {
  const audio = new Audio("public/sounds/levelUp.mp3");
  audio.volume = 1 * universalVolume;
  audio.play();
};
export const playLevelUpSpecial = () => {
  const audio = new Audio("public/sounds/levelUpSpecial.mp3");
  audio.volume = 1 * universalVolume;
  audio.play();
};

export const playShotgun = () => {
  const audio = new Audio("public/sounds/shotgunFire.mp3");
  audio.volume = 0.3 * universalVolume;
  audio.play();
};

export const playMinigun = () => {
  const audio = new Audio("public/sounds/minigunFire.mp3");
  audio.volume = 0.5 * universalVolume;
  audio.play();
};

export const playMinigunOverheat = () => {
  const audio = new Audio("public/sounds/minigunOverheat.mp3");
  audio.volume = 1.5 * universalVolume;
  audio.play();
};

export const playWiper = () => {
  const audio = new Audio("public/sounds/wiperEffect.mp3");
  audio.volume = 2 * universalVolume;
  audio.play();
};

export const playAirstrikeCall = () => {
  const audio = new Audio("public/sounds/airstrike_call.mp3");
  audio.volume = 2 * universalVolume;
  audio.play();
};
export const playAirstrikeExplosion = () => {
  const audio = new Audio("public/sounds/airstrike_explosion.mp3");
  audio.volume = 1 * universalVolume;
  audio.play();
};

export const playSlice = () => {
  const audio = new Audio("public/sounds/slice.mp3");
  audio.volume = 1 * universalVolume;
  audio.play();
};

export const playBossDefeat = () => {
  const audio = new Audio("public/sounds/small_boss_defeat.mp3");
  audio.volume = 0.5 * universalVolume;
  audio.play();
};

let isHurtSoundPlaying = false;

export const playHurt = () => {
  // Kontrollera om ljudet redan spelas
  if (!isHurtSoundPlaying) {
    isHurtSoundPlaying = true;

    const audio = new Audio("public/sounds/hurt.mp3");

    audio.volume = 2 * universalVolume;

    // Lyssna på 'ended'-händelse för att återställa flaggan när ljudet är klart
    audio.addEventListener("ended", () => {
      isHurtSoundPlaying = false;
    });

    // audio.play();
  }
};
