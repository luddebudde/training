import { Body, Quaternion, Vec3 } from 'cannon'
import { back, front, left, origo, right } from './vectors.ts'
import { forwardProjectDir, frontDir, torqueTowards } from './bodyVectorMath.ts'
import { dir, distance } from './vectorMath.ts'

export const applyTorqueToAlign = (body: Body, alignWith: Vec3) => {
  const upDir = body.vectorToWorldFrame(new Vec3(0, 1, 0))
  const deltaQuat = new Quaternion()
  deltaQuat.setFromVectors(alignWith, upDir)

  const [axis, angle] = deltaQuat.toAxisAngle() as [Vec3, number]
  axis.normalize()
  const a = axis.scale(-5 * angle)

  body.torque.copy(a)
}

export const springForce = (
  pos: Vec3,
  to: Vec3,
  springConstant: number,
): Vec3 => to.vsub(pos).scale(springConstant)

export const thrustForward = (body: Body, force: number) => {
  body.applyLocalForce(front.scale(force), origo)
}

export const thrustBackward = (body: Body, force: number) => {
  body.applyLocalForce(back.scale(force), origo)
}
// TODO calculate real torque this is not the real torque
export const turnLeft = (body: Body, torque: number) => {
  applyLocalYTorque(body, -2 * torque)
}
export const turnRight = (body: Body, torque: number) => {
  applyLocalYTorque(body, 2 * torque)
}
export const applyLocalYTorque = (body: Body, torque: number) => {
  body.applyLocalForce(left.scale(0.5 * torque), front)
  body.applyLocalForce(right.scale(0.5 * torque), back)
}

/**
 * Applies greater torque as the angle between the body's direction and the target position increases
 * @param body
 * @param targetPosition
 * @param maxTorque
 */
export const turnTowards = (
  body: Body,
  targetPosition: Vec3,
  maxTorque: number,
) => {
  const torque = maxTorque * torqueTowards(body, targetPosition)
  applyLocalYTorque(body, torque)
}

/**
 * Applies greater forward thrust when the body is angled towards the target
 * @param body
 * @param targetPosition
 * @param maxForce
 */
export const thrustTowards = (
  body: Body,
  targetPosition: Vec3,
  maxForce: number,
) => {
  const force = maxForce * forwardProjectDir(body, targetPosition)
  body.applyLocalForce(front.scale(force), origo)
}

export const thrustToDistance = (
  body: Body,
  targetPosition: Vec3,
  maxForce: number,
  distance: number,
) => {
  const equilibriumPosition = targetPosition.vadd(
    dir(targetPosition, body.position).scale(distance),
  )
  thrustTowards(body, equilibriumPosition, maxForce)
}
