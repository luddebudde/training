export type Vec2 = {
  x: number;
  y: number;
};

export const origo = { x: 0, y: 0 };

export const add = (firstVec: Vec2, secondVec: Vec2) => ({
  x: firstVec.x + secondVec.x,
  y: firstVec.y + secondVec.y,
});

export const addVar = (firstVec: Vec2, secondValue: number) => ({
  x: firstVec.x + secondValue,
  y: firstVec.y + secondValue,
});

export const sub = (firstVec: Vec2, secondVec: Vec2) => ({
  x: firstVec.x - secondVec.x,
  y: firstVec.y - secondVec.y,
});

export const mult = (firstVec: Vec2, secondVec: Vec2) => ({
  x: firstVec.x * secondVec.x,
  y: firstVec.y * secondVec.y,
});

export const multVar = (firstVec: Vec2, secondValue: number) => ({
  x: firstVec.x * secondValue,
  y: firstVec.y * secondValue,
});

export const div = (firstVec: Vec2, secondVec: Vec2) => ({
  x: firstVec.x / secondVec.x,
  y: firstVec.y / secondVec.y,
});

export const divVar = (firstVec: Vec2, secondValue: number) => ({
  x: firstVec.x / secondValue,
  y: firstVec.y / secondValue,
});

export const dot = (firstObj: Vec2, secondObj: Vec2) => {
  return firstObj.x * secondObj.x + firstObj.y * secondObj.y;
};

export const maxVec = (firstObj: Vec2, secondObj: Vec2) => {
  return {
    x: Math.max(firstObj.x, secondObj.x),
    y: Math.max(firstObj.y, secondObj.y),
  };
};

export const minVec = (firstObj: Vec2, secondObj: Vec2) => {
  return {
    x: Math.min(firstObj.x, secondObj.x),
    y: Math.min(firstObj.y, secondObj.y),
  };
};

export const useMathFunction = (vec: Vec2, round: () => void) => {
  return { x: Math.round(vec.x), y: Math.round(vec.y) };
};

export const normalize = (vector) => {
  const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  if (length === 0) return { x: 0, y: 0 }; // Undvik division med 0
  return { x: vector.x / length, y: vector.y / length };
};

export const randomNumber = (minValue: number, maxValue: number) => {
  return Math.random() * (maxValue - minValue) + minValue;
};

export const randomNumberMargin = (standardValue: number, margin: number) => {
  return standardValue + (Math.random() * 2 - 1) * margin;
};
