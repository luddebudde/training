import {Composite, Engine, Events, Mouse, MouseConstraint, Render, Runner, Vector} from "matter-js";
import {applyTorque} from "./src/applyTorque.js";
import {sprites} from "./src/sprites.js";
import {keyDownTracker} from "./src/keyDownTracker.js";
import {direction} from "./src/direction.js";
import {applyAngularFriction} from "./src/applyAngularFriction.js";
import {asteroid} from "./src/asteroid.js";
import {zeros} from "./src/zeros.js";
import {bullet} from "./src/bullet.js";
import {createPlayer, playerRadius} from "./src/createPlayer.js";
import {createEnemy,} from "./src/createEnemy.js";
import {createBomber} from "./src/createBomber.js";
import {throttle} from "throttle-debounce";
import {random} from "./src/random.js";
import {radiansToCartesian} from "./src/radianstToCartesian.js";
import {playBum, playExplosion} from "./src/audio.js";
import {hollowCircle} from "./src/hollowCircle.js";
import {collisionCategories} from "./src/collision.js";
import {thrust} from "./src/thrust.js";
import {drawHealthBar} from "./drawHealthBar.js";
import {drawScore} from "./drawScore.js";
import {moveCameraTo} from "./moveCameraTo.js";
import {average, sum} from "./src/math.js";

const roomRadius = 2000
const asteroidAmounts = 100
const shouldPlayMusic = true


const canvas = document.getElementById('app');
canvas.width = window.innerWidth
canvas.height = window.innerHeight

export const room = {
  height: canvas.height,
  width: canvas.width,
}

const testCollision = (objA, objB) => {
  if (objB !== undefined && objB.isBullet) {
    damage(objA, objB.damage ?? 0)
    damage(objB, objA.damage ?? 0)
  }
}

// create runner
const runner = Runner.create({
  isFixed: false,
})

const spawnPositionOutsideRoom = () => {
  return radiansToCartesian(random(0, 2 * Math.PI), roomRadius + 500)
}

const spawnPostionInsideRoom = () => {
  return radiansToCartesian(random(0, 2 * Math.PI), random(400, roomRadius + 500))
}

const engineAudio = new Audio('audio/engine.mp3');
engineAudio.loop = true
engineAudio.volume = 0

const playEngine = () => {
  const response = engineAudio.play()
  response.then(e => {
    document.body.removeEventListener("mousemove", playEngine)
  }).catch(e => {
  })
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
  }).catch(e => {
  })
}

document.body.addEventListener("mousemove", playMusic)

const addObject = (game, obj) => {
  Composite.add(game.engine.world, obj.worldObjects ?? obj.body)
  game.gameObjects = [
    ...game.gameObjects,
    obj,
  ]
}

const removeObject = (game, obj) => {
  Composite.remove(game.engine.world, obj.body)
  game.gameObjects = game.gameObjects.filter(updateable => updateable !== obj)
}

const getGameObjects = () => game.gameObjects
const createGame = () => {
  const addGameObject = obj => addObject(game, obj)
  const engine = Engine.create({
    gravity: {
      scale: 0,
    },
    timing: {
      timeScale: 0.5
    }
  })
  const game = {
    bullets: [],
    gameObjects: [],
    players: [
      createPlayer(sprites.player('green'), sprites.playerWithJet('green'), addGameObject),
      createPlayer(sprites.player('blue'), sprites.playerWithJet('blue'), addGameObject),
    ],
    engine,
    render: Render.create({
      canvas: canvas,
      element: document.body,
      engine,
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
    })
  }

  // Spawn Player
  addObject(game, game.players[0])
  addObject(game, game.players[1])

  // Spawn asteroid
  zeros(asteroidAmounts).map(() => {
    return asteroid(spawnPostionInsideRoom())
  }).forEach(addGameObject)

  // Spawn room boundary
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


  if (import.meta.env.DEV) {
    // add mouse control and make the mouse revolute
    const mouse = Mouse.create(game.render.canvas)
    const mouseConstraint = MouseConstraint.create(game.engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.6,
        length: 0,
        angularStiffness: 0,
        render: {
          visible: false
        }
      }
    })

    Composite.add(game.engine.world, [mouseConstraint])

    // keep the mouse in sync with rendering
    game.render.mouse = mouse;
  }
  return game
}

