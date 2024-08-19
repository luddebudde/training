export const playAnimation = (
  picture: string,
  parts: number,
  frameRate: number,
  containerId: string
) => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Element with id ${containerId} not found.`);
    return;
  }

  // Skapa ett nytt img-element
  const spriteImage = document.createElement("img");
  spriteImage.src = picture;
  spriteImage.style.position = "absolute";
  container.appendChild(spriteImage);

  let currentFrame = 0;
  const frameWidth = spriteImage.width / parts;

  const animate = () => {
    // Beräkna den del av bilden som ska visas
    const offsetX = -currentFrame * frameWidth;
    spriteImage.style.transform = `translateX(${offsetX}px)`;

    currentFrame = (currentFrame + 1) % parts; // Gå till nästa frame, loopar runt

    // Kör nästa frame efter en viss tid baserat på frameRate
    setTimeout(animate, 1000 / frameRate);
  };

  // Kör animationen
  spriteImage.onload = () => {
    animate();
  };
};
