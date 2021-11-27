const EPSILON = 0.000001;

///////////////////////////////////////////////////////////////////////////////
// Funcao que desenha um pixel colorido no canvas.
// Entrada: 
//   x, y: Coordenadas de tela do pixel.
//   color: Cor do pixel no formato RGB (THREE.Vector3).
// Retorno:
//   Sem retorno.
///////////////////////////////////////////////////////////////////////////////
function PutPixel(x, y, color) {
  let c = document.getElementById("canvas");
  let ctx = c.getContext("2d");
  let r = Math.min(255, Math.max(0, Math.round(color.x * 255)));
  let g = Math.min(255, Math.max(0, Math.round(color.y * 255)));
  let b = Math.min(255, Math.max(0, Math.round(color.z * 255)));
  ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
  ctx.fillRect(x, y, 1, 2);
}

function drawReferenceLine(x0, y0, x1, y1) {
  let c = document.getElementById("canvas");
  let ctx = c.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);

  ctx.lineWidth = 1;
  ctx.strokeStyle = "#fff";
  ctx.stroke();
}

function clear() {
  let c = document.getElementById("canvas");
  let ctx = c.getContext("2d");
  // ctx.fillStyle = "#002633";
  // ctx.fillStyle = "#004C66";
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
}

clear();

// drawReferenceLine(0, 512 / 2, 512, 512 / 2);
// drawReferenceLine(512 / 2, 0, 512 / 2, 512);

///////////////////////////////////////////////////////////////////////////////
// Classe que representa um raio de luz.
// Construtor: 
//   origem: Ponto de origem do raio (THREE.Vector3).
//   direcao: Vetor unitario que indica a direcao do raio (THREE.Vector3).
///////////////////////////////////////////////////////////////////////////////
class Raio {
  constructor(origem, direcao) {
    this.origem = origem;
    this.direcao = direcao;
  }
}

///////////////////////////////////////////////////////////////////////////////
// Classe que representa a camera.
// Construtor: 
//   Sem parametros. Os atributos da camera estao 'hard coded' no construtor.
///////////////////////////////////////////////////////////////////////////////
class Camera {
  constructor() {
    this.resolucaoX = 512; // Resolucao do sensor em X.
    this.resolucaoY = 512; // Resolucao do sensor em Y.
    this.d = 1.0;          // Distancia do sensor em relacao a posicao da camera.
    this.xMin = -1.0;      // Extremidade esquerda do sensor.
    this.xMax = 1.0;      // Extremidade direita do sensor.
    this.yMin = -1.0;      // Extremidade inferior do sensor.
    this.yMax = 1.0;      // Extremidade superior do sensor.
    this.k = new THREE.Vector3(this.xMin, this.yMax, -this.d);   // Canto superior esquerdo do sensor.
    this.a = new THREE.Vector3(this.xMax - this.xMin, 0.0, 0.0); // Vetor para calculo de um ponto sobre o sensor.
    this.b = new THREE.Vector3(0.0, this.yMin - this.yMax, 0.0); // Vetor para calculo de um ponto sobre o sensor.
  }

  ///////////////////////////////////////////////////////////////////////////////
  // Metodo que converte coordenadas (x,y) de tela para um raio 
  // primario que passa pelo centro do pixel no espaco do universo.
  // Entrada: 
  //   x, y: Coordenadas de tela do pixel.
  // Retorno:
  //   Um objeto do tipo Raio.
  ///////////////////////////////////////////////////////////////////////////////
  raio(x, y) {
    let u = (x + 0.5) / this.resolucaoX;
    let v = (y - 0.5) / this.resolucaoY;
    let p = ((this.a.clone().multiplyScalar(u)).add(this.b.clone().multiplyScalar(v))).add(this.k);

    let origem = new THREE.Vector3(0.0, 0.0, 0.0);
    let direcao = p.normalize();

    return new Raio(origem, direcao);
  }
}

///////////////////////////////////////////////////////////////////////////////
// Classe que representa um ponto de interseccao entre o raio e uma primitiva.
// Construtor: 
//   Sem parametros. As propriedades de um objeto desta classe sao preenchidas
//   assim que uma interseccao raio-primitiva e detectada.
///////////////////////////////////////////////////////////////////////////////
class Interseccao {
  constructor() {
    this.t = Infinity; // distancia entre a origem do raio e o ponto de intersecao.
    this.posicao = new THREE.Vector3(0.0, 0.0, 0.0); // Coordenadas do ponto de interseccao.
    this.normal = new THREE.Vector3(0.0, 0.0, 0.0);  // Vetor normal no ponto de interseccao.
  }
}

