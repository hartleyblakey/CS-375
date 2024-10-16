/////////////////////////////////////////////////////////////////////////////
//
//  ExperimentalCube.js
//
//  A cube defined ???
//

class ExperimentalCube {
    constructor(gl, vertexShader, fragmentShader) {
        let defaultVertexShader = vert`
            uniform mat4 P;
            uniform mat4 MV;
            out vec3 pos;
            
            const int[36] i = int[36](

                // 0 1 2 2 3 0

                0, 2, 6,
                6, 4, 0,
            
                7, 3, 1,
                1, 5, 7,
            
                3, 2, 0,
                0, 1, 3,
            
                4, 6, 7,
                7, 5, 4,
            
                0, 4, 5,
                5, 1, 0,
            
                7, 6, 2,
                2, 3, 7

            );

            #define p(i) (vec3((i) & 1, ((i) >> 1) & 1, (i) >> 2)-0.5)
            void main() {
                pos = p(7-i[gl_VertexID]);
                gl_Position = P * MV * vec4(pos,1);
            }
        `;

        let defaultFragmentShader = frag`
            out vec4 fragColor;
            in vec3 pos;

            void main() {
                fragColor = vec4(normalize(pos) * 0.5 + 0.5, 1.0);
            }
        `;

        vertexShader    ||= defaultVertexShader;
        fragmentShader  ||= defaultFragmentShader;

        let program = new ShaderProgram(gl, this, vertexShader, fragmentShader);

        this.draw = () => {
            program.use();

            gl.drawArrays(gl.TRIANGLES, 0, 36);

        };
    }
};