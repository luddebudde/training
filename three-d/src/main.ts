import * as THREE from "three";
import Stats from "stats.js";
import RAPIER, { Vector3 } from "@dimforge/rapier3d";
import { keyDownTracker } from "./keyDownTracker";
import {
  add,
  dot,
  down,
  forward,
  norm2,
  normalized2,
  origo,
  point_rotation_by_quaternion,
  quaternionToVector,
  right,
  rotate,
  scale,
  up,
  vec3,
  vec4,
  vecXyz,
} from "./vec";
import { Water } from "three/examples/jsm/Addons.js";
import { applyTorqueToAlign } from "./physics";

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
  let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setLinearDamping(0.1)
    .setAngularDamping(0.5);

  let rigidBody = world.createRigidBody(rigidBodyDesc);

  // Create a cuboid collider attached to the dynamic rigidBody.
  let colliderDesc = RAPIER.ColliderDesc.cuboid(
    boxHeight / 2,
    boxHeight / 2,
    boxHeight / 2
  ).setDensity(0.5);
  let collider = world.createCollider(colliderDesc, rigidBody);

  const object3D = new THREE.Mesh(geometry, material);
  const group = new THREE.Group();
  group.add(object3D);

  const arrowHelperRight = new THREE.ArrowHelper(
    new THREE.Vector3(...right),
    new THREE.Vector3(...origo),
    2,
    "red"
  );
  group.add(arrowHelperRight);

  const arrowHelperUp = new THREE.ArrowHelper(
    new THREE.Vector3(...up),
    new THREE.Vector3(...origo),
    2,
    "green"
  );
  group.add(arrowHelperUp);

  const arrowHelperForward = new THREE.ArrowHelper(
    new THREE.Vector3(...forward),
    new THREE.Vector3(...origo),
    2,
    "blue"
  );
  group.add(arrowHelperForward);

  const g = new THREE.SphereGeometry(0.1);
  const arrow = new THREE.Mesh(g, material);
  scene.add(arrow);

  return {
    rigidBody,
    object3D: group,
    arrow,
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
// const XZYMatrix = new THREE.Matrix4().set(
//   1,
//   0,
//   0,
//   0,
//   0,
//   1,
//   0,
//   0,
//   0,
//   0,
//   -1,
//   0,
//   0,
//   0,
//   0,
//   1
// );
// camera.applyMatrix4(XZYMatrix);

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

const boxes = Array(100)
  .fill(0)
  .map((_, index) => createBox(index === 0 ? redMaterial : greenMaterial));

const player = boxes[0];

boxes.forEach((box, index) => {
  box.rigidBody.setTranslation(
    { x: Math.random(), y: Math.random() * index, z: Math.random() },
    true
  );
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

const engineStrenght = 20;
const rudderStrenght = 0.1;

const update = () => {
  boxes.forEach((box) => {
    const heightInWater = Math.max(
      0,
      Math.min(boxHeight, -box.rigidBody.translation().y + boxHeight / 2)
    );
    box.rigidBody.resetForces(false);
    box.rigidBody.resetTorques(false);
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
    applyTorqueToAlign(box.rigidBody, vec4(box.object3D.quaternion), up);
  });

  // const playerForward = point_rotation_by_quaternion(
  //   forward,
  //   vec4(player.rigidBody.rotation())
  // );
  const playerForward = vec3(
    new THREE.Vector3(...forward).applyQuaternion(player.object3D.quaternion)
  );
  // const playerUp = point_rotation_by_quaternion(
  //   up,
  //   vec4(player.rigidBody.rotation())
  // );
  const playerUp = vec3(
    new THREE.Vector3(...up).applyQuaternion(player.object3D.quaternion)
  );
  if (isKeyDown("KeyW")) {
    player.rigidBody.addForce(
      vecXyz(scale(playerForward, engineStrenght)),
      true
    );
  }
  if (isKeyDown("KeyA")) {
    player.rigidBody.addTorque(vecXyz(scale(playerUp, rudderStrenght)), true);
  }
  if (isKeyDown("KeyD")) {
    player.rigidBody.addTorque(vecXyz(scale(playerUp, -rudderStrenght)), true);
  }
  if (isKeyDown("KeyS")) {
    player.rigidBody.addForce(
      vecXyz(scale(playerForward, -engineStrenght / 10)),
      true
    );
  }
  if (isKeyDown("Space")) {
    player.rigidBody.addForce({ x: 0, y: engineStrenght, z: 0 }, true);
  }
  if (isKeyDown("KeyX")) {
    player.rigidBody.addTorque({ x: 0.1, y: 0, z: 0 }, true);
  }
  if (isKeyDown("KeyY")) {
    player.rigidBody.addTorque({ x: 0, y: 0.1, z: 0 }, true);
  }
  if (isKeyDown("KeyZ")) {
    player.rigidBody.addTorque({ x: 0, y: 0, z: 0.1 }, true);
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

    // ...point_rotation_by_quaternion(right, vec4(box.rigidBody.rotation()))
    box.arrow.position.copy(
      box.object3D.position
        .clone()
        .add(
          new THREE.Vector3(
            ...rotate(right, vec4(box.object3D.quaternion))
          ).multiplyScalar(2)
        )
    );
  });
  console.log(player.rigidBody.translation().z, player.object3D.position.z);
  // console.log();

  // cube.position.set(pos.x, pos.y, pos.z);
  const playerPos = vec3(player.rigidBody.translation());

  // console.log(player.rigidBody.translation());

  const dir = new THREE.Vector3();
  player.object3D.getWorldDirection(dir);
  // const dir = quaternionToVector(player.rigidBody.rotation());

  // [
  //   player.rigidBody.rotation().y,
  //   player.rigidBody.rotation().z,
  //   player.rigidBody.rotation().w,
  // ];
  const cameraOffset = add(scale(vec3(dir), -10), scale(up, 10));
  camera.position.copy(vecXyz(add(playerPos, cameraOffset)));
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
