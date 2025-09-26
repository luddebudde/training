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

type KeyHandler = (code: string) => void;

export const onKeyRelease = (handler: KeyHandler) => {
  const keyUpHandler = (event: KeyboardEvent) => {
    handler(event.code);
  };

  document.addEventListener("keyup", keyUpHandler);

  return () => {
    document.removeEventListener("keyup", keyUpHandler);
  };
};
