export const bankAccount = {
  value: 1000,
};

export const IronMark = {
  htmlId: "ironmark",
  lowestPoint: 50,
  middlePoint: 300,
  strenghtToMiddle: 0.3,
  currentValue: 100,
  stability: 1,
  owned: 0,
  totalSpent: 0,
  averageSpent: 0,
  totalEarned: 0,
};

export const Cryptalon = {
  htmlId: "cryptalon",
  lowestPoint: 5,
  middlePoint: 800,
  strenghtToMiddle: 0.03,
  currentValue: 5,
  stability: 3,
  owned: 0,
  totalSpent: 0,
  averageSpent: 0,
  totalEarned: 0,
};

export const modifiers = {
  taxes: 0.8,
  rent: 0,
};

export const currencies = [IronMark, Cryptalon];

const stockSell = (amount, currency) => {
  console.log();

  if (currency.owned >= amount) {
    const oldBankValue = bankAccount.value;

    const moneyEarn = Math.round(
      currency.currentValue * amount * modifiers.taxes
    );
    bankAccount.value += moneyEarn;
    currency.totalEarned += moneyEarn;

    currency.owned -= amount;

    console.log(`Sold!, for a profit of ${oldBankValue - bankAccount.value}$!`);
  }
};

const stockBuy = (amount, currency) => {
  if (amount <= 0) {
    console.log("Ogiltigt belopp. Du måste köpa minst 1 aktie.");
    return;
  }

  const cost = Math.round(currency.currentValue * amount);

  if (bankAccount.value >= cost) {
    bankAccount.value -= cost;
    currency.owned += amount;
    currency.totalSpent = (currency.totalSpent || 0) + cost;

    console.log(
      `Köpte ${amount} ${currency.name || "aktier"} för ${cost}$. Du har nu ${
        currency.owned
      } totalt.`
    );
  } else {
    console.log("Inte tillräckligt med pengar för att köpa aktier!");
  }
};

let buyDiv = document.getElementById("buyStock");

// Lägg till container för rader
const createRow = (label, currency, action) => {
  const rowDiv = document.createElement("div");
  rowDiv.style.display = "flex";
  rowDiv.style.marginBottom = "10px";

  // Inputfält för valfri mängd
  const input = document.createElement("input");
  input.type = "number";
  input.placeholder = `Ange antal (${action})`;
  input.style.width = "75px";
  input.style.marginRight = "5px";

  // Knapp för att bekräfta mängden
  const confirmButton = document.createElement("button");
  confirmButton.textContent = `${action === "sell" ? "Sälj" : "Köp"}`;
  confirmButton.style.width = "75px";
  confirmButton.style.marginRight = "10px";

  // Klickhändelse för bekräftelseknappen
  confirmButton.onclick = () => {
    const amount = parseInt(input.value) || 0;
    if (action === "sell") {
      stockSell(amount, currency);
    } else if (action === "buy") {
      stockBuy(amount, currency);
    }
    // input.valsdue = ""; // Töm fältet efter handling
  };

  rowDiv.appendChild(input);
  rowDiv.appendChild(confirmButton);

  // Knappar för 1x och MAX
  for (let i = 1; i < 3; i++) {
    const button = document.createElement("button");
    button.textContent =
      i === 1
        ? "1x"
        : `MAX ${Math.floor(bankAccount.value / currency.currentValue)}`;
    button.style.width = "75px";
    button.style.height = "75px";
    button.style.margin = "2px";

    button.onclick = () => {
      const amount =
        i === 1
          ? 1 // För 1x
          : action === "sell"
          ? currency.owned // För MAX (sälj)
          : Math.floor(bankAccount.value / currency.currentValue); // För MAX (köp)

      if (action === "sell") {
        stockSell(amount, currency);
      } else if (action === "buy") {
        stockBuy(amount, currency);
      }
    };

    rowDiv.appendChild(button);
  }

  return rowDiv;
};

// Lägg till knappar till DOM
currencies.forEach((currency) => {
  const sellRow = createRow("Sell", currency, "sell");
  const buyRow = createRow("Buy", currency, "buy");

  buyDiv.appendChild(sellRow);
  buyDiv.appendChild(buyRow);
});
