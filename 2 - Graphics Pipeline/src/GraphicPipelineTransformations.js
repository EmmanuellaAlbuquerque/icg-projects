import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.131.3-QQa34rwf1xM5cawaQLl8/mode=imports,min/optimized/three.js';

// Cria um color buffer para armazenar a imagem final.
let color_buffer = new Canvas("canvas");
color_buffer.clear();

/******************************************************************************
 * Vértices do modelo (cubo) centralizado no seu espaco do objeto. Os dois
 * vértices extremos do cubo são (-1,-1,-1) e (1,1,1), logo, cada aresta do cubo
 * tem comprimento igual a 2.
 *****************************************************************************/
//                                   X     Y     Z    W (coord. homogênea)

let vertices = [new THREE.Vector4(0.0, 0.0, 0.0, 1.0),
                new THREE.Vector4(3.0, 0.0, -2.0, 1.0),
                new THREE.Vector4(0.0, 0.0, -4, 1.0)];

function showVertices() {
  let verticesCopy = vertices.map(x => {return {...x}})
  
  verticesCopy.forEach(lineElement => {
    console.log('[', lineElement.x.toFixed(2), lineElement.y.toFixed(2), lineElement.z.toFixed(2), lineElement.w.toFixed(2), ']')
  });
  console.log('\n'); 
}

console.log('Initial Vertices')
showVertices();

/******************************************************************************
 * As 12 arestas do cubo, indicadas através dos índices dos seus vértices.
 *****************************************************************************/

let edges = [[0,1],
            [1,2],
            [2,0]];

/******************************************************************************
 * Matriz Model (modelagem): Esp. Objeto --> Esp. Universo. 
 * OBS: A matriz está carregada inicialmente com a identidade.
 *****************************************************************************/
let m_model = new THREE.Matrix4();

// m_model.set(1.0, 0.0, 0.0, 0.0,
//             0.0, 1.0, 0.0, 0.0,
//             0.0, 0.0, 1.0, 0.0,
//             0.0, 0.0, 0.0, 1.0);
let theta = -90;
/******************************************************************************
 *   180° ------- π
 * angle  ------- x
 * x = ( angle * π ) / 180
 *****************************************************************************/
let theta_radians = (theta * Math.PI) / 180;

// Eixo Y
// m_model.set(Math.cos(theta_radians), 0.0, Math.sin(theta_radians), 0.0,
//             0.0, 1.0, 0.0, 0.0,
//             -Math.sin(theta_radians), 0.0, Math.cos(theta_radians), 0.0,
//             0.0, 0.0, 0.0, 1.0);
// for (let i = 0; i < vertices.length; ++i)
//     vertices[i].applyMatrix4(m_model);

m_model.set(Math.cos(theta_radians), -Math.sin(theta_radians), 0, 0.0,
            Math.sin(theta_radians), Math.cos(theta_radians), 0.0, 0.0,
            0, 0.0, 1, 0.0,
            0.0, 0.0, 0.0, 1.0);
for (let i = 0; i < vertices.length; ++i)
    vertices[i].applyMatrix4(m_model);

console.log('M Model')
showVertices();

/******************************************************************************
 * Parâmetros da camera sintética.
 *****************************************************************************/
let cam_pos = new THREE.Vector3(5.0 , 0.0, -2.0);     // posição da câmera no esp. do Universo.
let cam_look_at = new THREE.Vector3(0.0, 0.0, 0.0); // ponto para o qual a câmera aponta.
let cam_up = new THREE.Vector3(0.0, 1.0, 0.0);      // vetor Up da câmera.