///////////////////////////////////////////////////////////////////////////////
// Classe que representa uma primitiva do tipo esfera.
// Construtor: 
//   centro(THREE.Vector3): Coordenadas do centro da esfera no espaco do universo.
//   raio(float): Raio da esfera.
///////////////////////////////////////////////////////////////////////////////
class Esfera {
  constructor(centro, raio) {
    this.centro = centro;
    this.raio = raio;

    // -------------------------- Propriedades da Esfera --------------------------

    // ka: Coeficiente de reflectancia ambiente da esfera.
    this.ka = new THREE.Vector3(1.0, 1.0, 1.0);

    // kd: Coeficiente de reflectancia difusa da esfera.
    this.kd = new THREE.Vector3(1.0, 1.0, 1.0);

    // ks: Coeficiente de reflectância especular da esfera.
    this.ks = new THREE.Vector3(1.0, 1.0, 1.0);

    // n: Tamanho do brilho especular da esfera.
    this.n = 0;
  }

  ///////////////////////////////////////////////////////////////////////////////
  // Metodo que testa a interseccao entre o raio e a esfera.
  // Entrada: 
  //   raio: Objeto do tipo Raio cuja a interseccao com a esfera se quer verificar.
  //   interseccao: Objeto do tipo Interseccao que armazena os dados da interseccao caso esta ocorra.
  // Retorno:
  //   Um valor booleano: 'true' caso haja interseccao; ou 'false' caso contrario.
  ///////////////////////////////////////////////////////////////////////////////
  interseccionar(raio, interseccao) {
    let a = raio.direcao.clone().dot(raio.direcao);
    let o_c = raio.origem.clone().sub(this.centro);
    let b = 2.0 * raio.direcao.clone().dot(o_c);
    let c = o_c.clone().dot(o_c) - (this.raio * this.raio);

    let disc = b * b - 4.0 * a * c;

    if (disc > 0.0) {
      let t1 = (-b + Math.sqrt(disc)) / (2.0 * a);
      let t2 = (-b - Math.sqrt(disc)) / (2.0 * a);

      interseccao.t = t1;

      if ((t2 > 0.001) && (t2 < t1))
        interseccao.t = t2;

      if (interseccao.t > 0.001) {
        interseccao.posicao = raio.origem.clone().add(raio.direcao.clone().multiplyScalar(interseccao.t));
        interseccao.normal = (interseccao.posicao.clone().sub(this.centro)).normalize();
        return true;
      }

      return false;
    }

    return false;
  }
}

///////////////////////////////////////////////////////////////////////////////
// Classe que representa uma primitiva do tipo triangulo.
// Construtor: 
//   v0(THREE.Vector3): Coordenada do vertice A do triangulo.
//   v1(THREE.Vector3): Coordenada do vertice B do triangulo.
//   v2(THREE.Vector3): Coordenada do vertice C do triangulo.
///////////////////////////////////////////////////////////////////////////////
class Triangulo {
  constructor(v0, v1, v2) {
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;

    // -------------------------- Propriedades do Triangulo --------------------------

    // ka: Coeficiente de reflectancia ambiente do triangulo.
    this.ka = new THREE.Vector3(1.0, 1.0, 1.0);

    // kd: Coeficiente de reflectancia difusa do triangulo.
    this.kd = new THREE.Vector3(1.0, 1.0, 1.0);

    // ks: Coeficiente de reflectância especular do triangulo.
    this.ks = new THREE.Vector3(1.0, 1.0, 1.0);

    // n: Tamanho do brilho especular do triangulo.
    this.n = 0;
  }

