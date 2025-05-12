import { createCredits } from "./createCredits";
import { generateMap } from "./main";

export const createMenu = () => {
  // Skapa och styla gameTitle
  const gameTitle = document.createElement("p");
  gameTitle.style.padding = "3vw";
  gameTitle.style.color = "red";
  gameTitle.style.fontSize = "400%";
  gameTitle.style.backgroundColor = "darkred";
  gameTitle.style.borderRadius = "10px";
  gameTitle.style.textAlign = "center";
  gameTitle.style.position = "absolute";
  gameTitle.style.top = "0%";
  gameTitle.style.left = "50%";
  gameTitle.style.transform = "translateX(-50%)";
  gameTitle.textContent = "Thye Bangbing Musig";

  // Skapa och styla playButton
  const playButton = document.createElement("button");
  playButton.style.padding = "2vw";
  playButton.style.color = "darkred";
  playButton.style.fontSize = "3.5vh";
  playButton.style.backgroundColor = "blue";
  playButton.style.width = "15vw";
  playButton.textContent = "PLAY";
  playButton.onclick = () => {
    const div = document.getElementById("menu");

    if (div) {
      div.innerHTML = "";
      console.log("playButton clicked.");
      generateMap();
    }
  };

  playButton.style.position = "absolute";
  playButton.style.top = "30%";

  const creditsButton = document.createElement("button");
  creditsButton.style.padding = "2vw";
  creditsButton.style.color = "darkred";
  creditsButton.style.fontSize = "3.5vh";
  creditsButton.style.backgroundColor = "darkgreen";
  creditsButton.style.width = "15vw";
  creditsButton.style.margin = "1vh";
  creditsButton.textContent = "CREDITS";
  creditsButton.onclick = () => {
    console.log("creditButton clicked.");
    createCredits();
  };

  creditsButton.style.position = "absolute";
  creditsButton.style.top = "42.5%";

  const extraButton = document.createElement("button");
  extraButton.style.padding = "2vw";
  extraButton.style.color = "darkred";
  extraButton.style.fontSize = "3.5vh";
  extraButton.style.backgroundColor = "orange";
  extraButton.style.width = "15vw";
  extraButton.textContent = "EXTRA";

  extraButton.style.position = "absolute";
  extraButton.style.top = "57.5%";

  const div = document.getElementById("menu");

  if (div) {
    div.innerHTML = "";
    div.appendChild(gameTitle);
    div.appendChild(playButton);
    div.appendChild(creditsButton);
    div.appendChild(extraButton);
  } else {
    console.error('Element with id "menuDiv" not found.');
  }
};
