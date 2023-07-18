import { Body } from 'cannon'
import { ArrowHelper, Mesh } from 'three'
import { GameQueries } from './gameQueries.ts'

export type GameObject = {
  body: Body
  mesh: Mesh
  debugMesh?: Mesh
  gravitational: boolean
  arrowHelper: ArrowHelper
  update?: (gameQueries: GameQueries) => void
}
