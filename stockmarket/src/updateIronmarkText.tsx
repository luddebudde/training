import { bankAccount, IronMark } from "./bank";
import { graphBox } from "./main";

const ironmarkElement = document.getElementById("ironmark");
// Lägg till värdet direkt efter texten
// ironmarkElement.textContent += ` ${IronMark.currentValue}`;
// Skapa en lista för att lägga till poster under "Ironmark"
const subList = document.createElement("ul");
ironmarkElement.appendChild(subList);
export function updateIronmarkText() {
  // ironmarkElement.textContent = `Ironmark ${Math.round(
  //   IronMark.currentValue
  //   // 0
  // )}`;
  for (const [key, value] of Object.entries(IronMark)) {
    const listItem = document.createElement("li");
    listItem.textContent = `${key}: ${value}`;
    // subList.appendChild(listItem);
    // console.log("key:", key, "value:", value);
  }
  // Lägg till listan tillbaka (eftersom `textContent` rensar innehållet)
  ironmarkElement.appendChild(subList);
  updateSubList();
}
function updateSubList() {
  subList.innerHTML = ""; // Rensa tidigare lista
  for (const [key, value] of Object.entries(IronMark)) {
    const listItem = document.createElement("li");
    listItem.textContent = `${key}: ${Math.round(value)}`;
    subList.appendChild(listItem);
    // console.log("key:", key, "value:", value);
  }
}
for (const [key, value] of Object.entries(IronMark)) {
  const listItem = document.createElement("li");
  listItem.textContent = `${key}: ${value}`;
  subList.appendChild(listItem);
  console.log("key:", key, "value:", value);
}

const moneyElement = document.getElementById("bank");

export function updateMoneyText() {
  moneyElement.textContent = `MONEY: ${bankAccount.value}`;
  // for (const [key, value] of Object.entries(IronMark)) {
  //   const listItem = document.createElement("li");
  //   listItem.textContent = `${key}: ${value}`;
  //   // subList.appendChild(listItem);
  //   // console.log("key:", key, "value:", value);
  // }
  // // Lägg till listan tillbaka (eftersom `textContent` rensar innehållet)
  // ironmarkElement.appendChild(subList);
  // updateSubList();
}
