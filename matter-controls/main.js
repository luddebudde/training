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
import { asteroid} from "./src/asteroid.js";
import { zeros } from "./src/nTimes";
import { bullet, setBulletDirection } from "./src/bullet.js";

// create an engine
const engine = Engine.create();
engine.gravity.scale = 0
const canvas = document.getElementById('app');

export const room = {
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
    // showAngleIndicator: true,
    // showVelocity: true,
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
const runner = Runner.create()
// run the engine
Runner.run(runner, engine);

// ============= DO NOT EDIT ABOVE ==============


// Init game here
const playerRadius = 60
const player = {
  body: Bodies.circle(room.width / 2, room.height / 2, playerRadius, {
    mass: 500,
    frictionAir: 0.05,  
    render: {
      sprite: {
        texture: sprites.player.texture,
        xScale: 2 * playerRadius / sprites.player.width,
        yScale: 2 * playerRadius / sprites.player.height,
      },
    },
  })
}


const objects = [
  player.body, 
  ...zeros(500).map(() => {
    return asteroid(player)
  })
]

// Add all bodies and composites to the world
Composite.add(engine.world, objects);

const isKeyDown = keyDownTracker()

let bullets = [
]

addEventListener(`keydown`, (event) => {
  if (event.code === `Space`) { 
    const spawnPos = Vector.add(player.body.position, Vector.mult (direction(player.body), playerRadius))
    const newBullet = bullet(spawnPos,direction(player.body))
    Composite.add(engine.world, newBullet);
    bullets = [
      newBullet,
      ...bullets,
    ]
  }
})

Events.on(engine, "beforeUpdate", (event) => {
  //  Called very update
  if (isKeyDown(`KeyW`)) {
    Body.applyForce(player.body, player.body.position, Vector.mult(direction(player.body), 1))
  } 
  if (isKeyDown(`KeyS`)) {
    Body.applyForce(player.body, player.body.position, Vector.mult(direction(player.body), -0.5))
  }
  if (isKeyDown(`KeyA`)) {
    applyTorque(player.body, 0.5)
  }
  if (isKeyDown(`KeyD`)) {
    applyTorque(player.body, -0.5)
  }

  applyAngularFriction(player.body, 5)

  bullets.forEach(bullet => {
    // Set angle in velocity direction 
    Body.setAngle(
      bullet,
      Vector.angle(
        right,
        bullet.velocity,
      )
    )    
    // Reset speed
    setBulletDirection(bullet, bullet.velocity)
  });

  Render.lookAt(render, {
    min: {x: player.body.position.x - room.width / 2, y: player.body.position.y - room.height / 2,},
    max: {x: player.body.position.x + room.width / 2, y: player.body.position.y + room.height / 2},
  });
})

