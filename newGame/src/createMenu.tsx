import { createCredits } from "./createCredits";
import { generateMap } from "./main";

export const createMenu = () => {
  // Skapa och styla gameTitle
  const gameTitle = document.createElement("p");
  // gameTitle.style.padding = '30px';
  // gameTitle.style.padding = '60px';
  gameTitle.style.padding = "3vw";
  gameTitle.style.color = "red";
  gameTitle.style.fontSize = "400%";
  // gameTitle.style.fontSize = '60px';
  // gameTitle.style.fontSize = '80px';
  gameTitle.style.backgroundColor = "darkred";
  gameTitle.style.borderRadius = "10px";
  gameTitle.style.textAlign = "center"; // Ändra till center för bättre visning
  gameTitle.style.position = "absolute";
  gameTitle.style.top = "0%";
  gameTitle.style.left = "50%"; // Centrera horisontellt
  gameTitle.style.transform = "translateX(-50%)"; // Justera för centrering
  gameTitle.textContent = "Thye Bangbing Musig";

  // Skapa och styla playButton
  const playButton = document.createElement("button");
  // playButton.style.padding = '40px';
  playButton.style.padding = "2vw";
  playButton.style.color = "darkred";
  // playButton.style.fontSize = '40px';
  playButton.style.fontSize = "3.5vh";
  playButton.style.backgroundColor = "blue";
  playButton.style.width = "15vw";
  // playButton.style.height = "15vw";
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

  // Skapa och styla creditsButton
  const creditsButton = document.createElement("button");
  // creditsButton.style.padding = '40px';
  creditsButton.style.padding = "2vw";
  creditsButton.style.color = "darkred";
  // creditsButton.style.fontSize = '40px';
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

  // Skapa och styla extraButton
  const extraButton = document.createElement("button");
  // extraButton.style.padding = '40px';
  extraButton.style.padding = "2vw";
  extraButton.style.color = "darkred";
  // extraButton.style.fontSize = '40px';
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

    // console.log(gameTitle);
    // console.log("");
    // console.log(playButton);
    // console.log("");
    // console.log(creditsButton);
    // console.log("");
    // console.log(extraButton);
    // console.log("");
  } else {
    console.error('Element with id "menuDiv" not found.');
  }
};
