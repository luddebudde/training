import { waveOrder } from "./arrays";
import { bulletsShot } from "./createBullet";
import { player } from "./createPlayer";
import { changeIsPaused } from "./main";
// import { bulletsShot } from "./main";

export const statistics = {
  bossesKilled: 0,
  damageDealt: 0,
  damageTaken: 0,
  bulletsShot: 0,
  mistakesMade: 0,
};

const fakeBoss = {
  name: "fakeBossNAmesj",
  damageConflicted: 593,
  absorbedDamage: 325,
  bulletsShot: 405,
};

export const meetBossIndex = [fakeBoss, fakeBoss, fakeBoss];

export const loseScreen = () => {
  const selectionDiv = document.getElementById("loseScreen");

  selectionDiv.style.visibility = "visible";

  statistics.damageDealt = Math.round(player.damageConflicted);
  statistics.damageTaken = Math.round(player.absorbedDamage);
  statistics.mistakesMade = Math.round(Math.random() * 15 + 3);

  const stats = [
    // Göra per spel, och inte permament
    { id: "bosses-killed", value: statistics.bossesKilled },
    { id: "damage-dealt", value: statistics.damageDealt },
    { id: "damage-taken", value: statistics.damageTaken },
    { id: "bullets-shot", value: statistics.bulletsShot },
    { id: "mistakes-made", value: statistics.mistakesMade },
  ];

  // console.log(bossKillIndex);
  meetBossIndex.forEach((boss) => {
    console.log(
      boss.name,
      "dealt:",
      boss.damageConflicted,
      "taken:",
      boss.absorbedDamage,
      "shot:",
      boss.bulletsShot
    );
  });

  // Använd forEach för att uppdatera varje stat
  stats.forEach((stat) => {
    document.getElementById(stat.id).textContent =
      stat.id.replace("-", " ").replace(/\b\w/g, (char) => char.toUpperCase()) +
      ": " +
      stat.value;
  });
};
