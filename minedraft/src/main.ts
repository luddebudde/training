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
import { applyForce, applyImpulse, applyTorque } from './physics'
import { angle, degrees, left, projectOnVector, right, up, zeros } from './math'
import { throttle } from 'throttle-debounce'
import { moveCameraTo } from './moveCameraTo.ts'

const engine = Engine.create()

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
    showAngleIndicator: true,
    wireframes: false,
  },
})
const render2 = Render.create({
  canvas: canvas2,
  engine: engine,
  options: {
    width: canvas2Width,
    height: canvas2Height,
    showAngleIndicator: true,
    wireframes: false,
  },
})

const createPlayer = () => {
  const headRadius = 40
  const pickaxeRadius = 20
  const group = Body.nextGroup(true)
  const pickaxe = Bodies.circle(100, 100, pickaxeRadius, {
    mass: 0.3,
    collisionFilter: { group: group },
  })
  const head = Bodies.circle(100, 20, headRadius, {
    // collisionFilter: { group: group },
    mass: 5,
    collisionFilter: { group: group },
  })

  const rope = Composites.stack(100, 50, 8, 1, 10, 10, (x, y) =>
    Bodies.rectangle(x, y, 10, 5, { collisionFilter: { group: group } }),
  )

  Composites.chain(rope, 0.5, 0, -0.5, 0, {
    stiffness: 0.8,
    length: 2,
    render: { type: 'line' },
  })
  const armLenght = headRadius * 0.5
  Composite.add(
    rope,
    Constraint.create({
      bodyA: head,
      bodyB: rope.bodies[0],
      pointB: { x: 0, y: 0 },
      pointA: { x: headRadius + armLenght, y: 0 },
      stiffness: 0.3,
      length: 0,
    }),
  )
  Composite.add(
    rope,
    Constraint.create({
      bodyA: pickaxe,
      bodyB: rope.bodies[rope.bodies.length - 1],
      pointB: { x: 0, y: 0 },
      pointA: { x: 0, y: 0 },
      stiffness: 0.3,
      length: 0,
    }),
  )

  const body = Composite.create({
    bodies: [pickaxe, head],
    constraints: [],
    composites: [rope],
  })
  const walkForce = 0.02
  const jumpImpulse = 4
  const swingTorque = 5
  return {
    tag: 'player',
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
      () => {
        applyImpulse(head, Vector.mult(up, jumpImpulse), dt)
      },
      {
        noTrailing: true,
      },
    ),
    swingLeft: throttle(
      1000,
      () => {
        applyTorque(head, swingTorque)
      },
      {
        noTrailing: true,
      },
    ),

    swingRight: throttle(
      1000,
      () => {
        applyTorque(head, -swingTorque)
      },
      {
        noTrailing: true,
      },
    ),
  }
}

const player1 = createPlayer()
const player2 = createPlayer()

const boxSize = 40

// 1. [[0, 0,0 ], [0,0,0], [0,0,0]]
// 2. [[[0,0], [0,1], [0, 2]], [[1,0], [1,1], [1, 2]]]
// 2. [[0,0], [0,1], [0, 2], [1,0], [1,1], [1, 2]] // flat
// 2. [Vector.create(), [0,1], [0, 2], [1,0], [1,1], [1, 2]] // flat

const boxes = zeros(100)
  .map(() => {
    return zeros(100)
  })
  .map((arr, rowCount) => {
    return arr.map((__, columnCount) => {
      return [rowCount, columnCount]
    })
  })
  .flat()
  .map((coord) => {
    const row = coord[0]
    const column = coord[1]
    return Vector.create(row * boxSize, column * boxSize)
  })
  .map((coord) => {
    return {
      tag: 'box',
      body: Bodies.rectangle(coord.x, coord.y + 200, boxSize, boxSize, {
        isStatic: true,
        render: {
          fillStyle: '#3b3333',
          // lineWidth: 0,
        },
      }),
    }
  })
// .map((arr, row) => {
//
//   return Bodies.rectangle((row + 1) * boxSize, 200, boxSize, boxSize, {
//     isStatic: true,
//   })
// })
// .map((body) => {
//   return { body, tag: 'box' }
// })

const gameObjects = [player1, player2, ...boxes]

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

const update = () => {
  if (isKeyDown('KeyW')) {
    player1.jump()
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
    player1.swingLeft()
  } else if (isKeyDown('KeyS') && isKeyDown('KeyD')) {
    player1.swingRight()
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
    player2.swingLeft()
  } else if (isKeyDown('ArrowDown') && isKeyDown('ArrowRight')) {
    player2.swingRight()
  }

  moveCameraTo(player1.head.position, render1, canvas1Width, canvas1Height)
  moveCameraTo(player2.head.position, render2, canvas2Width, canvas2Height)
}

const testCollision = (box, pickaxe: Body, collision: Collision) => {
  // const energy =
  const energy = pickaxe.mass * pickaxe.speed * pickaxe.speed
  const contactNormal = Vector.normalise(
    Vector.sub(pickaxe.position, box.body.position),
  )
  const relSpeed = projectOnVector(pickaxe.velocity, contactNormal)
  const relEnergy = pickaxe.mass * Vector.dot(relSpeed, relSpeed)

  if (relEnergy >= 15) {
    // npulse(pickaxe, Vector.mult(left, 100), dt)
    Composite.remove(engine.world, box.body)
  }
  // if (objA.speed !== undefined) {
  //   const energy = objA.body.mass * objA.speed() * objA.speed()
  //   const collisionDamage = energy * 0.0005
  //   damage(objB, collisionDamage)
  // }
}

const handleCollisionStart = (event: IEventCollision<Engine>) => {
  // TODO loop through pairs
  const { bodyA, bodyB } = event.pairs[0]

  const objA = gameObjects.find((obj) => obj.body === bodyA)
  const objB = gameObjects.find((obj) => obj.body === bodyB)

  const pickaxes = [player1.pickaxe, player2.pickaxe]

  pickaxes.forEach((pickaxe) => {
    if (objA !== undefined && objA.tag === 'box' && bodyB === pickaxe) {
      testCollision(objA, pickaxe, event.pairs[0].collision)
    }

    if (objB !== undefined && objB.tag === 'box' && bodyA === pickaxe) {
      testCollision(objB, pickaxe, event.pairs[0].collision)
    }
  })

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

const dt = 1000 / 60

const run = () => {
  window.requestAnimationFrame(run)
  update()
  Engine.update(engine, dt)
}

run()