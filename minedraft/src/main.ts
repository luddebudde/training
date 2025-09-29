// create an engine
import {
  Bodies,
  Body,
  Collision,
  Composite,
  Engine,
  Events,
  IEventCollision,
  IRendererOptions,
  Pair,
  Render,
  Vector,
  World,
} from 'matter-js'
import { keyDownTracker } from './keyDownTracker.ts'
import {
  addMat,
  left,
  mapMat,
  projectOnVector,
  random,
  right,
  scale,
  scaleMat,
  up,
  zeros,
} from './math'
import { moveCameraTo } from './moveCameraTo.ts'
import { Sprite, sprites } from './sprites.ts'
import { drawHealthBar } from './drawHealthBar.ts'
import { canvasCoordinate } from './canvasCoordinate.ts'
import { perlin } from './math/perlin.ts'
import { rgb } from './color.ts'
import { createPlayer } from './createPlayer.ts'
import { applyImpulse2 } from './physics/applyForce.ts'
import { loadImage } from './image.ts'
import { animation } from './animation.ts'
import { drawArrow } from './drawArrow.ts'
import { assets } from './assets.ts'

const engine = Engine.create({
  gravity: {
    scale: 0.002,
  },
})

const canvas1 = document.createElement('canvas')
// canvas1.style.backgroundImage = 'url(/sprites/sky.jpg)'
// 'url(/sprites/sky.jpg)'

const canvas2 = document.createElement('canvas')

const appEl = document.getElementById('app')
if (!appEl) {
  throw new Error(
    'please, the html is missing an element #app. You can do better :(',
  )
}
appEl.appendChild(canvas1)
appEl.appendChild(canvas2)

const canvas1Width = canvas1.getBoundingClientRect().width
const canvas1Height = canvas1.getBoundingClientRect().height
const canvas2Width = canvas2.getBoundingClientRect().width
const canvas2Height = canvas2.getBoundingClientRect().height

const renderOptions: IRendererOptions = {
  width: canvas1Width,
  height: canvas1Height,
  showAngleIndicator: false,
  wireframes: false,
  showVelocity: false,
  showDebug: true,
  showCollisions: false,
  background: 'url(/sprites/sky.jpg)',
}

// create a renderer
const render1 = Render.create({
  canvas: canvas1,
  engine: engine,
  options: renderOptions,
})
const render2 = Render.create({
  canvas: canvas2,
  engine: engine,
  options: renderOptions,
})

// canvas1.style.backgroundSize = 'cover'

export const matterJsSprite = (radius: number, sprite: Sprite) => {
  return {
    texture: sprite.texture,
    xScale: (2 * radius) / sprite.width,
    yScale: (2 * radius) / sprite.height,
  }
}

const players = []
const gameObjects = []

const addGameObject = (obj: GameObject) => {
  Composite.add(engine.world, obj.body)
  gameObjects.push(obj)
  if (obj.tag === 'player') {
    players.push(obj)
  }
}

const player1 = createPlayer(
  sprites.playerBlue,
  sprites.pickaxeBlue,
  addGameObject,
)
const player2 = createPlayer(
  sprites.playerRed,
  sprites.pickaxeRed,
  addGameObject,
)

const canvases = [
  [render1, player1],
  [render2, player2],
] as const

const hvRatio = 2 / 1

const boxSize = 40
const horizontalBoxes = 100
const verticalBoxes = hvRatio * horizontalBoxes

const worldWidth = boxSize * horizontalBoxes
const worldHeight = boxSize * verticalBoxes

// 1. [[0, 0,0 ], [0,0,0], [0,0,0]]
// 2. [[[0,0], [0,1], [0, 2]], [[1,0], [1,1], [1, 2]]]
// 2. [[0,0], [0,1], [0, 2], [1,0], [1,1], [1, 2]] // flat
// 2. [Vector.create(), [0,1], [0, 2], [1,0], [1,1], [1, 2]] // flat

const p1 = perlin(horizontalBoxes, verticalBoxes, 6, hvRatio * 6)
const p2 = perlin(horizontalBoxes, verticalBoxes, 8, hvRatio * 8)
const p3 = perlin(horizontalBoxes, verticalBoxes, 16, hvRatio * 16)

const rockness = perlin(horizontalBoxes, verticalBoxes, 2, hvRatio * 2)
const rockEarthRatio = 0.14

const isWinter = Math.random() * 2 < 1

