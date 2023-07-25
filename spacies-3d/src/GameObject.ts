import { Body } from 'cannon'
import { ArrowHelper, Mesh } from 'three'

export type Indices = 'players' | 'enemies'
export type GameObjectIndex = Record<Indices | 'all', GameObject[]>
export type GameObject = {
  indices?: Partial<Record<Indices, boolean>>
  body: Body
  mesh: Mesh
  debugMesh?: Mesh
  gravitational: boolean
  arrowHelper: ArrowHelper
  update?: (gameObjectIndices: GameObjectIndex) => void
}
