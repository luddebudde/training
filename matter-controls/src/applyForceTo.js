import { Body, Vector } from "matter-js";

export const applyForceTo = (body, direction) => Body.applyForce(body, body.position, Vector.mult(direction, 0.1))