const worldYOffset = 500
const platform = zeros(10).map(
  (_, index) =>
    [
      1,
      'rubber',
      Vector.create(index * boxSize - boxSize * 5, boxSize * 25),
    ] as const,
)

const a1 = 4
const a2 = 3
const a3 = 1
const cavesThresHold = random(0.4, 0.5)
const ridgesType = Math.random() < 0.5 ? 'islands' : 'ridges'

const a = a1 + a2 + a3

const caves = () =>
  mapMat(
    mapMat(
      addMat(
        addMat(scaleMat(p1, a1 / a), scaleMat(p2, a2 / a)),
        scaleMat(p3, a3 / a),
      ),
      (val, column, row) => {
        const coord = Vector.create(
          column * boxSize - (horizontalBoxes * boxSize) / 2,
          row * boxSize,
        )

        return [(val + 1) / 2, coord] as const
      },
    ),
    ([value, pos], row, column) => {
      const fadeBorder =
        16 *
        ((1 - pos.y / worldHeight) *
          (pos.y / worldHeight) *
          (1 - (pos.x + worldWidth / 2) / worldWidth) *
          ((pos.x + worldWidth / 2) / worldWidth))

      const newValue = fadeBorder * value

      const relY = pos.y / worldHeight
      const material =
        newValue < cavesThresHold
          ? 'air'
          : (relY * relY * (rockness[row][column] + 1)) / 2 > rockEarthRatio
            ? isWinter
              ? 'ice'
              : 'rock'
            : 'earth'

      return [newValue, material, pos] as const
    },
  )

const ridges = () =>
  mapMat(
    mapMat(
      addMat(
        addMat(scaleMat(p1, a1 / a), scaleMat(p2, a2 / a)),
        scaleMat(p3, a3 / a),
      ),
      (val, column, row) => {
        const coord = Vector.create(
          column * boxSize - (horizontalBoxes * boxSize) / 2,
          row * boxSize,
        )

        return [
          ridgesType === 'islands' ? Math.abs(val) : 1 - Math.abs(val),
          coord,
        ] as const
      },
    ),
    ([value, pos], row, column) => {
      const fadeBorder =
        16 *
        ((1 - pos.y / worldHeight) *
          (pos.y / worldHeight) *
          (1 - (pos.x + worldWidth / 2) / worldWidth) *
          ((pos.x + worldWidth / 2) / worldWidth))

      const newValue = fadeBorder * value

      const ridgesThresHold = ridgesType === 'islands' ? 0.4 : 0.8
      const relY = pos.y / worldHeight
      const material =
        newValue < ridgesThresHold
          ? 'air'
          : (relY * relY * (rockness[row][column] + 1)) / 2 > rockEarthRatio
            ? isWinter
              ? 'ice'
              : 'rock'
            : 'earth'

      return [newValue, material, pos] as const
    },
  )

const terrainWithoutGrass = Math.random() > 0.5 ? ridges() : caves()

const materials = {
  earth: {
    color: (val: number) => rgb(val * 0.6, val * 0.64 * 0.6, val * 0 * 0.6),
    density: 0.001,
    resitution: 0.2,
  },
  grass: {
    color: (val: number) => rgb(val * 0, val * 1, val * 0),
    density: 0.0005,
    resitution: 0.2,
  },
  snow: {
    color: (val: number) => rgb(0.9, 0.9, 0.9),
    density: 0.0005,
    resitution: 0.2,
  },
  rock: {
    color: (val: number) => rgb(val * 0.5, val * 0.5, val * 0.5),
    density: 0.002,
    resitution: 0.2,
  },

  ice: {
    color: (val: number) => rgb(val * 0.5, val * 0.7, val * 1),
    density: 0.001,
    resitution: 0.2,
    opacity: 0.8,
  },
  rubber: {
    color: (val: number) => rgb(val * 0.8, val * 0.3, val * 0.3),
    density: 0.0002,
    resitution: 1,
  },
} as const

const generatedTerrain = mapMat(
  terrainWithoutGrass,
  ([value, material, pos], row, column) => {
    const isEarth = material === 'earth'
    const isBelowAir = terrainWithoutGrass[row][column - 1]?.[1] === 'air'
    return [
      value,
      isEarth && isBelowAir ? (isWinter ? 'snow' : 'grass') : material,
      pos,
    ]
  },
)
  .flat()
  .filter(([_, material]) => {
    return material !== 'air'
  })

