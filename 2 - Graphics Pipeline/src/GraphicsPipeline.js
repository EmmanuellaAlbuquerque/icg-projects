// import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.131.3-QQa34rwf1xM5cawaQLl8/mode=imports,min/optimized/three.js';

var initialTHETA = 0;
var diff = 10;
var actualForm = "cube";
var sizePixelated = true;

function changeTheta() {
  initialTHETA += diff; 

  if (initialTHETA == 360) {
    diff = -diff;
  }
  else if (initialTHETA > 360) {
    initialTHETA = 360;
    diff = -diff;
  }
  else if (initialTHETA < 0) {
    initialTHETA = 0;
    diff = -diff;
  }
}

function displayPipelineRender(form="cube", rotate=false, pixelated=true) {
  changeTheta()

  // Cria um color buffer para armazenar a imagem final.
  let color_buffer = new Canvas("canvas");
  color_buffer.clear();

  if (!pixelated) {
    color_buffer.setWidth(512);
    color_buffer.setHeight(512);
  }
  else {
    color_buffer.setWidth(128);
    color_buffer.setHeight(128);
  }
  
  /******************************************************************************
   * Vértices do modelo (cubo) centralizado no seu espaco do objeto. Os dois
   * vértices extremos do cubo são (-1,-1,-1) e (1,1,1), logo, cada aresta do cubo
   * tem comprimento igual a 2.
   *****************************************************************************/
  //                                   X     Y     Z    W (coord. homogênea)
  let cubeVertices = [new THREE.Vector4(-1.0, -1.0, -1.0, 1.0),
                  new THREE.Vector4( 1.0, -1.0, -1.0, 1.0),
                  new THREE.Vector4( 1.0, -1.0,  1.0, 1.0),
                  new THREE.Vector4(-1.0, -1.0,  1.0, 1.0),
                  new THREE.Vector4(-1.0,  1.0, -1.0, 1.0),
                  new THREE.Vector4( 1.0,  1.0, -1.0, 1.0),
                  new THREE.Vector4( 1.0,  1.0,  1.0, 1.0),
                  new THREE.Vector4(-1.0,  1.0,  1.0, 1.0)];
  
  let pyramidVertices = [new THREE.Vector4(1.0, 0.0, 1.0, 1.0),
                  new THREE.Vector4( 1.0, 0.0, -1.0, 1.0),
                  new THREE.Vector4( -1.0, 0.0,  -1.0, 1.0),
                  new THREE.Vector4( -1.0, 0.0,  1.0, 1.0),
                  new THREE.Vector4(0.0, 1.5,  0.0, 1.0)];
  
  let triangleVertices = [new THREE.Vector4(-1.0, -1.0, 1.0, 1.0),
    new THREE.Vector4( -1.0, 1.0, -1.0, 1.0),
    new THREE.Vector4( -1.0, -1.0,  -1.0, 1.0),
    new THREE.Vector4( 1.0, -1.0,  -1.0, 1.0),
    new THREE.Vector4(1.0, 1.0,  -1.0, 1.0)];    
  
  let t_prism = 1;
  let prismVertices = [new THREE.Vector4(-t_prism, 1.0, -1, 1.0),
    new THREE.Vector4( t_prism, 1.0, -1, 1.0),
    new THREE.Vector4( 0.0, 1.0,  1.0, 1.0),
    new THREE.Vector4( -t_prism, -1.0,  -1.0, 1.0),
    new THREE.Vector4(0.0, -1.0,  1.0, 1.0),
    new THREE.Vector4(t_prism, -1.0,  -1.0, 1.0)
  ]; 
  
  /******************************************************************************
   * As 12 arestas do cubo, indicadas através dos índices dos seus vértices.
   *****************************************************************************/
  let cubeEdges = [[0,1],
               [1,2],
               [2,3],
               [3,0],
               [4,5],
               [5,6],
               [6,7],
               [7,4],
               [0,4],
               [1,5],
               [2,6],
               [3,7]];
  
  let pyramidEdges = [[0,1],
              [1,2],
              [2,3],
              [3,0],
              [1,4],
              [4,2],
              [3,4],
              [0,4],
              // [1,3]
            ];
  
  let triangleEdges = [[0,1],
              [1,2],
              [2,3],
              [3,4],
              [4,1],
              [4,0],
              [0,2],
              [0,3],
            ];
  
  let prismEdges = [[0,1],
              [1,2],
              [2,0],
              [3,5],
              [5,4],
              [4,3],
              [0,3],
              [1,5],
              [2,4],
            ];
  
  let forms = {
    cube: {
      vertices: cubeVertices, 
      edges: cubeEdges,
    },
    pyramid: {
      vertices: pyramidVertices, 
      edges: pyramidEdges,
    },
    triangle: {
      vertices: triangleVertices, 
      edges: triangleEdges,
    },
    prism: {
      vertices: prismVertices, 
      edges: prismEdges,
    },
  }

  let actualForm = forms[`${form}`];

  let formVertices = actualForm.vertices;
  let formEdges = actualForm.edges;

  let vertices = formVertices;
  let edges = formEdges;
  
  /******************************************************************************
   * Matriz Model (modelagem): Esp. Objeto --> Esp. Universo. 
   * OBS: A matriz está carregada inicialmente com a identidade.
   *****************************************************************************/
  let m_model = new THREE.Matrix4();

  m_model.set(1.0, 0.0, 0.0, 0.0,
              0.0, 1.0, 0.0, 0.0,
              0.0, 0.0, 1.0, 0.0,
              0.0, 0.0, 0.0, 1.0);

  let theta = initialTHETA;

  /******************************************************************************
   * Transforma o ângulo em radianos.
   *   180° ------- π
   * angle  ------- x
   * x = ( angle * π ) / 180
   *****************************************************************************/
  let theta_radians = (theta * Math.PI) / 180;

  let m_y_rotation = new THREE.Matrix4();

  m_y_rotation.set(Math.cos(theta_radians), 0.0, Math.sin(theta_radians), 0.0,
              0.0, 1.0, 0.0, 0.0,
              -Math.sin(theta_radians), 0.0, Math.cos(theta_radians), 0.0,
              0.0, 0.0, 0.0, 1.0);

  /******************************************************************************
   * Aplica a matriz de rotação no Y na matriz identidade da modelagem, 
   * se o botão StartRotateForm tiver sido pressionado.
   *****************************************************************************/
  if (rotate) {
    m_model.multiply(m_y_rotation);
  }
  
  for (let i = 0; i < vertices.length; ++i)
      vertices[i].applyMatrix4(m_model);
  
  /******************************************************************************
   * Parâmetros da camera sintética.
   *****************************************************************************/
  let cam_pos = new THREE.Vector3(1.3,1.7,2.0);     // posição da câmera no esp. do Universo.
  let cam_look_at = new THREE.Vector3(0.0,0.0,0.0); // ponto para o qual a câmera aponta.
  let cam_up = new THREE.Vector3(0.0,1.0,0.0);      // vetor Up da câmera.
  
  /******************************************************************************
   * Matriz View (visualização): Esp. Universo --> Esp. Câmera
   * OBS: A matriz está carregada inicialmente com a identidade. 
   *****************************************************************************/
  
    // Derivando os vetores da base da câmera a partir dos parâmetros informados acima.
  
    // ---------------------------- SETTING ZCAM --------------------------------
  
    let cam_direction = cam_look_at.clone().sub(cam_pos);
  
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
  
    // Constrói 'm_bt', a inversa da matriz de base da câmera.
  
    let m_bt = new THREE.Matrix4();
  
    m_bt.set(x_cam.getComponent(0), x_cam.getComponent(1), x_cam.getComponent(2), 0.0,
             y_cam.getComponent(0), y_cam.getComponent(1), y_cam.getComponent(2), 0.0,
             z_cam.getComponent(0), z_cam.getComponent(1), z_cam.getComponent(2), 0.0,
             0.0, 0.0, 0.0, 1.0);
  
    // Constrói a matriz 'm_t' de translação para tratar os casos em que as
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
  
  /******************************************************************************
   * Homogeneizacao (divisao por W): Esp. Recorte --> Esp. Canônico
   *****************************************************************************/
  
    // Divide all vectors by homogeneous coordinate W
    for (let i = 0; i < vertices.length; ++i)
      vertices[i].divideScalar(vertices[i].getComponent(3));
  
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
  
  /******************************************************************************
   * Rasterização
   *****************************************************************************/
  
    for (let i = 0; i < edges.length; i++) {
      let [ vertex_index1, vertex_index2 ] = edges[i];
      let vertex1 = vertices[vertex_index1];
      let vertex2 = vertices[vertex_index2];
  
      color_buffer.drawLine(vertex1.x, vertex1.y, vertex2.x, vertex2.y, [255, 0, 0, 255], [255, 0, 0, 255]);
    }
    
    // ---------- debug camera base vectors ----------
    // let cameraBaseVectors = {
    //   cam_direction,
    //   d_norm,
    //   z_cam,
    //   up_cross_zcam,
    //   up_zcam_norm,
    //   x_cam,
    //   zcam_cross_xcam,
    //   zcam_xcam_norm,
    //   y_cam,
    //   origin,
    //   t, 
    //   m_bt,
    //   m_t,
    //   m_view,
    //   vertices
    // }
    
    // for (const key in cameraBaseVectors) {
    //   const element = cameraBaseVectors[key];
    //   console.log(key, ":", element)
    // }
  }

  /******************************************************************************
   * Ações dos botões utilizados no HTML 
   *****************************************************************************/

  function Cube() {
    displayPipelineRender("cube", false, sizePixelated);
    actualForm = "cube";
  }

  function Pyramid() {
    displayPipelineRender("pyramid", false, sizePixelated);
    actualForm = "pyramid";
  }

  function Triangle() {
    displayPipelineRender("triangle", false, sizePixelated);
    actualForm = "triangle";
  }

  function Prism() {
    displayPipelineRender("prism", false, sizePixelated);
    actualForm = "prism";
  }

  var createPipelineLoop;

  function StartRotation() {
    StopRotation();
    createPipelineLoop = setInterval(function () {
      displayPipelineRender(actualForm, true, sizePixelated);
    }, 100);
  }

  function StopRotation() {
    clearInterval(createPipelineLoop);
  }

  function ResizeCanvas() {
    if (sizePixelated) {
      sizePixelated = false;
    }
    else {
      sizePixelated = true;
    }
    displayPipelineRender(actualForm, false, sizePixelated);
  }

  /******************************************************************************
   * Main
   *****************************************************************************/

    displayPipelineRender();
