import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.131.3-QQa34rwf1xM5cawaQLl8/mode=imports,min/optimized/three.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@v0.131.3/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Adjusting the scene
scene.background = new THREE.Color("#000");
scene.add(new THREE.GridHelper(10, 10));

// Adjusting the renderer
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Adjusting the camera
camera.position.z = 3;

// Creating geometry cube
const box = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: "#fff" });
const cube = new THREE.Mesh(box, material);
box.translate(0, 0.8, 0);

// Adding the cube to the scene
scene.add(cube);

// Adding controllers for rotation
const controls = new OrbitControls(camera, renderer.domElement);

// Adding animate loop
function renderScene() {
  requestAnimationFrame(renderScene);
  renderer.render(scene, camera);
}

renderScene();
