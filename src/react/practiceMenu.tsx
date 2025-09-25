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
          <h1 style={{ fontSize: "4vw", marginBottom: "2vh" }}>
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
                      padding: "2vw 2vh",
                      fontSize: "1.2vw",
                      backgroundColor: "darkgreen",
                      width: world.width / wave.length - wave.length * 20,
                      height:
                        world.height / waveOrder.length - waveOrder.length * 20,
                      margin: "1.5vh",
                      color: "white",
                      borderRadius: "0.5vw",
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
              marginTop: "3vh",
              padding: "1vw 2vh",
              fontSize: "2vh",
              backgroundColor: "gray",
              color: "white",
              borderRadius: "1vh",
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
