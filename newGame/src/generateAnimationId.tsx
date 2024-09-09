let uniqueIdCounter = 0;

export const generateUniqueId = () => {
  uniqueIdCounter++;
  return `entity-${uniqueIdCounter}`;
};
