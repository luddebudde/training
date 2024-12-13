import { points } from "./main";

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

export const currencies = [IronMark];
export const allCurrencies = [IronMark, Cryptalon];
