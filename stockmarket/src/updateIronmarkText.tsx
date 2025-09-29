import { bankAccount, currencies, IronMark } from "./bank";
import { graphBox } from "./main";

export function updateIronmarkText() {
  currencies.forEach((currency) => {
    // console.log(currencies);

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
