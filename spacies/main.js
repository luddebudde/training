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
import { keyDownTracker } from './src/keyDownTracker'
import { asteroid } from './src/asteroid'
import {
  down,
  left,
  origo,
  radiansToCartesian,
  random,
  scale,
  sum,
  zeros,
} from './src/math'
import {
  createAssault,
  createB2,
  createBomber,
  createCoward,
  createEnemy,
  createFighter,
  createRhino,
  isDistanceLessThan,
} from './src/ships'
import { throttle } from 'throttle-debounce'
import { playBum, playBuy } from './src/audio'
import { hollowCircle } from './src/hollowCircle'
import { collisionCategories } from './src/collision'
import {
  blueLight,
  green,
  greenLight,
  red,
  redLight,
  white,
} from './src/palette'
import { drawHealthBar } from './drawHealthBar'
import { drawScore } from './drawScore'
import { moveCameraTo } from './moveCameraTo'
import { createCamera } from './src/createCamera'
import { distanceToCircle } from './src/distance'
import { drawFuelBar } from './drawFuelBar'
import { addObject } from './src/addObject'
import { removeObject } from './src/removeObject'
import { applyGravitationalWellForce } from './src/physics'
import { canvasCoordinate } from './src/canvasCoordinate'
import { createOuterBoundary } from './src/createOuterBoundary.ts'
import { loadImage } from './src/image.ts'
import { createAstronaut } from './src/ships/createAstronaut.ts'
import { comet } from './src/comet.ts'
import { drawOffScreenArrow } from './src/drawOffScreenArrow.ts'

const assets = {
  astronaut: await loadImage('/ships/player/astronaut.png'),
  assault: await loadImage(`/ships/player/large/assault.png`),
  fighter: await loadImage(`/ships/player/large/green.png`),
  rhino: await loadImage(`/ships/player/large/green-rhino.png`),
  jet: await loadImage('/animations/jet-even.png'),
  explosion: await loadImage('/animations/explosion.png'),
  comet: await loadImage('/animations/comet.png'),
}

const roomRadius = 2000
const spawnRadius = roomRadius + 1000
const outerBoundaryRadius = spawnRadius + 1000
// const roomRadius = 500
const shouldPlayMusic = true

const canvas = document.getElementById('app')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

export const room = {
  height: canvas.height,
  width: canvas.width,
}

const testCollision = (objA, objB) => {
  if (objB !== undefined && objB.damage > 0) {
    damage(objA, objB.damage ?? 0)
    damage(objB, objA.damage ?? 0)
  }

  if (objA.speed !== undefined) {
    const energy = objA.body.mass * objA.speed() * objA.speed()
    const collisionDamage = energy * 0.0005
    damage(objB, collisionDamage)
  }
}

// create runner
const runner = Runner.create({
  isFixed: false,
})

const randomPositionOutsideRoom = () => {
  return radiansToCartesian(random(0, 2 * Math.PI), spawnRadius)
}

