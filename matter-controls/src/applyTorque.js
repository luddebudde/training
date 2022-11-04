import {Body, Vector} from "matter-js";
import {down, left, right, up} from "./vectors.js";

export const applyTorque = (body, torque) => {
  Body.applyForce(body, Vector.add(body.position, up), Vector.mult(left, torque))
  Body.applyForce(body, Vector.add(body.position, down), Vector.mult(right, torque))
}

export const applySpringTorque = (body, magnitude = 1) => {
  const torque = magnitude * body.angle
  applyTorque(body, torque)
}