const registerEventListeners = () => {
  const handleClickKeydown = (event) => {
    if (event.code === `Space` && game.players[0].health > 0) {
      game.players[0].fire()
    }
    if (event.code === `Period` && game.players[1].health > 0) {
      game.players[1].fire()
    }
    if (event.code === 'KeyR') {
      restartGame()
    }
  }
  addEventListener(`keydown`, handleClickKeydown)

  const handleBeforeUpdate = () => {


    if (isKeyDown(`KeyW`)) {
      game.players[0].thrust()
      engineAudio.volume = 1
    } else {
      game.players[0].dontThrust()
      engineAudio.volume = 0
    }
    if (isKeyDown(`KeyS`)) {
      game.players[0].back()
    }
    if (isKeyDown(`KeyA`)) {
      game.players[0].turnLeft()
    }
    if (isKeyDown(`KeyD`)) {
      game.players[0].turnRight()
    }

    if (isKeyDown(`ArrowUp`)) {
      game.players[1].thrust()
      engineAudio.volume = 1
    } else {
      game.players[1].dontThrust()
      engineAudio.volume = 0
    }
    if (isKeyDown(`ArrowDown`)) {
      game.players[1].back()
    }
    if (isKeyDown(`ArrowLeft`)) {
      game.players[1].turnLeft()
    }
    if (isKeyDown(`ArrowRight`)) {
      game.players[1].turnRight()
    }

    game.bullets.forEach(bullet => {
      // Reset speed
      bullet.update()
    });

    game.gameObjects.forEach((updateable) => updateable.update?.())
    spawnEnemies()

    moveCameraTo(average(game.players[0].camera.position, game.players[1].camera.position), game.render, room.width, room.height)
    drawHealthBar(canvas, 0, room.height - 20, room.width, 20, game.players[0].health)
    drawHealthBar(canvas, 0, room.height - 50, room.width, 20, game.players[1].health)
    drawScore(canvas, room.width - 40, 50, game.players[0].score)
  }
  Events.on(game.engine, "beforeUpdate", handleBeforeUpdate)

  const handleCollisionStart = (event) => {
    const objA = game.gameObjects.find(updateable => updateable.body === event.pairs[0].bodyA)
    const objB = game.gameObjects.find(updateable => updateable.body === event.pairs[0].bodyB)

    testCollision(objA, objB)
    testCollision(objB, objA)
  }

  Events.on(game.engine, "collisionStart", handleCollisionStart)

  return () => {
    removeEventListener(`keydown`, handleClickKeydown)
    Events.off(game.engine, "beforeUpdate", handleBeforeUpdate)
    Events.off(game.engine, "collisionStart", handleCollisionStart)
  }
}
const startGame = () => {
  // run the renderer
  Render.run(game.render);
  // run the engine
  Runner.run(runner, game.engine);
  const cleanupEventListeners = registerEventListeners()
  return () => {
    cleanupEventListeners()
    Render.stop(game.render)
    Runner.stop(runner)
  }
}
const restartGame = () => {
  stopGame()
  game = createGame()
  startGame()
}

const isKeyDown = keyDownTracker()

const spawnEnemies = throttle(3000, () => {
    const r = random(0, 100)
    const position = spawnPositionOutsideRoom()
    if (r < 15) {
      zeros(3).forEach(() => {
        addObject(game, createEnemy(game.players, getGameObjects, position))
      })
    } else if (r < 25) {
      zeros(10).forEach(() => {
        addObject(game, createBomber(game.players, getGameObjects, position))
      })

    } else if (r < 40) {
      zeros(5).forEach(() => {
        addObject(game, createBomber(game.players, getGameObjects, position))
      })
    } else {
      addObject(game, createEnemy(game.players, (obj) => addObject(game, obj), position))
    }
  }
)

const damage = (obj, damage) => {
  if (obj !== undefined && obj.health !== undefined) {
    obj.health = obj.health - damage
    if (obj.health <= 0) {
      removeObject(game, obj)
      playExplosion()
      game.players[0].score = game.players[0].score + (obj.points ?? 0)
    } else {
      playBum()
    }
  }
}

let game = createGame()
const stopGame = startGame()