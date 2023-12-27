import {
  Body,
  Box,
  NaiveBroadphase,
  Quaternion,
  Sphere,
  Vec3,
  World,
} from 'cannon'
import * as THREE from 'three'
import {
  AmbientLight,
  ArrowHelper,
  AxesHelper,
  BackSide,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  Vector2,
  WebGLRenderer,
} from 'three'
import { keyDownTracker } from './keyDownTracker.ts'
import { modelLoader } from './modelLoader.ts'
import {
  closestDirectionOnSphere,
  projectOnSurface,
  sphereSurfaceNorm,
} from './vectorMath.ts'
import {
  randomAngle,
  randomColor,
  randomLinear,
  randomPointOnSphere,
} from './random.ts'
import { front, origo, up } from './vectors.ts'
import {
  springForce,
  thrustBackward,
  thrustForward,
  applyTorqueToAlign,
  turnLeft,
  turnRight,
} from './forces.ts'
import { throttle } from 'throttle-debounce'
import { createTextureLoader } from './createTextureLoader.ts'
import { vector3 } from './vector3.ts'
import { GameObject, GameObjectIndex } from './GameObject.ts'
import { createDrone } from './createDrone.ts'
import { zeros } from './zeros.ts'
import Stats from 'stats.js'
import { Player } from './Player.ts'
import { GameQueries } from './gameQueries.ts'
import { Game } from './Game.ts'

const createTrajectoryLine = () => {
  const lineGeometry = new THREE.BufferGeometry()
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x80ff00,
    linewidth: 5,
  })
  return new THREE.Line(lineGeometry, lineMaterial)
}
const spaceshipMesh = await modelLoader()
  .load('3d-models/low_poly_space_ship.glb')
  .then((gltf) => gltf.scene)
  .then((group) => {
    // group.traverse((obj) => {
    //   obj.receiveShadow = true
    //   obj.castShadow = true
    //   if ('material' in obj && obj.material instanceof MeshBasicMaterial) {
    //     obj.material.reflectivity = 0
    //   }
    // })
    const mesh = group.getObjectByName('ship_1') as Mesh
    mesh.geometry.rotateX(-Math.PI / 2)
    mesh.castShadow = true
    return mesh
  })
const asteriodGltf = await modelLoader().load(
  '3d-models/stylized_lowpoly_rock.glb',
)
const asteriodsGltf2 = await modelLoader().load(
  '3d-models/8_low_poly_asteroids.glb',
)
const asteriodsGltf = await modelLoader().load(
  '3d-models/rocks_low_poly_starter_pack.glb',
)
const textureLoader = createTextureLoader()
const asteroidMeshes =
  asteriodsGltf.scene.children[0].children[0].children[0].children

const earthHeight = await textureLoader.load('3d-models/height.jpeg')
earthHeight.minFilter = THREE.LinearFilter

const earthTextures = {
  height: await textureLoader.load('textures/earth/bump.jpeg'),
  clouds: await textureLoader.load('textures/earth/clouds_few_medium.jpeg'),
  day2: await textureLoader.load('textures/earth/day2.jpeg'),
  night: await textureLoader.load('textures/earth/night.jpeg'),
  water: await textureLoader.load('textures/earth/water-inv.png'),
}
earthTextures.day2.minFilter = THREE.LinearFilter
earthTextures.height.minFilter = THREE.LinearFilter
earthTextures.night.minFilter = THREE.LinearFilter
earthTextures.water.minFilter = THREE.LinearFilter

earthTextures.clouds.wrapS = THREE.RepeatWrapping
earthTextures.clouds.wrapT = THREE.RepeatWrapping
earthTextures.clouds.repeat.set(1, 1)
earthTextures.clouds.minFilter = THREE.LinearFilter

const nightSkyTexture = await textureLoader.load('textures/starfield.jpeg')
nightSkyTexture.minFilter = THREE.LinearFilter

const waterNormalMap = await textureLoader.load('textures/water_normal_4.jpeg')
waterNormalMap.minFilter = THREE.LinearFilter
waterNormalMap.wrapS = THREE.RepeatWrapping
waterNormalMap.wrapT = THREE.RepeatWrapping
waterNormalMap.repeat.set(10, 10)

const sunLight: DirectionalLight = new DirectionalLight(0xffffff, 1)
const line = createTrajectoryLine()

