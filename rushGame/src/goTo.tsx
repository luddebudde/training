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

export const goTo = (entity: any, target: Vec2, time, whenDone = () => {}) => {
  let newEntityPos = entity.pos !== undefined ? entity.pos : entity;

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

  // entity.vel.x = Math.round(entity.vel.x);
  // entity.vel.y = Math.round(entity.vel.y);

  const safetyMargin = 10;

  const interval = setInterval(() => {
    // console.log(
    //   Math.round(newEntityPos.x / safetyMargin) ===
    //     Math.round(target.x / safetyMargin),
    //   Math.round(newEntityPos.y / safetyMargin) ===
    //     Math.round(target.y / safetyMargin),
    //   Math.round(newEntityPos.x / safetyMargin / 10) ===
    //     Math.round(target.x / safetyMargin / 10),
    //   Math.round(newEntityPos.y / safetyMargin / 10) ===
    //     Math.round(target.y / safetyMargin / 10)
    // );
    newEntityPos = entity.pos !== undefined ? entity.pos : entity;
    // console.log(
    //   Math.round(newEntityPos.x / safetyMargin),
    //   Math.round(target.x / safetyMargin),
    //   Math.round(newEntityPos.y / safetyMargin),
    //   Math.round(target.y / safetyMargin),
    //   Math.round(newEntityPos.x / safetyMargin / 10),
    //   Math.round(target.x / safetyMargin / 10),
    //   Math.round(newEntityPos.y / safetyMargin / 10),
    //   Math.round(target.y / safetyMargin / 10)
    // );

    // console.log(entity.pos.x);

    // console.log(newEntityPos);
    if (
      Math.round(newEntityPos.x / safetyMargin) ===
        Math.round(target.x / safetyMargin) &&
      Math.round(newEntityPos.y / safetyMargin) ===
        Math.round(target.y / safetyMargin)
    ) {
      // console.log(newEntityPos, "1");

      clearInterval(interval);
      newEntityPos.x = target.x;
      newEntityPos.y = target.y;
      // console.log(newEntityPos, "2");

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
