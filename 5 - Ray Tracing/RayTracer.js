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
//   centro: Coordenadas do centro da esfera no espaco do universo (THREE.Vector3).
//   raio: Raio da esfera.
///////////////////////////////////////////////////////////////////////////////
class Esfera {
  constructor(centro, raio) {
    this.centro = centro;
    this.raio = raio;
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

class Triangulo {
  constructor(v0, v1, v2) {
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;
  }

  // MOLLER TRUMBORE
  // Fast, Minimum Storage Ray/Triangle Intersectio
  interseccionar(raio, interseccao) {
    let kEpsilon = 0.00000001;
    let dir = raio.direcao.clone();
    let orig = raio.origem.clone();

    let v0v1 = this.v1.clone().sub(this.v0);
    let v0v2 = this.v2.clone().sub(this.v0);

    let pvec = dir.clone().cross(v0v2);
    let det = v0v1.clone().dot(pvec);

    if (det > - kEpsilon && det < kEpsilon) return false;

    let invDet = 1.0 / det;

    let tvec = orig.clone().sub(this.v0);

    let u = tvec.clone().dot(pvec) * invDet;

    if (u < 0.0 || u > 1.0) return false;

    let qvec = tvec.clone().cross(v0v1);

    let v = dir.clone().dot(qvec) * invDet;

    if (v < 0.0 || u + v > 1.0) return false;

    let t = v0v2.clone().dot(qvec) * invDet;

    interseccao.t = t;
    interseccao.posicao = orig.clone().add(dir.clone().multiplyScalar(interseccao.t));
    interseccao.normal = (interseccao.posicao.clone().sub(this.v0)).normalize();

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
// Funcao que renderiza a cena utilizando ray tracing.
// Entrada: 
//  Sem entradas.
// Retorno:
//   Sem retorno.
///////////////////////////////////////////////////////////////////////////////
function Render() {
  let camera = new Camera();

  let s1 = new Esfera(new THREE.Vector3(0.0, 0.0, -3.0), 1.0);

  let v0 = new THREE.Vector3(-1.0, -1.0, -3.5);
  let v1 = new THREE.Vector3(1.0, 1.0, -3.0);
  let v2 = new THREE.Vector3(-0.75, -1.0, -2.5);
  let triangle1 = new Triangulo(v0, v1, v2);

  let Ip = new Luz(new THREE.Vector3(-10.0, 10.0, 4.0), new THREE.Vector3(0.8, 0.8, 0.8));

  // Lacos que percorrem os pixels do sensor.
  for (let y = 0; y < 512; ++y)
    for (let x = 0; x < 512; ++x) {

      let raio = camera.raio(x, y); // Construcao do raio primario que passa pelo centro do pixel de coordenadas (x,y).
      let interseccao = new Interseccao();

      if (triangle1.interseccionar(raio, interseccao)) { // Se houver interseccao entao...

        let ka = new THREE.Vector3(1.0, 0.0, 0.0);  // Coeficiente de reflectancia ambiente da esfera.
        let kd = new THREE.Vector3(1.0, 0.0, 0.0);  // Coeficiente de reflectancia difusa da esfera.
        let ks = new THREE.Vector3(1.0, 1.0, 1.0);  // Coeficiente de reflectância especular da esfera.
        let Ia = new THREE.Vector3(0.2, 0.2, 0.2);  // Intensidade da luz ambiente.
        let n = 32; // Tamanho do brilho especular da esfera.

        // Calculo do termo ambiente do modelo local de iluminacao.
        let termo_ambiente = Ia.clone().multiply(ka);

        let L = (Ip.posicao.clone().sub(interseccao.posicao)).normalize(); // Vetor que aponta para a fonte e luz pontual.

        // Calculo do termo difuso do modelo local de iluminacao.
        let termo_difuso = (Ip.cor.clone().multiply(kd)).multiplyScalar(Math.max(0.0, interseccao.normal.dot(L)));

        let R = L.clone().reflect(interseccao.normal); // Vetor normalizado que representa a reflexão de l em relação à n.
        let V = interseccao.posicao.clone().normalize(); // Vetor normalizado que aponta para a câmera.

        // Calculo do termo especular do modelo local de iluminacao.
        let termo_especular = (Ip.cor.clone().multiply(ks)).multiplyScalar(Math.pow(Math.max(0.0, R.dot(V)), n));

        // Intensidade (cor) final do pixel, após a avaliação do modelo local de iluminação.
        let I = termo_ambiente.add(termo_difuso).add(termo_especular);

        PutPixel(x, y, I); // Combina os termos difuso e ambiente e pinta o pixel.
      } else // Senao houver interseccao entao...
        PutPixel(x, y, new THREE.Vector3(0.0, 0.0, 0.0)); // Pinta o pixel com a cor de fundo.
    }
}

Render(); // Invoca o ray tracer.
