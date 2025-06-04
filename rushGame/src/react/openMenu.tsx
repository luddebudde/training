import React, { useState } from "react";
import { Menu } from "./menu";

function App(changeIsPaused) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [gameName, setGameName] = useState("GAME NAME");
  return (
    <>
      {gameName && <Menu />}
      <div
        style={{
          margin: 5,
          position: "absolute",
          backgroundColor: "blue",
          display: "flex",
          width: "50%",
          height: "70%",
          left: "50%",
          top: "0%",
          flexDirection: "column",
          transform: "translate(-50%, 0%)",
        }}
      >
        {/* <button
          style={{ backgroundColor: "red", fontSize: 150, margin: 0 }}
          onClick={() => setGameName(true)}
        >
          {gameName}
        </button> */}
        <input
          style={{ fontSize: 130, backgroundColor: "red", margin: 10 }}
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
        />

        <button
          style={{ backgroundColor: "red", fontSize: 50, margin: 40 }}
          onClick={() => alert("hdeiu")}
        >
          Hello, React
        </button>

        <button
          style={{ backgroundColor: "red", fontSize: 50, margin: 10 }}
          onClick={() => alert("hdeiu")}
        >
          Hello, React
        </button>
      </div>
    </>
  );
}

export default App;

export const openMenu = (changeIsPaused) => {
  //   const [gameName, setGameName] = useState("GAME NAME");
  changeIsPaused(true);
  const container = document.getElementById("menu");
  if (!container) {
    console.error("Ingen element med id 'menu' hittades.");
    return;
  }
  container.style.display = "flex";
  //   const element = (
  //   );
  //   const root = createRoot(container);
  //   root.render(element);
};