const helperArrow = new ArrowHelper()
helperArrow.setLength(10)
let camera1: PerspectiveCamera
let camera2: PerspectiveCamera
let scene: Scene
let shape,
  timeStep = 1 / 60,
  geometry,
  material
const isKeyDown = keyDownTracker()

let renderer1: WebGLRenderer
let renderer2: WebGLRenderer

const lightWidth = 100
const lightDistance = 50
const createWorld = (): World => {
  const world = new World()
  world.gravity.set(0, 0, 0)
  world.broadphase = new NaiveBroadphase()
  world.solver.iterations = 10
  return world
}

const initThree = (): Game => {
  scene = new THREE.Scene()

  camera1 = new PerspectiveCamera(
    50,
    (window.innerWidth / window.innerHeight) * 2,
    1,
    1000,
  )
  scene.add(camera1)

  camera2 = new PerspectiveCamera(
    50,
    (window.innerWidth / window.innerHeight) * 2,
    1,
    1000,
  )
  scene.add(camera2)

  const ambientLight = new AmbientLight(0xffffff, 0.01)
  scene.add(ambientLight)

  sunLight.shadow.mapSize.height = 2048
  sunLight.shadow.mapSize.width = 2048
  sunLight.castShadow = true
  sunLight.shadow.camera.far = lightDistance + planetRadius
  sunLight.shadow.camera.left = -0.5 * lightWidth
  sunLight.shadow.camera.right = 0.5 * lightWidth
  sunLight.shadow.camera.top = 0.5 * lightWidth
  sunLight.shadow.camera.bottom = -0.5 * lightWidth
  scene.add(sunLight)

  // const cameraHelper = new THREE.CameraHelper(sunLight.shadow.camera)
  // scene.add(cameraHelper)

  scene.add(line)

  const spaceShip = spaceshipMesh
  const spaceShipInstancedMesh = new THREE.InstancedMesh(
    spaceShip.geometry.clone(),
    spaceShip.material,
    120,
  )
  // spaceShipInstancedMesh.rotateZ(Math.PI)
  // spaceShipInstancedMesh.instanceMatrix

  const dummy = new Object3D()
  dummy.rotateX(Math.PI)
  dummy.updateMatrix()

  // spaceShipInstancedMesh.applyMatrix4(dummy.matrix)
  spaceShipInstancedMesh.instanceMatrix.applyMatrix4(dummy.matrix)
  const instancedMeshes = {
    spaceship: spaceShipInstancedMesh,
  }
  Object.values(instancedMeshes).forEach((it) => {
    it.instanceMatrix.setUsage(THREE.DynamicDrawUsage) // will be updated every frame
    scene.add(it)
  })

  renderer1 = new WebGLRenderer({ antialias: true })
  renderer1.shadowMap.enabled = true
  renderer1.autoClear = false
  renderer1.setSize(window.innerWidth, window.innerHeight / 2)

  renderer2 = new WebGLRenderer({ antialias: true })
  renderer2.shadowMap.enabled = true
  renderer2.autoClear = false
  renderer2.setSize(window.innerWidth, window.innerHeight / 2)

  scene.add(new AxesHelper(150))
  scene.add(helperArrow)

  scene.add(skyScene)
  // new OrbitControls(camera, renderer.domElement)

  // Stats
  const stats = document.createElement('div')
  stats.style.position = 'fixed'
  stats.style.left = '0px'
  stats.style.top = '0px'
  stats.style.display = 'flex'
  stats.appendChild(stats0.dom)
  stats.appendChild(stats2.dom)
  stats0.dom.style.position = 'relative'
  stats2.dom.style.position = 'relative'
  document.body.appendChild(stats)

  // Split screen
  document.body.appendChild(renderer1.domElement)
  document.body.appendChild(renderer2.domElement)

  return {
    instancedMeshes,
  }
}

const stats0 = new Stats()
stats0.showPanel(0)
const stats2 = new Stats()
stats2.showPanel(2)

const loop = (then: number) => (now: number) => {
  const timeSinceLastCalled = now - then
  stats0.begin()
  stats2.begin()

  updatePhysics(timeSinceLastCalled, game)
  render(game)
  stats0.end()
  stats2.end()
  requestAnimationFrame(loop(now))
}

