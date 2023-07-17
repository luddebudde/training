import { Body, Quaternion, Vec3 } from 'cannon'

export const torqueToAlign = (body: Body, alignAxis: Vec3) => {
  const upDir = body.vectorToWorldFrame(new Vec3(0, 1, 0))
  const deltaQuat = new Quaternion()
  deltaQuat.setFromVectors(alignAxis, upDir)

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

// export const spehericalSpring = (pos: Vec3, t)
