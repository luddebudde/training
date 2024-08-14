import {checkNeighbors} from "./checkNeighbors.tsx";
import { chosePathGeneration, handleBlocks } from "./handleBlocks.tsx";
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
  row: number,
  column: number,
  color: string;
  text: string;
}

// export const chosenMapLayout = 
// mapLayouts[3]
// mapLayouts[Math.floor(Math.random() * mapLayouts.length)]


// setTimeout(() => {
  

  for (let row = 0; row <= 5; row++) {
    for (let column = 0; column <= 8; column++) {
      let colorHex: string = '#009900';
      let blockText: string = '';

      if (row === 5 && column === 4) {
        colorHex = '#FFB266';
      }

      const colorRgb = hexToRgb(colorHex);

      const currentBlock: Block = {
        row: row,
        column: column,
        color: colorRgb,
        text: blockText,
      };

      // Anropa den importerade funktionen
      if (row === 5 && column === 4) {
        pathBlocks.push(currentBlock)
      }

      // console.log(currentBlock);

      // Lägg till blocket i mapBlocks arrayen
      mapBlocks.push(currentBlock);
    }
  }



// console.log(mapBlocks);

(async () => {
  // Dynamisk import och tillgång till den exporterade funktionen
  const module = await import('./handleBlocks');
  const chosePathGeneration = module.chosePathGeneration;

  for (let row = 0; row <= 5; row++) {
    

    const result: Block = chosePathGeneration(pathBlocks[pathBlocks.length - 1]);
    // console.log("results", result); 

    // pathBlocks.push(result)
  }
})();


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


// }, 100);