// Texturas Utilizadas
let images = {
  gate: src_gate,
  checkerboard: src_checkerboard,
  arrow: 'images/magnification/Back-Arrow.png',
  sword: 'images/magnification/Sword.png',
  deck: 'images/magnification/Wooden_Decking.png',
  cartoon_roof: 'images/minification/Cartoon_Roof.png',
  floor: 'images/minification/Forest_Floor.jpeg',
  roof: 'images/minification/Roof.jpg',
  brown_rock: 'images/minification/Brown_Rock.jpg',
  brick: 'images/minification/Brick.jpg'
};

let image = new Image();
image.src = images.gate; // textura do portão do Doom (mag)
image.src = images.checkerboard; // textura do padrão xadrez (mag)
image.src = images.arrow; // textura de uma seta para trás (mag)
image.src = images.sword; // textura de uma espada (mag)
image.src = images.deck; // textura de um deck de madeira (mag)
image.src = images.cartoon_roof; // textura de um telhado (min)
image.src = images.floor; // textura do chão de um parque (min)
image.src = images.roof; // textura de um telhado marrom (min)
image.src = images.brown_rock; // textura de um pedra marrom (min)
image.src = images.brick; // textura de um pedra marrom (min)

texture = new THREE.Texture(image);

// Filtros para Magnificação e Minificação
let filters = {
  NearestNeighbor: THREE.NearestFilter,
  Bilinear: THREE.LinearFilter,
  Mipmapping: THREE.LinearMipmapLinearFilter,
  MipmappingNearest: THREE.NearestMipmapNearestFilter,
  MipmappingNearestLinear: THREE.NearestMipmapLinearFilter,
  MipmappingNearestBilinear: THREE.LinearMipmapNearestFilter
};

image.onload = function () {
  texture.needsUpdate = true;
  texture.magFilter = filters.NearestNeighbor; // filtro a ser utilizado em caso de magnificação.
  texture.minFilter = filters.NearestNeighbor; // filtro a ser utilizado em caso de minificação.
  texture.anisotropy = 1; // fator máximo de anisotropia para o filtro anisotrópico.
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
};

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);

// position 1 for BoxGeometry (CUBE)
// camera.position.z = 1;
// camera.position.x = 1;
// camera.position.y = 1;

// position 2 for PlaneGeometry (PLANE)
// camera.position.z = 0.5;
// camera.position.y = -7.5;

// position 3 for PlaneGeometry (PLANE)
camera.position.z = 0.3;
camera.position.y = -7;

scene.add(camera);

let renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("canvas") });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// alert(renderer.getMaxAnisotropy());

let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.2;
controls.rotateSpeed = 0.05;
controls.screenSpacePanning = true;

// let geometry = new THREE.BoxGeometry(1, 1, 1);
let geometry = new THREE.PlaneGeometry(14, 14);

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
  map: texture,
  side: THREE.DoubleSide,
});

var object_mesh = new THREE.Mesh(geometry, material);
scene.add(object_mesh);

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  controls.update()
}

render();
