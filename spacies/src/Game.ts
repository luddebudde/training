import { Engine } from 'matter-js'
import { GameObject } from './GameObject.ts'

export type Game = {
  engine: Engine
  gameObjects: GameObject[]
  playerShips: GameObject[]
  comets: GameObject[]
}
