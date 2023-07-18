import { Vec3 } from 'cannon'

export const projectOnVector = (a: Vec3, b: Vec3): Vec3 =>
  b.clone().scale(a.dot(b) / b.dot(b))

export const projectOnSurface = (vec: Vec3, surfaceNorm: Vec3): Vec3 => {
  return vec.vsub(projectOnVector(vec, surfaceNorm))
}

export const sphereSurfaceNorm = (center: Vec3, position: Vec3) => {
  const norm = position.vsub(center)
  norm.normalize()
  return norm
}

export const closestDirectionOnSphere = (
  center: Vec3,
  from: Vec3,
  to: Vec3,
): Vec3 => {
  const diff = to.vsub(from)
  const dir = projectOnSurface(diff, sphereSurfaceNorm(center, from))
  dir.normalize()
  return dir
}

export const dir = (from: Vec3, to: Vec3): Vec3 => {
  const r = to.vsub(from)
  r.normalize()
  return r
}
