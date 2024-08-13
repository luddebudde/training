import { Vector } from "three/examples/jsm/Addons.js";
import {checkCloseMapBlocks} from "./checkCloseMapBlocks.tsx";
import { handleBlocks } from "./handleBlocks.tsx";
import { hexToRgb } from "./hexToRgb.tsx";
import { mapLayouts } from "./mapLayouts.tsx";

const deletion = `
  <ul> 
    <li>BANANANA</li>
    <li>APPPLEEE</li>
  </ul>`;

const a = `
<button
  style="
    background-color: red;
    color: green;
    font-size: 30px;
    padding: 50px;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  "
  onclick="deleteList()"
>
  DELETE
</button>
`;

document.body.insertAdjacentHTML('beforeend', deletion);
document.body.insertAdjacentHTML('beforeend', a);


export const mapBlocks = [];
export const pathBlocks = []

type Block = {
  index: number;
  color: string;
  text: string;
}

export const chosenMapLayout = 
// mapLayouts[3]
mapLayouts[Math.floor(Math.random() * mapLayouts.length)]


for (let x = 54; x > 0; x--) {
  let colorHex: string = '#009900'
  let blockText: string = ""

  chosenMapLayout.forEach(tile => {

    
      if (Array.isArray(tile)) {
        
        if (x === tile[0]){
          colorHex = '#FFB266'
        } if ((tile[1] === "Enemy" || tile[1] === "Boss") && x === tile[0]){
          console.log(tile[1]);
          
          blockText = tile[1]
          colorHex = '#FF4000'
        }

      } else {
      if (x === tile){
        colorHex = '#FFB266'
      }}
    });

  
  const colorRgb = hexToRgb(colorHex);

  const currentBlock: Block = {
    index: x,
    color: colorRgb,
    text: blockText,
  };

  if (currentBlock.color === hexToRgb(`#FFB266`)){
    pathBlocks.push(currentBlock)
  }

  mapBlocks.unshift(currentBlock); 
}

console.log(mapBlocks);




mapBlocks.forEach((block, loopIndex) => {


  const mapButton = `
      <button
        style="
          background-color: ${block.color};
          font-size: 30px;
          padding: 80px;

        "
  onclick="this.style.backgroundColor = this.style.backgroundColor === 'rgb(255, 178, 102)' ? '#009900' : '#FFB266';"
      >

      </button>`
  

  document.getElementById('mapDiv').insertAdjacentHTML('beforeend', mapButton);

});


