export const closestObject = (array, object) => {
  let previusPosDifference = {
    pos: {
      x: 100000000,
      y: 100000000,
    },
  };
  let closestElement = 0;

  array.forEach((element) => {
    const posDifference = {
      x: object.pos.x - element.pos.x,
      y: object.pos.y - element.pos.y,
    };

    const previusPosDifferenceRoot = {
      x: previusPosDifference.pos.x * previusPosDifference.pos.x,
      y: previusPosDifference.pos.y * previusPosDifference.pos.y,
    };

    const currentPosDifferenceRoot = {
      x: posDifference.x * posDifference.x,
      y: posDifference.y * posDifference.y,
    };

    if (
      previusPosDifferenceRoot.x + previusPosDifferenceRoot.y >
      currentPosDifferenceRoot.x +
        currentPosDifferenceRoot.y -
        element.pullForceBonus
    ) {
      // console.log(currentPosDifferenceRoot);
      closestElement = element;
      previusPosDifference.pos.x = posDifference.x;
      previusPosDifference.pos.y = posDifference.y;
    }
  });
  // console.log(closestElement);
  return closestElement;
};
