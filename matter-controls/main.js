import {
  Composite,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
  Vector,
} from 'matter-js'
import { sprites } from './src/sprites.js'
import { keyDownTracker } from './src/keyDownTracker.js'
import { asteroid } from './src/asteroid.js'
import { zeros } from './src/zeros.js'
import { createFighter } from './src/createFighter.js'
import { createEnemy } from './src/createEnemy.js'
import { closestPointOnCircle, createBomber } from './src/createBomber.js'
import { throttle } from 'throttle-debounce'
import { random } from './src/random.js'
import { radiansToCartesian } from './src/radianstToCartesian.js'
import { playBum, playExplosion } from './src/audio.js'
import { hollowCircle } from './src/hollowCircle.js'
import { collisionCategories } from './src/collision.js'
import { applyThrust } from './src/applyThrust.js'
import { drawHealthBar } from './drawHealthBar.js'
import { drawScore } from './drawScore.js'
import { moveCameraTo } from './moveCameraTo.js'
import { average, scale, sum } from './src/math.js'
import { createB2 } from './src/createB2.js'
import { createCamera } from './src/createCamera.js'
import { createCoward, isDistanceLessThan } from './src/createCoward.js'
import { miniBox } from './src/ammoBox.js'
import { down, origo } from './src/vectors.js'
import { applyForce } from './src/applyForce.js'
import { createAssault } from './src/createAssault.js'

const roomRadius = 2000
const asteroidAmounts = 100
const shouldPlayMusic = true

const canvas = document.getElementById('app')
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
  return radiansToCartesian(
    random(0, 2 * Math.PI),
    random(400, roomRadius + 500),
  )
}

const engineAudio = new Audio('audio/engine.mp3')
engineAudio.loop = true
engineAudio.volume = 0

const playEngine = () => {
  const response = engineAudio.play()
  response
    .then((e) => {
      document.body.removeEventListener('mousemove', playEngine)
    })
    .catch((e) => {})
}

document.body.addEventListener('mousemove', playEngine)

const musicAudio = new Audio('audio/synthwave-outrun.mp3')
musicAudio.loop = true
musicAudio.volume = 0.7
const playMusic = () => {
  if (!shouldPlayMusic) {
    return
  }
  const response = musicAudio.play()
  response
    .then((e) => {
      document.body.removeEventListener('mousemove', playMusic)
    })
    .catch((e) => {})
}

document.body.addEventListener('mousemove', playMusic)

const addObject = (game, obj) => {
  Composite.add(game.engine.world, obj.worldObjects ?? obj.body)
  game.gameObjects = [...game.gameObjects, obj]
}

const removeObject = (game, obj) => {
  Composite.remove(game.engine.world, obj.body)
  game.gameObjects = game.gameObjects.filter((updateable) => updateable !== obj)
}

const getGameObjects = () => game.gameObjects
const createGame = () => {
  const addGameObject = (obj) => addObject(game, obj)
  const engine = Engine.create({
    gravity: {
      scale: 0,
    },
    timing: {
      // timeScale: 0.7,
    },
  })
  const players = [
    createFighter(addGameObject),
    createFighter(addGameObject),
    createAssault(addGameObject),
  ]
  const game = {
    bullets: [],
    gameObjects: [],
    playerA: players[0],
    playerB: players[1],
    players,
    camera: createCamera(),
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
        // showAxes: true,
        // showVelocity: true,
        // showPositions: true,
        // showCollisions: true,
      },
    }),
  }

  // Spawn Player
  game.players.forEach((player) => {
    addObject(game, player)
  })
  addObject(game, game.camera)

  // Spawn asteroid
  zeros(asteroidAmounts)
    .map(() => {
      return asteroid(spawnPostionInsideRoom())
    })
    .forEach(addGameObject)

  // Spawn room boundary
  Composite.add(
    engine.world,
    hollowCircle(Vector.create(0, 0), 100, roomRadius, {
      width: 100,
      isStatic: true,
      label: 'World Boundary',
      collisionFilter: {
        category: collisionCategories.roomBoundary,
        mask: 0,
      },
      friction: 0,
      render: {
        fillStyle: '#FFFFFF',
        opacity: 0.1,
      },
    }),
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
          visible: false,
        },
      },
    })

    Composite.add(game.engine.world, [mouseConstraint])

    // keep the mouse in sync with rendering
    game.render.mouse = mouse
  }
  return game
}

const getNextShip = (thisPlayer, otherPlayer) => {
  const emptyShips = game.players.filter((ship) => {
    return ship !== otherPlayer
  })
  const nearbyShips = emptyShips.filter((ship) =>
    isDistanceLessThan(thisPlayer.body.position, ship.body.position, 200),
  )
  const playerAIndex = nearbyShips.indexOf(thisPlayer)
  const newIndex = (playerAIndex + 1) % nearbyShips.length
  const nextShip = nearbyShips[newIndex]
  return nextShip
}