const render = (game: Game) => {
  // Update world
  const a = {
    spaceship: 0,
  }
  const dummy = new Object3D()
  gameObjectIndex.all.forEach((it) => {
    const key = it.instancedMesh
    if (key) {
      dummy.position.copy(it.body.position)
      dummy.quaternion.copy(it.body.quaternion)
      dummy.scale.setScalar(0.5)
      dummy.updateMatrix()
      game.instancedMeshes[key].setMatrixAt(a[key], dummy.matrix)
      a[key]++
    }
  })
  Object.values(game.instancedMeshes).forEach((it) => {
    it.instanceMatrix.needsUpdate = true
  })

  waterNormalMap.offset.copy(
    waterNormalMap.offset.add(new Vector2(0.0, 0.0001)),
  )

  setSunlight(player1, sunLight, lightDistance)
  skyScene.position.copy(player1.body.position)
  renderer1.render(scene, camera1)
  setSunlight(player2, sunLight, lightDistance)
  // renderer2.dep
  // const skyRenderer = new WebGLRenderer({
  //   antialias: true,
  //   canvas: renderer2.domElement,
  //   depth: false,
  // })
  // skyRenderer.autoClear = false
  // skyRenderer.setSize(window.innerWidth, window.innerHeight / 2)
  // skyRenderer.render(skyScene, camera2)
  skyScene.position.copy(player2.body.position)
  renderer2.render(scene, camera2)
}

const cannonBallMass = 0.1

// export const shoot = throttle(
//   500,
//   (spawnPos: Vec3, dir: Vec3) => {
//   },
//   {
//     noTrailing: true,
//   },
// )

const updatePhysics = (timeSinceLastCalled: number, game: Game) => {
  const jumpStrength = 1

  // Player 1
  if (isKeyDown('ShiftLeft')) {
    player1.body.applyLocalForce(
      new Vec3(0, 1, 0).scale(jumpStrength),
      new Vec3(0, 0, 1),
    )
  }
  if (isKeyDown('KeyW')) {
    player1.thrustForward()
  }
  if (isKeyDown('KeyA')) {
    player1.turnLeft()
  }
  if (isKeyDown('KeyD')) {
    player1.turnRight()
  }
  if (isKeyDown('KeyS')) {
    player1.thrustBackward()
  }
  if (isKeyDown('Space')) {
    player1.shoot()
  }

  // Player 2
  if (isKeyDown('ArrowUp')) {
    player2.thrustForward()
  }
  if (isKeyDown('ArrowLeft')) {
    player2.turnLeft()
  }
  if (isKeyDown('ArrowRight')) {
    player2.turnRight()
  }
  if (isKeyDown('ArrowDown')) {
    player2.thrustBackward()
  }

  if (isKeyDown('Comma')) {
    player2.shoot()
  }
  // Step the physics world
  world.step(timeStep, timeSinceLastCalled, 5)

  // Follow camera
  const players = [player1, player2]

  players.forEach((player) => {
    const sphereNorm = sphereSurfaceNorm(origo, player.body.position)

    applyTorqueToAlign(player.body, sphereNorm)

    const forwardDir = player.body.vectorToWorldFrame(front)
    const directionOnSurface = projectOnSurface(forwardDir, sphereNorm)
    directionOnSurface.normalize()
    const cameraDistanceAbove = 20
    const cameraDistanceBehind = 20
    const cameraPos = player.body.position
      .vadd(sphereNorm.scale(cameraDistanceAbove))
      .vsub(directionOnSurface.scale(cameraDistanceBehind))
    player.camera.position.copy(vector3(cameraPos))
    player.camera.lookAt(vector3(player.body.position))
    player.camera.up.copy(vector3(sphereNorm))

    player.arrowHelper.setLength(10)
    player.arrowHelper.setDirection(
      vector3(
        closestDirectionOnSphere(
          origo,
          player.body.position,
          player1.body.position,
        ),
      ),
    )
    // player.camera
  })

  // Trace Trajectory
  // const dt = 1 / 60
  // const initVel = cannonImpulse.scale(1 / cannonBallMass)
  // const trajectory = zeros(200)
  //   .reduce(
  //     (arr, _, index) => {
  //       const [r0, v0] = arr[index]
  //
  //       const sphereNorm = r0.vsub(origo)
  //       sphereNorm.normalize()
  //       const surfacePos = sphereNorm.scale(planetRadius + 5)
  //       const F0 = springForce(r0, surfacePos, 5)
  //
  //       const r1 = r0.vadd(v0.scale(dt))
  //       const a = F0.scale(1 / 0.1)
  //       const v1 = v0.vadd(a.scale(dt))
  //       arr.push([r1, v1])
  //       return arr
  //     },
  //     [[player1.body.position, initVel]] as [Vec3, Vec3][],
  //   )
  //   .map((it) => vector3(it[0]))
  // helperArrow.position.copy(vector3(player1.body.position))
  // line.geometry.setFromPoints(trajectory)

  gameObjectIndex.all.forEach((obj) => {
    // Surface spring
    if (obj.gravitational) {
      const sphereNorm = obj.body.position.vsub(origo)
      sphereNorm.normalize()
      const surfacePos = sphereNorm.scale(planetRadius + atmosphereHeight)
      const force = springForce(obj.body.position, surfacePos, 5)
      obj.body.applyForce(force, obj.body.position)
    }

    obj.update?.(gameObjectIndex)

    // Gravity
    // if (obj.gravitational) {
    //   const planetCenter = origo
    //   const planetMass = 100000
    //   const G = 1
    //   const r = planetCenter.clone().vsub(obj.body.position)
    //   console.log(r)
    //   const norm = r.normalize()
    //   const forceSize = (G * planetMass * obj.body.mass) / (norm * norm)
    //   const force = r.scale(forceSize)
    //   if (obj === player) {
    //     helperArrow.setDirection(vector3(r))
    //   }
    //   obj.body.applyForce(force, player.body.position)
    // }
    // obj.body.quaternion.setFromVectors(obj.body.)
    // new Quaternion().setFromVectors(obj.body.quaternion, new Vec3(0, 1, 0))

    // Copy coordinates from Cannon.js to Three.js
    obj.mesh?.position?.copy?.(obj.body.position)
    obj.mesh?.quaternion?.copy?.(obj.body.quaternion)
    obj.debugMesh?.position?.copy?.(obj.body.position)
    obj.debugMesh?.quaternion?.copy?.(obj.body.quaternion)
    obj.arrowHelper?.position?.copy?.(obj.body.position)
  })
}
const setSunlight = (
  player: Player,
  sunLight: DirectionalLight,
  lightDistance: number,
) => {
  sunLight.position.copy(
    vector3(player.body.pointToWorldFrame(up.scale(lightDistance))),
  )
  sunLight.lookAt(vector3(player.body.position))
}

