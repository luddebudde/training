import {Bodies, Body, Composite, Engine, Events, Mouse, MouseConstraint, Render, Runner, Vector} from "matter-js";
import {black, darkGrey, green, red, white} from './src/palette.js'
import {down, left, right, up} from "./src/vectors.js";
import {applyTorque} from "./src/applyTorque.js";
import {createRoom} from "./src/createRoom.js";
import {sprites} from "./src/sprites.js";
import {keyDownTracker} from "./src/keyDownTracker.js";

// create an engine
const engine = Engine.create();
const world = engine.world
engine.gravity.scale = 0
const canvas = document.getElementById('app');

const roomDim = {
  height: 1000,
  width: 1500,
  wallThickness: 50,
}
// create a renderer
const render = Render.create({
  canvas: canvas,
  element: document.body,
  engine: engine,
  options: {
    // showCollisions: true,  
    wireframes: false,
    height: roomDim.height,
    width: roomDim.width,
    background: `radial-gradient(circle, ${darkGrey} 0%, ${black} 100%)`,
    // For debugging
    // showMousePosition: true,
    // showAngleIndicator: true,
    // showPerformance: true,
  },
});

const playerStartDist = 100 // Distance from wall

const createPlayer = (color, xPos) => {
  const playerHeight = 200
  const playerWidth = 20
  return Bodies.rectangle(xPos, roomDim.height / 2, playerWidth, playerHeight, {
    mass: 10,
    frictionAir: 0.2,
    render: {
      fillStyle: color,
    },
  });
}

// create two boxes and a ground
const playerABody = createPlayer(green, playerStartDist + roomDim.wallThickness/2)
const playerBBody = createPlayer(red, roomDim.width - playerStartDist - roomDim.wallThickness/2)

const ballRadius = 20
const rubberBall = Bodies.circle(roomDim.width / 2, roomDim.height / 2, ballRadius, {
  mass: 2,
  frictionAir: 0.0,
  restitution: 0.9,
  frictionStatic: 0,
  inertia: Infinity,
  render: {
    sprite: {
      texture: sprites.pingPongBall.texture,
      xScale: 2 * ballRadius / sprites.pingPongBall.width,
      yScale: 2 * ballRadius / sprites.pingPongBall.height,
    },
    fillStyle: white,
  }
})

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

const room = createRoom(roomDim.width, roomDim.height, roomDim.wallThickness, {
  isStatic: true,
  render: {
    fillStyle: darkGrey,
  },
})

// Add all bodies and composites to the world
Composite.add(engine.world, [room, playerABody, playerBBody, rubberBall, mouseConstraint]);

// keep the mouse in sync with rendering
render.mouse = mouse;

// fit the render viewport to the scene
Render.lookAt(render, {
  min: {x: 0, y: 0},
  max: {x: roomDim.width, y: roomDim.height}
});

// run the renderer
Render.run(render);
// create runner
const runner = Runner.create();

const applyForceTo = (body, direction) => Body.applyForce(body, body.position, Vector.mult(direction, 0.1))

// const keyHandlers = {
//   KeyA: applyForceTo(playerABody, left),
//   KeyD: applyForceTo(playerABody, right),
//   KeyW: applyForceTo(playerABody, up),
//   KeyS: applyForceTo(playerABody, down),
//   ArrowLeft: applyForceTo(playerBBody, left),
//   ArrowRight: applyForceTo(playerBBody, right),
//   ArrowUp: applyForceTo(playerBBody, up),
//   ArrowDown: applyForceTo(playerBBody, down),
// };

const keysDown = new Set();

const isKeyDown = keyDownTracker()

document.addEventListener("keydown", event => {
  keysDown.add(event.code);
});

document.addEventListener("keyup", event => {
  keysDown.delete(event.code);
});

const applySpringTorque = (body) => {
  const torque = 0.5 * body.angle
  applyTorque(body, torque)
}

Events.on(engine, "beforeUpdate", event => {
  if(isKeyDown('KeyA')){
    applyForceTo(playerABody, left)
  }
  if(isKeyDown('KeyD')){
    applyForceTo(playerABody, right)
  }
  if(isKeyDown('KeyW')){
    applyForceTo(playerABody, up)
  }
  if(isKeyDown('KeyS')){
    applyForceTo(playerABody, down)
  }

  if(isKeyDown('ArrowLeft')){
    applyForceTo(playerBBody, left)
  }
  if(isKeyDown('ArrowRight')){
    applyForceTo(playerBBody, right)
  }
  if(isKeyDown('ArrowUp')){
    applyForceTo(playerBBody, up)
  }
  if(isKeyDown('ArrowDown')){
    applyForceTo(playerBBody, down)
  }

  applySpringTorque(playerABody)
  applySpringTorque(playerBBody)

});

// run the engine
Runner.run(runner, engine);
