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