const boxes = [
  ...generatedTerrain,
  //  ...platform
].map(([val, materialKey, coord]) => {
  const material = materials[materialKey]
  const color = material.color(val)

  return {
    tag: 'box',
    material,
    health: 0,
    body: Bodies.rectangle(coord.x, coord.y, boxSize, boxSize, {
      isStatic: true,
      render: {
        // fillStyle: rgb(red, red * 0.64 - coord.y / 20000, red * 0),
        fillStyle: color,
        opacity: material.opacity,
      },
      friction: 0.02,
      density: material.density,
      restitution: material.resitution,
    }),
  }
})

addGameObject(player1)
addGameObject(player2)

boxes.forEach((box) => {
  addGameObject(box)
})

const createBoundary = () => {
  const width = worldWidth * 10

  return {
    body: Bodies.rectangle(
      0,
      worldHeight * 2,
      width,
      1000,

      { isSensor: true, isStatic: true },
    ),
  }
}

const boundary = createBoundary()

addGameObject(boundary)

const isKeyDown = keyDownTracker()

// run the renderer
Render.run(render1)
Render.run(render2)

const update = (dt: number) => {
  if (isKeyDown('KeyW')) {
    player1.jump()
  }
  if (isKeyDown('KeyA')) {
    player1.moveLeft()
  }
  if (isKeyDown('KeyD')) {
    player1.moveRight()
  }

  if (isKeyDown('KeyS')) {
    player1.throwGrenade()
  }

  // if (isKeyDown('KeyS') && isKeyDown('KeyA')) {
  //   player1.swingLeft(dt)
  // } else if (isKeyDown('KeyS') && isKeyDown('KeyD')) {
  //   player1.swingRight(dt)
  // }

  if (isKeyDown('ArrowUp')) {
    player2.jump()
  }
  if (isKeyDown('ArrowLeft')) {
    player2.moveLeft()
  }
  if (isKeyDown('ArrowRight')) {
    player2.moveRight()
  }
  // if (isKeyDown('ArrowDown') && isKeyDown('ArrowLeft')) {
  //   player2.swingLeft(dt)
  // } else if (isKeyDown('ArrowDown') && isKeyDown('ArrowRight')) {
  //   player2.swingRight(dt)
  // }
  if (isKeyDown('ArrowDown')) {
    player2.throwGrenade()
  }

  gameObjects.forEach((object) => {
    object.update?.(dt)
  })
}

const testPickCollision = (
  targetObj: GameObject,
  pickaxe: Body,
  collision: Collision,
) => {
  const energy = pickaxe.mass * pickaxe.speed * pickaxe.speed
  // const contactNormal = Vector.normalise(
  //   Vector.sub(collision.bodyA.position, collision.bodyB.position),
  // )
  // const relSpeed = projectOnVector(pickaxe.velocity, contactNormal)
  // const relEnergy = pickaxe.mass * Vector.dot(relSpeed, relSpeed)

  if (energy >= 50) {
    Body.setStatic(targetObj.body, false)
  }
}

const testIceCollision = (
  ice: GameObject,
  body: Body,
  collision: Collision,
) => {
  const energy = body.mass * body.speed * body.speed

  if (energy >= 50) {
    Body.setStatic(ice.body, false)
    // Composite.remove(engine.world, ice.body)
  }
}

const testExplosionCollision = (
  targetBody: Body,
  targetGameObject: GameObject | undefined,
  explosion: GameObject,
  collision: Collision,
) => {
  if (targetBody === explosion.source) {
    Composite.remove(engine.world, targetBody)
  }
  const diff = Vector.sub(targetBody.position, explosion.body.position)
  const dir = Vector.add(Vector.normalise(diff), up)
  const density = targetBody._original?.density ?? targetBody.density
  const impulseFactor = 200000
  const speedDiff =
    impulseFactor / (Vector.magnitudeSquared(diff) + 2500) / (density * 1000)

  const velDiff = Vector.mult(dir, speedDiff)

  console.log(1, density, speedDiff)

  if (targetGameObject?.tag === 'box' && speedDiff > 2) {
    Body.setStatic(targetBody, false)
  }
  if (!targetBody.isStatic) {
    Body.setVelocity(targetBody, Vector.add(targetBody.velocity, velDiff))
  }
  const b = explosion.body as Body
  b.collisionFilter.mask = 0
  Body.setStatic(explosion.body, true)
  // Composite.remove(engine.world, explosion.body)
}

