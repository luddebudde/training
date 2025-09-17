export const randomArrayElement = (array): Element => {
  return array[Math.floor(Math.random() * array.length)];
};

export const randomArrayElementSplice = (array) => {
  const index = Math.floor(Math.random() * array.length);
  const chosenElement = array[index];

  array.splice(index, 1);
  return chosenElement;
};
