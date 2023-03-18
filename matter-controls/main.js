import { Bodies, Body, Composite, Engine, Events, Mouse, MouseConstraint, Render, Runner, Vector } from "matter-js";
import { black, darkGrey, green, red, white } from './src/palette.js'
import { down, left, right, up } from "./src/vectors.js";
import { applyTorque } from "./src/applyTorque.js";
import { createRoom  } from "./src/createRoom.js";
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
import { sum } from "./src/math.js";
import { radiansToCartesian } from "./src/radianstToCartesian.js";
import { playBum, playExplosion } from "./src/audio.js";
import {hollowCircle} from "./src/hollowCircle.js";
import {collisionCategories} from "./src/collision.js";
import {thrust} from "./src/thrust.js";

const shouldPlayMusic = true

const engineAudio = new Audio('audio/engine.mp3');
engineAudio.loop = true
engineAudio.volume = 0

const playEngine = () => {
  const response = engineAudio.play()
  response.then(e => {
    document.body.removeEventListener("mousemove", playEngine)
  }).catch(e => { })
}

document.body.addEventListener("mousemove", playEngine)

const musicAudio = new Audio('audio/synthwave-outrun.mp3');
musicAudio.loop = true
musicAudio.volume = 0.7
const playMusic = () => {
  if (!shouldPlayMusic) {
    return
  }
  const response = musicAudio.play()
  response.then(e => {
    document.body.removeEventListener("mousemove", playMusic)
  }).catch(e => { })
}

document.body.addEventListener("mousemove", playMusic)

// create an engine
const engine = Engine.create({
  gravity: {
    scale: 0,
  },
  timing: {
    timeScale: 0.5
  }
});

const canvas = document.getElementById('app');
canvas.width = window.innerWidth
canvas.height = window.innerHeight

export const room = {
  height: canvas.height,
  width: canvas.width,
}
const roomRadius = 2000

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
    // showAngleIndicator: import.meta.env.DEV,
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


// create runner
const runner = Runner.create({
  isFixed: false,
})
// run the renderer
Render.run(render);
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
const asteroidAmounts = 100

let bullets = [
]
let gameObjects = [
]

const spawnPositionOutsideRoom = () => {
  return radiansToCartesian(random(0, 2 * Math.PI), roomRadius + 500)
}


const spawnPostionInsideRoom = () => {
  return radiansToCartesian(random(0, 2 * Math.PI), random(400, roomRadius + 500))
}

// Spawn in the beginning

zeros(asteroidAmounts).map(() => {
  return asteroid(spawnPostionInsideRoom())
}).forEach(addObject)
Composite.add(
  engine.world,
  hollowCircle(Vector.create(0, 0), 100, roomRadius, {
    width: 100,
    isStatic: true,
    label: 'World Boundary',
    collisionFilter: {
      category: collisionCategories.roomBoundary,
      mask: collisionCategories.player,
    },
    render: {
      fillStyle: '#FFFFFF',
      opacity: 0.1,
    },
  })
)

addObject(player)

const isKeyDown = keyDownTracker()


const fireP = throttle(300, () => {
  const spawnPos = Vector.add(player.body.position, Vector.mult(direction(player.body), playerRadius))
  const newBullet = bullet(spawnPos, direction(player.body))
  addObject(newBullet)
  const audio = new Audio('audio/player-rifle.mp3');
  audio.play();

})

const spawnEnemies = throttle(3000, () => {
  const r = random(0, 100)
  const position = spawnPositionOutsideRoom()
  if (r < 15) {
    zeros(3).forEach(() => {
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
      player.score = player.score + (obj.points ?? 0)
    } else{
      playBum()
    }
  }

}

Events.on(engine, "beforeUpdate", (event) => {
  //  Called very update
  const playerTorque = 0.2
  const playerThrust = 1

  if (isKeyDown(`KeyW`)) {
    thrust(player.body, playerThrust)
    player.body.render.sprite.texture = sprites.playerWithJet.texture
    engineAudio.volume = 1
  } else{
    player.body.render.sprite.texture = sprites.playerWithoutJet.texture
    engineAudio.volume = 0
  }
  if (isKeyDown(`KeyS`)) {
    thrust(player.body, -playerThrust * 0.3)
  }
  if (isKeyDown(`KeyA`)) {
    applyTorque(player.body, playerTorque)
  }
  if (isKeyDown(`KeyD`)) {
    applyTorque(player.body, -playerTorque)
  }


  applyAngularFriction(player.body, 5)

  bullets.forEach(bullet => {
    // Reset speed
    bullet.update()
  });

  gameObjects.forEach((updateable) => updateable.update?.())
  spawnEnemies()

  lookAt(player.camera.position)
  drawHealthBar()
  drawScore()
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

const drawScore = () => {
  const ctx = canvas.getContext("2d");
  ctx.font = "48px serif";
  ctx.fillText(player.score, room.width - 40, 50);
}

Events.on(engine, "collisionStart", (event) => {
  const objA = gameObjects.find(updateable => updateable.body == event.pairs[0].bodyA)
  const objB = gameObjects.find(updateable => updateable.body == event.pairs[0].bodyB)

  testCollision(objA, objB)
  testCollision(objB, objA)
}
)
