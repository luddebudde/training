export const standardMap = {
  texture: "rocks",
  description: "If the world was a rock",
  info: {
    waves: "15",
    difficulty: "3",
    background: "LOL IDK",
  },
};

export const hardMap = {
  texture: "castle",
  description: "MY EMPIRE!",
  info: {
    waves: "150",
    difficulty: "H̶̛̙͉͑̓̐̚ą̸̥̟̱͇͈̙͙̾̔͝ṛ̵̡̡̩̖̠̖̺̻̳̃͗̒͐͛̇͐̆̒̋͆̚̚͜ͅd̷͎̻̹̲͔͋͛͗̔̈́̂̅̊̕͘͝͝͝",
    background: "LOL IDK",
  },
};

export const maps = [standardMap, hardMap];

export let currentMap = standardMap;

export const changeCurrentMap = (map) => {
  currentMap = map;
};

export const drawBackground = (ctx, player, world, backgrounds) => {
  // Beräkna bakgrundens förskjutning baserat på spelarens position
  const offsetX = -player.pos.x + world.width / 2;
  const offsetY = -player.pos.y + world.height / 2;

  // Få bakgrundsbilden
  const background = backgrounds[currentMap.texture];

  // Bakgrundsbildens dimensioner
  const bgWidth = background.width;
  const bgHeight = background.height;

  const scaledBgWidth = bgWidth * 2;
  const scaledBgHeight = bgHeight * 2;

  // Beräkna var den övre vänstra hörnet av bakgrundsrutnätet ska börja
  const startX = (offsetX % bgWidth) - bgWidth;
  const startY = (offsetY % bgHeight) - bgHeight;

  // Rita 3x3-rutnätet av bakgrundsbilder

  for (let x = startX; x < world.width; x += bgWidth) {
    for (let y = startY; y < world.height; y += bgHeight) {
      ctx.drawImage(background, x, y, scaledBgWidth, scaledBgHeight);
    }
  }

  // for (let x = startX; x < world.width; x += scaledBgWidth) {
  //   for (let y = startY; y < world.height; y += scaledBgHeight) {
  //     ctx.drawImage(background, x, y, scaledBgWidth, scaledBgHeight);
  //   }
  // }
};