const testCollision = (bodyA: Body, bodyB: Body, collision: Collision) => {
  const objA =
    gameObjects.find((obj) => obj.body === bodyA) ??
    players.find((obj) => obj.head === bodyA)
  const objB =
    gameObjects.find((obj) => obj.body === bodyB) ??
    players.find((obj) => obj.head === bodyB)

  const pickaxes = [player1.pickaxe, player2.pickaxe]

  pickaxes.forEach((pickaxe) => {
    if (objA !== undefined && bodyB === pickaxe) {
      testPickCollision(objA, pickaxe, collision)
    }
  })

  if (objA !== undefined && objA.tag === 'explosion') {
    testExplosionCollision(bodyB, objB, objA, collision)
  }

  if (
    objA !== undefined &&
    objA.tag === 'box' &&
    objA.material === materials.ice
  ) {
    testIceCollision(objA, bodyB, collision)
  }

  if (objA?.tag === 'box' && objB?.tag === 'box') {
  }

  players.forEach((player) => {
    if (bodyA === player.jumpSensor) {
      player.onTouchGround()
    }
  })
  // Boundary
  if (objA === boundary) {
    Composite.remove(engine.world, bodyB)
  }
}

const handleCollisionStart = (event: IEventCollision<Engine>) => {
  event.pairs.forEach((pair) => {
    testCollision(pair.bodyA, pair.bodyB, pair.collision)
    testCollision(pair.bodyB, pair.bodyA, pair.collision)
  })
}

const handleCollisionEnd = (event: IEventCollision<Engine>) => {
  event.pairs.forEach((pair) => {
    const { bodyA, bodyB } = pair

    players.forEach((player) => {
      if (bodyA === player.jumpSensor || bodyB === player.jumpSensor) {
        player.onLeaveGround()
      }
    })
  })
}

Events.on(engine, 'collisionStart', handleCollisionStart)
Events.on(engine, 'collisionEnd', handleCollisionEnd)

const render = (dt: number) => {
  const zoom = 0.5

  canvases.forEach(([renderer, canvasPlayer]) => {
    const canvas = renderer.canvas
    const ctx = canvas.getContext('2d')!

    const bounds = canvas.getBoundingClientRect()

    const cameraPos = Vector.div(
      Vector.add(renderer.bounds.min, renderer.bounds.max),
      2,
    )

    // const cameraPos = canvasPlayer.head.position

    ctx.translate(
      zoom * -(cameraPos.x - bounds.width / (zoom * 2)),
      zoom * -(cameraPos.y - bounds.height / (zoom * 2)),
    )
    // ctx.translate(
    //   (zoom * canvas.getBoundingClientRect().width) / 2,
    //   (zoom * canvas.getBoundingClientRect().height) / 2,
    // )
    ctx.scale(zoom, zoom)
    gameObjects.forEach((gameObject) => {
      if (gameObject.render === undefined) {
        return
      }
      gameObject.render(ctx, dt)
    })

    // Health bar

    // console.log(render1.bounds.min)

    // players.forEach((player) => {
    const endPos = Vector.add(
      canvasPlayer.head.position,
      Vector.mult(Vector.normalise(canvasPlayer.head.velocity), 100),
    )
    drawArrow(
      ctx,
      canvasPlayer.head.position.x,
      canvasPlayer.head.position.y,
      endPos.x,
      endPos.y,
    )

    // ctx.beginPath()
    // ctx.strokeStyle = '#FFFF44FF'
    // ctx.lineWidth = 3
    // ctx.moveTo(-worldWidth, worldHeight / 3)
    // ctx.lineTo(worldWidth, worldHeight / 3)
    // ctx.stroke()

    // ctx.beginPath()
    // ctx.strokeStyle = '#FF444480'
    // ctx.lineWidth = 3
    // ctx.moveTo(-worldWidth, (worldHeight * 2) / 3)
    // ctx.lineTo(worldWidth, (worldHeight * 2) / 3)
    // ctx.stroke()

    // })
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    moveCameraTo(
      canvasPlayer.head.position,
      renderer,
      canvas1Width / zoom,
      canvas1Height / zoom,
    )
  })
  // moveCameraTo(
  //   player1.head.position,
  //   render1,
  //   canvas1Width * 5,
  //   canvas1Height * 5,
  // )
}

const maxDt = 1000 / 20

const loop = (then: DOMHighResTimeStamp) => (now: DOMHighResTimeStamp) => {
  const dt = Math.min(maxDt, now - then)
  window.requestAnimationFrame(loop(now))
  update(dt)
  render(dt)
  Engine.update(engine, dt)
}

window.requestAnimationFrame(loop(0))
