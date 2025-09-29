import { Vector } from 'matter-js'
import { GameObject } from '../GameObject'

export type Weapon = (
  spawnPos: Vector,
  dir: Vector,
  addObject: (obj: GameObject) => void,
) => void
