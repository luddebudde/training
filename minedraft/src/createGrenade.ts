import { Bodies } from 'matter-js'

export const createGrenade = (addGameObject) => {
  const body = Bodies.circle(0, 0, 10, {})

  let isExploded = false
  let timeSinceCreation = 0

  return {
    tag: 'grenade',
    body,

    update: (dt: number) => {
      timeSinceCreation += dt
      if (timeSinceCreation >= 2000 && !isExploded) {
        console.log('GRENADE!')

        const explosionDetector = Bodies.circle(
          body.position.x,
          body.position.y,
          100,
          {
            isSensor: true,
            // isStatic: true,
            render: {
              opacity: 0.5,
            },
          },
        )

        addGameObject({ tag: 'explosion', body: explosionDetector })

        isExploded = true
      }
    },
  }
}
