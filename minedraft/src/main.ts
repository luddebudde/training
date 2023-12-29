// create an engine
import {
  Bodies,
  Body,
  Collision,
  Composite,
  Composites,
  Constraint,
  Engine,
  Events,
  IEventCollision,
  Render,
  Vector,
} from 'matter-js'
import { keyDownTracker } from './keyDownTracker.ts'
import { applyAngularImpulse, applyForce, applyImpulse } from './physics'
import { left, mapMat, projectOnVector, right, up } from './math'
import { throttle } from 'throttle-debounce'
import { moveCameraTo } from './moveCameraTo.ts'
import { Sprite, sprites } from './sprites.ts'
import { drawHealthBar } from './drawHealthBar.ts'
import { canvasCoordinate } from './canvasCoordinate.ts'
import { perlin } from './math/perlin.ts'

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

const matterJsSprite = (radius: number, sprite: Sprite) => {
  return {
    texture: sprite.texture,
    xScale: (2 * radius) / sprite.width,
    yScale: (2 * radius) / sprite.height,
  }
}

const createPlayer = (headSprite: Sprite, pickaxeSprite: Sprite) => {
  const headRadius = 40
  const pickaxeRadius = 20
  const group = Body.nextGroup(true)
  const pickaxe = Bodies.circle(100, 100, pickaxeRadius, {
    mass: 0.1,
    collisionFilter: { group: group },
    // friction: 1,
    restitution: 0,
    isSensor: true,
    // type:
    render: {
      sprite: matterJsSprite(pickaxeRadius, pickaxeSprite),
    },
  })
  const head = Bodies.circle(100, 20, headRadius, {
    // collisionFilter: { group: group },
    mass: 5,
    collisionFilter: { group: group },
    friction: 0,
    render: {
      sprite: matterJsSprite(headRadius, headSprite),
    },
  })

  const ropeMass = 0.1
  const ropeJoints = 10

  const jointLenght = 5

  const rope = Composites.stack(
    100,
    50,
    ropeJoints,
    1,
    0,
    0,
    (x: number, y: number) =>
      Bodies.rectangle(x, y, jointLenght, 5, {
        mass: ropeMass / ropeJoints,
        collisionFilter: { group: group },
      }),
  )

  const jointOptions = {
    stiffness: 0.9,
    damping: 0.9,
    angularStiffness: 0.2,
    angularDamping: 0.2,
  }

  Composites.chain(rope, 0.5, 0, -0.5, 0, {
    render: { type: 'line' },
    length: 0,
    ...jointOptions,
  })
  const armLenght = headRadius * 0.5
  Composite.add(
    rope,
    Constraint.create({
      bodyA: head,
      bodyB: rope.bodies[0],
      pointB: { x: -jointLenght / 2, y: 0 },
      pointA: { x: headRadius + armLenght, y: 0 },
      length: 0,
      ...jointOptions,
    }),
  )
  Composite.add(
    rope,
    Constraint.create({
      bodyA: pickaxe,
      bodyB: rope.bodies[rope.bodies.length - 1],
      pointB: { x: jointLenght / 2, y: 0 },
      pointA: { x: 0, y: 0 },
      length: 0,
      ...jointOptions,
    }),
  )

  const body = Composite.create({
    bodies: [pickaxe, head],
    constraints: [],
    composites: [rope],
  })
  const walkForce = 0.002
  const jumpImpulse = 6
  const swingAngularImpulse = 100
  const maxHealth = 100
  return {
    tag: 'player',
    maxHealth: maxHealth,
    health: maxHealth,
    body,
    head,
    pickaxe,
    moveRight: () => {
      applyForce(head, Vector.mult(right, walkForce))
    },
    moveLeft: () => {
      applyForce(head, Vector.mult(left, walkForce))
    },
    jump: throttle(
      750,
      (dt) => {
        applyImpulse(head, Vector.mult(up, jumpImpulse), dt)
      },
      {
        noTrailing: true,
      },
    ),
    swingLeft: throttle(
      1000,
      (dt) => {
        applyAngularImpulse(head, swingAngularImpulse, dt)
      },
      {
        noTrailing: true,
      },
    ),

    swingRight: throttle(
      1000,
      (dt) => {
        applyAngularImpulse(head, -swingAngularImpulse, dt)
      },
      {
        noTrailing: true,
      },
    ),
  }
}

const player1 = createPlayer(sprites.playerBlue, sprites.pickaxeBlue)
const player2 = createPlayer(sprites.playerRed, sprites.pickaxeRed)

const players = [player1, player2]

const canvases = [
  [canvas1, player1],
  [canvas2, player2],
]

