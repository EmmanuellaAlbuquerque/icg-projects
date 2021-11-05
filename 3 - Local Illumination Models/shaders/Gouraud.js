const Gouraud = {
  vertexShader: '',
  fragmentShader: ''
};

//----------------------------------------------------------------------------
// =-=-=-=-=-=-=-=-=-=-=-=-=-= Gouraud Vertex Shader =-=-=-=-=-=-=-=-=-=-=-=-=
//----------------------------------------------------------------------------
Gouraud.vertexShader = /* glsl */ `
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
    //     A variável 'I' é do tipo 'varying', ou seja, seu valor será calculado pelo Vertex Shader (por vértice)
    //     e será interpolado durante a rasterização das primitivas, ficando disponível para cada fragmento gerado pela rasterização.
    
    varying vec4 I;

    // Programa principal do Vertex Shader.

    void main() {
    
        // 'modelViewMatrix' : variável de sistema que contém a matriz ModelView (4x4).
        // 'Ip_pos_cam_spc' : variável que armazenará a posição da fonte de luz no Espaço da Câmera.
        
        vec4 Ip_pos_cam_spc = modelViewMatrix * vec4(Ip_position, 1.0);

        // 'position' : variável de sistema que contém a posição do vértice (vec3) no espaço do objeto.
        // 'P_cam_spc' : variável que contém o vértice (i.e. 'position') transformado para o Espaço de Câmera.
        //     Observe que 'position' é um vetor 3D que precisou ser levado para o espaço projetivo 4D 
        //     (i.e., acrescentando-se uma coordenada adicional w = 1.0) para poder ser multiplicado pela
        //     matriz 'modelViewMatrix' (que é 4x4).
        
        vec4 P_cam_spc = modelViewMatrix * vec4(position, 1.0);

        // 'viewMatrix' : variável de sistema que contém a matriz View (4x4).
        // 'cameraPosition' : Posição da Câmera no Espaço do Universo.
        
        vec4 position_cam_spc = viewMatrix * vec4(cameraPosition, 1.0);
        vec3 V = normalize(position_cam_spc.xyz - P_cam_spc.xyz);

        // 'normal' : variável de sistema que contém o vetor normal do vértice (vec3) no espaço do objeto.
        // 'normalMatrix' : variável de sistema que contém a matriz de normais (3x3) gerada a partir da matriz 'modelViewMatrix'.
        
        vec3 N_cam_spc = normalize(normalMatrix * normal);

        // 'normalize()' : função do sistema que retorna o vetor de entrada normalizado (i.e. com comprimento = 1).
        // 'L_cam_spc' : variável que contém o vetor unitário, no Espaço de Câmera, referente à fonte de luz.
        
        vec3 L_cam_spc = normalize(Ip_pos_cam_spc.xyz - P_cam_spc.xyz);

        // 'reflect()' : função do sistema que retorna 'R_cam_spc', isto é, o vetor 'L_cam_spc' refletido 
        //     em relação o vetor 'N_cam_spc'.
        
        vec3 R_cam_spc = reflect(-L_cam_spc, N_cam_spc);

        ///////////////////////////////////////////////////////////////////////////////
        //
        // Escreva aqui o seu código para implementar os modelos de iluminação com 
        // Gouraud Shading (interpolação por vértice). 
        //
        ///////////////////////////////////////////////////////////////////////////////

        // 'I' : cor final (i.e. intensidade) do vértice.
        //     Neste caso, a cor retornada é vermelho. Para a realização do exercício, o aluno deverá atribuir a 'I' o valor
        //     final gerado pelo modelo local de iluminação implementado.
        
        vec3 ambient_term = Ia * k_a;
        vec3 diffuse_term = Ip_diffuse_color * k_d * max(0.0, dot(N_cam_spc, L_cam_spc));
        vec3 specular_term = Ip_diffuse_color * k_s * pow(max(0.0, dot(R_cam_spc, V)), n);

        I = vec4(ambient_term + diffuse_term + specular_term, 1.0);

        // 'gl_Position' : variável de sistema que conterá a posição final do vértice transformado pelo Vertex Shader.
        
        gl_Position = projectionMatrix * P_cam_spc;
    }
    `;

//----------------------------------------------------------------------------
// =-=-=-=-=-=-=-=-=-=-=-=-= Gouraud Fragment Shader =-=-=-=-=-=-=-=-=-=-=-=-=
//----------------------------------------------------------------------------
Gouraud.fragmentShader = /* glsl */ `
    // 'I' : valor de cor originalmente calculada pelo Vertex Shader, e já interpolada para o fragmento corrente.
    
    varying vec4 I;

    // Programa principal do Fragment Shader.

    void main() {
    
        // 'gl_FragColor' : variável de sistema que conterá a cor final do fragmento calculada pelo Fragment Shader.
        
        gl_FragColor = I;
    }
    `;

export default Gouraud;
