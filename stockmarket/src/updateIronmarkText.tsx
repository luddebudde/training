import { bankAccount, currencies, IronMark } from "./bank";
import { graphBox } from "./main";

// const ironmarkElement = document.getElementById("ironmark");
// // Lägg till värdet direkt efter texten
// // ironmarkElement.textContent += ` ${IronMark.currentValue}`;
// // Skapa en lista för att lägga till poster under "Ironmark"
// const subList = document.createElement("ul");
// ironmarkElement.appendChild(subList);
// export function updateIronmarkText() {
//   // ironmarkElement.textContent = `Ironmark ${Math.round(
//   //   IronMark.currentValue
//   //   // 0
//   // )}`;
//   for (const [key, value] of Object.entries(IronMark)) {
//     const listItem = document.createElement("li");
//     listItem.textContent = `${key}: ${value}`;
//     // subList.appendChild(listItem);
//     // console.log("key:", key, "value:", value);
//   }
//   ironmarkElement.appendChild(subList);
//   updateSubList();
// }
// function updateSubList() {
//   subList.innerHTML = ""; // Rensa tidigare lista
//   for (const [key, value] of Object.entries(IronMark)) {
//     const listItem = document.createElement("li");
//     listItem.textContent = `${key}: ${Math.round(value)}`;
//     subList.appendChild(listItem);
//     // console.log("key:", key, "value:", value);
//   }
// }
// for (const [key, value] of Object.entries(IronMark)) {
//   const listItem = document.createElement("li");
//   listItem.textContent = `${key}: ${value}`;
//   subList.appendChild(listItem);
//   console.log("key:", key, "value:", value);
// }

// const ironmarkElement = document.getElementById("ironmark");

// const subList = document.createElement("ul");
// ironmarkElement.appendChild(subList);

// let subList;

// const ironmarkElement = document.getElementById("ironmark");
// Lägg till värdet direkt efter texten
// ironmarkElement.textContent += ` ${IronMark.currentValue}`;
// Skapa en lista för att lägga till poster under "Ironmark"
// const subList = document.createElement("ul");
// ironmarkElement.appendChild(subList);

// setTimeout(() => {
//   currencies.forEach((currency) => {
//     const ironmarkElement = document.getElementById(`${currency.htmlId}`);
//     // const subList = document.createElement("ul");
//     ironmarkElement.appendChild(subList);

//     for (const [key, value] of Object.entries(IronMark)) {
//       const listItem = document.createElement("li");
//       listItem.textContent = `${key}: ${value}`;
//       subList.appendChild(listItem);
//       console.log("key:", key, "value:", value);
//     }
//   });
// }, 100);

// export function updateIronmarkText() {
//   currencies.forEach((currency) => {
//     const ironmarkElement = document.getElementById(`${currency.htmlId}`);
//     const subList = document.createElement("ul");
//     ironmarkElement.appendChild(subList);

//     // subList.innerHTML = "";

//     // for (const [key, value] of Object.entries(IronMark)) {
//     //   const listItem = document.createElement("li");
//     //   listItem.textContent = `${key}: ${value}`;
//     //   subList.appendChild(listItem);
//     //   console.log("key:", key, "value:", value);
//     // }

//     for (const [key, value] of Object.entries(currency)) {
//       const listItem = document.createElement("li");
//       listItem.textContent = `${key}: ${value}`;
//     }
//     // Lägg till listan tillbaka (eftersom `textContent` rensar innehållet)
//     ironmarkElement.appendChild(subList);
//     subList.innerHTML = ""; // Rensa tidigare lista
//     updateSubList(currency, subList);
//   });
// }
// function updateSubList(currency, subList) {
//   console.log(subList);
//   // while (subList.hasChildNodes()) {
//   //   subList.removeChild(subList.firstChild);
//   // }

//   subList.innerHTML = ""; // Rensa tidigare lista
//   for (const [key, value] of Object.entries(currency)) {
//     const listItem = document.createElement("li");
//     listItem.textContent = `${key}: ${Math.round(value)}`;
//     subList.appendChild(listItem);
//     // console.log("key:", key, "value:", value);
//   }
// }
// // for (const [key, value] of Object.entries(IronMark)) {
// //   const listItem = document.createElement("li");
// //   listItem.textContent = `${key}: ${value}`;
// //   subList.appendChild(listItem);
// //   console.log("key:", key, "value:", value);
// // }

export function updateIronmarkText() {
  currencies.forEach((currency) => {
    const currencyElement = document.getElementById(`${currency.htmlId}`);

    currencyElement.innerHTML = "";
    currencyElement.innerHTML = `${currency.htmlId}`;

    const subList = document.createElement("ul");
    currencyElement.appendChild(subList);

    for (const [key, value] of Object.entries(IronMark)) {
      const listItem = document.createElement("li");
      listItem.textContent = `${key}: ${value}`;
    }
    currencyElement.appendChild(subList);
    updateSubList(currency, subList);
  });
}

function updateSubList(currency, subList) {
  subList.innerHTML = "";

  for (const [key, value] of Object.entries(currency)) {
    const listItem = document.createElement("li");
    listItem.textContent = `${key}: ${Math.round(value)}`;
    subList.appendChild(listItem);
  }
}
