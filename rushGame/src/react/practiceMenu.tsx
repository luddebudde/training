import React, { useEffect, useState } from "react";
import { waveOrder } from "../arrays";
import { world } from "../basics";
import { useMenu } from "./reactContext";

declare global {
  interface Window {
    onBossDeath?: () => void;
  }
}

export let practiceBoss = false;

const PracticeMenu = ({ onBack }) => {
  const { currentMenu, setMenu } = useMenu();

  useEffect(() => {
    window.onBossDeath = () => {
      setMenu("practice");
    };
  }, [setMenu]);

  if (typeof window.onBossDeath === "function") {
    window.onBossDeath();
  }

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
              {wave.map((bossArray, colIndex) => (
                <button
                  key={colIndex}
                  onClick={() => {
                    practiceBoss = true;
                    setMenu("none");

                    const canvas = document.getElementById("myCanvas");
                    const ctx = canvas.getContext("2d");
                    bossArray[2](ctx);
                  }}
                  style={{
                    padding: "40px 40px",
                    fontSize: "30px",
                    backgroundColor: "darkgreen",
                    width: world.width / wave.length - wave.length * 20,
                    height:
                      world.height / waveOrder.length - waveOrder.length * 20,
                    margin: 20,
                    // gap: 20,
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

export default PracticeMenu;
