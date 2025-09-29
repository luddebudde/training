export const keyDownTracker = () => {
  const keysDown = new Set();

  document.addEventListener("keydown", (event) => {
    if (!event.repeat) {
      keysDown.add(event.code);
    }
  });

  document.addEventListener("keyup", (event) => {
    keysDown.delete(event.code);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      keysDown.clear();
    }
  });

  return (keyCode) => keysDown.has(keyCode);
};

export const oneTimeKeyPress = () => {
  const keysPressed = new Set();

  const keyDownHandler = (event) => {
    if (!keysPressed.has(event.code)) {
      keysPressed.add(event.code);
      // Lägg till din logik här för när knappen trycks ned första gången
      console.log(`${event.code} pressed for the first time.`);
    }
  };

  const keyUpHandler = (event) => {
    keysPressed.delete(event.code);
  };

  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);

  return () => {
    document.removeEventListener("keydown", keyDownHandler);
    document.removeEventListener("keyup", keyUpHandler);
  };
};
