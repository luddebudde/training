export const getNextElement = (array, index) => {
  const listIndex = (index + 1) % array.length;
  const nextElement = array[listIndex];

  return nextElement;
};
