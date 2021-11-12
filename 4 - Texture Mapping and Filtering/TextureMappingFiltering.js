let image = new Image();
image.src = src_gate; // textura do portão do Doom
//image.src = src_checkerboard; // texture do padrão xadrez

texture = new THREE.Texture(image);

image.onload = function () {
  texture.needsUpdate = true;
  texture.magFilter = THREE.NearestFilter; // filtro a ser utilizado em caso de magnificação.
  texture.minFilter = THREE.NearestFilter; // filtro a ser utilizado em caso de minificação.
  texture.anisotropy = 1; // fator máximo de anisotropia para o filtro anisotrópico.
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
};

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
camera.position.z = 1.5;

scene.add(camera);

let renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("canvas") });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.2;
controls.rotateSpeed = 0.05;
controls.screenSpacePanning = true;

let geometry = new THREE.BoxGeometry(1, 1, 1);

//----------------------------------------------------------------------------
// Criação das fontes de luz pontuais.
//----------------------------------------------------------------------------
var point_light1 = new THREE.PointLight(0xffffff);
point_light1.position.set(-10, 10, 20);
scene.add(point_light1);

var point_light2 = new THREE.PointLight(0xffffff);
point_light2.position.set(10, 10, 10);
scene.add(point_light2);

var point_light3 = new THREE.PointLight(0x666666);
point_light3.position.set(0, -10, -10);
scene.add(point_light3);

//----------------------------------------------------------------------------
// Criação do material difuso. A textura define a reflectância difusa (k_d) 
// do material.
//----------------------------------------------------------------------------
let material = new THREE.MeshLambertMaterial({
  map: texture
});

var object_mesh = new THREE.Mesh(geometry, material);
scene.add(object_mesh);

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  controls.update()
}

render();
