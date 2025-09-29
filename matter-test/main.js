import { MouseConstraint } from "matter-js";
import { Mouse } from "matter-js";
import { Engine, Render, Runner, Bodies, Composite } from "matter-js";

// create an engine
const engine = Engine.create();
const world = engine.world
engine.gravity.scale = 0
var canvas = document.getElementById('app');
const room = {
  height: 1000,
  width: 1000,
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
    height: room.height,
    width: room.width,
    // showMousePosition: true,
    // background: '#fafafa',
  },
});

// create two boxes and a ground
const boxA = Bodies.rectangle(400, 200, 250, 20, {
  render: {
    fillStyle: "red",
  },
});
const circleA = Bodies.circle(300, 100, 80)
const rubberBall = Bodies.circle(340, 100, 40, {
      frictionAir: 0,
      restitution: 1,
})
const boxB = Bodies.rectangle(450, 50, 80, 80);
const boxC = Bodies.rectangle(500, 50, 80, 80);
const ground = Bodies.rectangle(room.width / 2, room.height, room.width, room.wallThickness, {
  isStatic: true,
  render: {
    fillStyle: "yellow",
  },
});
const ceiling = Bodies.rectangle(room.width / 2, 0, room.width, room.wallThickness,{
  isStatic: true,
  render: {
    fillStyle: "yellow",
  },
})
const leftWall = Bodies.rectangle(0, room.height / 2, room.wallThickness, room.height,{
  isStatic: true,
  render: {
    fillStyle: "yellow",
  },
})
const rightWall = Bodies.rectangle(room.width, room.height / 2, room.wallThickness, room.height,{
  isStatic: true,
  render: {
    fillStyle: "yellow",
  },
})
 // add mouse control and make the mouse revolute
 const mouse = Mouse.create(render.canvas),
 mouseConstraint = MouseConstraint.create(engine, {
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

// add all of the bodies to the world
Composite.add(engine.world, [boxA, boxB, boxC, ground, ceiling, leftWall, rightWall, circleA, rubberBall, mouseConstraint]);

// keep the mouse in sync with rendering
render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: room.width, y: room.height }
  });

// run the renderer
Render.run(render);
// create runner
const runner = Runner.create();

// run the engine
Runner.run(runner, engine);
