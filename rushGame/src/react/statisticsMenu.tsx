// import React, { useEffect, useState } from "react";
// import { waveOrder } from "../arrays";
// import { world } from "../basics";
// import { useMenu } from "./reactContext";
// import {
//   allFoughtBosses,
//   foughtBosses,
//   overallStatistics,
//   statistics,
// } from "../loseScreen";
// import { randomArrayElement } from "../randomArrayElement";
// import { bossCritiques } from "./bossCritique";
// import { player } from "../createPlayer";

// const squareWidth = 450;
// const squareHeight = 250;
// const margin = 25;

// const StatisticsMenu = ({ onBack }) => {
//   const { currentMenu, setMenu } = useMenu();

//   const allFoughtBosses = JSON.parse(
//     localStorage.getItem("allFoughtBosses") || "[]"
//   );

//   // Change this so it doesnt rely on player health
//   const source = player.health <= 0 ? statistics : overallStatistics;
//   const bossArray = player.health <= 0 ? foughtBosses : allFoughtBosses;

//   player.health = player.maxHealth;

//   // bossArray.forEach(element => {

//   // });

//   console.log(bossArray);

//   return (
//     <div>
//       {currentMenu === "statistics" && (
//         <div
//           style={{
//             width: "100vw",
//             height: "100vh",
//             backgroundColor: "black",
//             color: "white",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           {bossArray.map((boss, index) => (
//             <div
//               style={{
//                 width: squareWidth,
//                 height: squareHeight,
//                 backgroundColor: "red",
//                 left:
//                   index % 2 === 0 ? margin : world.width - squareWidth - margin,
//                 top: (squareHeight + margin) * Math.floor(index / 2),
//                 position: "absolute",
//                 fontSize: 40,
//                 color: "black",
//                 // fontStyle:
//               }}
//             >
//               <b style={{ fontSize: 50 }}>{boss.name}:</b>
//               <div>Damage taken: {Math.floor(boss.damageAbsorbed)} </div>
//               <div>Damage dealt: {Math.floor(boss.damageConflicted)} </div>
//               {/* <div>Bullets shot: {boss.bulletsShot} </div> */}
//               <div>Times defeated: {boss.timesDefeated} </div>
//               <i style={{ fontSize: 35 }}>
//                 "
//                 {
//                   bossCritiques[
//                     Math.floor(Math.random() * bossCritiques.length)
//                   ]
//                 }
//                 "{" "}
//               </i>
//             </div>
//           ))}
//           <div
//             style={{
//               // backgroundColor: "red",
//               width: "35%",
//               height: "40%",
//               display: "flex",
//               flexDirection: "column",
//               fontSize: 80,
//               textAlign: "center",
//               color: "grey",
//             }}
//           >
//             <b style={{ fontSize: 140 }}>Player stats</b>
//             <div>Damage taken: {Math.floor(source.damageAbsorbed)}</div>
//             <div>Damage dealt: {Math.floor(source.damageConflicted)}</div>
//             <div>Bullets shot:{source.bulletsShot}</div>
//           </div>

//           <button
//             onClick={() => {
//               setMenu("main");
//             }}
//             style={{
//               marginTop: "60px",
//               padding: "20px 40px",
//               fontSize: "30px",
//               backgroundColor: "gray",
//               color: "white",
//               borderRadius: "10px",
//             }}
//           >
//             Tillbaka
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StatisticsMenu;

import React, { useEffect, useMemo } from "react";
import { waveOrder } from "../arrays";
import { world } from "../basics";
import { useMenu } from "./reactContext";
import {
  allFoughtBosses as allFoughtBossesFromLS, // not used but kept if needed
  foughtBosses,
  overallStatistics,
  statistics,
} from "../loseScreen";
import { randomArrayElement } from "../randomArrayElement";
import { bossCritiques } from "./bossCritique";
import { player } from "../createPlayer";

const squareWidth = 450;
const squareHeight = 250;
const margin = 25;

const StatisticsMenu = ({ onBack }) => {
  const { currentMenu, setMenu } = useMenu();

  const allFoughtBosses = JSON.parse(
    localStorage.getItem("allFoughtBosses") || "[]"
  );

  // Källa för player-statistik (behåll din logik eller ändra senare)
  const source = player.health <= 0 ? statistics : overallStatistics;
  const bossArray = player.health <= 0 ? foughtBosses : allFoughtBosses;

  // Flytta reset av hälsa till useEffect (ingen sidoeffekt i render)
  useEffect(() => {
    player.health = player.maxHealth;
  }, []);

  // Bestäm en kritik per boss EN gång (ingen random vid varje render)
  const critiques = useMemo(
    () => bossArray.map(() => randomArrayElement(bossCritiques)),
    [bossArray]
  );

  return (
    <div>
      {currentMenu === "statistics" && (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            backgroundColor: "black",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
            padding: margin,
          }}
        >
          {/* Scrollbarad behållare för alla boss-kort */}
          <div
            style={{
              width: "90%",
              height: "55%",
              overflow: "auto",
              position: "relative",
              padding: margin,
              boxSizing: "border-box",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* Grid: två kolumner med gap */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(2, ${squareWidth}px)`,
                gap: `${margin}px`,
                justifyContent: "center",
                alignContent: "start",
              }}
            >
              {bossArray.map((boss, index) => (
                <div
                  key={(boss.name || "boss") + index}
                  style={{
                    width: squareWidth,
                    height: squareHeight,
                    backgroundColor: "red",
                    color: "black",
                    padding: 16,
                    boxSizing: "border-box",
                    borderRadius: 8,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}
                  >
                    {boss.name}
                  </div>
                  <div>
                    Damage taken: {Math.floor(boss.damageAbsorbed ?? 0)}
                  </div>
                  <div>
                    Damage dealt: {Math.floor(boss.damageConflicted ?? 0)}
                  </div>
                  <div>Bullets shot: {boss.bulletsShot ?? 0}</div>
                  <div>Times defeated: {boss.timesDefeated ?? 0}</div>
                  <i style={{ fontSize: 16, display: "block", marginTop: 10 }}>
                    "{critiques[index]}"
                  </i>
                </div>
              ))}
            </div>
          </div>

          {/* Player stats */}
          <div
            style={{
              width: "35%",
              height: "20%",
              display: "flex",
              flexDirection: "column",
              fontSize: 20,
              textAlign: "center",
              color: "grey",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 18,
            }}
          >
            <b style={{ fontSize: 28 }}>Player stats</b>
            <div>Damage taken: {Math.floor(source.damageAbsorbed ?? 0)}</div>
            <div>Damage dealt: {Math.floor(source.damageConflicted ?? 0)}</div>
            <div>Bullets shot: {source.bulletsShot ?? 0}</div>
          </div>

          <button
            onClick={() => {
              setMenu("main");
            }}
            style={{
              marginTop: "24px",
              padding: "14px 28px",
              fontSize: "18px",
              backgroundColor: "gray",
              color: "white",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Tillbaka
          </button>
        </div>
      )}
    </div>
  );
};

export default StatisticsMenu;
