import Matter, { Bodies, Body, Vector } from 'matter-js'

type HollowCircleOptions = {
  width: number
  extraLength: number
  initialRotation: number
  otherOptions: Matter.IBodyDefinition
  render: Matter.IBodyRenderOptions | undefined
}

/**
 * Creates a polygon that can contain other objects by putting together
 * rectangles for each edge of the polygon.
 *
 * @param x: the center of the polygon
 * @param y: the center of the polygon
 * @param sides: the number of sides of the polygon
 * @param radius: the radius of the circumscribing circle
 * @param options: a set of properties applied to each edge of the polygon.
 * There are a few special options:
 *  'extraLength': The factor to increase the length of each rectangle by to
 *  avoid inner and outer gaps. Typically around 1.15.
 *  'width': the width of each rectangluar side. If this is too small, the
 *  matter-js engine will require a smaller interval to prevent objects from
 *  being pushed in / out of teh object.
 *  'initialRotation': The initital rotation to be applied to the shape.
 */
export const hollowCircle = (
  position: Vector,
  sides: number,
  radius: number,
  options: HollowCircleOptions,
) => {
  const {
    width = 20,
    extraLength = 1.15,
    initialRotation = 0,
    ...otherOptions
  } = options ?? {}

  const theta = (2 * Math.PI) / sides
  const sideLength = ((2 * radius * theta) / 2) * extraLength

  const parts = []
  for (let i = 0; i < sides; i++) {
    // We'll build thin sides and then translate + rotate them appropriately.
    const body = Bodies.rectangle(0, 0, sideLength, width, {
      render: otherOptions.render,
    })
    Body.rotate(body, i * theta)
    Body.translate(body, {
      x: radius * Math.sin(i * theta),
      y: -radius * Math.cos(i * theta),
    })
    parts.push(body)
  }
  const ret = Body.create(otherOptions)
  Body.setParts(ret, parts)
  if (initialRotation) {
    Body.rotate(ret, initialRotation)
  }
  Body.translate(ret, position)

  return ret
}
