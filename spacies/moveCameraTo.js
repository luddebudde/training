import {
  Composite,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
  Vector,
} from 'matter-js'
export const moveCameraTo = (pos, render, width, height) => {
  Render.lookAt(render, {
    min: { x: pos.x - width / 2, y: pos.y - height / 2 },
    max: { x: pos.x + width / 2, y: pos.y + height / 2 },
  })
}
