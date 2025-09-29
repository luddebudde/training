import { GameObject } from './GameObject.ts'
import { OrthographicCamera } from 'three'

export type Player = GameObject & {
  thrustForward: () => void
  thrustBackward: () => void
  turnLeft: () => void
  turnRight: () => void
  shoot: () => void
  camera: OrthographicCamera
}
