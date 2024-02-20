export const getNextElement = (array, index) => {
  //   const currentElement = array[index];

  const listIndex = (index + 1) % array.length;

  const nextElement = array[listIndex];
  //   console.log(index);
  return nextElement;
};
