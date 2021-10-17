// import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.131.3-QQa34rwf1xM5cawaQLl8/mode=imports,min/optimized/three.js';

  /* =-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  *                        Variaveis Globais limitadas ao escopo do script. 
  =-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-= */

  // Cria um color buffer para armazenar a imagem final.
  let color_buffer = new Canvas("canvas");
  color_buffer.clear();

  /******************************************************************************
  * Os vértices das geometrias. Modelo do Cubo: centralizado no seu espaco do objeto. 
  * Os dois vértices extremos do cubo são (-1,-1,-1) e (1,1,1), logo, cada aresta do 
  * cubo tem comprimento igual a 2.
  *****************************************************************************/
  //                                     X     Y     Z    W (coord. homogênea)
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

  let prismVertices = [new THREE.Vector4(-1, 1.0, -1, 1.0),
                       new THREE.Vector4( 1, 1.0, -1, 1.0),
                       new THREE.Vector4( 0.0, 1.0,  1.0, 1.0),
                       new THREE.Vector4( -1, -1.0,  -1.0, 1.0),
                       new THREE.Vector4(0.0, -1.0,  1.0, 1.0),
                       new THREE.Vector4(1, -1.0,  -1.0, 1.0)]; 

  /******************************************************************************
  * As arestas das geometrias, indicadas através dos índices dos seus vértices.
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
                      [0,4]];

  let triangleEdges = [[0,1],
                      [1,2],
                      [2,3],
                      [3,4],
                      [4,1],
                      [4,0],
                      [0,2],
                      [0,3]];

  let prismEdges = [[0,1],
                    [1,2],
                    [2,0],
                    [3,5],
                    [5,4],
                    [4,3],
                    [0,3],
                    [1,5],
                    [2,4]];

  /******************************************************************************
  * Os vértices e as arestas das geometrias organizadas 
  * em um objeto de formas geométricas.
  *****************************************************************************/

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
    }
  }

  /******************************************************************************
  * Algumas configuracoes iniciais para exibicao das geometrias.
  *****************************************************************************/

  var THETA = 0;
  var diff = 10;
  var actualForm = "cube";
  var sizePixelated = false;

  /* =-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  *                                       Funcoes utilizadas.
  =-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-= */

  /**
   * Muda o valor do THETA entre 0 e 360,
   * quando o parametro de rotacao esta ativo.
   */
  function changeTheta() {
    THETA += diff;

    if (THETA == 360) {
      diff = -diff;
    }
    else if (THETA > 360) {
      THETA = 360;
      diff = -diff;
    }
    else if (THETA < 0) {
      THETA = 0;
      diff = -diff;
    }
  }

  /**
   * Executa todas as etapas do Pipeline, utilizando as 
   * matrizes de transformacao geometrica.
   * @param {Vector4} vertices 
   * @param {boolean} rotate 
   * @returns {Vector4[]} Vector4 Array.
   */
  function executeGPipeline(vertices, rotate=false) {
  /******************************************************************************
   * Matriz Model (modelagem): Esp. Objeto --> Esp. Universo. 
   * OBS: A matriz está carregada inicialmente com a identidade.
   *****************************************************************************/
    let m_model = new THREE.Matrix4();

    m_model.set(1.0, 0.0, 0.0, 0.0,
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0);

    /******************************************************************************
     * Aplica a matriz de rotação no Y, na matriz identidade da modelagem, 
     * se o botão StartRotateForm tiver sido pressionado.
     *****************************************************************************/
    if (rotate) {

      /******************************************************************************
       * Transforma o ângulo em radianos.
       *   180° ------- π
       * angle  ------- x
       * x = ( angle * π ) / 180
       *****************************************************************************/
        let theta_radians = (THETA * Math.PI) / 180;

        let m_y_rotation = new THREE.Matrix4();
    
        m_y_rotation.set(Math.cos(theta_radians), 0.0, Math.sin(theta_radians), 0.0,
                        0.0, 1.0, 0.0, 0.0,
                        -Math.sin(theta_radians), 0.0, Math.cos(theta_radians), 0.0,
                        0.0, 0.0, 0.0, 1.0);

        changeTheta();
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
     * Matriz View (visualização): Esp. Universo --> Esp. Câmera.
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
     * Matriz de Projecao: Esp. Câmera --> Esp. Recorte.
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
    
      for (let i = 0; i < vertices.length; ++i) {
        vertices[i].applyMatrix4(m_viewport);

        // Arredonda as coordenadas dos vertices para serem inteiras.
        vertices[i].round();
      }

      let baseParams = {
        cam_direction,
        d_norm,
        z_cam,
        up_cross_zcam,
        up_zcam_norm,
        x_cam,
        zcam_cross_xcam,
        zcam_xcam_norm,
        y_cam,
        origin,
        t, 
        m_bt,
        m_t,
        m_view,
        vertices
      }

      // showPipelineBaseParams(baseParams);

      // Retorna os vertices modificados, apos realizar 
      // todas as transformacoes geometricas.
      return vertices;
  }

  /**
   * Auxiliar para ver os valores dos vetores e matrizes 
   * gerados pelo Pipeline no console.
   * @param {Object} params 
   */
  function showPipelineBaseParams(params){
    // ---------- debug base vectors and matrices ---------- 
    for (const key in params) {
      const element = params[key];
      console.log(key, ":", element)
    }
  }

  /******************************************************************************
  * Rasterização
  *****************************************************************************/
  function Render (vertices, edges) {
    color_buffer.clear();

     for (let i = 0; i < edges.length; i++) {
      let [ vertex_index1, vertex_index2 ] = edges[i];
      let vertex1 = vertices[vertex_index1];
      let vertex2 = vertices[vertex_index2];
  
      color_buffer.drawLine(vertex1.x, vertex1.y, vertex2.x, vertex2.y, [255, 0, 0, 255], [255, 0, 0, 255]);
    }
  }

  function setCanvasSize() {
    if (sizePixelated) {
      color_buffer.setWidth(512);
      color_buffer.setHeight(512);
    }
    else {
      color_buffer.setWidth(128);
      color_buffer.setHeight(128);
    }
  }

  function copyVertices(vertices) {
    let vertices_copy = vertices.map(v => {
      return v.clone();
    })

    return vertices_copy;
  }

  function renderWrapper(geometry_name, is_rotated=false) {
    setCanvasSize();

    let geometric_form = forms[`${geometry_name}`];

    let vertices = copyVertices(geometric_form.vertices);
    let edges = geometric_form.edges;
  
    var transformed_vertices = executeGPipeline(vertices, is_rotated);
    Render(transformed_vertices, edges);
    actualForm = geometry_name;
  }

  /* =-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  *                             Ações dos botões utilizados no HTML 
  =-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-= */

  function Cube() {
    renderWrapper("cube");
  }

  function Pyramid() {
    renderWrapper("pyramid");
  }

  function Triangle() {
    renderWrapper("triangle");
  }

  function Prism() {
    renderWrapper("prism");
  }

  var createPipelineLoop;

  function StartRotation() {
    StopRotation();
    createPipelineLoop = setInterval(function () {
      renderWrapper(actualForm, true);
    }, 100);
  }

  function StopRotation() {
    clearInterval(createPipelineLoop);
  }

  function ResizeCanvas() {
    sizePixelated = sizePixelated ? false : true;
    renderWrapper(actualForm, false);
  }

  /* =-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  *                                             Main
  =-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-= */

    renderWrapper("cube");
