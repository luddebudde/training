import * as THREE from "three";
import Stats from "stats.js";

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const scene = new THREE.Scene();
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

const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.rotation.x = 10;
cube.rotation.y = 10;
scene.add(cube);

// let pos = {
//   x: 0,
//   y: 0,
//   z: 0,
// };

camera.position.z = 5;

const cubes = [cube];

const update = () => {
  cubes.forEach((cube) => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.position.x += (Math.random() - 0.5) / 5;
    cube.position.y += (Math.random() - 0.5) / 5;
    cube.position.z += (Math.random() - 0.5) / 5;

    // cube.position.add((Math.random() - 0.5) / 5);

    if (Math.random() > 0.99) {
      const newCube = new THREE.Mesh(geometry, material);
      newCube.position.set(cube.position.x, cube.position.y, cube.position.z);
      newCube.rotation.copy(cube.rotation);
      scene.add(newCube);
      cubes.push(newCube);
    }
  });

  // if (cubes.length > 5000) cubes.length = 1;
};

const render = () => {
  // cube.position.set(pos.x, pos.y, pos.z);
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
