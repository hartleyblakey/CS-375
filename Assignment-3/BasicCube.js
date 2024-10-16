/////////////////////////////////////////////////////////////////////////////
//
//  BasicCube.js
//
//  A cube defined of 12 triangles
//

class BasicCube {
    constructor(gl, vertexShader, fragmentShader) {
        let defaultVertexShader = vert`
            in vec4 aPosition;
            in vec4 aColor;

            out vec3 vColor;

            uniform mat4 P;
            uniform mat4 MV;

            void main() {
                gl_Position = P * MV * vec4(aPosition.xyz - 0.5, aPosition.w);
                vColor = vec3(aColor.rgb);
            }
        `;

        let defaultFragmentShader = frag`
            out vec4 fragColor;
            
            in vec3 vColor;

            void main() {
                fragColor = vec4(vColor, 1.0);
            }
        `;

        vertexShader    ||= defaultVertexShader;
        fragmentShader  ||= defaultFragmentShader;

        let program = new ShaderProgram(gl, this, vertexShader, fragmentShader);

        let positions     = new Attribute(gl, program, "aPosition", new Float32Array(cubePositions.flat()), 3, gl.FLOAT);
        let colors        = new Attribute(gl, program, "aColor"   , new Float32Array(cubeColors.flat())   , 3, gl.FLOAT);

        this.draw = () => {
            program.use();

            positions.enable();
            colors.enable();

            gl.drawArrays(gl.TRIANGLES, 0, cubePositions.length);

            positions.disable();
            colors.disable();
        };
    }
};