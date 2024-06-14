// export const closestObject = (array, object) => {
//   let previusPosDifference = {
//     pos: {
//       x: 100000000,
//       y: 100000000,
//     },
//   };
//   let closestElement = 0;

//   array.forEach((element) => {
//     const posDifference = {
//       x: object.pos.x - element.pos.x,
//       y: object.pos.y - element.pos.y,
//     };

//     const previusPosDifferenceRoot = {
//       x: previusPosDifference.pos.x * previusPosDifference.pos.x,
//       y: previusPosDifference.pos.y * previusPosDifference.pos.y,
//     };

//     const currentPosDifferenceRoot = {
//       x: posDifference.x * posDifference.x,
//       y: posDifference.y * posDifference.y,
//     };

//     if (
//       previusPosDifferenceRoot.x + previusPosDifferenceRoot.y >
//       currentPosDifferenceRoot.x +
//         currentPosDifferenceRoot.y -
//         element.pullForceBonus
//     ) {
//       console.log(previusPosDifference.pos);
//       closestElement = element;
//       previusPosDifference.pos.x = posDifference.x;
//       previusPosDifference.pos.y = posDifference.y;
//     }
//   });

//   return closestElement;
// };

export const closestObject = (array, object) => {
  if (!array.length) {
    return "hej"; // Returnera null om arrayen är tom
  }

  let closestElement = null;
  let closestDistance = Infinity;

  array.forEach((element) => {
    const dx = object.pos.x - element.pos.x;
    const dy = object.pos.y - element.pos.y;
    const distanceSquared = dx * dx + dy * dy - (element.pullForceBonus || 0);

    if (distanceSquared < closestDistance) {
      closestDistance = distanceSquared;
      closestElement = element;
    }
  });

  return closestElement;
};
