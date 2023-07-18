import { Body, Vec3 } from 'cannon'
import { down, front, up } from './vectors.ts'
import { dir } from './vectorMath.ts'

export const rightTorque = (body: Body, position: Vec3): number =>
  dir(body.position, position).cross(frontDir(body)).dot(upDir(body))

export const projectForward = (body: Body, position: Vec3): number =>
  dir(body.position, position).dot(frontDir(body))

export const isToLeft = (body: Body, position: Vec3): boolean =>
  rightTorque(body, position) < 0

export const frontDir = (body: Body) => body.vectorToWorldFrame(front)
export const upDir = (body: Body) => body.vectorToWorldFrame(up)
export const downDir = (body: Body) => body.vectorToWorldFrame(down)
