import React from "react";
import { BossArray, waveOrder } from "../arrays";
import { changeIsPaused, world } from "../basics";
import { generateRewards } from "../generateRewards";
import { startGame } from "../startGame";
import { useMenu } from "./reactContext";

export let practiceBoss = false;

const PracticeMenu = ({ onBack }) => {
  const { currentMenu, setMenu } = useMenu();

  const isBossFought = (waveBossName: string) => {
    // Exempel: gruppnamn som matchar flera riktiga bossar
    const aliasMap = {
      "The Twin Bros": ["[Twin] Johnny", "[Twin] Ian"],
      "Squa's gang": [
        "[RECT] Damager",
        "[RECT] Debuffer",
        "[RECT] Healer",
        "[RECT] Support",
      ],
    };

    const realNames = aliasMap[waveBossName] || [waveBossName];

    const allFoughtBosses = JSON.parse(
      localStorage.getItem("allFoughtBosses") || "[]"
    );

    return allFoughtBosses.some((foughtBoss) =>
      realNames.includes(foughtBoss.name)
    );
    // return allFoughtBosses;
  };

  return (
    <div>
      {currentMenu === "practice" && (
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
          }}
        >
          <h1 style={{ fontSize: "60px", marginBottom: "40px" }}>
            Practice Mode
          </h1>

          {waveOrder.map((wave, rowIndex) => (
            <div
              key={rowIndex}
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              {wave
                .filter((bossArray: BossArray) => isBossFought(bossArray[0]))
                .map((bossArray: BossArray, colIndex) => (
                  <button
                    key={colIndex}
                    onClick={() => {
                      practiceBoss = true;
                      setMenu("none");

                      const canvas = document.getElementById(
                        "myCanvas"
                      ) as HTMLCanvasElement;
                      const ctx = canvas.getContext("2d");

                      const parentIndex = waveOrder.findIndex((sub) =>
                        sub.includes(bossArray)
                      );

                      console.log(bossArray[2]);
                      startGame(ctx, bossArray[2]);
                      changeIsPaused(true);

                      if (parentIndex > 0) {
                        generateRewards(ctx, parentIndex - 1, bossArray[2]);
                      } else {
                        changeIsPaused(false);
                      }
                      // }, 10 * i);
                      // console.log(i);
                      // }

                      // }, 1500);

                      // bossArray[2](ctx);
                    }}
                    style={{
                      padding: "40px 40px",
                      fontSize: "30px",
                      backgroundColor: "darkgreen",
                      width: world.width / wave.length - wave.length * 20,
                      height:
                        world.height / waveOrder.length - waveOrder.length * 20,
                      margin: 20,
                      color: "white",
                      borderRadius: "10px",
                    }}
                  >
                    {bossArray[0]}
                  </button>
                ))}
            </div>
          ))}

          <button
            onClick={() => {
              setMenu("main");
            }}
            style={{
              marginTop: "60px",
              padding: "20px 40px",
              fontSize: "30px",
              backgroundColor: "gray",
              color: "white",
              borderRadius: "10px",
            }}
          >
            Tillbaka
          </button>
        </div>
      )}
    </div>
  );
};

export default PracticeMenu;
