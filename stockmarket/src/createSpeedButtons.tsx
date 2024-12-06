import { bankAccount, IronMark } from "./bank";
import { highestPoint } from "./main";

export const standardxOffsetIncrease = 5;
export let speedModifier = 1;
export let xOffSetIncrease = standardxOffsetIncrease * speedModifier;

export const createSpeedButtons = () => {
  let speedButton;

  // Custom
  // speedButton = document.getElementById("customSpeed");
  // speedButton.input = () => {
  //   console.log(speedButton.currentTarget.value);

  //   if (number === Number) {
  //     // speedModifier = number;
  //     console.log("speeeeeeeeeeding", speedModifier);
  //   } else {
  //     console.log("Enter a number, you stupid f");
  //   }
  //   xOffSetIncrease = standardxOffsetIncrease * speedModifier;
  // };

  // Pause
  speedButton = document.getElementById("pause");
  speedButton.onclick = () => {
    speedModifier = 0;
    console.log("speeeeeeeeeeding", speedModifier);
    xOffSetIncrease = standardxOffsetIncrease * speedModifier;
  };

  // Speed One
  speedButton = document.getElementById("setSpeedOne");
  speedButton.onclick = () => {
    speedModifier = 1;
    console.log("speeeeeeeeeeding", speedModifier);
    xOffSetIncrease = standardxOffsetIncrease * speedModifier;
  };

  // Speed Two
  speedButton = document.getElementById("setSpeedTwo");
  speedButton.onclick = () => {
    speedModifier = 2;
    console.log("speeeeeeeeeeding", speedModifier);
    xOffSetIncrease = standardxOffsetIncrease * speedModifier;
  };

  // Speed Three
  speedButton = document.getElementById("setSpeedThree");
  speedButton.onclick = () => {
    speedModifier = 3;
    console.log("speeeeeeeeeeding", speedModifier);
    xOffSetIncrease = standardxOffsetIncrease * speedModifier;
  };

  // Buy Max
  speedButton = document.getElementById("buyMax");
  speedButton.onclick = () => {
    IronMark.owned += Math.floor(bankAccount.value / IronMark.currentValue);
    bankAccount.value = bankAccount.value % IronMark.currentValue;
    console.log("speeeeeeeeeeding", speedModifier);
    xOffSetIncrease = standardxOffsetIncrease * speedModifier;
  };

  // Sell Max
  speedButton = document.getElementById("sellMax");
  speedButton.onclick = () => {
    // speedModifier = 3;
    bankAccount.value = IronMark.owned * IronMark.currentValue;
    IronMark.owned = 0;
    console.log("speeeeeeeeeeding", speedModifier);
    xOffSetIncrease = standardxOffsetIncrease * speedModifier;
  };
};
