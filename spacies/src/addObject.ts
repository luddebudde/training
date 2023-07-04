import { Composite } from 'matter-js'
import { GameObject } from './GameObject'
import { Game } from './Game.ts'

export const addObject = (game: Game, obj: GameObject) => {
  Composite.add(game.engine.world, obj.worldObjects ?? obj.body)
  game.gameObjects = [...game.gameObjects, obj]
}
