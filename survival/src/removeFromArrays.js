import { allArrays } from "./main.js";

export const removeFromArrays = (object) => {
  allArrays.forEach((array) => {
    if (array.includes(object)) {
      const index = array.indexOf(object);
      if (index !== -1) {
        array.splice(index, 1);
      }
    }
  });
};
