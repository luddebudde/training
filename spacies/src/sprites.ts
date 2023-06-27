
type Sprite = {
  texture: string,
  height: number,
  width: number,
}

export const sprites: Record<string, Sprite> = {
  pingPongBall: {
    texture: '/ping-pong-ball.png',
    height: 800,
    width: 800,
  },
  asteroid: {
    texture: '/space-objects/12.png',
    height: 512,
    width: 512,
  },
  ammoBox: {
    texture: '/space-objects/8.png',
    height: 512,
    width: 512,
  },
  fighterWithoutJet: (color) => ({
    texture: `/ships/player/large/${color}.png`,
    width: 844,
    height: 890,
  }),
  playerCannon: (color) => ({
    texture: `/ships/player/large/${color}-cannon.png`,
    width: 125,
    height: 125,
  }),
  fighterWithJet: (color) => ({
    texture: `/ships/player/large/${color}-jet.png`,
    width: 844,
    height: 890,
  }),
  assault: {
    texture: `/ships/player/large/assault.png`,
    width: 304,
    height: 336,
  },
  enemy: {
    texture: '/enemy.png',
    height: 338,
    width: 392,
  },
  bomber: {
    texture: '/ships/enemies/kamikaze.png',
    width: 275,
    height: 282,
  },
  missile: {
    texture: '/ships/enemies2/missile.png',
    width: 106,
    height: 145,
  },
  b2: {
    texture: '/ships/enemies/b2.png',
    width: 372,
    height: 225,
  },
  coward: {
    texture: '/ships/enemies/coward.png',
    width: 548,
    height: 754,
  },
  bullet: {
    texture: '/laser-sprites/16.png',
    height: 254,
    width: 141,
  },
  eBullet: {
    texture: '/laser-sprites/02.png',
    height: 127,
    width: 123,
  },
  miniBullet: {
    texture: '/laser-sprites/09.png',
    height: 123,
    width: 119,
  },
}