const registerEventListeners = () => {
  const handleClickKeydown = (event) => {
    if (event.code === 'KeyR') {
      restartGame()
    }
    if (event.code === 'KeyC') {
      game.playerA = getNextShip(game.playerA, game.playerB)
    }
    if (event.code === 'Numpad0') {
      game.playerB = getNextShip(game.playerB, game.playerA)
    }
  }
  addEventListener(`keydown`, handleClickKeydown)

  const handleBeforeUpdate = () => {
    // Player 1
    if (isKeyDown(`KeyW`)) {
      game.playerA.thrust()
      engineAudio.volume = 1
    } else {
      game.playerA.dontThrust()
      engineAudio.volume = 0
    }
    if (isKeyDown(`KeyS`)) {
      game.playerA.back()
    }
    if (isKeyDown(`KeyA`)) {
      game.playerA.turnLeft()
    }
    if (isKeyDown(`KeyD`)) {
      game.playerA.turnRight()
    }
    if (isKeyDown(`Space`) && game.playerA.health > 0) {
      game.playerA.fire()
    }

    // Player 2
    if (isKeyDown(`ArrowUp`)) {
      game.playerB.thrust()
      engineAudio.volume = 1
    } else {
      game.playerB.dontThrust()
      engineAudio.volume = 0
    }
    if (isKeyDown(`ArrowDown`)) {
      game.playerB.back()
    }
    if (isKeyDown(`ArrowLeft`)) {
      game.playerB.turnLeft()
    }
    if (isKeyDown(`ArrowRight`)) {
      game.playerB.turnRight()
    }
    if (isKeyDown(`Period`) && game.playerB.health > 0) {
      game.playerB.fire()
    }

    game.bullets.forEach((bullet) => {
      // Reset speed
      bullet.update()
    })

    moveCameraTo(
      game.camera.body.position,
      game.render,
      room.width,
      room.height,
    )

    game.gameObjects.forEach((updateable) => updateable.update?.(game))

    game.players.forEach((ship) => applyRoomBoundaryForce(ship.body))

    spawnEnemies()
    spawnAmmo()
    const margin = 20
    const height = 20
    const width = room.width / 2 - margin * 2
    const ctx = canvas.getContext('2d')
    drawHealthBar(
      ctx,
      margin,
      room.height - height - margin,
      width,
      height,
      game.playerA.health,
      game.playerA.maxHealth,
    )
    drawHealthBar(
      ctx,
      room.width - width - margin,
      room.height - margin - height,
      width,
      20,
      game.playerB.health,
      game.playerB.maxHealth,
    )
    const canvasPos = (pos) => {
      const cameraPos = game.camera.body.position
      return sum(
        pos,
        Vector.neg(cameraPos),
        Vector.create(canvas.width / 2, canvas.height / 2),
      )
    }
    game.gameObjects
      .filter((gameObject) => gameObject.type !== 'asteroid')
      .filter((gameObject) => gameObject.health > 1 && gameObject.maxHealth)
      .forEach((gameObject) => {
        const position = canvasPos(
          sum(
            gameObject.body.position,
            scale(down, gameObject.body.circleRadius * 1),
          ),
        )
        const barWidth = gameObject.body.circleRadius * 1.2
        const barHeight = 5
        drawHealthBar(
          ctx,
          position.x - barWidth / 2,
          position.y + barHeight / 2,
          barWidth,
          barHeight,
          gameObject.health,
          gameObject.maxHealth,
        )
      })
    drawScore(canvas, room.width - 40, 50, game.playerA.score)
  }
  Events.on(game.engine, 'beforeUpdate', handleBeforeUpdate)

  const handleCollisionStart = (event) => {
    const objA = game.gameObjects.find(
      (updateable) => updateable.body === event.pairs[0].bodyA,
    )
    const objB = game.gameObjects.find(
      (updateable) => updateable.body === event.pairs[0].bodyB,
    )

    testCollision(objA, objB)
    testCollision(objB, objA)
  }

  Events.on(game.engine, 'collisionStart', handleCollisionStart)

  return () => {
    removeEventListener(`keydown`, handleClickKeydown)
    Events.off(game.engine, 'beforeUpdate', handleBeforeUpdate)
    Events.off(game.engine, 'collisionStart', handleCollisionStart)
  }
}
const startGame = () => {
  // run the renderer
  Render.run(game.render)
  // run the engine
  Runner.run(runner, game.engine)
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
  if (r < 10) {
    zeros(1).forEach(() => {
      addObject(
        game,
        createB2(game.players, (obj) => addObject(game, obj), position),
      )
    })
  } else if (r < 40) {
    zeros(7).forEach(() => {
      addObject(game, createBomber(game.players, getGameObjects, position))
    })
  } else if (r < 50) {
    addObject(
      game,
      createCoward(
        game.players,
        getGameObjects,
        position,
        spawnPostionInsideRoom(),
      ),
    )
  } else {
    addObject(
      game,
      createEnemy(game.players, (obj) => addObject(game, obj), position),
    )
  }
})

const spawnAmmo = throttle(3000, () => {
  const r = random(0, 100)
  if (r < 100) {
    addObject(game, miniBox(spawnPostionInsideRoom()))
  }
})

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

const applyRoomBoundaryForce = (body) => {
  if (!isDistanceLessThan(body.position, origo, roomRadius)) {
    applyForce(
      body,
      scale(
        Vector.sub(
          closestPointOnCircle(body.position, origo, roomRadius),
          body.position,
        ),
        0.05,
      ),
    )
  }
}

let game = createGame()
const stopGame = startGame()
