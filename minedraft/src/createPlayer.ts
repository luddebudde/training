import { matterJsSprite } from './main'

import {
  Body,
  Bodies,
  Composites,
  Composite,
  Constraint,
  Vector,
} from 'matter-js'
import { throttle } from 'throttle-debounce'
import { right, left, up } from './math'
import { applyForce, applyAngularImpulse, applyImpulse2 } from './physics'
import { Sprite } from './sprites'
import { createGrenade } from './createGrenade'

export const createPlayer = (
  headSprite: Sprite,
  pickaxeSprite: Sprite,
  addGameObject: (obj: GameObject) => void,
) => {
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

  const head = Bodies.circle(0, 0, headRadius, {
    // collisionFilter: { group: group },
    mass: 5,
    collisionFilter: { group: group },
    friction: 0.1,
    render: {
      sprite: matterJsSprite(headRadius, headSprite),
    },
  })
  const jumpSensor = Bodies.circle(0, 0, headRadius * 1.3, {
    isSensor: true,
    // mass: 0.1,
    density: 0,
    render: {
      opacity: 0.5,
    },
  })

  const body = Body.create({
    parts: [jumpSensor, head],
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
    angularStiffness: 0.5,
    angularDamping: 0.5,
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
      bodyA: body,
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
  const playerBody = Composite.create({
    bodies: [body, pickaxe],
    constraints: [],
    composites: [rope],
  })
  const walkForce = 0.005
  const jumpImpulse = 80
  const swingAngularImpulse = 100
  const maxHealth = 100
  const swingDelay = 2000
  return {
    tag: 'player',
    maxHealth: maxHealth,
    health: maxHealth,
    body: playerBody,
    jumpSensor: jumpSensor,
    head,
    pickaxe,
    moveRight: () => {
      applyForce(body, Vector.mult(right, walkForce))
    },
    moveLeft: () => {
      applyForce(body, Vector.mult(left, walkForce))
    },
    jump: throttle(
      750,
      () => {
        // jumpDetector.is
        applyImpulse2(body, Vector.mult(up, jumpImpulse))
      },
      {
        noTrailing: true,
      },
    ),
    swingLeft: throttle(
      swingDelay,
      (dt) => {
        applyAngularImpulse(body, swingAngularImpulse, dt)
      },
      {
        noTrailing: true,
      },
    ),

    swingRight: throttle(
      swingDelay,
      (dt) => {
        applyAngularImpulse(body, -swingAngularImpulse, dt)
      },
      {
        noTrailing: true,
      },
    ),
    throwGrenade: throttle(
      3000,
      () => {
        const velDir = Vector.normalise(body.velocity)
        addGameObject(
          createGrenade(
            Vector.add(body.position, Vector.mult(velDir, headRadius)),
            velDir,
            addGameObject,
          ),
        )
      },
      {
        noTrailing: true,
      },
    ),
  }
}
