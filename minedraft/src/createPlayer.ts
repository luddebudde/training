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
import { right, left, up, direction } from './math'
import { applyForce, applyImpulse, applyAngularImpulse } from './physics'
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
  const swingDelay = 2000
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
      swingDelay,
      (dt) => {
        applyAngularImpulse(head, swingAngularImpulse, dt)
      },
      {
        noTrailing: true,
      },
    ),

    swingRight: throttle(
      swingDelay,
      (dt) => {
        applyAngularImpulse(head, -swingAngularImpulse, dt)
      },
      {
        noTrailing: true,
      },
    ),
    throwGrenade: throttle(
      1000,
      () => {
        const velDir = Vector.normalise(head.velocity)
        addGameObject(
          createGrenade(
            Vector.add(head.position, Vector.mult(velDir, headRadius)),
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
