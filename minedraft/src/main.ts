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

const engine = Engine.create({
  gravity: {
    scale: 0.002,
  },
})

const canvas1 = document.createElement('canvas')
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
const horizontalBoxes = 80
const verticalBoxes = hvRatio * horizontalBoxes

const worldWidth = boxSize * horizontalBoxes
const worldHeight = boxSize * verticalBoxes

// 1. [[0, 0,0 ], [0,0,0], [0,0,0]]
// 2. [[[0,0], [0,1], [0, 2]], [[1,0], [1,1], [1, 2]]]
// 2. [[0,0], [0,1], [0, 2], [1,0], [1,1], [1, 2]] // flat
// 2. [Vector.create(), [0,1], [0, 2], [1,0], [1,1], [1, 2]] // flat

const p1 = perlin(horizontalBoxes, verticalBoxes, 4, hvRatio * 4)
const p2 = perlin(horizontalBoxes, verticalBoxes, 8, hvRatio * 8)
const p3 = perlin(horizontalBoxes, verticalBoxes, 16, hvRatio * 16)

const rockness = perlin(horizontalBoxes, verticalBoxes, 2, hvRatio * 2)
const rockEarthRatio = 0.14

const worldYOffset = 500
const platform = zeros(10).map(
  (_, index) =>
    [
      1,
      'rock',
      Vector.create(index * boxSize - boxSize * 5, boxSize * 25),
    ] as const,
)

const a1 = 4
const a2 = 3
const a3 = 1
const thresHold = random(0.4, 0.5)

const a = a1 + a2 + a3

const generatedTerrain = mapMat(
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

    const relY = pos.y / worldHeight
    const material =
      (relY * relY * (rockness[row][column] + 1)) / 2 > rockEarthRatio
        ? 'rock'
        : 'earth'

    return [fadeBorder * value, material, pos] as const
  },
)
  .flat()
  .filter(([val]) => {
    return val > thresHold
  })

const boxes = [...generatedTerrain, ...platform].map(
  ([val, material, coord]) => {
    const color =
      material === 'earth'
        ? rgb(val * 0.6, val * 0.64 * 0.6, val * 0 * 0.6)
        : rgb(val * 0.5, val * 0.5, val * 0.5)

    return {
      tag: 'box',
      health: 0,
      body: Bodies.rectangle(coord.x, coord.y, boxSize, boxSize, {
        isStatic: true,
        render: {
          // fillStyle: rgb(red, red * 0.64 - coord.y / 20000, red * 0),
          fillStyle: color,
        },
        friction: 0.02,
      }),
    }
  },
)

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

  if (isKeyDown('KeyQ')) {
    player1.throwGrenade()
  }

  if (isKeyDown('KeyS') && isKeyDown('KeyA')) {
    player1.swingLeft(dt)
  } else if (isKeyDown('KeyS') && isKeyDown('KeyD')) {
    player1.swingRight(dt)
  }

  if (isKeyDown('ArrowUp')) {
    player2.jump()
  }
  if (isKeyDown('ArrowLeft')) {
    player2.moveLeft()
  }
  if (isKeyDown('ArrowRight')) {
    player2.moveRight()
  }
  if (isKeyDown('ArrowDown') && isKeyDown('ArrowLeft')) {
    player2.swingLeft(dt)
  } else if (isKeyDown('ArrowDown') && isKeyDown('ArrowRight')) {
    player2.swingRight(dt)
  }
  if (isKeyDown('Enter')) {
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

const testExplosionCollision = (
  targetBody: Body,
  targetGameObject: GameObject | undefined,
  explosion: GameObject,
  collision: Collision,
) => {
  console.log(c++)
  if (targetBody === explosion.source) {
    Composite.remove(engine.world, targetBody)
  }
  const diff = Vector.sub(targetBody.position, explosion.body.position)
  const dir = Vector.add(Vector.normalise(diff), up)
  const impulseFactor = 200000
  const impulse = Vector.mult(
    dir,
    impulseFactor / (Vector.magnitudeSquared(diff) + 2500),
  )

  if (targetGameObject?.tag === 'box') {
    Body.setStatic(targetBody, false)
  }
  Body.setVelocity(targetBody, Vector.add(targetBody.velocity, impulse))

  const b = explosion.body as Body
  b.collisionFilter.mask = 0
  Body.setStatic(explosion.body, true)
  // Composite.remove(engine.world, explosion.body)
}

let c = 0

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

    const cameraPos = Vector.div(
      Vector.add(renderer.bounds.min, renderer.bounds.max),
      2,
    )

    // const cameraPos = canvasPlayer.head.position

    ctx.translate(
      zoom * -(cameraPos.x - canvas.getBoundingClientRect().width / (zoom * 2)),
      zoom *
        -(cameraPos.y - canvas.getBoundingClientRect().height / (zoom * 2)),
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
