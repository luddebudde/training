import { createCredits } from "./createCredits";
import { generateMap } from "./main";

export const createMenu = () => {
    // Skapa och styla gameTitle
    const gameTitle = document.createElement('p');
    gameTitle.style.padding = '30px';
    //gameTitle.style.padding = '60px';
    gameTitle.style.color = 'red';
    gameTitle.style.fontSize = '60px';
    //gameTitle.style.fontSize = '60px';
    gameTitle.style.backgroundColor = 'darkred';
    gameTitle.style.borderRadius = '10px';
    gameTitle.style.textAlign = 'center'; // Ändra till center för bättre visning
    gameTitle.style.position = 'absolute';
    gameTitle.style.top = '0%';
    gameTitle.style.left = '50%'; // Centrera horisontellt
    gameTitle.style.transform = 'translateX(-50%)'; // Justera för centrering
    gameTitle.textContent = 'Thye Bangbing Musig';
  
    // Skapa och styla playButton
    const playButton = document.createElement('button');
    playButton.style.padding = '40px';
    playButton.style.color = 'darkred';
    playButton.style.fontSize = '40px';
    playButton.style.backgroundColor = 'blue';
    playButton.style.width = '15%';
    playButton.textContent = 'PLAY';
    playButton.onclick = () => {
        console.log('playButton clicked.');
        generateMap()
    }
  
    // Skapa och styla creditsButton
    const creditsButton = document.createElement('button');
    creditsButton.style.padding = '40px';
    creditsButton.style.color = 'darkred';
    creditsButton.style.fontSize = '40px';
    creditsButton.style.backgroundColor = 'darkgreen';
    creditsButton.style.width = '15%';
    creditsButton.style.margin = '15px';
    creditsButton.textContent = 'CREDITS';
    creditsButton.onclick = () => {
        console.log('creditButton clicked.');
        createCredits()
    }
  
    // Skapa och styla extraButton
    const extraButton = document.createElement('button');
    extraButton.style.padding = '40px';
    extraButton.style.color = 'darkred';
    extraButton.style.fontSize = '40px';
    extraButton.style.backgroundColor = 'orange';
    extraButton.style.width = '15%';
    extraButton.textContent = 'EXTRA';
  
    // Hitta div och lägg till alla element
    const div = document.getElementById('menu');

    if (div) {
      div.innerHTML = ''; // Rensa eventuell gammal innehåll
      div.appendChild(gameTitle);
      div.appendChild(playButton);
      div.appendChild(creditsButton);
      div.appendChild(extraButton);
    } else {
      console.error('Element with id "menuDiv" not found.');
    }  
  };