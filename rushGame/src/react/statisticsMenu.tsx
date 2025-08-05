import React, { useEffect, useState } from "react";
import { waveOrder } from "../arrays";
import { world } from "../basics";
import { useMenu } from "./reactContext";
import {
  allFoughtBosses,
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

  // Change this so it doesnt rely on player health
  const source = player.health <= 0 ? statistics : overallStatistics;
  const bossArray = player.health <= 0 ? foughtBosses : allFoughtBosses;

  player.health = player.maxHealth;

  // bossArray.forEach(element => {

  // });

  console.log(bossArray);

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
          }}
        >
          {bossArray.map((boss, index) => (
            <div
              style={{
                width: squareWidth,
                height: squareHeight,
                backgroundColor: "red",
                left:
                  index % 2 === 0 ? margin : world.width - squareWidth - margin,
                top: (squareHeight + margin) * Math.floor(index / 2),
                position: "absolute",
                fontSize: 40,
                color: "black",
                // fontStyle:
              }}
            >
              <b style={{ fontSize: 50 }}>{boss.name}:</b>
              <div>Damage taken: {Math.floor(boss.damageAbsorbed)} </div>
              <div>Damage dealt: {Math.floor(boss.damageConflicted)} </div>
              {/* <div>Bullets shot: {boss.bulletsShot} </div> */}
              <div>Times defeated: {boss.timesDefeated} </div>
              <i style={{ fontSize: 35 }}>
                "
                {
                  bossCritiques[
                    Math.floor(Math.random() * bossCritiques.length)
                  ]
                }
                "{" "}
              </i>
            </div>
          ))}
          <div
            style={{
              // backgroundColor: "red",
              width: "35%",
              height: "40%",
              display: "flex",
              flexDirection: "column",
              fontSize: 80,
              textAlign: "center",
              color: "grey",
            }}
          >
            <b style={{ fontSize: 140 }}>Player stats</b>
            <div>Damage taken: {Math.floor(source.damageAbsorbed)}</div>
            <div>Damage dealt: {Math.floor(source.damageConflicted)}</div>
            <div>Bullets shot:{source.bulletsShot}</div>
          </div>

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

export default StatisticsMenu;
