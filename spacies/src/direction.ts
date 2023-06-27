import { Body } from "matter-js";

export const direction = (body: Body) => ({
  x: Math.cos(body.angle),
  y: Math.sin(body.angle),
})
