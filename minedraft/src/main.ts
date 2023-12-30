// create an engine
import {
  Bodies,
  Body,
  Collision,
  Composite,
  Engine,
  Events,
  IEventCollision,
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
} from './math'
import { moveCameraTo } from './moveCameraTo.ts'
import { Sprite, sprites } from './sprites.ts'
import { drawHealthBar } from './drawHealthBar.ts'
import { canvasCoordinate } from './canvasCoordinate.ts'
import { perlin } from './math/perlin.ts'
import { rgb } from './color.ts'
import { createPlayer } from './createPlayer.ts'
import { applyImpulse2 } from './physics/applyForce.ts'

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

// create a renderer
const render1 = Render.create({
  canvas: canvas1,
  engine: engine,
  options: {
    width: canvas1Width,
    height: canvas1Height,
    showAngleIndicator: false,
    wireframes: false,
    showDebug: true,
  },
})
const render2 = Render.create({
  canvas: canvas2,
  engine: engine,
  options: {
    width: canvas2Width,
    height: canvas2Height,
    showAngleIndicator: false,
    wireframes: false,
  },
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
  [canvas1, player1],
  [canvas2, player2],
]

const vhRatio = 3 / 1

const boxSize = 30
const horizontalBoxes = vhRatio * 60
const verticalBoxes = 60

const thresHold = random(0.4, 0.6)

// 1. [[0, 0,0 ], [0,0,0], [0,0,0]]
// 2. [[[0,0], [0,1], [0, 2]], [[1,0], [1,1], [1, 2]]]
// 2. [[0,0], [0,1], [0, 2], [1,0], [1,1], [1, 2]] // flat
// 2. [Vector.create(), [0,1], [0, 2], [1,0], [1,1], [1, 2]] // flat

const p1 = perlin(horizontalBoxes, verticalBoxes, vhRatio * 2, 2)
const p2 = perlin(horizontalBoxes, verticalBoxes, vhRatio * 10, 10)
const p3 = perlin(horizontalBoxes, verticalBoxes, vhRatio * 30, 30)

const boxes = mapMat(
  addMat(addMat(scaleMat(p1, 0.7), scaleMat(p2, 0.3)), scaleMat(p3, 0.1)),
  (val, column, row) => {
    const coord = Vector.create(column * boxSize, row * boxSize)
    return [(val + 1) / 2, coord] as const
  },
)
  .flat()
  .filter(([val]) => {
    return val > thresHold
  })
  .map(([val, coord]) => {
    // -1 to 1 to hex
    // const hexColor = Math.floor(((val + 1) / 2) * 256)
    //   .toString(16)
    //   .padStart(2, '0')

    const red = val / 2

    // console.log(val, hexColor)
    return {
      tag: 'box',
      health: 0,
      body: Bodies.rectangle(
        coord.x - (horizontalBoxes * boxSize) / 2,
        coord.y + 200,
        boxSize,
        boxSize,
        {
          isStatic: true,
          render: {
            fillStyle: rgb(red, red * 0.64 - coord.y / 20000, red * 0),

            // lineWidth: 0,
          },
        },
      ),
    }
  })

addGameObject(player1)
addGameObject(player2)

boxes.forEach((box) => {
  addGameObject(box)
})

const isKeyDown = keyDownTracker()

// run the renderer
Render.run(render1)
Render.run(render2)

const update = (dt: number) => {
  if (isKeyDown('KeyW')) {
    player1.jump(dt)
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
    player2.jump(dt)
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
  const contactNormal = Vector.normalise(
    Vector.sub(collision.bodyA.position, collision.bodyB.position),
  )
  const relSpeed = projectOnVector(pickaxe.velocity, contactNormal)
  const relEnergy = pickaxe.mass * Vector.dot(relSpeed, relSpeed)

  if (energy >= 50) {
    targetObj.health -= relEnergy / 3

    if (targetObj.health <= 0) {
      Body.setStatic(targetObj.body, false)
    }
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
  const dir = Vector.normalise(diff)
  const impulseFactor = 500000
  const impulse = Vector.mult(
    dir,
    impulseFactor / (Vector.magnitude(diff) + 50) ** 2,
  )

  Body.setStatic(targetBody, false)
  applyImpulse2(targetBody, impulse)

  Composite.remove(engine.world, explosion.body)
  console.log(targetBody)
}

const handleCollisionStart = (event: IEventCollision<Engine>) => {
  event.pairs.forEach((pair) => {
    const { bodyA, bodyB } = pair

    const objA =
      gameObjects.find((obj) => obj.body === bodyA) ??
      players.find((obj) => obj.head === bodyA)
    const objB =
      gameObjects.find((obj) => obj.body === bodyB) ??
      players.find((obj) => obj.head === bodyB)

    const pickaxes = [player1.pickaxe, player2.pickaxe]

    pickaxes.forEach((pickaxe) => {
      if (objA !== undefined && 'health' in objA && bodyB === pickaxe) {
        testPickCollision(objA, pickaxe, pair.collision)
      } else if (objB !== undefined && 'health' in objB && bodyA === pickaxe) {
        testPickCollision(objB, pickaxe, pair.collision)
      }
    })

    if (objA !== undefined && objA.tag === 'explosion') {
      testExplosionCollision(bodyB, objB, objA, pair.collision)
    } else if (objB !== undefined && objB.tag === 'explosion') {
      testExplosionCollision(bodyA, objA, objB, pair.collision)
    }
  })
}

Events.on(engine, 'collisionStart', handleCollisionStart)

const draw = (dt: number) => {
  canvases.forEach(([canvas, canvasPlayer]) => {
    const ctx = canvas.getContext('2d')
    players.forEach((player) => {
      const canvasPos = canvasCoordinate(
        player.head.position,
        canvasPlayer.head.position,
        canvas,
      )

      drawHealthBar(
        ctx,
        canvasPos.x - player.head.circleRadius,
        canvasPos.y + player.head.circleRadius * 1.5,
        player.head.circleRadius * 2,
        15,
        player.health,
        player.maxHealth,
      )
    })
  })
  // moveCameraTo(
  //   player1.head.position,
  //   render1,
  //   canvas1Width * 5,
  //   canvas1Height * 5,
  // )
  moveCameraTo(
    player1.head.position,
    render1,
    canvas1Width * 1.5,
    canvas1Height * 1.5,
  )
  moveCameraTo(
    player2.head.position,
    render2,
    canvas2Width * 1.5,
    canvas2Height * 1.5,
  )
}

const loop = (then: DOMHighResTimeStamp) => (now: DOMHighResTimeStamp) => {
  const dt = now - then
  window.requestAnimationFrame(loop(now))
  update(dt)
  draw(dt)
  Engine.update(engine, dt)
}

window.requestAnimationFrame(loop(0))
