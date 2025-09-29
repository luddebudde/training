import React, { useEffect, useState } from "react";
// import { Menu } from "./menu";
import { startGame } from "../startGame";
import PracticeMenu from "./practiceMenu";
import { Menu, useMenu } from "./reactContext";
import StatisticsMenu from "./statisticsMenu";

function App() {
  const localName = localStorage.getItem("gameName");
  const storedName = localName === "" ? "Deiat's Challenge" : localName;

  const [gameName, setGameName] = useState(storedName);
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
                fontSize: "10vh",
                backgroundColor: "black",
                marginBottom: "3%",
                width: "75%",
                color: "darkred",
                textAlign: "center",
              }}
              value={gameName}
              onChange={(e) => {
                setGameName(e.target.value);
                localStorage.setItem("gameName", e.target.value);
              }}
            />
            {createButton("Play", "red", () => {
              setMenu("none");
              const canvas = document.getElementById(
                "myCanvas"
              ) as HTMLCanvasElement;
              const ctx = canvas.getContext("2d");
              if (!ctx) throw new Error("Could not get 2D context!");

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
              setMenu("IDIOT");
              alert(
                "IDOTIDOTIDOTIDOTIDOTIDOTIDOTIDOTIDOTIDOTIDOTIDOTIDOTIDOTIDOTIDOTIDOTIDO(**r**n)TIDOTIDOTIDOTIDOTIDOTIDOTIDOTIDOTIDOTIDOTIDOTIDOTIDOT"
              );
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
      fontSize: "3.5vw",
      width: "20%",
      height: "10%",
      margin: "3vh",
    }}
    onClick={onClick}
  >
    {text}
  </button>
);
