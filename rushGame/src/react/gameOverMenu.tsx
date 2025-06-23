import { useEffect } from "react";
import { useMenu } from "./reactContext";
import React from "react";
import { statistics } from "../loseScreen"; // ex: { kills: 5, "time-survived": "2:34" }

function GameOverMenu() {
  const { currentMenu, setMenu } = useMenu();

  useEffect(() => {
    Object.entries(statistics).forEach(([key, value]) => {
      const el = document.getElementById(key);
      if (el)
        el.textContent =
          key.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()) +
          ": " +
          value;
    });
  }, []);

  return currentMenu === "gameOver" ? (
    <div>
      <div id="stats-container">
        {Object.keys(statistics).map((key) => (
          <div id={key} key={key}></div>
        ))}
      </div>
      <button
        onClick={() => setMenu("main")}
        style={{
          marginTop: "40px",
          fontSize: "24px",
          padding: "10px 20px",
          backgroundColor: "#333",
          color: "white",
          borderRadius: "8px",
        }}
      >
        Tillbaka till huvudmenyn
      </button>
    </div>
  ) : null;
}

export default GameOverMenu;
