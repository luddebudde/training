import * as THREE from "three";
import Stats from "stats.js";
import RAPIER, { Vector3 } from "@dimforge/rapier3d";
import { keyDownTracker } from "./keyDownTracker";
import {
  add,
  dot,
  norm2,
  normalized2,
  origo,
  scale,
  vec3,
  vecXyz,
} from "./vec";
import { Water } from "three/examples/jsm/Addons.js";

// RAPIER
let gravity = { x: 0.0, y: -9.81, z: 0.0 };
let world = new RAPIER.World(gravity);
// let groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.1, 10.0);
// world.createCollider(groundColliderDesc);

// Three js
const scene = new THREE.Scene();

const greenMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const redMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });

const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

const water = new Water(waterGeometry, {
  textureWidth: 512,
  textureHeight: 512,
  waterNormals: new THREE.TextureLoader().load(
    "waternormals.jpg",
    function (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }
  ),
  sunDirection: new THREE.Vector3(),
  sunColor: 0xffffff,
  waterColor: 0x001e0f,
  distortionScale: 3.7,
  fog: scene.fog !== undefined,
});

water.rotateX(-Math.PI / 2);

scene.add(water);

const boxHeight = 1;

const geometry = new THREE.BoxGeometry(boxHeight, boxHeight, boxHeight);
const createBox = (material) => {
  let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic();

  let rigidBody = world.createRigidBody(rigidBodyDesc);

  // Create a cuboid collider attached to the dynamic rigidBody.
  let colliderDesc = RAPIER.ColliderDesc.cuboid(
    boxHeight / 2,
    boxHeight / 2,
    boxHeight / 2
  ).setDensity(0.5);
  let collider = world.createCollider(colliderDesc, rigidBody);

  const object3D = new THREE.Mesh(geometry, material);
  return {
    rigidBody,
    object3D,
  };
};
// Create a dynamic rigid-body.
// let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(
//   0.0,
//   1.0,
//   0.0
// );
// let rigidBody = world.createRigidBody(rigidBodyDesc);

// // Create a cuboid collider attached to the dynamic rigidBody.
// let colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
// let collider = world.createCollider(colliderDesc, rigidBody);

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

// const object3D = new THREE.Mesh(geometry, material);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// ¨
const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(100, 100, 0);
// light.target.updateMatrixWorld();
scene.add(directionalLight);

// directionalLight.rotation.y = 100;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// cube.rotation.x = 10;
// cube.rotation.y = 10;

const boxes = Array(5000)
  .fill(0)
  .map((_, index) => createBox(index === 0 ? redMaterial : greenMaterial));

const player = boxes[0];

boxes.forEach((box, index) => {
  box.rigidBody.setTranslation({ x: 0, y: index, z: 0 }, true);
  // box.rigidBody.
  scene.add(box.object3D);
});

// let pos = {
//   x: 0,
//   y: 0,
//   z: 0,
// };

camera.position.z = 5;
camera.position.y = 1.5;

const isKeyDown = keyDownTracker();

const engineStrenght = 10;

const update = () => {
  boxes.forEach((box) => {
    const heightInWater = Math.max(
      0,
      Math.min(boxHeight, -box.rigidBody.translation().y + boxHeight / 2)
    );
    box.rigidBody.resetForces(false);
    const forceUp = -gravity.y * 1 * heightInWater;

    const boxVel = vec3(box.rigidBody.linvel());
    const dir = normalized2(boxVel);
    const dragCoeff = 0.25;
    const forceDrag =
      dir === undefined
        ? origo
        : scale(
            dir,
            (-dragCoeff *
              boxHeight *
              boxHeight *
              dot(boxVel, boxVel) *
              heightInWater) /
              boxHeight
          );
    box.rigidBody.addForce(vecXyz([0, forceUp, 0]), true);
    box.rigidBody.addForce(vecXyz(forceDrag), true);
    console.log();
  });

  if (isKeyDown("KeyW")) {
    player.rigidBody.addForce({ x: 0, y: 0, z: -engineStrenght }, true);
  }
  if (isKeyDown("KeyA")) {
    player.rigidBody.addForce({ x: -engineStrenght, y: 0, z: 0 }, true);
  }
  if (isKeyDown("KeyD")) {
    player.rigidBody.addForce({ x: engineStrenght, y: 0, z: 0 }, true);
  }
  if (isKeyDown("KeyS")) {
    player.rigidBody.addForce({ x: 0, y: 0, z: engineStrenght }, true);
  }
  if (isKeyDown("Space")) {
    player.rigidBody.addForce({ x: 0, y: engineStrenght, z: 0 }, true);
  }

  world.step();
};

const render = () => {
  // console.log(player.rigidBody.rotation());

  boxes.forEach((box) => {
    const q = box.rigidBody.rotation();

    box.object3D.position.copy(box.rigidBody.translation());
    box.object3D.setRotationFromQuaternion(
      new THREE.Quaternion(q.x, q.y, q.z, q.w)
    );
  });
  // cube.position.set(pos.x, pos.y, pos.z);
  const playerPos = vec3(player.rigidBody.translation());
  camera.position.copy(vecXyz(add(playerPos, [0, 10, 10])));
  // console.log(player.rigidBody.translation());

  camera.lookAt(player.object3D.position);
  renderer.render(scene, camera);
};

function animate() {
  stats.begin();
  requestAnimationFrame(animate);

  update();
  render();
  stats.end();
}
animate();
