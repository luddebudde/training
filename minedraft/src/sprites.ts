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
} as const