  ///////////////////////////////////////////////////////////////////////////////
  // Metodo que testa a interseccao entre o raio e o triângulo.
  // MOLLER TRUMBORE: Fast, Minimum Storage Ray/Triangle Intersection
  // Entrada: 
  //   raio: Objeto do tipo Raio cuja a interseccao com o triângulo se quer verificar.
  //   interseccao: Objeto do tipo Interseccao que armazena os dados da interseccao caso esta ocorra.
  // Retorno:
  //   Um valor booleano: 'true' caso haja interseccao; ou 'false' caso contrario.
  ///////////////////////////////////////////////////////////////////////////////
  interseccionar(raio, interseccao) {
    return this.interseccionarSemBackfaceCulling(raio, interseccao);
    // return this.interseccionarComBackfaceCulling(raio, interseccao);
  }

  interseccionarSemBackfaceCulling(raio, interseccao) {

    // Encontrando os vetores para duas arestas ligadas a v0
    let edge1 = this.v1.clone().sub(this.v0);
    let edge2 = this.v2.clone().sub(this.v0);

    // Calculando o determinante.
    // D = (RayDirection x E2) * E1
    let pvec = raio.direcao.clone().cross(edge2);
    let det = edge1.clone().dot(pvec);

    // Sem Backface Culling
    if (det > -EPSILON && det < EPSILON) return false;

    // --- Calculando parâmetros escalares u, v, t ---

    let invDet = 1.0 / det;

    // Calculando a distância entre o vértice 0 e a origem do raio.
    let tvec = raio.origem.clone().sub(this.v0);

    // Calculando o parâmetro u e testando os limites
    let u = tvec.clone().dot(pvec) * invDet;
    if (u < 0.0 || u > 1.0) return false;

    let qvec = tvec.clone().cross(edge1);

    // Calculando o parâmetro v e testando os limites
    let v = raio.direcao.clone().dot(qvec) * invDet;
    if (v < 0.0 || u + v > 1.0) return false;

    // Calculando t, o raio intersecciona o triângulo!
    // t: distância do raio até o ponto de intersecção.
    let t = edge2.clone().dot(qvec) * invDet;

    interseccao.t = t;
    interseccao.posicao = raio.origem.clone().add(raio.direcao.clone().multiplyScalar(interseccao.t));

    // O vetor normal do triângulo é perpendicular ao plano. 
    interseccao.normal = edge2.cross(edge1).normalize();

    return true;
  }

  interseccionarComBackfaceCulling(raio, interseccao) {

    // Encontrando os vetores para duas arestas ligadas a v0
    let edge1 = this.v1.clone().sub(this.v0);
    let edge2 = this.v2.clone().sub(this.v0);

    // Calculando o determinante.
    // D = (RayDirection x E2) * E1
    let pvec = raio.direcao.clone().cross(edge2);
    let det = edge1.clone().dot(pvec);

    // Determinando Visibilidade: Backface Culling
    if (det < EPSILON) return false;

    // Calculando a distância entre o vértice 0 e a origem do raio.
    let tvec = raio.origem.clone().sub(this.v0);

    // Calculando o parâmetro u e testando os limites
    let u = tvec.clone().dot(pvec);
    if (u < 0.0 || u > det) return false;

    let qvec = tvec.clone().cross(edge1);

    // Calculando o parâmetro v e testando os limites
    let v = raio.direcao.clone().dot(qvec);
    if (v < 0.0 || u + v > det) return false;

    // Calculando parâmetros escalares u, v, t 
    let invDet = 1.0 / det;

    // Calculando t, o raio intersecciona o triângulo!
    // t: distância do raio até o ponto de intersecção.
    let t = edge2.clone().dot(qvec) * invDet;
    u *= invDet;
    v *= invDet;

    // let xg = (this.v0.x + this.v1.x + this.v2.x) / 3;
    // let yg = (this.v0.y + this.v1.y + this.v2.y) / 3;
    // let zg = (this.v0.z + this.v1.z + this.v2.z) / 3;
    // let baricentro = new THREE.Vector3(xg, yg, zg);

    interseccao.t = t;
    interseccao.posicao = raio.origem.clone().add(raio.direcao.clone().multiplyScalar(interseccao.t));

    // O vetor normal do triângulo é perpendicular ao plano. 
    interseccao.normal = edge2.cross(edge1).normalize();

    return true;
  }
}

///////////////////////////////////////////////////////////////////////////////
// Classe que representa uma fonte de luz pontual.
// Construtor: 
//   posicao: Posicao da fonte de luz pontual no espaco (THREE.Vector3).
//   cor: Cor da fonte de luz no formato RGB (THREE.Vector3).
///////////////////////////////////////////////////////////////////////////////
class Luz {
  constructor(posicao, cor) {
    this.posicao = posicao;
    this.cor = cor;
  }
}

