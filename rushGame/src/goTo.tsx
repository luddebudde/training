import { makeDirection } from "./geometry/makeDirection";
import { calculateFPS } from "./main";
import {
  div,
  divVar,
  mult,
  multVar,
  origo,
  sub,
  useMathFunction,
  Vec2,
} from "./math";

export const goTo = (entity, target: Vec2, time, whenDone = () => {}) => {
  const newEntityPos = entity.pos !== undefined ? entity.pos : entity;

  const diff = {
    x: newEntityPos.x - target.x,
    y: newEntityPos.y - target.y,
  };
  const dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
  const direction = {
    x: -diff.x / dist,
    y: -diff.y / dist,
  };
  const newSpeed = dist / time;

  entity.vel = multVar(direction, newSpeed);

  const interval = setInterval(() => {
    if (
      Math.round(newEntityPos.x / 10) === Math.round(target.x / 10) &&
      Math.round(newEntityPos.y / 10) === Math.round(target.y / 10)
    ) {
      clearInterval(interval);
      entity.vel = origo;
      console.log("Målet nått!");
      whenDone();
    }
  }, 16);
};

// export const goTo = (entity, target: Vec2, time, whenDone = () => {}) => {
//   const newEntityPos = entity.pos !== undefined ? entity.pos : entity;

//   const startPos = { ...newEntityPos }; // spara startposition
//   const diff = {
//     x: target.x - startPos.x,
//     y: target.y - startPos.y,
//   };
//   const dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
//   const direction = {
//     x: diff.x / dist,
//     y: diff.y / dist,
//   };
//   const newSpeed = dist / time;

//   entity.vel = multVar(direction, newSpeed);

//   const interval = setInterval(() => {
//     const dx = newEntityPos.x - startPos.x;
//     const dy = newEntityPos.y - startPos.y;

//     // Projektion: hur långt entity har kommit i rörelseriktningen
//     const traveled = dx * direction.x + dy * direction.y;

//     if (traveled + 10 >= dist) {
//       clearInterval(interval);
//       entity.vel = origo;
//       newEntityPos.x = target.x;
//       newEntityPos.y = target.y;
//       console.log("Målet nått!");
//       whenDone();
//     }
//   }, 16);
// };
