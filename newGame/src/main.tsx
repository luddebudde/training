import { hexToRgb } from "./hexToRgb.tsx";
import { survivalLetter } from "./survivalLetter.tsx";
// import { survivalLetter } from './survivalLetter.tsx';

// Rewrite map generation but with pathBlocks.includes(neighbor) instead, maybe.

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

export type Enemy = {
  health: number,
  name: string
}

export type Block = {
  row: number,
  column: number,
  color: string;
  text: string;
  infested: boolean | Enemy
}



export const mapBlocks: Block[] = [];
export const pathBlocks: Block[] = []


  for (let row = 0; row <= 5; row++) {
    for (let column = 0; column <= 8; column++) {
      let colorHex: string = '#009900';
      let blockText: string = '';

      if (row === 5 && column === 4) {
        colorHex = '#FFB266';
      }

      // const colorRgb = hexToRgb(colorHex);

      const currentBlock: Block = {
        row: row,
        column: column,
        color: colorHex,
        text: blockText,
        infested: false,
      };

      if (row === 5 && column === 4) {
        pathBlocks.push(currentBlock)
      }
     
      mapBlocks.push(currentBlock);
    }
  }



const enemyPrototype: Enemy = {
  health: 100,
  name: "Prototype"
}

const runAway: Enemy = {
  health: 50,
  name: "Runaway"
}

const giganian: Enemy = {
  health: 50,
  name: "giganian"
}

const basher: Enemy = {
  health: 50,
  name: "basher"
}

const enemyTypesOnFloor = [enemyPrototype, runAway];
const bossTypesOnFloor = [giganian, basher];

const randomEnemy = () => {
  return enemyTypesOnFloor[Math.floor(Math.random() * enemyTypesOnFloor.length)]
}

const randomBoss = () => {
  return bossTypesOnFloor[Math.floor(Math.random() * bossTypesOnFloor.length)]
}



const generateMap = () => {
(async () => {
  const module = await import('./handleBlocks');
  const chosePathGeneration = module.chosePathGeneration;

  for (let row = 0; row <= 50; row++) {
  setTimeout(() => {
    


    const contestantNeighbors: Block[] = chosePathGeneration(pathBlocks[pathBlocks.length - 1]);
    
    const chosenNeighbor = contestantNeighbors[Math.floor(Math.random() * contestantNeighbors.length)]

    
    const div = document.getElementById('mapDiv');
    if (div)  {
      div.innerHTML = '';
    }


    // console.log(pathBlocks);
    

    if (chosenNeighbor === undefined || pathBlocks.includes(chosenNeighbor)){
      const lastElement: Block =  pathBlocks[pathBlocks.length - 1]
      lastElement.color = "#FF0000"

      
      lastElement.infested = randomBoss()

      // console.log("reset");
      drawmap()

      return
    } else {


      if (Math.random() > 0.3){
        chosenNeighbor.color = `#FFB266`
      } else {
        console.log(chosenNeighbor);
        
        chosenNeighbor.color = `#FF8000`
        chosenNeighbor.infested = randomEnemy()
        
      }

      // console.log("next");
      drawmap()


      pathBlocks.push(chosenNeighbor)
  }

}, 500 * row);    
  }
})();
}

generateMap()
console.log(pathBlocks);


const drawmap = () => {
mapBlocks.forEach((block) => {
  console.log(block.color);
  
  const mapButton = `
      <button
        style="
          background-color: ${};
          font-size: 30px;
          padding: 0px;
          margin: 0px;
          padding-down: 0px;

        "
   onclick="
      if (${block.infested !== false}) {
        console.log('${block.infested.name}');
      }
    "
      >
  <img 
    src="${block.color === '#009900' ? '/map/fog.webp' : '/map/john lennon.jpg'}" 
    style="
      width: 100%; 
      height: 100%; 
      display: block; /* Ta bort inline-relaterat mellanrum */
      margin: 0; /* Säkerställ att ingen marginal läggs till */
      padding: 0; /* Säkerställ att ingen padding läggs till */
      border: none; /* Ta bort eventuell kantlinje på bilden */
      outline: none; /* Ta bort eventuell outline */
      border-spacing: 0px;
    "
      alt="${survivalLetter}" 
  />
      </button>
      `
  

      const div = document.getElementById('mapDiv');
      if (div) {
        div.insertAdjacentHTML('beforeend', mapButton);
      }
});
}
