import { waveOrder } from "./arrays";
import { bulletsShot } from "./createBullet";
import { player } from "./createPlayer";
import { changeIsPaused } from "./basics";
import { GameOverMenu } from "./react/gameOverMenu";
import { useMenu } from "./react/reactContext";
// import { bulletsShot } from "./main";

export const statistics = {
  bossesKilled: 0,
  damageConflicted: 0,
  damageAbsorbed: 0,
  bulletsShot: 0,
  mistakesMade: 0,
};

export const overallStatistics = structuredClone(statistics);

const fakeBoss = {
  name: "fakeBossNAmesj",
  damageConflicted: 593,
  damageAbsorbed: 325,
  bulletsShot: 405,
};

export const foughtBosses = [];
// export const allFoughtBosses = [];

export let stats = [];

export const loseScreen = () => {
  // const selectionDiv = document.getElementById("loseScreen");

  // selectionDiv.style.visibility = "visible";

  console.log("died");

  statistics.damageConflicted = Math.round(player.damageConflicted);
  statistics.damageAbsorbed = Math.round(player.damageAbsorbed);
  statistics.mistakesMade = Math.round(Math.random() * 15 + 3);

  const allFoughtBosses = JSON.parse(
    localStorage.getItem("allFoughtBosses") || "[]"
  );

  foughtBosses.forEach((boss) => {
    const existing = allFoughtBosses.find((b) => b.name === boss.name);
    if (!existing) {
      allFoughtBosses.push(boss);
    } else {
      existing.damageConflicted += boss.damageConflicted || 0;
      existing.damageAbsorbed += boss.damageAbsorbed || 0;
      existing.bulletsShot += boss.bulletsShot || 0;
    }
  });

  stats = [
    // Göra per spel, och inte permament
    { id: "bosses-killed", value: statistics.bossesKilled },
    { id: "damage-dealt", value: statistics.damageConflicted },
    { id: "damage-taken", value: statistics.damageAbsorbed },
    { id: "bullets-shot", value: statistics.bulletsShot },
    { id: "mistakes-made", value: statistics.mistakesMade },
  ];

  for (const key in statistics) {
    if (
      overallStatistics.hasOwnProperty(key) &&
      typeof statistics[key] === "number"
    ) {
      overallStatistics[key] += statistics[key];

      statistics[key] = 0;
    } else {
      overallStatistics[key] = statistics[key];

      statistics[key] = 0;
    }
  }

  console.log(statistics, overallStatistics);

  localStorage.setItem("allFoughtBosses", JSON.stringify(allFoughtBosses));

  setTimeout(() => {
    if (typeof window.changeMenu === "function") {
      window.changeMenu("statistics");
    } else {
      console.warn("window.changeMenu är inte definierad!");
    }
  }, 1000);

  // Använd forEach för att uppdatera varje stat
  // stats.forEach((stat) => {
  //   document.getElementById(stat.id).textContent =
  //     stat.id.replace("-", " ").replace(/\b\w/g, (char) => char.toUpperCase()) +
  //     ": " +
  //     stat.value;
  // });

  // document.getElementById("toMainMenu").addEventListener("click", () => {
  //   // const { currentMenu, setMenu } = useMenu();
  //   // setMenu("main");
  //   console.log("clicking");

  //   // document.getElementById("mainMenu").style.visibility = "visible";
  //   // document.getElementById("practiceMenu").style.visibility = "hidden";
  //   // document.getElementById("statisticsMenu").style.visibility = "hidden"; // om du har en sån
  // });

  // GameOverMenu(statistics);
};
