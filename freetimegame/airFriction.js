export const airFriction = (objectXVel, objectYVel, objectAirFriction) => {
  if (objectXVel >= 1) {
    objectXVel = objectXVel / objectAirFriction;
  } else {
    if (objectXVel <= -1) {
      objectXVel = objectXVel / objectAirFriction;
    }
  }
  if (objectYVel >= 1) {
    objectYVel = objectYVel / objectAirFriction;
  } else {
    if (objectYVel <= -1) {
      objectYVel = objectYVel / objectAirFriction;
    }
  }
  const objectVel = {
    x: objectXVel,
    y: objectYVel,
  };
  return objectVel;
};
