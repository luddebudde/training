export const universalVolume = 1;

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

export const playScreecher = () => {
  const audio = new Audio("public/sounds/screecher.mp3");
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

export const playWilhelm = () => {
  const audio = new Audio("public/sounds/wilhelm.mp3");
  audio.volume = 2 * universalVolume;
  audio.play();
};

export const playDeathSound = () => {
  const audio = new Audio("public/sounds/death_sound.mp3");
  audio.volume = 2 * universalVolume;
  audio.play();
};

export const playClick = () => {
  const audio = new Audio("public/sounds/click.mp3");
  audio.volume = 1 * universalVolume;
  audio.play();
};

export const playBangbang = () => {
  const audio = new Audio("public/sounds/bangbang.mkv");
  audio.volume = 2 * universalVolume;
  audio.play();
};

let chargingAudio;

export const playChargingShot = () => {
  // Kontrollera om ljudet redan spelas
  if (!chargingAudio || chargingAudio.paused || chargingAudio.ended) {
    if (chargingAudio && !chargingAudio.ended) {
      chargingAudio.pause(); // Pausa ljudet om det redan spelas
    }
    chargingAudio = new Audio("public/sounds/charging.mp3");
    chargingAudio.volume = 0.75 * universalVolume;
    chargingAudio.play();
  }
};

export const playFullyChargedShot = () => {
  const audio = new Audio("public/sounds/fullyCharged.mp3");
  audio.volume = 0.75 * universalVolume;
  audio.play();
};

export const playWeakChargedShot = () => {
  const audio = new Audio("public/sounds/weakChargedShot.mp3");
  audio.volume = 0.2 * universalVolume;
  audio.play();
};

export const playStrongChargedShot = () => {
  const audio = new Audio("public/sounds/strongChargedShot.mp3");
  audio.volume = 0.75 * universalVolume;
  audio.play();
};

export const playMassiveChargedShot = () => {
  const audio = new Audio("public/sounds/masiveChargedShot.mp3");
  audio.volume = 1 * universalVolume;
  audio.play();
};

export const playDemonScreech = () => {
  const audio = new Audio("public/sounds/demonScreech.mp3");
  audio.volume = 1.5 * universalVolume;
  audio.play();
};

export const playDemonFireball = () => {
  const audio = new Audio("public/sounds/demonFireball.mp3");
  audio.volume = 1 * universalVolume;
  audio.play();
};

export const playSmallDemonFireballs = () => {
  const audio = new Audio("public/sounds/masiveChargedShot.mp3");
  audio.volume = 1 * universalVolume;
  audio.play();
};

export const playDemonTeleport = () => {
  const audio = new Audio("public/sounds/demonTeleport.mp3");
  audio.volume = 1 * universalVolume;
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
