import { Body, Vec3 } from 'cannon'
import { down, front, up } from './vectors.ts'
import { dir } from './vectorMath.ts'

/**
 * Torque around  local y axis towards `position`
 */
export const torqueTowards = (body: Body, position: Vec3): number =>
  // TODO normalize
  torqueToAlign(body, dir(body.position, position))
/**
 * Torque around local y axis to align with `direction`
 * @param body
 * @param direction
 */
export const torqueToAlign = (body: Body, direction: Vec3): number =>
  // TODO normalize
  direction.cross(frontDir(body)).dot(upDir(body))

export const forwardProjectDir = (body: Body, position: Vec3): number =>
  dir(body.position, position).dot(frontDir(body))

export const isToLeft = (body: Body, position: Vec3): boolean =>
  torqueTowards(body, position) < 0

export const frontDir = (body: Body) => body.vectorToWorldFrame(front)
export const upDir = (body: Body) => body.vectorToWorldFrame(up)
export const downDir = (body: Body) => body.vectorToWorldFrame(down)
