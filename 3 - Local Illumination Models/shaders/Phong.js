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

    // 'modelViewM4' : matriz ModelView (4x4).
    // 'normalM3' : matriz de normais (3x3).
    // 'vnormal' : vetor normal do vértice (vec3).
    // 'vposition' : posição do vértice (vec3).
    
    varying mat4 modelViewM4;
    varying mat3 normalM3;
    varying vec3 vnormal;
    varying vec3 vposition;

    // Programa principal do Vertex Shader.

    void main() {

        modelViewM4 = modelViewMatrix;
        normalM3 = normalMatrix;
        vnormal = normal;
        vposition = position;

        // 'gl_Position' : variável de sistema que conterá os vértice no espaço de recorte.
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`;

//----------------------------------------------------------------------------
// =-=-=-=-=-=-=-=-=-=-=-=-=-= Phong Fragment Shader =-=-=-=-=-=-=-=-=-=-=-=-=
//----------------------------------------------------------------------------

Phong.fragmentShader = /* glsl */ `

    varying mat4 modelViewM4;
    varying mat3 normalM3;
    varying vec3 vnormal;
    varying vec3 vposition;

    // 'uniform' contendo informação sobre a fonte de luz ambiente.
        
    uniform vec3 Ia;

    // 'uniforms' contendo informações sobre a fonte de luz pontual.

    uniform vec3 Ip_position;
    uniform vec3 Ip_diffuse_color;

    // 'uniforms' contendo informações sobre as reflectâncias do objeto.

    uniform vec3 k_a;
    uniform vec3 k_d;
    uniform vec3 k_s;

    // 'uniforms' contendo informação sobre o tamanho do brilho especular.

    uniform float n;

    // 'I' : Variável que armazenará a cor final (i.e. intensidade) do vértice, após a avaliação do modelo local de iluminação.

    vec4 I;

    // Programa principal do Fragment Shader.

    void main() {

        // 'modelViewM4' : a matriz ModelView (4x4).
        // 'Ip_pos_cam_spc' : variável que armazenará a posição da fonte de luz no Espaço da Câmera.
        
        vec4 Ip_pos_cam_spc = modelViewM4 * vec4(Ip_position, 1.0);

        // 'vposition' : a posição do vértice (vec3) no espaço do objeto.
        // 'P_cam_spc' : variável que contém o vértice (i.e. 'position') transformado para o Espaço de Câmera.
        
        vec4 P_cam_spc = modelViewM4 * vec4(vposition, 1.0);

        // 'viewMatrix' : a matriz View (4x4).
        // 'position_cam_spc' : a posição da Câmera no Espaço do Universo.

        vec4 position_cam_spc = viewMatrix * vec4(cameraPosition, 1.0);
        vec3 V = normalize(position_cam_spc.xyz - P_cam_spc.xyz);

        // 'vnormal' : vetor normal do vértice (vec3) no espaço do objeto.
        // 'normalM3' : a matriz de normais (3x3) gerada a partir da matriz 'modelViewMatrix'.
        
        vec3 N_cam_spc = normalize(normalM3 * vnormal);

        // 'normalize()' : função do sistema que retorna o vetor de entrada normalizado (i.e. com comprimento = 1).
        // 'L_cam_spc' : variável que contém o vetor unitário, no Espaço de Câmera, referente à fonte de luz.
        
        vec3 L_cam_spc = normalize(Ip_pos_cam_spc.xyz - P_cam_spc.xyz);

        // 'reflect()' : função do sistema que retorna 'R_cam_spc', isto é, o vetor 'L_cam_spc' refletido 
        // em relação o vetor 'N_cam_spc'.
        
        vec3 R_cam_spc = reflect(-L_cam_spc, N_cam_spc);

        // 'I' : cor final (i.e. intensidade) do vértice.
        
        vec3 ambient_term = Ia * k_a;
        vec3 diffuse_term = Ip_diffuse_color * k_d * max(0.0, dot(N_cam_spc, L_cam_spc));
        vec3 specular_term = Ip_diffuse_color * k_s * pow(max(0.0, dot(R_cam_spc, V)), n);

        I = vec4(ambient_term + diffuse_term + specular_term, 1.0);
    
        // 'gl_FragColor' : variável de sistema que conterá a cor final do fragmento calculada pelo Fragment Shader.
        
        gl_FragColor = I;
    }`;

export default Phong;
