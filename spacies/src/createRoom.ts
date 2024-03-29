import { Bodies, Composite, IChamferableBodyDefinition } from 'matter-js'

export const createRoom = (
  width: number,
  height: number,
  wallThickness: number,
  options: IChamferableBodyDefinition,
) => {
  const ground = Bodies.rectangle(
    width / 2,
    height,
    width,
    wallThickness,
    options,
  )
  const ceiling = Bodies.rectangle(width / 2, 0, width, wallThickness, options)
  const leftWall = Bodies.rectangle(
    0,
    height / 2,
    wallThickness,
    height,
    options,
  )
  const rightWall = Bodies.rectangle(
    width,
    height / 2,
    wallThickness,
    height,
    options,
  )

  const room = Composite.create()
  Composite.add(room, [ground, ceiling, leftWall, rightWall])

  return room
}
