import { bossesKilled } from "./arrays";
import { bulletsShot } from "./createBullet";
import { damageDealt, damageTaken } from "./dealDamage";
// import { bulletsShot } from "./main";

export const loseScreen = () => {
  const selectionDiv = document.getElementById("loseScreen");

  selectionDiv.style.visibility = "visible";

  const stats = [
    { id: "bosses-killed", value: bossesKilled },
    { id: "damage-dealt", value: Math.round(damageDealt) },
    { id: "damage-taken", value: Math.round(damageTaken) },
    { id: "bullets-shot", value: bulletsShot },
    { id: "mistakes-made", value: Math.round(Math.random() * 150 + 6) },
  ];

  // Använd forEach för att uppdatera varje stat
  stats.forEach((stat) => {
    document.getElementById(stat.id).textContent =
      stat.id.replace("-", " ").replace(/\b\w/g, (char) => char.toUpperCase()) +
      ": " +
      stat.value;
  });
};
