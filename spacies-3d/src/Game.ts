import { InstancedMesh } from 'three'

export type Game = {
  instancedMeshes: Record<'spaceship', InstancedMesh>
}