const addGameObject = (obj: GameObject) => {
  gameObjectIndex.all.push(obj)

  Object.entries(obj.indices ?? {})
    .filter(([_, isIndexed]) => Boolean(isIndexed))
    .forEach(([index]) => {
      gameObjectIndex[index].push(obj)
    })
  world.addBody(obj.body)
  scene.add(obj.mesh)
  if (obj.arrowHelper) {
    scene.add(obj.arrowHelper)
  }
  if (obj.debugMesh) {
    scene.add(obj.debugMesh)
  }
}

const createAsteroid = (): GameObject => {
  const density = 1
  const scale = randomLinear(1, 4)
  const radius1 = 2
  const radius2 = 1.7

  const offset1 = new Vec3(0, 0, 0)
  const shape1 = new Sphere(radius1 * scale)
  const offset2 = new Vec3(0, 2, 0)
  const shape2 = new Sphere(radius2 * scale)
  const body = new Body({
    mass: density * Math.pow(scale, 3),
    linearDamping: 0.5,
    angularDamping: 0.1,
    // TODO random point on sphere
    position: randomPointOnSphere(origo, planetRadius + atmosphereHeight),
    quaternion: new Quaternion().setFromEuler(
      randomAngle(),
      randomAngle(),
      randomAngle(),
    ),
  })
  body.addShape(shape1, offset1)
  body.addShape(shape2, offset2)

  const segments = 15
  const debugMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
  })
  const material = new MeshPhongMaterial({
    color: randomColor(),
  })

  const wireMesh1 = new THREE.Mesh(
    new THREE.SphereGeometry(radius1, segments, segments),
    debugMaterial,
  )
  wireMesh1.position.copy(vector3(offset1))
  const wireMesh2 = new THREE.Mesh(
    new THREE.SphereGeometry(radius2, segments, segments),
    debugMaterial,
  )
  wireMesh2.position.copy(vector3(offset2))
  const wireMeshGroup = new Group()
  wireMeshGroup.add(wireMesh1, wireMesh2)
  wireMeshGroup.scale.multiplyScalar(scale)
  wireMeshGroup.visible = false

  // const mesh = new THREE.Mesh(geometry, material)
  // mesh.receiveShadow = true
  // mesh.castShadow = true
  // const mesh = asteriodsGltf.scene.clone()
  // const mesh = asteriodsGltf.scene.clone()
  // const mesh = asteroidMeshes[randomInt(0, asteroidMeshes.length)].clone()
  // mesh.scale.copy(mesh.scale.multiplyScalar(0.05))
  const mesh = asteriodsGltf2.scene.clone()
  mesh.scale.copy(mesh.scale.multiplyScalar(0.6 * radius1))
  mesh.traverse((obj) => {
    if ('material' in obj && obj.material instanceof MeshStandardMaterial) {
      obj.material.color = new Color(0x776666)
      obj.material.roughness = 0.8
    }
  })
  mesh.position.copy(vector3(new Vec3(3, 0, 0)))
  mesh.rotateX(0.4)
  const meshGroup = new Group()
  meshGroup.add(mesh)
  meshGroup.scale.multiplyScalar(scale)

  return {
    body,
    gravitational: true,
    mesh: meshGroup,
    debugMesh: wireMeshGroup,
  }
}
const createCannonBall = (): GameObject => {
  const mass = 0.1
  const radius = 1

  const shape = new Sphere(radius)
  const body = new Body({
    mass,
    linearDamping: 0,
    fixedRotation: true,
    position: new Vec3(
      randomLinear(-100, 100),
      randomLinear(-100, 100),
      randomLinear(-100, 100),
    ),
  })
  body.addShape(shape)

  const geometry = new THREE.SphereGeometry(radius, 10)
  const material = new MeshStandardMaterial({
    color: 0x4444ff,
    metalness: 0.8,
    roughness: 0.2,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  mesh.castShadow = true

  return {
    body,
    gravitational: true,
    mesh,
  }
}
const planetRadius = 90
const atmosphereHeight = 10

const createPlayer = (position: Vec3, camera: OrthographicCamera): Player => {
  const shapeBody = new Box(new Vec3(0.3, 0.5, 1.5))
  const shapeWings = new Box(new Vec3(2.4, 0.3, 0.9))
  const body = new Body({
    mass: 1,
    linearDamping: 0.9,
    angularDamping: 0.95,
    position,
    // collisionFilterMask: 0,
  })
  const bodyOffset = new Vec3(0, 0, 1)
  body.addShape(shapeBody, bodyOffset)
  body.addShape(shapeWings)

  const bodyGeometry = new THREE.BoxGeometry(
    shapeBody.halfExtents.x * 2,
    shapeBody.halfExtents.y * 2,
    shapeBody.halfExtents.z * 2,
  )
  const wingGeometry = new THREE.BoxGeometry(
    shapeWings.halfExtents.x * 2,
    shapeWings.halfExtents.y * 2,
    shapeWings.halfExtents.z * 2,
  )
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
  })

  const bodyMesh = new THREE.Mesh(bodyGeometry, material)
  const wingMesh = new THREE.Mesh(wingGeometry, material)
  bodyMesh.position.copy(vector3(bodyOffset))

  const meshGroup = new Group()
  meshGroup.add(bodyMesh, wingMesh)

  const mesh = spaceshipMesh.clone()
  // mesh.traverse((obj) => {
  //   obj.receiveShadow = true
  //   obj.castShadow = true
  //   if ('material' in obj && obj.material instanceof MeshBasicMaterial) {
  //     obj.material.reflectivity = 0
  //   }
  // })

  const engineBackwardStrength = 25
  const engineForwardStrength = 50
  const engineBoostStrength = 75
  const rotationStrength = 5

  return {
    indices: {
      players: true,
    },
    body,
    gravitational: true,
    mesh,
    debugMesh: meshGroup,
    arrowHelper: new ArrowHelper(),
    camera,
    thrustForward: () => thrustForward(body, engineForwardStrength),
    thrustBackward: () => () => thrustBackward(body, engineBackwardStrength),
    turnLeft: () => turnLeft(body, rotationStrength),
    turnRight: () => turnRight(body, rotationStrength),
    shoot: throttle(
      1000,
      () => {
        const cannonImpulse = body.vectorToWorldFrame(new Vec3(5, 20, 30))
        cannonImpulse.normalize()
        cannonImpulse.scale(10, cannonImpulse)

        const cannonBall = createCannonBall()
        cannonBall.body.position.copy(body.position)
        cannonBall.body.applyImpulse(cannonImpulse, cannonBall.body.position)
        addGameObject(cannonBall)
        body.applyImpulse(cannonImpulse.negate(), body.position)
      },
      {
        noTrailing: true,
      },
    ),
  }
}
const createPlanet = (): GameObject => {
  const mass = 10000
  const radius = planetRadius

  const shape = new Sphere(radius)
  const body = new Body({
    mass,
    linearDamping: 0,
    angularDamping: 0,
    position: origo,
    angularVelocity: up.scale(0.001),
    collisionFilterMask: 0,
  })
  body.addShape(shape)

  const groundGeometry = new THREE.SphereGeometry(radius, 300, 300)
  const meshMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
  })

  const groundMaterial = new MeshPhysicalMaterial({
    // color: 0x668833,
    // wireframe: true,
    map: earthTextures.day2,
    bumpMap: earthTextures.height,
    bumpScale: 2,
    displacementMap: earthTextures.height,
    displacementScale: 5,
    lightMap: earthTextures.night,
    lightMapIntensity: 0.3,

    transparent: true,
    alphaMap: earthTextures.water,

    // normalMap: earthTextures.normal,
    // normalScale: new Vector2(2, 2),
    // normalScale: new Vector2(1, 1),
    // metalnessMap: earthTextures.water,
    // metalness: 3,
    // transmissionMap: earthTextures.water,
    // sheenColorMap: earthTextures.water,
    // specularIntensityMap: earthTextures.height,
    // specularIntensity: 10,
    // emissiveMap: earthTextures.water,
    // clearcoatMap: earthTextures.water,
    // metalnessMap: earthTextures.water,
    // lightMap: earthTextures.height,
    // lightMapIntensity: 1,
    // depthWrite: false,
  })

  const cloudGeometry = new THREE.SphereGeometry(radius + 2, 100, 100)
  const cloudMaterial = new MeshStandardMaterial({
    alphaMap: earthTextures.clouds,
    transparent: true,
    bumpMap: earthTextures.clouds,
    bumpScale: 0.5,
    // displacementMap: earthTextures.clouds,
    // displacementScale: 0.5,
    depthWrite: false,
  })
  const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial)
  // cloudMesh.receiveShadow = true
  // cloudMesh.castShadow = true

  // const debugMesh = new THREE.Mesh(groundGeometry, meshMaterial)
  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)
  groundMesh.receiveShadow = true

  const waterMaterial = new MeshStandardMaterial({
    color: 0x4499ff,
    wireframe: false,
    roughness: 0.1,
    metalness: 0.9,
    map: earthHeight,
    lightMap: earthHeight,
    lightMapIntensity: 1,
    displacementMap: earthTextures.height,
    displacementScale: 5,
    normalMap: waterNormalMap,
    normalScale: new Vector2(0.5, 0.5),
    // depthWrite: false,
  })
  const waterMesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius - 1, 100, 100),
    waterMaterial,
  )
  waterMesh.receiveShadow = true

  const meshGroup = new Group()

  meshGroup.add(waterMesh)
  meshGroup.add(groundMesh)
  meshGroup.add(cloudMesh)

  return {
    body,
    gravitational: false,
    mesh: meshGroup,
    // debugMesh,
  }
}
const createSkyScene = (): Scene => {
  const radius = planetRadius * 3

  const geometry = new THREE.SphereGeometry(radius, 20, 20)

  const material = new MeshBasicMaterial({
    // map: nightSkyTexture,
    side: BackSide,
    lightMap: nightSkyTexture,
    lightMapIntensity: 0.5,
  })

  const skyMesh = new THREE.Mesh(geometry, material)

  const skyScene = new Scene()
  skyScene.add(skyMesh)

  return skyScene
}

const skyScene = createSkyScene()
const gameObjectIndex: GameObjectIndex = {
  all: [],
  players: [],
  enemies: [],
}
const game = initThree()
const playerSpawnPosition = randomPointOnSphere(
  origo,
  planetRadius + atmosphereHeight,
)

const world = createWorld()
const player1 = createPlayer(playerSpawnPosition, camera1)
const player2 = createPlayer(playerSpawnPosition, camera2)
addGameObject(player1)
addGameObject(player2)
zeros(100).forEach(() => addGameObject(createAsteroid()))
zeros(10).forEach(() =>
  addGameObject(
    createDrone(
      randomPointOnSphere(origo, planetRadius + atmosphereHeight),
      spaceshipMesh,
      game,
    ),
  ),
)

addGameObject(createPlanet())

requestAnimationFrame(loop(0))
