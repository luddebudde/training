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
import { torqueToAlign } from "./physics";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { modelLoader } from "./modelLoader";

// RAPIER
let gravity = { x: 0.0, y: -9.81, z: 0.0 };
let world = new RAPIER.World(gravity);
// let groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.1, 10.0);
// world.createCollider(groundColliderDesc);

// Three js
const scene = new THREE.Scene();

const greenMaterial = new THREE.MeshPhongMaterial({
  color: 0x00ff00,
  wireframe: true,
});
const redMaterial = new THREE.MeshPhongMaterial({
  color: 0xff0000,
  wireframe: true,
});

const boatMesh = await modelLoader()
  .load("boats/playerBoat.glb")
  .then((gltf) => gltf.scene)
  .then((scene) => {
    scene.scale.setScalar(0.5);
    scene.rotateY(Math.PI);
    scene.translateZ(-0.3);
    scene.receiveShadow = true;
    scene.castShadow = true;
    return scene;
  });
// .then((group) => {
//   // group.traverse((obj) => {
//   //   obj.receiveShadow = true
//   //   obj.castShadow = true
//   //   if ('material' in obj && obj.material instanceof MeshBasicMaterial) {
//   //     obj.material.reflectivity = 0
//   //   }
//   // })
//   const mesh = group.getObjectByName("ship_1") as Mesh;
//   mesh.geometry.rotateX(-Math.PI / 2);
//   mesh.castShadow = true;
//   return mesh;
// });

const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
const waterDensity = 1;
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

const boxDim = {
  x: 1.4,
  y: 1,
  z: 4.4,
};

const boxDensity = 0.5;

const geometry = new THREE.BoxGeometry(boxDim.x, boxDim.y, boxDim.z);
const createBox = (material) => {
  let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setLinearDamping(0.1)
    .setAngularDamping(0.5);

  let rigidBody = world.createRigidBody(rigidBodyDesc);

  // Create a cuboid collider attached to the dynamic rigidBody.
  let colliderDesc = RAPIER.ColliderDesc.cuboid(
    boxDim.x / 2,
    boxDim.y / 2,
    boxDim.z / 2
  ).setDensity(boxDensity);
  let collider = world.createCollider(colliderDesc, rigidBody);

  const object3D = new THREE.Mesh(geometry, material);
  const group = new THREE.Group();
  // group.add(object3D);

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

  // const boat = boatMesh;
  group.add(boatMesh.clone());

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

const boxes = Array(144)
  .fill(0)
  .map((_, index) => createBox(index === 0 ? redMaterial : greenMaterial));

const player = boxes[0];

boxes.forEach((box, index) => {
  box.rigidBody.setTranslation(
    {
      x: boxDim.x * Math.floor(index / 12),
      y: 0,
      z: boxDim.z * (index % 12),
    },
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

const engineStrenght = 250;
const rudderStrenght = 30;
const boostStrenght = 5;

const update = () => {
  boxes.forEach((box) => {
    const heightInWater = Math.max(
      0,
      Math.min(boxDim.y, -box.rigidBody.translation().y + boxDim.y / 2)
    );
    box.rigidBody.resetForces(false);
    box.rigidBody.resetTorques(false);
    const forceUp =
      -gravity.y *
      waterDensity *
      heightInWater *
      boxDim.x *
      boxDim.y *
      boxDim.z;

    const boxVel = vec3(box.rigidBody.linvel());
    const dir = normalized2(boxVel);
    const dragCoeff = 5;
    const waterDragForce =
      dir === undefined
        ? origo
        : scale(
            dir,
            (-dragCoeff *
              boxDim.x *
              boxDim.y *
              dot(boxVel, boxVel) *
              heightInWater) /
              boxDim.y
          );

    box.rigidBody.addForce(vecXyz([0, forceUp, 0]), true);
    box.rigidBody.addForce(vecXyz(waterDragForce), true);
    box.rigidBody.addTorque(
      vecXyz(scale(vec3(torqueToAlign(vec4(box.object3D.quaternion), up)), 5)),
      true
    );
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
  if (player.rigidBody.translation().y < boxDim.y / 2) {
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
      player.rigidBody.addTorque(
        vecXyz(scale(playerUp, -rudderStrenght)),
        true
      );
    }
    if (isKeyDown("KeyS")) {
      player.rigidBody.addForce(
        vecXyz(scale(playerForward, -engineStrenght / 10)),
        true
      );
    }
    if (isKeyDown("Space")) {
      player.rigidBody.addForce(
        vecXyz(scale(playerForward, engineStrenght * boostStrenght)),
        true
      );
    }
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
  // console.log();

  // cube.position.set(pos.x, pos.y, pos.z);
  const playerPos = vec3(player.rigidBody.translation());

  // console.log(player.rigidBody.translation());

  const dir = new THREE.Vector3();
  player.object3D.getWorldDirection(dir);
  const dir = quaternionToVector(player.rigidBody.rotation());

  // [
  //   player.rigidBody.rotation().y,
  //   player.rigidBody.rotation().z,
  //   player.rigidBody.rotation().w,
  // ];
  const cameraOffset = add(scale(vec3(dir), -10), scale(up, 7));
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
