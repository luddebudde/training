import { Vec3 } from 'cannon'
import { Vector3 } from 'three'

export const vector3 = (vec: Vec3): Vector3 => new Vector3(vec.x, vec.y, vec.z)
export const vec3 = (vec: Vector3): Vec3 => new Vec3(vec.x, vec.y, vec.z)
