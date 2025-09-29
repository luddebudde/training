import { makeDirection } from "./makeDirection.js";

export const getRandomAngle = () => {
  return Math.random() * 360; // Slumpad vinkel mellan 0 och 360 grader
};

// Funktion för att generera slumpat avstånd från cirkelns centrum
export const getRandomDistance = (radius) => {
  return Math.random() * 300; // Slumpat avstånd upp till cirkelns radie
};

export const randomDirection = (player, radius) => {
  const circleRadius = 50;

  const randomAngle = getRandomAngle();
  const randomDistance = getRandomDistance(radius);

  const stopPos = {
    x:
      circleRadius +
      randomDistance * Math.cos((randomAngle * Math.PI) / 180) +
      player.pos.x,
    y:
      circleRadius +
      randomDistance * Math.sin((randomAngle * Math.PI) / 180) +
      player.pos.y,
  };

  return makeDirection(stopPos, player.pos);
};
