import { GameObject } from './GameObject.ts'
import { Body, Box, Vec3 } from 'cannon'
import * as THREE from 'three'
import { vector3 } from './vector3.ts'
import { ArrowHelper, Group, InstancedMesh } from 'three'
import { dir, distanceSquared, mean, sphereSurfaceNorm } from './vectorMath.ts'
import { back, front, left, origo, right, up } from './vectors.ts'
import {
  applyLocalYTorque,
  thrustForward,
  thrustToDistance,
  thrustTowards,
  applyTorqueToAlign,
  turnLeft,
  turnRight,
  turnTowards,
} from './forces.ts'
import { min } from './arrays.ts'
import {
  downDir,
  frontDir,
  isToLeft,
  torqueToAlign,
  torqueTowards,
  upDir,
} from './bodyVectorMath.ts'
import { cube } from './scalarMath.ts'
import { Game } from './Game.ts'

export const createDrone = (
  position: Vec3,
  mesh: Group,
  game: Game,
): GameObject => {
  const scale = 0.5
  const shapeBody = new Box(new Vec3(0.3, 0.5, 1.5).scale(scale))
  const shapeWings = new Box(new Vec3(2.4, 0.3, 0.9).scale(scale))
  const mass = cube(scale)
  const body = new Body({
    mass,
    linearDamping: 0.9,
    angularDamping: 0.95,
    position,
    // collisionFilterMask: 0,
  })
  const bodyOffset = new Vec3(0, 0, 0.8).scale(scale)
  const wingOffset = new Vec3(0, 0, 0)
  body.addShape(shapeBody, bodyOffset)
  body.addShape(shapeWings, wingOffset)

  const bodyGeometry = new THREE.BoxGeometry(
    shapeBody.halfExtents.x * 2,
    shapeBody.halfExtents.y * 2,
    shapeBody.halfExtents.z * 2,
  )
  const wingGeometry = new THREE.BoxGeometry(
    shapeWings.halfExtents.x * 2,
    shapeWings.halfExtents.y * 2,
    shapeWings.halfExtents.z * 2,
  )
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
  })

  const bodyMesh = new THREE.Mesh(bodyGeometry, material)
  bodyMesh.position.copy(vector3(bodyOffset))
  const wingMesh = new THREE.Mesh(wingGeometry, material)
  wingMesh.position.copy(vector3(wingOffset))

  const debugMeshGroup = new Group()
  debugMeshGroup.add(bodyMesh, wingMesh)

  const engineBackwardStrength = 25
  const maxThrust = 10 * mass
  const engineBoostStrength = 75
  const maxTorque = 5 * mass
  const safeDistance = 3
  const neighborDistance = 5

  const arrowHelper = new ArrowHelper()
  arrowHelper.setLength(5)

  const meshGroup = new Group()

  const group = new Group()
  group.position.set(0 * scale, -0.5 * scale, 0 * scale)
  group.scale.multiplyScalar(scale)
  group.add(mesh.clone())
  meshGroup.add(group)

  return {
    body,
    gravitational: true,
    // mesh: meshGroup,
    instancedMesh: 'spaceship',
    // debugMesh: debugMeshGroup,
    // arrowHelper,
    indices: {
      enemies: true,
    },
    update: (index) => {
      const sphereNorm = sphereSurfaceNorm(origo, body.position)
      applyTorqueToAlign(body, sphereNorm)

      const closestPlayer = index.players[0]
      const neighbors = index.enemies.filter(
        (enemy) =>
          distanceSquared(enemy.body.position, body.position) <
          neighborDistance * neighborDistance,
      )

      const averageHeading = mean(
        neighbors.map((neighbor) => frontDir(neighbor.body)),
      )

      const averagePosition = mean(
        neighbors.map((neighbor) => neighbor.body.position),
      )
      const safePosition = averagePosition?.vadd(
        dir(averagePosition, body.position).scale(safeDistance),
      )
      const safeTargetDir = safePosition
        ? dir(body.position, safePosition)
        : undefined
      const playerTargetDir = dir(body.position, closestPlayer.body.position)

      const meanDir =
        mean([
          playerTargetDir,
          safeTargetDir ?? origo,
          averageHeading ?? origo,
        ]) ?? playerTargetDir
      applyLocalYTorque(body, torqueToAlign(body, meanDir))
      thrustForward(body, maxThrust)
    },
  }
}
