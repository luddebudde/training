import * as CANNON from "cannon";
import { back, front, left, origo, right } from "./vectors.ts";
import {
  forwardProjectDir,
  frontDir,
  torqueTowards,
} from "./bodyVectorMath.ts";
import { dir, distance } from "./vectorMath.ts";
import { RigidBody } from "@dimforge/rapier3d";
import { Vec3, Vec4, rotate, up, vec4, vecXy, vecXyz } from "./vec.ts";

export const torqueToAlign = (rotation: Vec4, alignWith: Vec3) => {
  const upDir = new CANNON.Vec3(...rotate(up, rotation));
  const deltaQuat = new CANNON.Quaternion();
  deltaQuat.setFromVectors(new CANNON.Vec3(...alignWith), upDir);

  const [axis, angle] = deltaQuat.toAxisAngle();
  axis.normalize();
  return axis.scale(-angle);

  // body.addTorque(a, true);
};
