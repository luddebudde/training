export const vector = {
  eachOther: {
    add: (firstObj, secondObj) => {
      const finalObj = {
        x: firstObj.x + secondObj.x,
        y: firstObj.y + secondObj.y,
      };
      return finalObj;
    },
    sub: (firstObj, secondObj) => {
      const finalObj = {
        x: firstObj.x - secondObj.x,
        y: firstObj.y - secondObj.y,
      };
      return finalObj;
    },
    mult: (firstObj, secondObj) => {
      const finalObj = {
        x: firstObj.x * secondObj.x,
        y: firstObj.y * secondObj.y,
      };

      return finalObj;
    },
  },
  alone: {
    neg: (firstObj) => {
      return {
        x: -firstObj.x,
        y: -firstObj.y,
      };
    },
    add: (firstObj, amount) => {
      const finalObj = {
        x: firstObj.x + amount,
        y: firstObj.y + amount,
      };
      return finalObj;
    },
    sub: (firstObj, amount) => {
      const finalObj = {
        x: firstObj.x - amount,
        y: firstObj.y - amount,
      };
      return finalObj;
    },
    mult: (firstObj, amount) => {
      const finalObj = {
        x: firstObj.x * amount,
        y: firstObj.y * amount,
      };
      return finalObj;
    },
    div: (firstObj, amount) => {
      const finalObj = {
        x: firstObj.x / amount,
        y: firstObj.y / amount,
      };

      return finalObj;
    },
  },
};
