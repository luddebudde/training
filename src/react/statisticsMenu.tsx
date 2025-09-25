import React, { useEffect, useMemo } from "react";
import { player } from "../createPlayer";
import { foughtBosses, statistics } from "../loseScreen";
import { randomArrayElement } from "../randomArrayElement";
import { bossCritiques } from "./bossCritique";
import { useMenu } from "./reactContext";
import { world } from "../basics";

const squareWidth = world.width / 5;
const squareHeight = world.height / 5;
const margin = (world.height / 100) * 2;

const StatisticsMenu = ({ onBack }) => {
  const { currentMenu, setMenu } = useMenu();

  const allFoughtBosses = JSON.parse(
    localStorage.getItem("allFoughtBosses") || "[]"
  );
  const overallStatistics = JSON.parse(
    localStorage.getItem("overallStatistics") || "statistics"
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
                    padding: "1vh",
                    boxSizing: "border-box",
                    borderRadius: "0.5vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2vh",
                      fontWeight: 700,
                      marginBottom: "0.5vh",
                    }}
                  >
                    {boss.name}
                  </div>
                  <div>
                    Damage dealt to them: {Math.floor(boss.damageAbsorbed ?? 0)}
                  </div>
                  <div>
                    Damage dealt to you:{" "}
                    {Math.floor(boss.damageConflicted ?? 0)}
                  </div>
                  <div>Bullets shot: {boss.bulletsShot ?? 0}</div>
                  <div>Times defeated: {boss.timesDefeated ?? 0}</div>
                  <i
                    style={{
                      fontSize: "1vw",
                      display: "block",
                      marginTop: "1.5vh",
                    }}
                  >
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
              fontSize: "3vh",
              textAlign: "center",
              color: "grey",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "1vh",
            }}
          >
            <b style={{ fontSize: "3vh" }}>Player stats</b>
            <div>
              Damage dealt to you: {Math.floor(source.damageAbsorbed ?? 0)}
            </div>
            <div>
              Damage dealt to them: {Math.floor(source.damageConflicted ?? 0)}
            </div>
            <div>Bullets shot: {source.bulletsShot ?? 0}</div>
            <div>Mistakes made: {source.mistakesMade ?? 0}</div>
          </div>

          <button
            onClick={() => {
              setMenu("main");
            }}
            style={{
              marginTop: "5vh",
              padding: "2vh 2vw",
              fontSize: "2vh",
              backgroundColor: "gray",
              color: "white",
              borderRadius: "1vh",
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
