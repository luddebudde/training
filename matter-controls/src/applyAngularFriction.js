import { applyTorque } from "./applyTorque"

export const applyAngularFriction = (body, amplitude) => {
  applyTorque(body, amplitude * body.angularVelocity)
}