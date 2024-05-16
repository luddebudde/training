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
