
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


const mapBlocks = [];
const pathBlocks = []

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;
  return `rgb(${r}, ${g}, ${b})`;
}

for (let x = 54; x > 0; x--) {
  const colorHex = x === 50 ? '#FFB266' : '#009900';
  const colorRgb = hexToRgb(colorHex);

  const currentBlock = {
    index: x,
    color: colorRgb
  };


  

  if (currentBlock.color === hexToRgb(`#FFB266`)){
    // console.log(currentBlock, "1");
    
    pathBlocks.push(currentBlock)
  }

  mapBlocks.unshift(currentBlock); 
}

console.log(mapBlocks);

const colorToCompare = hexToRgb('#FFB266'); 

let currentTestingBlock

pathBlocks.forEach(block => {
  console.log((mapBlocks[block.index]).color);
  
  currentTestingBlock = mapBlocks[block.index]
  if (currentTestingBlock !== undefined && currentTestingBlock.color === hexToRgb(`#009900`) ){
    console.log("color works"); 

    currentTestingBlock.color = `#FFB266`
    
  }

  currentTestingBlock = mapBlocks[block.index - 2]
  if (currentTestingBlock !== undefined && currentTestingBlock.color === hexToRgb(`#009900`)){
    console.log("color works"); 

    currentTestingBlock.color = `#FFB266`
    
  }

  currentTestingBlock = mapBlocks[block.index - 10]
  if (currentTestingBlock !== undefined && currentTestingBlock.color === hexToRgb(`#009900`) ){
    console.log("color works"); 

    currentTestingBlock.color = `#FFB266`
    
  }

  currentTestingBlock = mapBlocks[block.index + 8]
  if (currentTestingBlock !== undefined && currentTestingBlock.color === hexToRgb(`#009900`)){
    console.log("color works"); 

    currentTestingBlock.color = `#FFB266`
    
  }


});


mapBlocks.forEach((block, loopIndex) => {
  // Ensure indices are within bounds

    

  // const prevBlockColor = (block.index > 1) ? mapBlocks[block.index - 2].color : null;
  // const nextBlockColor = (block.index < mapBlocks.length) ? mapBlocks[block.index].color : null;

  // const aboveBlockColor = (block.index > 9) ? mapBlocks[block.index - 9].color : null; // Adjusted index
  // const belowBlockColor = (block.index < mapBlocks.length - 9) ? mapBlocks[block.index + 9].color : null; // Adjusted index
  

  // if (prevBlockColor === colorToCompare || nextBlockColor === colorToCompare || aboveBlockColor === colorToCompare ||belowBlockColor === colorToCompare) {
  //   block.color = Math.random() > 0 ? `#FFB266` : block.color;
    
  //   console.log(block.index - 1, "--"); 
  // } else {
  //   console.log(block.index - 1, "-");
  // }


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