///////////////////////////////////////////////////////////////////////////////
// Funcao que retorna todas as geometrias a serem renderizadas na cena.
// Entrada: 
//  Sem entrada.
// Retorno:
//   geometries(Array): Array das geometrias a serem renderizadas na cena.
///////////////////////////////////////////////////////////////////////////////
function getGeometries() {
  let geometries = [];

  // geometries.push(...sequentialSpheresScene());
  // geometries.push(...triangles());
  // geometries.push(...triangle2SpheresScene());
  // geometries.push(...trianglesInside());
  geometries.push(...abstractArt());

  return geometries;
}

///////////////////////////////////////////////////////////////////////////////
// Funcao que renderiza a cena utilizando ray tracing.
// Entrada: 
//  geometries(Array): Array das geometrias a serem renderizadas na cena.
// Retorno:
//   Sem retorno.
///////////////////////////////////////////////////////////////////////////////
function Render(geometries) {
  let camera = new Camera();

  // Intensidade da luz pontual/direcional.
  // Inicial
  let Ip = new Luz(new THREE.Vector3(-10.0, 10.0, 4.0), new THREE.Vector3(0.8, 0.8, 0.8));

  // Testando outros valores de Ip.
  // let Ip = new Luz(new THREE.Vector3(-5.0, 10.0, 4.0), new THREE.Vector3(0.8, 0.8, 0.8));
  // let Ip = new Luz(new THREE.Vector3(0.0, 2.5, 3.0), new THREE.Vector3(0.8, 0.8, 0.8));
  // let Ip = new Luz(new THREE.Vector3(3.0, 0.5, 3.0), new THREE.Vector3(0.8, 0.8, 0.8));
  // let Ip = new Luz(new THREE.Vector3(-1.0, -1.0, 4.0), new THREE.Vector3(0.8, 0.8, 0.8));
  // let Ip = new Luz(new THREE.Vector3(-10.0, -3.0, 4.0), new THREE.Vector3(0.8, 0.8, 0.8));
  // let Ip = new Luz(new THREE.Vector3(-7.0, -2.0, 4.0), new THREE.Vector3(0.8, 0.8, 0.8));
  // let Ip = new Luz(new THREE.Vector3(8.0, 8.0, 4.0), new THREE.Vector3(0.8, 0.8, 0.8));
  // let Ip = new Luz(new THREE.Vector3(0.0, 0.0, 4.0), new THREE.Vector3(0.8, 0.8, 0.8));
  // let Ip = new Luz(new THREE.Vector3(getRandom(-10.0, 10.0), getRandom(-10.0, 10.0), getRandom(4.0, 10.0)), new THREE.Vector3(0.8, 0.8, 0.8));

  // Lacos que percorrem os pixels do sensor.
  for (let y = 0; y < 512; ++y) {
    for (let x = 0; x < 512; ++x) {

      let raio = camera.raio(x, y); // Construcao do raio primario que passa pelo centro do pixel de coordenadas (x,y).
      let interseccao = new Interseccao();

      // Realiza o calculo da interseccao para cada geometria. 
      geometries.forEach(geometry => {

        if (geometry.interseccionar(raio, interseccao)) { // Se houver interseccao entao...

          let Ia = new THREE.Vector3(0.2, 0.2, 0.2);  // Intensidade da luz ambiente.

          // Calculo do termo ambiente do modelo local de iluminacao.
          let termo_ambiente = Ia.clone().multiply(geometry.ka);

          let L = (Ip.posicao.clone().sub(interseccao.posicao)).normalize(); // Vetor que aponta para a fonte e luz pontual.

          // Calculo do termo difuso do modelo local de iluminacao.
          let termo_difuso = (Ip.cor.clone().multiply(geometry.kd)).multiplyScalar(Math.max(0.0, interseccao.normal.dot(L)));

          let R = L.clone().reflect(interseccao.normal); // Vetor normalizado que representa a reflexão de l em relação à n.
          let V = interseccao.posicao.clone().normalize(); // Vetor normalizado que aponta para a câmera.

          // Calculo do termo especular do modelo local de iluminacao.
          let termo_especular = (Ip.cor.clone().multiply(geometry.ks)).multiplyScalar(Math.pow(Math.max(0.0, R.dot(V)), geometry.n));

          // Intensidade (cor) final do pixel, após a avaliação do modelo local de iluminação.
          let I = termo_ambiente.add(termo_difuso).add(termo_especular);

          PutPixel(x, y, I); // Combina os termos difuso e ambiente e pinta o pixel.

        }
        // else { // Senao houver interseccao entao...

        //   PutPixel(x, y, new THREE.Vector3(0.0, 0.0, 0.0)); // Pinta o pixel com a cor de fundo.

        // }
      });
    }
  }

  // alert("Hello, Friend! The scene has just been rendered! ");
}

