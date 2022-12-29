import { applyTorque } from "./applyTorque"

export const applySpringTorque = (body) => {
    const torque = 0.5 * body.angle
    applyTorque(body, torque)
  }