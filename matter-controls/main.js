import {Bodies, Body, Composite, Engine, Events, Mouse, MouseConstraint, Render, Runner, Vector} from "matter-js";
import {black, darkGrey, green, red, white} from './src/palette.js'
import {down, left, right, up} from "./src/vectors.js";
import {applyTorque} from "./src/applyTorque.js";
import {createRoom} from "./src/createRoom.js";
import {sprites} from "./src/sprites.js";
import {keyDownTracker} from "./src/keyDownTracker.js";

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
    background: `radial-gradient(circle, ${darkGrey} 0%, ${black} 100%)`,
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
Render.lookAt(render, {
  min: {x: 0, y: 0},
  max: {x: room.width, y: room.height}
});

// run the renderer
Render.run(render);
// create runner
const runner = Runner.create();
// run the engine
Runner.run(runner, engine);

// ============= DO NOT EDIT ABOVE ==============

// Init game here
const player = {
  body: Bodies.circle(room.width / 2, room.height / 2, 30, {
    mass: 500,
    frictionAir: 0.1,
  })
}

const objects = [player.body]

// Add all bodies and composites to the world
Composite.add(engine.world, objects);

const isKeyDown = keyDownTracker()

const createBullet = (force) => {
  const bullet = Bodies.circle(player.body.position.x, player.body.position.y, 10, {
    mass: 20,
    frictionAir: 0,
  })
  Body.applyForce(bullet, bullet.position, force)
  return bullet
}

addEventListener(`keydown`, (event) => {
  if (event.code === `ArrowUp`) {
    Composite.add(engine.world, createBullet(up));
  }
  if (event.code === `ArrowDown`) {
    Composite.add(engine.world, createBullet(down));
  }
  if (event.code === `ArrowLeft`) {
    Composite.add(engine.world, createBullet(left));
  }
  if (event.code === `ArrowRight`) {
    Composite.add(engine.world, createBullet(right));
  }
})

Events.on(engine, "beforeUpdate", (event) => {
  //  Called very update
  if (isKeyDown(`KeyW`)) {
    Body.applyForce(player.body, player.body.position, up)
  }
  if (isKeyDown(`KeyS`)) {
    Body.applyForce(player.body, player.body.position, down)
  }
  if (isKeyDown(`KeyA`)) {
    Body.applyForce(player.body, player.body.position, left)
  }
  if (isKeyDown(`KeyD`)) {
    Body.applyForce(player.body, player.body.position, right)
  }
})