const boxSize = 100
const horizontalBoxes = 100
const verticalBoxes = 100

// 1. [[0, 0,0 ], [0,0,0], [0,0,0]]
// 2. [[[0,0], [0,1], [0, 2]], [[1,0], [1,1], [1, 2]]]
// 2. [[0,0], [0,1], [0, 2], [1,0], [1,1], [1, 2]] // flat
// 2. [Vector.create(), [0,1], [0, 2], [1,0], [1,1], [1, 2]] // flat

const boxes = mapMat(
  perlin(horizontalBoxes, verticalBoxes, 20, 20),
  (val, column, row) => {
    const coord = Vector.create(column * boxSize, row * boxSize)
    // -1 to 1 to hex
    const normalizedValue = (val + 1) / 2
    // console.log(normalizedValue)
    if (normalizedValue < 0) {
      console.log('err: less than 0', normalizedValue)
    }
    if (normalizedValue > 1) {
      console.log('err: greater than or equal to 1', normalizedValue)
    }
    const hexColor = Math.floor(((val + 1) / 2) * 256)
      .toString(16)
      .padStart(2, '0')
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
            fillStyle: `#${hexColor}${hexColor}${hexColor}`,
            // lineWidth: 0,
          },
        },
      ),
    }
  },
).flat()
// .map((arr, row) => {
//
//   return Bodies.rectangle((row + 1) * boxSize, 200, boxSize, boxSize, {
//     isStatic: true,
//   })
// })
// .map((body) => {
//   return { body, tag: 'box' }
// })

const gameObjects = [...players, ...boxes]

// create two boxes and a ground
// const ground = Bodies.rectangle(400, 610, 1810, 60, { isStatic: true })

// add all of the bodies to the world
Composite.add(engine.world, [
  ...boxes.map((box) => box.body),
  player1.body,
  player2.body,
])

const isKeyDown = keyDownTracker()

// run the renderer
Render.run(render1)
Render.run(render2)

// create runner
// var runner = Runner.create();

// run the engine
// Runner.run(runner, engine);

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
  // if (isKeyDown('KeyQ')) {
  //   player1.swingLeft()
  // }

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
}

const testCollision = (
  targetObj: GameObject,
  pickaxe: Body,
  collision: Collision,
) => {
  // const energy =

  const energy = pickaxe.mass * pickaxe.speed * pickaxe.speed
  const contactNormal = Vector.normalise(
    Vector.sub(collision.bodyA.position, collision.bodyB.position),
  )
  const relSpeed = projectOnVector(pickaxe.velocity, contactNormal)
  const relEnergy = pickaxe.mass * Vector.dot(relSpeed, relSpeed)

  if (energy >= 50) {
    // console.log(relEnergy)
    // npulse(pickaxe, Vector.mult(left, 100), dt)

    targetObj.health -= relEnergy / 3

    if (targetObj.health <= 0) {
      Composite.remove(engine.world, targetObj.body)
    }
  }
  // if (objA.speed !== undefined) {
  //   const energy = objA.body.mass * objA.speed() * objA.speed()
  //   const collisionDamage = energy * 0.0005
  //   damage(objB, collisionDamage)
  // }
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
        testCollision(objA, pickaxe, pair.collision)
      } else if (objB !== undefined && 'health' in objB && bodyA === pickaxe) {
        testCollision(objB, pickaxe, pair.collision)
      }
    })

    // if (bodyA === player1.head && bodyB === player2.pickaxe) {
    //   testCollision(player1.body, player2.pickaxe, pair.collision)
    // } else if (bodyB === player1.head && bodyA === player2.pickaxe) {
    //   testCollision(player1.body, player2.pickaxe, pair.collision)
    // }
  })
  // TODO loop through pairs

  // if (objA && objB) {
  //   testCollision(objA, objB)
  //   testCollision(objB, objA)
  // }
  //
  // if (bodyA.label === 'OuterBoundary') {
  //   removeObject(game, objB)
  // }
  // if (bodyB.label === 'OuterBoundary') {
  //   removeObject(game, objA)
  // }
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
  moveCameraTo(
    player1.head.position,
    render1,
    canvas1Width * 20,
    canvas1Height * 20,
  )
  moveCameraTo(player2.head.position, render2, canvas2Width, canvas2Height)
}

const loop = (then: DOMHighResTimeStamp) => (now: DOMHighResTimeStamp) => {
  const dt = now - then
  window.requestAnimationFrame(loop(now))
  update(dt)
  draw(dt)
  Engine.update(engine, dt)
}

window.requestAnimationFrame(loop(0))