///////////////////////////////////////////////////////////////////////////////
// Cena 1: cena das esferas da menor para a maior.
// Entrada: 
//  Sem entrada.
// Retorno:
//   spheres(Array): Array das esferas.
///////////////////////////////////////////////////////////////////////////////
function sequentialSpheresScene() {

  let spheres = [];

  // Esferas Vermelhas
  let sphere1 = new Esfera(new THREE.Vector3(1.5, 0.0, -3.0), 1.0);
  sphere1.ka = new THREE.Vector3(1.0, 0.0, 0.0);
  sphere1.kd = new THREE.Vector3(1.0, 0.0, 0.0);
  sphere1.ks = new THREE.Vector3(1.0, 1.0, 1.0);
  sphere1.n = 32;
  spheres.push(sphere1);

  let sphere2 = new Esfera(new THREE.Vector3(-0.2, -0.5, -3.0), 0.5);
  sphere2.ka = new THREE.Vector3(1.0, 0.0, 0.0);
  sphere2.kd = new THREE.Vector3(1.0, 0.0, 0.0);
  sphere2.ks = new THREE.Vector3(1.0, 1.0, 1.0);
  sphere2.n = 32;
  spheres.push(sphere2);

  let sphere3 = new Esfera(new THREE.Vector3(-1.2, -0.75, -3.0), 0.25);
  sphere3.ka = new THREE.Vector3(1.0, 0.0, 0.0);
  sphere3.kd = new THREE.Vector3(1.0, 0.0, 0.0);
  sphere3.ks = new THREE.Vector3(1.0, 1.0, 1.0);
  sphere3.n = 32;
  spheres.push(sphere3);

  let sphere4 = new Esfera(new THREE.Vector3(-2.0, -0.875, -3.0), 0.125);
  sphere4.ka = new THREE.Vector3(1.0, 0.0, 0.0);
  sphere4.kd = new THREE.Vector3(1.0, 0.0, 0.0);
  sphere4.ks = new THREE.Vector3(1.0, 1.0, 1.0);
  sphere4.n = 32;
  spheres.push(sphere4);

  let sphere5 = new Esfera(new THREE.Vector3(-2.5, -0.9375, -3.0), 0.125 / 2);
  sphere5.ka = new THREE.Vector3(1.0, 0.0, 0.0);
  sphere5.kd = new THREE.Vector3(1.0, 0.0, 0.0);
  sphere5.ks = new THREE.Vector3(1.0, 1.0, 1.0);
  sphere5.n = 32;
  spheres.push(sphere5);

  return spheres;
}

///////////////////////////////////////////////////////////////////////////////
// Cena 2: cena com duas esferas e um triângulo.
// Entrada: 
//  Sem entrada.
// Retorno:
//   geometries(Array): Array com as geometrias.
///////////////////////////////////////////////////////////////////////////////
function triangle2SpheresScene() {

  let geometries = [];

  /* rgba(76,0,0,255) */
  let triangle = new Triangulo(
    new THREE.Vector3(0, -1, -5),
    new THREE.Vector3(4.8, -1, -5),
    new THREE.Vector3(2.5, 4.8, -5));
  triangle.ka = new THREE.Vector3(76 / 255, 0 / 255, 0 / 255);
  triangle.kd = new THREE.Vector3(76 / 255, 0 / 255, 0 / 255);
  triangle.ks = new THREE.Vector3(1.0, 1.0, 1.0);
  triangle.n = 32;
  geometries.push(triangle);

  /* rgba(1,1,95,255) */
  let sphere1 = new Esfera(new THREE.Vector3(-1, 0.8, -3.0), 1.3);
  sphere1.ka = new THREE.Vector3(0 / 255, 85 / 255, 70 / 255);
  sphere1.kd = new THREE.Vector3(0 / 255, 85 / 255, 70 / 255);
  sphere1.ks = new THREE.Vector3(1.0, 1.0, 1.0);
  sphere1.n = 32;
  geometries.push(sphere1);

  /* rgb(3, 25, 38) */
  let sphere2 = new Esfera(new THREE.Vector3(0.3, -0.5, -3.0), 0.5);
  sphere2.ka = new THREE.Vector3(3 / 255, 25 / 255, 38 / 89);
  sphere2.kd = new THREE.Vector3(3 / 255, 25 / 255, 38 / 89);
  sphere2.ks = new THREE.Vector3(1.0, 1.0, 1.0);
  sphere2.n = 32;
  geometries.push(sphere2);

  return geometries;
}