/******************************************************************************
 * Matriz View (visualização): Esp. Universo --> Esp. Câmera
 * OBS: A matriz está carregada inicialmente com a identidade. 
 *****************************************************************************/

  // Derivar os vetores da base da câmera a partir dos parâmetros informados acima. ✓

  // ---------------------------- SETTING ZCAM --------------------------------

  // let cam_direction = cam_look_at.clone().sub(cam_pos);
  let cam_direction = new THREE.Vector3(-1.0, 0.0, 0.0);      // vetor Direção da câmera.

  // Euclidean distance, NORM of Direction Vector
  let d_norm = cam_direction.length();

  let z_cam = cam_direction.clone().multiplyScalar(-1).divideScalar(d_norm);

  // ---------------------------- SETTING XCAM --------------------------------

  let up_cross_zcam = cam_up.clone().cross(z_cam);

  // Euclidean distance, NORM of U x Z_cam
  let up_zcam_norm = up_cross_zcam.length();

  let x_cam = up_cross_zcam.clone().divideScalar(up_zcam_norm)

  // ---------------------------- SETTING YCAM --------------------------------

  let zcam_cross_xcam = z_cam.clone().cross(x_cam);

  // Euclidean distance, NORM of Z_cam x X_cam
  let zcam_xcam_norm = zcam_cross_xcam.length();

  let y_cam = zcam_cross_xcam.clone().divideScalar(zcam_xcam_norm)

  // Construir 'm_bt', a inversa da matriz de base da câmera.

  let m_bt = new THREE.Matrix4();

  m_bt.set(x_cam.getComponent(0), x_cam.getComponent(1), x_cam.getComponent(2), 0.0,
           y_cam.getComponent(0), y_cam.getComponent(1), y_cam.getComponent(2), 0.0,
           z_cam.getComponent(0), z_cam.getComponent(1), z_cam.getComponent(2), 0.0,
           0.0, 0.0, 0.0, 1.0);

  // Construir a matriz 'm_t' de translação para tratar os casos em que as
  // origens do espaço do universo e da câmera não coincidem.

  let origin = new THREE.Vector3(0.0, 0.0, 0.0); // vetor Origem no esp. do Universo.
  let t = cam_pos.clone().sub(origin);

  let m_t = new THREE.Matrix4();

  m_t.set(1.0, 0.0, 0.0, -t.getComponent(0),
          0.0, 1.0, 0.0, -t.getComponent(1),
          0.0, 0.0, 1.0, -t.getComponent(2),
          0.0, 0.0, 0.0, 1.0);

  // Constrói a matriz de visualização 'm_view' como o produto
  //  de 'm_bt' e 'm_t'.
  let m_view = m_bt.clone().multiply(m_t);

  for (let i = 0; i < vertices.length; ++i)
      vertices[i].applyMatrix4(m_view);

console.log('M View')
showVertices();
/******************************************************************************
 * Matriz de Projecao: Esp. Câmera --> Esp. Recorte
 * OBS: A matriz está carregada inicialmente com a identidade. 
 *****************************************************************************/

  let d = 1;

  let m_projection = new THREE.Matrix4();

  m_projection.set(1.0, 0.0, 0.0, 0.0,
                   0.0, 1.0, 0.0, 0.0,
                   0.0, 0.0, 1.0, d,
                   0.0, 0.0, -1/d, 0.0);

  for (let i = 0; i < vertices.length; ++i)
    vertices[i].applyMatrix4(m_projection);

console.log('M Projection')
showVertices();

/******************************************************************************
 * Homogeneizacao (divisao por W): Esp. Recorte --> Esp. Canônico
 *****************************************************************************/

  // Divide all vectors by homogeneous coordinate W
  for (let i = 0; i < vertices.length; ++i)
    vertices[i].divideScalar(vertices[i].getComponent(3));
  
console.log('(Divisao por W)')
showVertices();

