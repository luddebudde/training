export const drawRotatedImage = (
  ctx,
  image,
  x,
  y,
  width,
  height,
  angleInDegrees
) => {
  ctx.save(); // Spara den nuvarande duken
  ctx.translate(x, y); // Flytta duken till bildens position
  ctx.rotate(angleInDegrees); // Rotera duken till den önskade vinkeln i radianer
  ctx.drawImage(image, -width / 2, -height / 2, width, height); // Rita bilden med centrum vid (x, y)
  ctx.restore(); // Återställ den tidigare duken
};

export const drawImageBetweenPoints = (
  ctx,
  img,
  point1,
  point2,
  width,
  { imageCountX = 1, imageCountY = 1, frameX = 0, frameY = 0 } = {}
) => {
  // Beräkna vinkeln från point1 till point2
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  const angle = Math.atan2(dy, dx);

  // Beräkna avståndet mellan punkterna
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Beräkna dimensioner för varje frame
  const frameWidth = img.width / imageCountX;
  const frameHeight = img.height / imageCountY;

  ctx.save();

  // Flytta till startpunkt och rotera till vinkeln
  ctx.translate(point1.x, point1.y);
  ctx.rotate(angle);

  // Rita bilden
  ctx.drawImage(
    img,
    frameX * frameWidth, // Start x-position i bild
    frameY * frameHeight, // Start y-position i bild
    frameWidth, // Bredd på frame
    frameHeight, // Höjd på frame
    0, // Canvas x-position (efter rotation)
    -width / 2, // Canvas y-position (efter rotation)
    distance, // Bredd på canvas
    width // Höjd på canvas
  );

  ctx.restore();
};