///////////////////////////////////////////////////////////////////////////////
// Cena com alguns triângulos.
// Entrada: 
//  Sem entrada.
// Retorno:
//   geometries(Array): Array com os triângulos.
///////////////////////////////////////////////////////////////////////////////
function triangles() {

  let triangles = [];

  let bigRampTriangle = new Triangulo(
    new THREE.Vector3(-7.0, 7.0, 10.5),
    new THREE.Vector3(-7.0, -7.0, 10.0),
    new THREE.Vector3(7.75, 7.0, 11.5));
  bigRampTriangle.ka = new THREE.Vector3(1.0, 0.0, 0.0);
  bigRampTriangle.kd = new THREE.Vector3(1.0, 0.0, 0.0);
  bigRampTriangle.ks = new THREE.Vector3(1.0, 1.0, 1.0);
  bigRampTriangle.n = 32;
  // triangles.push(bigRampTriangle);

  let smallestTriangle = new Triangulo(
    new THREE.Vector3(-4, -1, -5),
    new THREE.Vector3(-3, -1, -5),
    new THREE.Vector3(-3.5, -0, -5));
  smallestTriangle.ka = new THREE.Vector3(1.0, 0.0, 0.0);
  smallestTriangle.kd = new THREE.Vector3(1.0, 0.0, 0.0);
  smallestTriangle.ks = new THREE.Vector3(1.0, 1.0, 1.0);
  smallestTriangle.n = 32;
  // triangles.push(smallestTriangle);

  let refTriangleModified = new Triangulo(
    new THREE.Vector3(1.0, 1.0, -3.0),
    new THREE.Vector3(0.75, -1, -2.5),
    new THREE.Vector3(-1.0, -1.0, -3.5));
  refTriangleModified.ka = new THREE.Vector3(1.0, 0.0, 0.0);
  refTriangleModified.kd = new THREE.Vector3(1.0, 0.0, 0.0);
  refTriangleModified.ks = new THREE.Vector3(1.0, 1.0, 1.0);
  refTriangleModified.n = 32;
  triangles.push(refTriangleModified);

  let refTriangle = new Triangulo(
    new THREE.Vector3(-1.0, -1.0, -3.5),
    new THREE.Vector3(1.0, 1.0, -3.0),
    new THREE.Vector3(-0.75, -1, -2.5));
  refTriangle.ka = new THREE.Vector3(1.0, 0.0, 0.0);
  refTriangle.kd = new THREE.Vector3(1.0, 0.0, 0.0);
  refTriangle.ks = new THREE.Vector3(1.0, 1.0, 1.0);
  refTriangle.n = 32;
  // triangles.push(refTriangle);

  return triangles;
}

