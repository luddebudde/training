import { currencies } from "./bank";
import { points } from "./main";

export let eventMult = 1;
export let eventAdd = 0;

let resetEffect = () => {};

const eventIncrease = () => {
  eventMult *= 1.2;

  resetEffect = () => {
    eventMult = 1;
  };
};

const eventDecrease = () => {
  eventMult *= 0.8;

  resetEffect = () => {
    eventMult = 1;
  };
};

const eventIncreaseStability = () => {
  currencies.forEach((currency) => {
    currency.stability += 2;
  });

  resetEffect = () => {
    currencies.forEach((currency) => {
      currency.stability -= 2;
    });
  };
};

const eventLargeIncrease = () => {
  eventMult *= 1.5;

  resetEffect = () => {
    eventMult = 1;
  };
};

const eventLargeDecrease = () => {
  eventMult *= 0.5;

  resetEffect = () => {
    eventMult = 1;
  };
};

const eventDipp = () => {
  currencies.forEach((currency) => {
    currency.currentValue -= 3;
    // points[points.length - 1].y -= 100;
  });

  resetEffect = () => {
    eventMult = 1.1;
  };
};

const eventXLargeIncrease = () => {
  eventMult *= 3;

  resetEffect = () => {
    eventMult = 1;
  };
};

const eventXLargeDecrease = () => {
  eventMult *= 0.01;

  resetEffect = () => {
    eventMult = 1;
  };
};

// 1st Common, 2nd Uncommon, 3rd Rare
const possibleEvents = [
  [eventIncrease, eventDecrease, eventIncreaseStability], // Vanliga event (större chans)
  [eventLargeIncrease, eventLargeDecrease, eventDipp],
  [eventXLargeIncrease, eventXLargeDecrease], // Ovanliga event (mindre chans)
];

// Vikter för varje eventgrupp, där 0 är vanligast och 1 är ovanligast
const eventGroupWeights = [0.7, 0.29, 0.01]; // 70% chans att välja från första gruppen, 30% från andra

// Funktion som väljer ett index baserat på vikterna
const selectWeightedIndex = (weights) => {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const randomValue = Math.random() * totalWeight;
  let cumulativeWeight = 0;

  for (let i = 0; i < weights.length; i++) {
    cumulativeWeight += weights[i];
    if (randomValue <= cumulativeWeight) {
      return i;
    }
  }
};

const eventSelectionCount = {
  eventIncrease: 0,
  eventDecrease: 0,
  eventLargeIncrease: 0,
  eventLargeDecrease: 0,
  eventXLargeIncrease: 0,
  eventXLargeDecrease: 0,
};

export const selectEvent = () => {
  resetEffect();

  const groupIndex = selectWeightedIndex(eventGroupWeights);

  const secondEventIndex = Math.floor(
    Math.random() * possibleEvents[groupIndex].length
  );
  const selectedEvent = possibleEvents[groupIndex][secondEventIndex];

  selectedEvent();
  console.log(selectedEvent);

  if (selectedEvent === eventIncrease) {
    eventSelectionCount.eventIncrease++;
  } else if (selectedEvent === eventDecrease) {
    eventSelectionCount.eventDecrease++;
  } else if (selectedEvent === eventLargeIncrease) {
    eventSelectionCount.eventLargeIncrease++;
  } else if (selectedEvent === eventLargeDecrease) {
    eventSelectionCount.eventLargeDecrease++;
  } else if (selectedEvent === eventXLargeIncrease) {
    eventSelectionCount.eventXLargeIncrease++;
  } else if (selectedEvent === eventXLargeDecrease) {
    eventSelectionCount.eventXLargeDecrease++;
  }
};

export const printEventSelections = () => {
  console.log("Event selections after 100 loops:");
  console.log(`eventIncrease: ${eventSelectionCount.eventIncrease}`);
  console.log(`eventDecrease: ${eventSelectionCount.eventDecrease}`);
  console.log(`eventLargeIncrease: ${eventSelectionCount.eventLargeIncrease}`);
  console.log(`eventLargeDecrease: ${eventSelectionCount.eventLargeDecrease}`);
  console.log(
    `eventXLargeIncrease: ${eventSelectionCount.eventXLargeIncrease}`
  );
  console.log(
    `eventXLargeDecrease: ${eventSelectionCount.eventXLargeDecrease}`
  );
};