/******************************************************************************
 * Matriz Viewport: Esp. Canônico --> Esp. Tela
 * OBS: A matriz está carregada inicialmente com a identidade. 
 *****************************************************************************/

  let m_s = new THREE.Matrix4();

  m_s.set(color_buffer.getWidth()/2, 0.0, 0.0, 0.0,
                 0.0, color_buffer.getHeight()/2, 0.0, 0.0,
                 0.0, 0.0, 1.0, 0.0,
                 0.0, 0.0, 0.0, 1.0);

  let m_t_viewport = new THREE.Matrix4();

  m_t_viewport.set(1.0, 0.0, 0.0, 1,
          0.0, 1.0, 0.0, 1,
          0.0, 0.0, 1.0, 0.0,
          0.0, 0.0, 0.0, 1.0);

  // Constrói a matriz Viewport 'm_viewport' como o produto
  //  de 'm_s' e 'm_t_viewport'.
  let m_viewport = m_s.clone().multiply(m_t_viewport);

  for (let i = 0; i < vertices.length; ++i)
    vertices[i].applyMatrix4(m_viewport);

console.log('M Viewport')
showVertices();

/******************************************************************************
 * Rasterização
 *****************************************************************************/

  for (let i = 0; i < edges.length; i++) {
    let [ vertex_index1, vertex_index2 ] = edges[i];
    let vertex1 = vertices[vertex_index1];
    let vertex2 = vertices[vertex_index2];

    color_buffer.drawLine(vertex1.x, vertex1.y, vertex2.x, vertex2.y, [255, 0, 0, 255], [255, 0, 0, 255]);
  }

  // let teste = new THREE.Matrix4();

  // teste.set(1.0, 2.0, 3.0, 4.0,
  // 5.0, 6.0, 7.0, 8.0,
  // 9.0, 10.0, 11.0, 12.0,
  // 13.0, 14.0, 15.0, 16.0);
  // teste.transpose();

  m_model.transpose();
  m_view.transpose();
  m_projection.transpose();
  m_viewport.transpose();

  let M = m_model.clone().multiply(m_view).multiply(m_projection);

  // ---------- All Pipeline Matrices ----------
  let matrices = {
    m_model,
    m_view,
    m_projection,
    m_viewport,
    M
  }

  let matricesString = '';

  for (const key in matrices) {
    const matrix = matrices[key];
    console.log(key)

    let j = 0;
    let lineMatrix = [];
    for (let i = 0; i < 16; i++) {
      lineMatrix.push(matrix.elements[i]);
      j++;
      if (j==4) {

        let line = '[';

        lineMatrix.forEach(element => {
          line += ' ';
          line += element.toFixed(2);
        });
  
        line += ' ]'
        console.log(line)

        j = 0;
        lineMatrix = [];
      }
    }

    let matrixString = `
    \\begin{bmatrix}
    ${matrix.elements[0].toFixed(2)}&  ${matrix.elements[1].toFixed(2)}&  ${matrix.elements[2].toFixed(2)}& ${matrix.elements[3].toFixed(2)}\\\\
    ${matrix.elements[4].toFixed(2)}&  ${matrix.elements[5].toFixed(2)}&  ${matrix.elements[6].toFixed(2)}& ${matrix.elements[7].toFixed(2)}\\\\
    ${matrix.elements[8].toFixed(2)}&  ${matrix.elements[9].toFixed(2)}&  ${matrix.elements[10].toFixed(2)}& ${matrix.elements[11].toFixed(2)}\\\\
    ${matrix.elements[12].toFixed(2)}&  ${matrix.elements[13].toFixed(2)}&  ${matrix.elements[14].toFixed(2)}& ${matrix.elements[15].toFixed(2)}
   \\end{bmatrix}
    `;

    matricesString += matrixString;
  }

  console.log(matricesString)

  // function download(filename, text) {
  //   var element = document.createElement('a');
  //   element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  //   element.setAttribute('download', filename);
  
  //   element.style.display = 'none';
  //   document.body.appendChild(element);
  
  //   element.click();
  
  //   document.body.removeChild(element);
  // }
  
  // // Start file download.
  // download("hello.txt", matrixString);

  // console.log(x_cam)
  // console.log(y_cam)
  // console.log(z_cam)


  //     m_model,
    // m_view,
    // m_projection,

  // let M = m_model.clone().multiply(m_view).multiply(m_projection);
  // console.log(M)

