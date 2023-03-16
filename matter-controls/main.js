import { Bodies, Body, Composite, Engine, Events, Mouse, MouseConstraint, Render, Runner, Vector } from "matter-js";
import { black, darkGrey, green, red, white } from './src/palette.js'
import { down, left, right, up } from "./src/vectors.js";
import { applyTorque } from "./src/applyTorque.js";
import { createRoom } from "./src/createRoom.js";
import { sprites } from "./src/sprites.js";
import { keyDownTracker } from "./src/keyDownTracker.js";
import { direction } from "./src/direction.js";
import { applySpringTorque } from "./src/applySpringTorque";
import { applyAngularFriction } from "./src/applyAngularFriction.js";
import { asteroid } from "./src/asteroid.js";
import { zeros } from "./src/zeros.js";
import { bullet, setBulletDirection } from "./src/bullet.js";
import { createPlayer, playerRadius } from "./src/createPlayer.js";
import { createEnemy, engineStrength, } from "./src/createEnemy.js";
import { createBomber } from "./src/createBomber.js";
import { ebullet } from "./src/eBullet.js";
import { throttle } from "throttle-debounce";
import { random } from "./src/random.js";
import { add } from "./src/math.js";
import { radiansToCartesian } from "./src/radianstToCartesian.js";
import { playBum, playExplosion } from "./src/audio.js";

const shouldPlayMusic = true

const audio = new Audio('audio/synthwave-outrun.mp3');
const playMusic = () => {
  if (!shouldPlayMusic) {
    return
  }
  const response = audio.play()
  response.then(e => {
    document.body.removeEventListener("mousemove", playMusic)
  }).catch(e => { })
}

document.body.addEventListener("mousemove", playMusic)



// create an engine
const engine = Engine.create();
engine.gravity.scale = 0
const canvas = document.getElementById('app');
canvas.width = window.innerWidth
canvas.height = window.innerHeight

export const room = {
  height: canvas.height,
  width: canvas.width,
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
    showDebug: import.meta.env.DEV,
    // background: `radial-gradient(circle, ${darkGrey} 0%, ${black} 100%)`,
    // For debugging
    // showMousePosition: true,
    // showAngleIndicator: true,
    // showVelocity: true,
    // showPerformance: true,
  },
});
if (import.meta.env.DEV) {
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
}

// fit the render viewport to the scene


// run the renderer
Render.run(render);
// create runner
const runner = Runner.create({
  isFixed: true,
})
// run the engine
Runner.run(runner, engine);

// ============= DO NOT EDIT ABOVE ==============

const addObject = (obj) => {
  Composite.add(engine.world, obj.worldObjects ?? obj.body)
  gameObjects = [
    ...gameObjects,
    obj,
  ]
}
const removeObject = (obj) => {
  Composite.remove(engine.world, obj.body)
  gameObjects = gameObjects.filter(updateable => updateable !== obj)
}

const getGameObjects = () => gameObjects

// Init game here
const player = createPlayer()
// const enemies = zeros(3).map(() => createEnemy(player, addObject))
// const bombers = zeros(20).map(() => createBomber(player, getGameObjects))
const asteroidAmounts = 20

let bullets = [
]
let gameObjects = [
]

const spawnPosition = () => {
  return Vector.add(radiansToCartesian(random(0, 2 * Math.PI), random(room.width * 1.1, room.width * 1.3)), player.body.position)
}
zeros(asteroidAmounts).map(() => {
  return asteroid(spawnPosition())
}).forEach(addObject)

addObject(player)

const isKeyDown = keyDownTracker()


const fireP = throttle(300, () => {
  const spawnPos = Vector.add(player.body.position, Vector.mult(direction(player.body), playerRadius))
  const newBullet = bullet(spawnPos, direction(player.body))
  addObject(newBullet)
  const audio = new Audio('audio/player-rifle.mp3');
  audio.play();

})

const spawnEnemies = throttle(5000, () => {
  const r = random(0, 100)
  const position = spawnPosition()
  if (r < 15) {
    zeros(2).forEach(() => {
      addObject(createEnemy(player, getGameObjects, position))
    })
  } else if (r < 25) {
    zeros(15).forEach(() => {
      addObject(createBomber(player, getGameObjects, position))
    })

  } else if (r < 40) {
    zeros(10).forEach(() => {
      addObject(createBomber(player, getGameObjects, position))
    })
  } else {
    addObject(createEnemy(player, addObject, position))
  }
}
)

const spawnAsteroids = throttle(500, () => {
  const position = spawnPosition()
  addObject(asteroid(position))
}
)


addEventListener(`keydown`, (event) => {
  if (event.code === `Space` && player.health > 0) {
    fireP()
  }
})


const testCollision = (objA, objB) => {
  if (objB !== undefined && objB.isBullet) {
    damage(objA, objB.damage ?? 0)
    damage(objB, objA.damage ?? 0)

  }
}

const damage = (obj, damage) => {
  if (obj !== undefined && obj.health !== undefined) {
    obj.health = obj.health - damage
    if (obj.health <= 0) {
      removeObject(obj)
      playExplosion()
    } else{
      playBum()
    }
  }

}

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
    // Reset speed
    bullet.update()
  });

  gameObjects.forEach((updateable) => updateable.update?.())
  spawnEnemies()
  spawnAsteroids()

  lookAt(player.camera.position)
  drawHealthBar()
})

const lookAt = (pos) => {
  Render.lookAt(render, {
    min: { x: pos.x - room.width / 2, y: pos.y - room.height / 2, },
    max: { x: pos.x + room.width / 2, y: pos.y + room.height / 2 },
  });
}

const drawHealthBar = () => {
  const maxHealth = 200
  const health = player.health
  const percentageHealth = health / maxHealth
  const ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.rect(0, room.height - 30, room.width, room.height);
  ctx.fillStyle = "green"
  ctx.fill()
  ctx.beginPath();
  ctx.rect(percentageHealth * room.width, room.height - 30, room.width, room.height)
  ctx.fillStyle = "red"
  ctx.fill()
}


Events.on(engine, "collisionStart", (event) => {
  const objA = gameObjects.find(updateable => updateable.body == event.pairs[0].bodyA)
  const objB = gameObjects.find(updateable => updateable.body == event.pairs[0].bodyB)

  testCollision(objA, objB)
  testCollision(objB, objA)
}
)
