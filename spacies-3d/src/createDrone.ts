import { GameObject } from './GameObject.ts'
import { Body, Box, Vec3 } from 'cannon'
import * as THREE from 'three'
import { vector3 } from './vector3.ts'
import { ArrowHelper, Group } from 'three'
import { sphereSurfaceNorm } from './vectorMath.ts'
import { front, origo, up } from './vectors.ts'
import {
  applyTorque,
  thrustForward,
  thrustTowards,
  torqueToAlign,
  turnLeft,
  turnRight,
  turnTowards,
} from './forces.ts'
import { min } from './arrays.ts'
import { downDir, isToLeft, rightTorque, upDir } from './bodyVectorMath.ts'

export const createDrone = (position: Vec3, mesh: Group): GameObject => {
  const shapeBody = new Box(new Vec3(0.3, 0.5, 1.5))
  const shapeWings = new Box(new Vec3(2.4, 0.3, 0.9))
  const body = new Body({
    mass: 1,
    linearDamping: 0.9,
    angularDamping: 0.95,
    position,
  })
  const bodyOffset = new Vec3(0, 0, 1)
  body.addShape(shapeBody, bodyOffset)
  body.addShape(shapeWings)

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
    color: 0xff0000,
    wireframe: true,
  })

  const bodyMesh = new THREE.Mesh(bodyGeometry, material)
  const wingMesh = new THREE.Mesh(wingGeometry, material)
  bodyMesh.position.copy(vector3(bodyOffset))

  const meshGroup = new Group()
  meshGroup.add(bodyMesh, wingMesh)

  const engineBackwardStrength = 25
  const maxThrust = 20
  const engineBoostStrength = 75
  const maxTorque = 5

  const arrowHelper = new ArrowHelper()
  arrowHelper.setLength(5)

  return {
    body,
    gravitational: true,
    mesh,
    // debugMesh: meshGroup,
    arrowHelper,
    // shoot: throttle(
    //   1000,
    //   () => {
    //     const cannonImpulse = body.vectorToWorldFrame(new Vec3(5, 20, 30))
    //     cannonImpulse.normalize()
    //     cannonImpulse.scale(10, cannonImpulse)
    //
    //     const cannonBall = createCannonBall()
    //     cannonBall.body.position.copy(body.position)
    //     cannonBall.body.applyImpulse(cannonImpulse, cannonBall.body.position)
    //     addGameObject(cannonBall)
    //     body.applyImpulse(cannonImpulse.negate(), body.position)
    //   },
    //   {
    //     noTrailing: true,
    //   },
    // ),
    update: (gameQueries) => {
      const sphereNorm = sphereSurfaceNorm(origo, body.position)
      torqueToAlign(body, sphereNorm)

      const closestPlayer = min(gameQueries.getPlayers(), (player) =>
        player.body.position.vsub(body.position).norm2(),
      )
      // arrowHelper.setDirection(vector3(forwardDir))
      // console.log(dirToPlayer.cross(body.vectorToWorldFrame(front)).norm2())

      turnTowards(body, closestPlayer.body.position, maxTorque)
      // arrowHelper.setDirection(upDir(body))
      // arrowHelper.setLength(torque)

      thrustTowards(body, closestPlayer.body.position, maxThrust)
    },
  }
}
