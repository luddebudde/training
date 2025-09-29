import { IronMark, modifiers } from "./bank";

export let minStockValueAdd = 0;

const higherBottom = {
  name: "higher bottom",
  function: () => {
    minStockValueAdd += 50;
  },
};

const lowerTaxes = {
  name: "decreased taxes",
  function: () => {
    modifiers.taxes += 0.05;
  },
};

const increasedStab = {
  name: "increase stability",
  function: () => {
    IronMark.stability += 1;
  },
};

const decreasedStab = {
  name: "decrease stability",
  function: () => {
    IronMark.stability -= 1;
  },
};

export const upgrades = [
  higherBottom,
  lowerTaxes,
  increasedStab,
  decreasedStab,
];

let upgradeDiv = document.getElementById("purchaseMenu");
upgrades.forEach((upgrade) => {
  const newButton = document.createElement("button");
  newButton.textContent = `${upgrade.name}`;
  newButton.style.width = "75px";
  newButton.style.height = "75px";
  newButton.style.margin = "2px";

  newButton.onclick = upgrade.function;

  upgradeDiv.appendChild(newButton);
});
