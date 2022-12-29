import {Bodies, Body, Composite, Engine, Events, Mouse, MouseConstraint, Render, Runner, Vector} from "matter-js";
import {black, darkGrey, green, red, white} from './src/palette.js'
import {down, left, right, up} from "./src/vectors.js";
import {applyTorque} from "./src/applyTorque.js";
import {createRoom} from "./src/createRoom.js";
import {sprites} from "./src/sprites.js";
import {keyDownTracker} from "./src/keyDownTracker.js";
import { direction } from "./src/direction.js";
import { applySpringTorque } from "./src/applySpringTorque";
import { applyAngularFriction } from "./src/applyAngularFriction.js";

// create an engine
const engine = Engine.create();
engine.gravity.scale = 0
const canvas = document.getElementById('app');

const room = {
  height: 1000,
  width: 1500,
}

// create a renderer
const render = Render.create({
  canvas: canvas,
  element: document.body,
  engine: engine,
  options: {
    // showCollisions: true,  
    wireframes: false,
    height: room.height,
    width: room.width,
    // wireframeBackground: true,
    background: undefined,
    showDebug: true,
    // background: `radial-gradient(circle, ${darkGrey} 0%, ${black} 100%)`,
    // For debugging
    // showMousePosition: true,
    showAngleIndicator: true,
    // showPerformance: true,
  },
});

// add mouse control and make the mouse revolute
const mouse = Mouse.create(render.canvas)
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.6,
    length: 0,
    angularStiffness: 0,
    render: {
      visible: false
    }
  }
});

Composite.add(engine.world, [mouseConstraint])

// keep the mouse in sync with rendering
render.mouse = mouse;

// fit the render viewport to the scene


// run the renderer
Render.run(render);
// create runner
const runner = Runner.create();
// run the engine
Runner.run(runner, engine);

// ============= DO NOT EDIT ABOVE ==============

const applyForceTo = (body, direction) => Body.applyForce(body, body.position, Vector.mult(direction, 0.1))

// Init game here
const playerRadius = 60
const player = {
  body: Bodies.circle(room.width / 2, room.height / 2, playerRadius, {
    mass: 500,
    frictionAir: 0.02,  
    render: {
      sprite: {
        texture: sprites.player.texture,
        xScale: 2 * playerRadius / sprites.player.width,
        yScale: 2 * playerRadius / sprites.player.height,
      },
    },
  })
}

const asteroidRadius = 60

const asteroid = Bodies.circle(room.width / 3, room.height / 2, asteroidRadius, {
  mass: 1000,
  frictionAir: 0,
  render: {
    sprite: {
      texture: sprites.asteroid.texture,
      xScale: 2 * asteroidRadius / sprites.asteroid.width * 1.23,
      yScale: 2 * asteroidRadius / sprites.asteroid.height * 1.23,
    },
  },
})

applyTorque(asteroid, 1)
applyForceTo(asteroid, {
  x: 10,
  y: 20,
})

const objects = [player.body, asteroid]

// Add all bodies and composites to the world
Composite.add(engine.world, objects);

const isKeyDown = keyDownTracker()

const createBullet = (force) => {
  const bulletRadius = 10
  const pos = Vector.add(Vector.mult (direction(player.body), playerRadius + bulletRadius), player.body.position)
  const bullet = Bodies.circle(pos.x, pos.y, bulletRadius, {
    mass: 20,
    frictionAir: 0,
  })
  Body.applyForce(bullet, bullet.position, force)
  return bullet
}

addEventListener(`keydown`, (event) => {
  if (event.code === `Space`) {
    Composite.add(engine.world, createBullet(direction(player.body)));
  }
})

Events.on(engine, "beforeUpdate", (event) => {
  //  Called very update
  if (isKeyDown(`KeyW`)) {
    Body.applyForce(player.body, player.body.position, direction(player.body))
  } 
  if (isKeyDown(`KeyS`)) {
    Body.applyForce(player.body, player.body.position, Vector.mult(direction(player.body), -1))
  }
  if (isKeyDown(`KeyA`)) {
    applyTorque(player.body, 0.5)
  }
  if (isKeyDown(`KeyD`)) {
    applyTorque(player.body, -0.5)
  }

  applyAngularFriction(player.body, 5)

  Render.lookAt(render, {
    min: {x: player.body.position.x - room.width / 2, y: player.body.position.y - room.height / 2,},
    max: {x: player.body.position.x + room.width / 2, y: player.body.position.y + room.height / 2},
  });
})