const randomPositionInsideRoom = () => {
  const innerMargin = 400
  const outerMargin = -500
  return radiansToCartesian(
    random(0, 2 * Math.PI),
    random(innerMargin, roomRadius - outerMargin),
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

const getGameObjects = () => game.gameObjects
const createGame = () => {
  const addGameObject = (obj) => addObject(game, obj)
  const engine = Engine.create({
    gravity: {
      scale: 0,
    },
    timing: {
      timeScale: 0.7,
    },
  })
  const game = {
    gameObjects: [],
    comets: [],
    // playerAScore: 0,
    // playerBScore: 0,
    score: 0,
    balance: 0,
    playerShips: [],
    camera: createCamera(),
    explosions: [],
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
        wireframeBackground: true,
        background: undefined,
        showDebug: import.meta.env.DEV,
        // background: `radial-gradient(circle, ${darkGrey} 0%, ${black} 100%)`,
        // For debugging
        // showMousePosition: true,
        showAngleIndicator: import.meta.env.DEV,
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
  zeros(2).forEach((player) => {
    addObject(game, createFighter(origo, addGameObject, getPlayers, assets))
  })
  game.playerA = game.playerShips[0]
  game.playerB = game.playerShips[1]

  addObject(game, game.camera)

  // Spawn asteroid
  const asteroidAmounts = 10
  zeros(asteroidAmounts)
    .map(() => {
      return asteroid(randomPositionInsideRoom(), Vector.mult(left, 100))
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
  // Outerboundry
  addGameObject(createOuterBoundary(outerBoundaryRadius))

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
  const emptyShips = game.playerShips.filter((ship) => {
    return ship !== otherPlayer
  })
  const nearbyShips = emptyShips
    .filter(
      (ship) =>
        ship.health > 0 &&
        isDistanceLessThan(thisPlayer.body.position, ship.body.position, 200),
    )
    .sort((a, b) => {
      return (
        distanceToCircle(
          thisPlayer.body.position,
          a.body.position,
          a.body.circleRadius,
        ) -
        distanceToCircle(
          thisPlayer.body.position,
          b.body.position,
          b.body.circleRadius,
        )
      )
    })
  if (nearbyShips.length === 0) {
    return undefined
  }
  const playerAIndex = nearbyShips.indexOf(thisPlayer)
  const newIndex = (playerAIndex + 1) % nearbyShips.length
  return nearbyShips[newIndex]
}

const priceList = [
  {
    keyNumber: 1,
    price: 750,
    createShip: createFighter,
    image: assets.fighter,
  },
  {
    keyNumber: 2,
    price: 1000,
    createShip: createAssault,
    image: assets.assault,
  },
  {
    keyNumber: 3,
    price: 1500,
    createShip: createRhino,
    image: assets.rhino,
  },
]
const registerEventListeners = () => {
  const handleClickKeydown = (event) => {
    if (event.code === 'KeyR') {
      restartGame()
    }
    if (event.code === 'KeyC') {
      const nextShip = getNextShip(game.playerA, game.playerB)
      if (nextShip !== undefined) {
        game.playerA = nextShip
      }
    }
    if (event.code === 'Comma') {
      const nextShip = getNextShip(game.playerB, game.playerA)
      if (nextShip !== undefined) {
        game.playerB = nextShip
      }
    }

    if (isKeyDown(`KeyP`)) {
      game.balance = game.balance + 100000
    }

    const buy = (keyNumber, price, createShip) => {}

    // buy(1, 750, createFighter)
    //
    // buy(2, 1000, createAssault)
    //
    // buy(3, 1500, createRhino)

    priceList.forEach((item) => {
      if (
        event.code === `Digit${item.keyNumber}` ||
        event.code === `Numpad${item.keyNumber}`
      ) {
        if (game.balance >= item.price) {
          const newShip = item.createShip(
            randomPositionOutsideRoom(),
            (obj) => addObject(game, obj),
            getPlayers,
            assets,
          )
          addObject(game, newShip)
          game.balance = game.balance - item.price
          playBuy()
        }
      }
    })
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
    if (isKeyDown(`Space`)) {
      game.playerA.fire()
    }
    if (isKeyDown(`KeyA`)) {
      game.playerA.turnLeft()
    }
    if (isKeyDown(`KeyD`)) {
      game.playerA.turnRight()
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

    if (isKeyDown(`Period`)) {
      game.playerB.fire()
    }
    if (isKeyDown(`ArrowLeft`)) {
      game.playerB.turnLeft()
    }
    if (isKeyDown(`ArrowRight`)) {
      game.playerB.turnRight()
    }

    moveCameraTo(
      game.camera.body.position,
      game.render,
      room.width,
      room.height,
    )

    game.gameObjects.forEach((gameObject) => gameObject.update?.(game))

    game.playerShips.forEach((ship) =>
      applyGravitationalWellForce(ship.body, roomRadius, 0.05),
    )

    spawnEnemies()
    // spawnAsteriods()
    spawnComet()

    const ctx = canvas.getContext('2d')

    game.gameObjects.forEach((gameObject) => {
      if (gameObject.draw !== undefined) {
        ctx.translate(
          -game.camera.body.position.x,
          -game.camera.body.position.y,
        )
        ctx.translate(gameObject.body.position.x, gameObject.body.position.y)
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate(gameObject.body.angle)
        gameObject.draw(ctx, assets, gameObject)
        ctx.setTransform(1, 0, 0, 1, 0, 0)
      }
    })

    game.explosions.forEach((explosion) => {
      explosion.animationState += 1
      const imageMaxCount = 7
      const imageCount = Math.floor(explosion.animationState / 10)
      if (imageCount >= imageMaxCount) {
        // todo remove from list
        return
      }
      ctx.translate(-game.camera.body.position.x, -game.camera.body.position.y)
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.drawImage(
        assets.explosion,
        imageCount * (assets.explosion.width / imageMaxCount),
        0,
        assets.explosion.width / imageMaxCount,
        assets.explosion.height,
        explosion.position.x - explosion.radius,
        explosion.position.y - explosion.radius,
        explosion.radius * 2,
        explosion.radius * 2,
      )
      ctx.setTransform(1, 0, 0, 1, 0, 0)
    })

    priceList.forEach((item, index) => {
      ctx.fillStyle = 'yellow'
      ctx.font = '30px serif'
      ctx.fillText(item.price.toString(), 110, 100 + index * 50)
      ctx.drawImage(item.image, 5, 80 + index * 50, 40, 40)
    })

    const margin = 20
    const height = 20
    const width = room.width / 2 - margin * 2

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
      height,
      game.playerB.health,
      game.playerB.maxHealth,
    )

    const nextPlayerAShip = getNextShip(game.playerA, game.playerB)
    const nextPlayerBShip = getNextShip(game.playerB, game.playerA)
    if (nextPlayerAShip !== undefined && nextPlayerAShip !== game.playerA) {
      drawCircleAroundEmptyShip(
        ctx,
        nextPlayerAShip.body.position,
        'C',
        nextPlayerAShip.body.circleRadius * 1.3,
        greenLight,
      )
    }
    if (nextPlayerBShip !== undefined && nextPlayerBShip !== game.playerB) {
      drawCircleAroundEmptyShip(
        ctx,
        nextPlayerBShip.body.position,
        ';',
        nextPlayerBShip.body.circleRadius * 1.3,
        blueLight,
      )
    }

    game.gameObjects
      .filter((gameObject) => gameObject.type !== 'asteroid')
      .filter((gameObject) => gameObject.health > 1 && gameObject.maxHealth)
      .forEach((gameObject) => {
        const position = canvasCoordinate(
          sum(
            gameObject.body.position,
            scale(down, gameObject.body.circleRadius * 1),
          ),
          game.camera.body.position,
          canvas,
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

        if (gameObject.fuel !== undefined) {
          drawFuelBar(
            ctx,
            position.x - barWidth / 2.2,
            position.y + barHeight / 2 + 12,
            barWidth,
            barHeight,
            gameObject.fuel(),
            gameObject.maxFuel,
          )
        }
      })
    drawScore(ctx, room.width / 2, 50, game.score)
    drawScore(ctx, room.width / 2, 100, `€${game.balance}`)

    // UI
    game.comets.forEach((obj) =>
      drawOffScreenArrow(
        ctx,
        obj.body.position,
        canvas,
        game.camera.body.position,
        redLight,
      ),
    )
    const players = [game.playerA, game.playerB]
    game.playerShips
      .filter((ship) => players.indexOf(ship) < 0)
      .forEach((obj) =>
        drawOffScreenArrow(
          ctx,
          obj.body.position,
          canvas,
          game.camera.body.position,
          greenLight,
        ),
      )

    players.forEach((obj) =>
      drawOffScreenArrow(
        ctx,
        obj.body.position,
        canvas,
        game.camera.body.position,
        blueLight,
        40,
      ),
    )
  }
  Events.on(game.engine, 'beforeUpdate', handleBeforeUpdate)

  const handleCollisionStart = (event) => {
    const { bodyA, bodyB } = event.pairs[0]
    const objA = game.gameObjects.find(
      (updateable) => updateable.body === bodyA,
    )
    const objB = game.gameObjects.find(
      (updateable) => updateable.body === bodyB,
    )

    if (objA && objB) {
      testCollision(objA, objB)
      testCollision(objB, objA)
    }

    if (bodyA.label === 'OuterBoundary') {
      removeObject(game, objB)
    }
    if (bodyB.label === 'OuterBoundary') {
      removeObject(game, objA)
    }
  }

  Events.on(game.engine, 'collisionStart', handleCollisionStart)

  return () => {
    removeEventListener(`keydown`, handleClickKeydown)
    Events.off(game.engine, 'beforeUpdate', handleBeforeUpdate)
    Events.off(game.engine, 'collisionStart', handleCollisionStart)
  }
}

const drawCircleAroundEmptyShip = (ctx, shipPos, text, radius, color) => {
  const pos = canvasCoordinate(shipPos, game.camera.body.position, canvas)
  ctx.beginPath()
  ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI, false)
  ctx.lineWidth = 3
  ctx.strokeStyle = color
  ctx.stroke()
  ctx.fillStyle = color
  ctx.font = '35px serif'
  ctx.fillText(text, pos.x + 15, pos.y + 70)
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
const getPlayers = () =>
  [game.playerA, game.playerB].filter((player) => player.health > 0)

const spawnEnemies = throttle(3000, () => {
  const r = random(0, 100)
  const position = randomPositionOutsideRoom()
  if (r < 5) {
    zeros(1).forEach(() => {
      addObject(
        game,
        createB2(getPlayers, (obj) => addObject(game, obj), position),
      )
    })
  } else if (r < 30) {
    zeros(7).forEach(() => {
      addObject(game, createBomber(getPlayers, getGameObjects, position))
    })
  } else if (r < 40) {
    addObject(
      game,
      createCoward(
        getPlayers,
        getGameObjects,
        position,
        randomPositionInsideRoom(),
      ),
    )
  } else {
    addObject(
      game,
      createEnemy(getPlayers, (obj) => addObject(game, obj), position),
    )
  }
})

const spawnAsteriods = throttle(500, () => {
  zeros(2).forEach(() => {
    addObject(
      game,
      asteroid(randomPositionOutsideRoom(), Vector.mult(left, 2000)),
    )
  })
})
const spawnComet = throttle(1000, () => {
  zeros(1).forEach(() => {
    const spawnPos = randomPositionOutsideRoom()
    const speed = 10
    const target = randomPositionInsideRoom()
    const dir = Vector.normalise(Vector.sub(target, spawnPos))
    const vel = Vector.mult(dir, speed)
    addObject(game, comet(spawnPos, vel))
  })
})
const damage = (obj, damage) => {
  if (obj === undefined) {
    return
  }
  const wasAlive = obj.health > 0
  if (obj.health !== undefined) {
    obj.health -= damage
  }
  const isAlive = obj.health > 0
  const died = wasAlive && !isAlive
  const shouldDestroy = obj.isBullet || died
  if (shouldDestroy) {
    game.score = game.score + (obj.points ?? 0)
    game.balance = game.balance + (obj.points ?? 0)
    const keep = obj.onDestroy?.()
    game.explosions.push({
      position: Vector.clone(obj.body.position),
      animationState: 0,
      radius: obj.body.circleRadius * 2,
    })
    if (!keep) {
      removeObject(game, obj)
    }
    game.playerShips.forEach((ship) => {
      if (obj === ship && (ship === game.playerA || ship === game.playerB)) {
        const astronaut = createAstronaut(
          ship.body.position,
          (obj) => addObject(game, obj),
          () => game.playerShips,
          assets,
        )
        addObject(game, astronaut)
        if (ship === game.playerA) {
          game.playerA = astronaut
        } else if (ship === game.playerB) {
          game.playerB = astronaut
        }
      }
    })
  } else {
    playBum()
  }
}

let game = createGame()
const stopGame = startGame()
