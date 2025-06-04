import React from "react";

export const Menu = () => {
  return (
    <div
      id="menu"
      style={{
        display: "hidden",
        position: "absolute",
        backgroundColor: "green",
        opacity: "50%",
        textAlign: "center",
        height: "100vh",
        width: "100vw",
        flexDirection: "column",
        pointerEvents: "none",
      }}
    ></div>
  );
};
