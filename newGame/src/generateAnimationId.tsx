let uniqueIdCounter = 0;

export const generateUniqueId = () => {
  uniqueIdCounter++;
  // const newCounter = structuredClone(uniqueIdCounter);
  return `entity-${uniqueIdCounter}`;
};
