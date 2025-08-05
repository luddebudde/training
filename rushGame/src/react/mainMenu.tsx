import React, { useEffect, useState } from "react";
// import { Menu } from "./menu";
import { nextBoss } from "../arrays";
import practiceMenu from "./practiceMenu";
import PracticeMenu from "./practiceMenu";
import { Menu, MenuProvider, useMenu } from "./reactContext";
import StatisticsMenu from "./statisticsMenu";
import { createRoot } from "react-dom/client";
import { startGame } from "../startGame";

function App() {
  const [gameName, setGameName] = useState("GAME NAME");
  const { currentMenu, setMenu } = useMenu();

  useEffect(() => {
    window.changeMenu = (changeTo: Menu) => {
      setMenu(changeTo);
    };

    // Flytta anropet HIT:
    window.changeMenu("main");
  }, [setMenu]);

  return (
    <>
      <div id="world">
        {currentMenu === "main" && (
          <div
            id="mainMenu"
            style={{
              // marginTop: 20,
              opacity: "100%",
              position: "absolute",
              // backgroundColor: "green",sd
              backgroundImage: "url(public/img.webp)",

              display: "flex",
              width: "100%",
              height: "100%",
              left: "50%",
              top: "0%",
              flexDirection: "column",
              // justifyContent: "",
              alignItems: "center",
              transform: "translate(-50%, 0%)",
              padding: "40px",
            }}
          >
            <input
              style={{
                fontSize: 130,
                backgroundColor: "white",
                marginBottom: 60,
                width: "50%",
                textAlign: "center",
              }}
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
            />
            {createButton("Play", "red", () => {
              setMenu("none");
              const canvas = document.getElementById("myCanvas");
              const ctx = canvas.getContext("2d");

              // setTimeout(() => {
              startGame(ctx);
              // }, 1500);
            })}

            {createButton("Practice", "green", () => {
              setMenu("practice");
              console.log(currentMenu);
            })}

            {createButton("4 nerds", "blue", () => {
              setMenu("statistics");
              console.log(currentMenu);
            })}
            {createButton("4 Dummies", "blue", () => {
              setMenu("statistics");
            })}
          </div>
        )}
        {currentMenu === "practice" && (
          <PracticeMenu onBack={() => setMenu("main")} />
        )}
        {currentMenu === "statistics" && (
          <StatisticsMenu onBack={() => setMenu("main")} />
        )}
      </div>
    </>
  );
}

export default App;

const createButton = (text, backgroundColor, onClick) => (
  <button
    style={{
      backgroundColor,
      fontSize: 80,
      width: "20%",
      height: "10%",
      margin: 40,
    }}
    onClick={onClick}
  >
    {text}
  </button>
);
