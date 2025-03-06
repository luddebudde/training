export type Vec2 = {
  x: number;
  y: number;
};

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
