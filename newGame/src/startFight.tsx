import { changeDivStatus } from "./changeDivStatus";
import { clearArray } from "./clearArray";
import { mapBlocks, pathBlocks } from "./main";


export const loopPerSecond = 60

export const startFight = () => {
    console.log("ben");

    const div = document.getElementById('mapDiv');
    if (div)  {
      div.innerHTML = '';
    }

    // mapBlocks.splice(0, mapBlocks.length)
    // pathBlocks.splice(0, pathBlocks.length)

    clearArray(mapBlocks)
    clearArray(pathBlocks)

    changeDivStatus('mapDiv', "display", "none")

    // playAnimation('/gothic-hero-jump.png', 5, 10, 'spriteContainer')

    const battleInterval = setInterval((index) => {


        // console.log("Loop körs");
    }, 1000 / loopPerSecond);

}