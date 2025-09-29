import { bankAccount, modifiers, currencies } from "./bank";

const stockSell = (amount, currency) => {
  if (currency.owned >= amount) {
    const oldBankValue = bankAccount.value;
    const moneyEarn = Math.round(
      currency.currentValue * amount * modifiers.taxes
    );

    bankAccount.value += moneyEarn;
    currency.totalEarned = (currency.totalEarned || 0) + moneyEarn;
    currency.owned -= amount;

    console.log(`Sold! For a profit of ${moneyEarn}$!`);
  } else {
    console.log("Not enough stocks to sell.");
  }
};
const stockBuy = (amount, currency) => {
  if (amount <= 0) {
    console.log("Invalid amount. You must buy at least 1 stock.");
    return;
  }

  const cost = Math.round(currency.currentValue * amount);
  if (bankAccount.value >= cost) {
    bankAccount.value -= cost;
    currency.owned = (currency.owned || 0) + amount;
    currency.totalSpent = (currency.totalSpent || 0) + cost;

    console.log(`Bought ${amount} ${currency.name || "stocks"} for ${cost}$.`);
  } else {
    console.log("Not enough funds to buy stocks!");
  }
};

// Funktion för att skapa en knapp
const createButton = (text, onClick, styles = {}) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.onclick = onClick;
  Object.assign(button.style, styles);
  return button;
};
// Funktion för att skapa en rad
const createRow = (currency, action) => {
  const rowDiv = document.createElement("div");
  rowDiv.style.display = "flex";
  rowDiv.style.marginBottom = "10px";
  rowDiv.style.alignItems = "center"; // Justera vertikalt

  // Valutainformation
  const currencyInfo = document.createElement("span");
  currencyInfo.textContent = `${currency.htmlId} (${Math.round(
    currency.currentValue
  )}$)`;
  currencyInfo.style.marginRight = "10px";
  currencyInfo.style.width = "150px"; // Fixa bredd för tydlighet

  // Lägg till valuta-info först
  rowDiv.appendChild(currencyInfo);

  // Resten av UI-komponenterna (input och knappar)
  const input = document.createElement("input");
  input.type = "number";
  input.placeholder = `Enter amount (${action})`;
  input.style.width = "75px";
  input.style.marginRight = "5px";

  const confirmButton = createButton(
    action === "sell" ? "Sell" : "Buy",
    () => {
      const amount = parseInt(input.value) || 0;
      if (action === "sell") stockSell(amount, currency);
      else stockBuy(amount, currency);
    },
    { width: "75px", marginRight: "10px" }
  );

  rowDiv.appendChild(input);
  rowDiv.appendChild(confirmButton);

  const maxAmount =
    action === "sell"
      ? currency.owned
      : Math.floor(bankAccount.value / currency.currentValue);

  // console.log(Math.floor(bankAccount.value / currency.currentValue));

  ["1x", `MAX ${maxAmount}`].forEach((label, index) => {
    const button = createButton(
      label,
      () => {
        const amount = index === 0 ? 1 : maxAmount;
        if (action === "sell") stockSell(amount, currency);
        else stockBuy(amount, currency);
      },
      { width: "75px", margin: "2px" }
    );
    rowDiv.appendChild(button);
  });

  return rowDiv;
};

export const updateUI = (currencies) => {
  const buyDiv = document.getElementById("buyStock");
  buyDiv.innerHTML = ""; // Rensa tidigare innehåll

  currencies.forEach((currency) => {
    const sellRow = createRow(currency, "sell");
    const buyRow = createRow(currency, "buy");
    buyDiv.appendChild(sellRow);
    buyDiv.appendChild(buyRow);
  });
};

// Uppdatera gränssnittet
updateUI(currencies);
