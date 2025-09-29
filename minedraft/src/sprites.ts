export type Sprite = {
  texture: string
  height: number
  width: number
}

export const sprites = {
  playerRed: {
    texture: 'sprites/red.png',
    height: 656,
    width: 656,
  },
  playerBlue: {
    texture: 'sprites/blue.png',
    height: 665,
    width: 665,
  },
  pickaxeRed: {
    texture: 'sprites/red-wreckingball.png',
    height: 594,
    width: 594,
  },
  pickaxeBlue: {
    texture: 'sprites/blue-wreckingball.png',
    height: 637,
    width: 637,
  },
  grenadeRed: {
    texture: 'sprites/red-grenade.png',
    width: 802,
    height: 638,
  },
  hand: {
    texture: 'sprites/hand.png',
    width: 541,
    height: 734,
  },
} as const
