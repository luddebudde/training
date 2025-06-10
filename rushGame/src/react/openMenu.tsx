import React, { useState } from "react";
// import { Menu } from "./menu";
import { nextBoss } from "../arrays";

function App() {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  const [gameName, setGameName] = useState("GAME NAME");
  return (
    <>
      {/* {<Menu />} */}
      <div
        id="menu"
        style={{
          // marginTop: 20,
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
          const menu = document.getElementById("menu");
          menu.style.visibility = "hidden";

          setTimeout(() => {
            nextBoss(ctx);
          }, 1500);
        })}
        {createButton("Practice", "green", () => {})}
        {createButton("4 Dummies", "blue", () => {})}
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

const closeMenu = () => {
  const menu = document.getElementById("menu");
  menu.style.display = "hidden";
};

const openMenu = () => {
  const menu = document.getElementById("menu");
  menu.style.display = "flex";
};
