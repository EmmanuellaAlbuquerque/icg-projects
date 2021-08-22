import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.131.3-QQa34rwf1xM5cawaQLl8/mode=imports,min/optimized/three.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@v0.131.3/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// ----------------------------- Adjusting the scene -----------------------------
scene.background = new THREE.Color("#fff");
scene.add(new THREE.GridHelper(50, 50));

// Adjusting the renderer
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Adjusting the camera
camera.position.z = 20;
camera.position.y = 5;

// Creating geometry cube
const box = new THREE.BoxGeometry(10, 10, 10);
box.translate(0, 5.1, 0);

// ----------------------------- Creating CUBE 1 - LineSegments -----------------------------
const boxMaterial1 = new THREE.LineDashedMaterial({ color: "#30414b", dashSize: 1, gapSize: 0.5 });
const boxEdge = new THREE.EdgesGeometry(box);
const cubeLine = new THREE.LineSegments(boxEdge, boxMaterial1);
cubeLine.computeLineDistances();

// Adding the cube 1 to the scene
scene.add(cubeLine);

// ----------------------------- Creating CUBE 2 - MeshLambertMaterial -----------------------------
const boxMaterial2 = new THREE.MeshLambertMaterial({ transparent: true, opacity: 0.5 });
const cube2 = new THREE.Mesh(box, boxMaterial2);
cube2.position.x += -14;

// Adding the cube 2 to the scene
scene.add(cube2);

// ----------------------------- Creating CUBE 3 - MeshNormalMaterial -----------------------------
const boxMaterial3 = new THREE.MeshNormalMaterial();
const cube3 = new THREE.Mesh(box, boxMaterial3);
cube3.position.x += 14;

// Adding the cube 3 to the scene
scene.add(cube3);

// ----------------------------- Adding controllers for rotation -----------------------------
const controls = new OrbitControls(camera, renderer.domElement);

// Adding animate loop
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();
