export const loadImage = (file) =>
  new Promise((resolve, _reject) => {
    const img = new Image();
    img.onload = function () {
      resolve(img);
    };
    img.src = file;
  });
