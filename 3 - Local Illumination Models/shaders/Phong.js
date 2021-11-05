//----------------------------------------------------------------------------
// =-=-=-=-=-=-=-=-=-= Phong Model using Phong Interpolation =-=-=-=-=-=-=-=-=
//----------------------------------------------------------------------------

const Phong = {
    vertexShader: '',
    fragmentShader: ''
};

//----------------------------------------------------------------------------
// =-=-=-=-=-=-=-=-=-=-=-=-=-= Phong Vertex Shader =-=-=-=-=-=-=-=-=-=-=-=-=-=
//----------------------------------------------------------------------------

Phong.vertexShader = /* glsl */ `

    /* =-=-=-=-=-=-= Variáveis que vão ser usadas no Fragment Shader =-=-=-=-=-=-= */
    // (propriedades geradas dos vértices que vão ser enviados diretamente para o 
    // estágio de rasterização)

    // 'N' : vetor normal no ponto onde se está avaliando a iluminação. (vec3)
    // 'L' : vetor normalizado que aponta para a fonte de luz pontual/direcional. (vec3)
    // 'R' : reflexão de l em relação à n. (vec3)
    // 'V' : vetor normalizado que aponta para a câmera. (vec3)
    
    varying vec3 N;
    varying vec3 L;
    varying vec3 R;
    varying vec3 V;

    // 'uniforms' contendo informações sobre a fonte de luz pontual.

    uniform vec3 Ip_position;

    // Programa principal do Vertex Shader.

    void main() {

        // 'modelViewMatrix' : variável de sistema que contém a matriz ModelView (4x4).
        // 'Ip_pos_cam_spc' : variável que armazenará a posição da fonte de luz no Espaço da Câmera.
        
        vec4 Ip_pos_cam_spc = modelViewMatrix * vec4(Ip_position, 1.0);

        // 'position' : variável de sistema que contém a posição do vértice (vec3) no espaço do objeto.
        // 'P_cam_spc' : variável que contém o vértice (i.e. 'position') transformado para o Espaço de Câmera.
        
        vec4 P_cam_spc = modelViewMatrix * vec4(position, 1.0);

        // 'viewMatrix' : variável de sistema que contém a matriz View (4x4).
        // 'cameraPosition' : Posição da Câmera no Espaço do Universo. (vec3)
        // 'position_cam_spc' : Posição da Câmera no Espaço do Câmera. (vec4)
        
        vec4 position_cam_spc = viewMatrix * vec4(cameraPosition, 1.0);

        // 'normal' : variável de sistema que contém o vetor normal do vértice (vec3) no espaço do objeto.
        // 'normalMatrix' : variável de sistema que contém a matriz de normais (3x3) gerada a partir da matriz 'modelViewMatrix'.
        
        vec3 N_cam_spc = normalize(normalMatrix * normal);

        // 'normalize()' : função do sistema que retorna o vetor de entrada normalizado (i.e. com comprimento = 1).
        // 'L_cam_spc' : variável que contém o vetor unitário, no Espaço de Câmera, referente à fonte de luz.
        
        vec3 L_cam_spc = normalize(Ip_pos_cam_spc.xyz - P_cam_spc.xyz);

        // 'reflect()' : função do sistema que retorna 'R_cam_spc', isto é, o vetor 'L_cam_spc' refletido 
        // em relação o vetor 'N_cam_spc'.
        
        vec3 R_cam_spc = reflect(-L_cam_spc, N_cam_spc);

        N = N_cam_spc;
        L = L_cam_spc;
        R = R_cam_spc;

        // Esp.Camera: (CameraPosition - VerticePosition)
        V = position_cam_spc.xyz - P_cam_spc.xyz;

        // 'gl_Position' : variável de sistema que conterá os vértice no espaço de recorte.
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`;

//----------------------------------------------------------------------------
// =-=-=-=-=-=-=-=-=-=-=-=-=-= Phong Fragment Shader =-=-=-=-=-=-=-=-=-=-=-=-=
//----------------------------------------------------------------------------

Phong.fragmentShader = /* glsl */ `

    // Elementos necessários para a avaliação do modelo de Phong geradas no vertex shader.
    // 'varying' propriedades **interpoladas** dos vértices.

    varying vec3 N;
    varying vec3 L;
    varying vec3 R;
    varying vec3 V;

    // 'uniform' contendo informação sobre a fonte de luz ambiente.
        
    uniform vec3 Ia;

    // 'uniforms' contendo informações sobre a fonte de luz pontual.

    uniform vec3 Ip_diffuse_color;

    // 'uniforms' contendo informações sobre as reflectâncias do objeto.

    uniform vec3 k_a;
    uniform vec3 k_d;
    uniform vec3 k_s;

    // 'uniforms' contendo informação sobre o tamanho do brilho especular.

    uniform float n_expo;

    // 'I' : Variável que armazenará a cor final (i.e. intensidade) do vértice, após a avaliação do modelo local de iluminação.

    vec4 I;

    // Programa principal do Fragment Shader.

    void main() {

        // (Re)Normalização dos vetores normais.

        // 'n' : vetor normal no ponto onde se está avaliando a iluminação. (vec3)

        vec3 n = normalize(N);

        // 'l' : vetor normalizado que aponta para a fonte de luz pontual/direcional. (vec3)

        vec3 l = normalize(L);

        // 'r' : reflexão de l em relação à n. (vec3)

        vec3 r = normalize(R);

        // 'v' : vetor normalizado que aponta para a câmera. (vec3)

        vec3 v = normalize(V);

        // Cálculo da iluminação por fragmento.
        
        vec3 ambient_term = Ia * k_a;
        vec3 diffuse_term = Ip_diffuse_color * k_d * max(0.0, dot(n, l));
        vec3 specular_term = Ip_diffuse_color * k_s * pow(max(0.0, dot(r, v)), n_expo);

        // 'I' : cor final (i.e. intensidade) do vértice.

        I = vec4(ambient_term + diffuse_term + specular_term, 1.0);
    
        // 'gl_FragColor' : variável de sistema que conterá a cor final do fragmento calculada pelo Fragment Shader.
        
        gl_FragColor = I;
    }`;

export default Phong;