///////////////////////////////////////////////////////////////////////////////
// Cena 3: cena com triângulos. (Régua)
// Entrada: 
//  Sem entrada.
// Retorno:
//   geometries(Array): Array com as geometrias.
///////////////////////////////////////////////////////////////////////////////
function trianglesInside() {

  let triangles = [];

  let bigTriangle = new Triangulo(
    new THREE.Vector3(-4, -4, -5),
    new THREE.Vector3(4, -4, -5),
    new THREE.Vector3(0, 4, -5));
  bigTriangle.ka = new THREE.Vector3(1.0, 0.0, 0.0);
  bigTriangle.kd = new THREE.Vector3(1.0, 0.0, 0.0);
  bigTriangle.ks = new THREE.Vector3(1.0, 1.0, 1.0);
  bigTriangle.n = 32;
  triangles.push(bigTriangle);

  let smallestTriangle1 = new Triangulo(
    new THREE.Vector3(-1.4, -2.53, -5),
    new THREE.Vector3(1.4, -2.53, -5),
    new THREE.Vector3(0, 0.4, -5));
  smallestTriangle1.ka = new THREE.Vector3(1.0, 1.0, 1.0);
  smallestTriangle1.kd = new THREE.Vector3(1.0, 1.0, 1.0);
  smallestTriangle1.ks = new THREE.Vector3(1.0, 1.0, 1.0);
  smallestTriangle1.n = 32;
  triangles.push(smallestTriangle1);

  let smallestTriangle2 = new Triangulo(
    new THREE.Vector3(-1.3, -2.5, -5),
    new THREE.Vector3(1.3, -2.5, -5),
    new THREE.Vector3(0, 0.3, -5));
  smallestTriangle2.ka = new THREE.Vector3(0.0, 0.0, 0.0);
  smallestTriangle2.kd = new THREE.Vector3(0.0, 0.0, 0.0);
  smallestTriangle2.ks = new THREE.Vector3(1.0, 1.0, 1.0);
  smallestTriangle2.n = 32;
  triangles.push(smallestTriangle2);

  return triangles;
}

///////////////////////////////////////////////////////////////////////////////
// Funcao que retorna um numero randomico entre Min e Max.
// Entrada: 
//  Min: Valor mínimo.
//  Max: Valor máximo.
// Retorno:
//   float: número randomico.
///////////////////////////////////////////////////////////////////////////////
function getRandom(min = -20, max = 20) {
  return Math.random() * (max - min) + min;
}

///////////////////////////////////////////////////////////////////////////////
// Cena 4: Gera uma cena randomica com triângulos e esferas.
// Entrada: 
//  Sem entrada.
// Retorno:
//   geometries(Array): Array com as geometrias.
///////////////////////////////////////////////////////////////////////////////
function abstractArt() {

  let geometries = [];

  for (let i = 0; i < 10; i++) {
    let triangle = new Triangulo(
      new THREE.Vector3(getRandom(), getRandom(), getRandom(-100, -20)),
      new THREE.Vector3(getRandom(), getRandom(), getRandom(-100, -20)),
      new THREE.Vector3(getRandom(), getRandom(), getRandom(-100, -20)));
    triangle.ka = new THREE.Vector3(getRandom(0, 1), getRandom(0, 1), getRandom(0, 1));
    triangle.kd = new THREE.Vector3(getRandom(0, 1), getRandom(0, 1), getRandom(0, 1));
    triangle.ks = new THREE.Vector3(1.0, 1.0, 1.0);
    triangle.n = 32;
    geometries.push(triangle);

    let sphere = new Esfera(new THREE.Vector3(getRandom(-4, 4), getRandom(-4, 4), getRandom(-10, -4)), getRandom(0.1, 1));
    sphere.ka = new THREE.Vector3(getRandom(0, 1), getRandom(0, 1), getRandom(0, 1));
    sphere.kd = new THREE.Vector3(getRandom(0, 1), getRandom(0, 1), getRandom(0, 1));
    sphere.ks = new THREE.Vector3(1.0, 1.0, 1.0);
    sphere.n = 32;
    geometries.push(sphere);

    let triangleSet = new Triangulo(
      new THREE.Vector3(1.0, 1.0, getRandom(-100, -3)),
      new THREE.Vector3(0.75, -1, getRandom(-100, -3)),
      new THREE.Vector3(-1, -1, getRandom(-100, -3)));
    triangleSet.ka = new THREE.Vector3(getRandom(0, 1), getRandom(0, 1), getRandom(0, 1));
    triangleSet.kd = new THREE.Vector3(getRandom(0, 1), getRandom(0, 1), getRandom(0, 1));
    triangleSet.ks = new THREE.Vector3(1.0, 1.0, 1.0);
    triangleSet.n = 32;
    // geometries.push(triangleSet);

  }

  return geometries;
}

Render(getGeometries()); // Invoca o ray tracer.

location.reload(); //  Recarrega a página. 
