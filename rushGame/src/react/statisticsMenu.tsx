import React, { useEffect, useState } from "react";
import { waveOrder } from "../arrays";
import { world } from "../basics";
import { useMenu } from "./reactContext";
import { meetBossIndex } from "../loseScreen";

const squareWidth = 450;
const squareHeight = 250;
const margin = 25;

const StatisticsMenu = ({ onBack }) => {
  const { currentMenu, setMenu } = useMenu();

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
          {meetBossIndex.map((boss, index) => (
            <div
              style={{
                width: squareWidth,
                height: squareHeight,
                backgroundColor: "red",
                left:
                  index % 2 === 0 ? margin : world.width - squareWidth - margin,
                top: (squareHeight + margin) * Math.floor(index / 2),
                position: "absolute",
                fontSize: 50,
                color: "black",
              }}
            >
              {boss.name}:<div></div>
            </div>
          ))}

          <h1 style={{ fontSize: "60px", marginBottom: "40px" }}>
            Practice Mode
          </h1>

          <button
            onClick={() => {
              onBack();
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
