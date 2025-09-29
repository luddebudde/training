import { Render, Vector } from 'matter-js'
export const moveCameraTo = (
  pos: Vector,
  render: Render,
  width: number,
  height: number,
) => {
  Render.lookAt(render, {
    min: { x: pos.x - width / 2, y: pos.y - height / 2 },
    max: { x: pos.x + width / 2, y: pos.y + height / 2 },
  })
}
