/////////////////////////////////////////////////////////////////////////////
//
//  BasicCube.js
//
//  A cube defined of 12 triangles
//

// for syntax highlighting, [stage]`` needs to be valid syntax
// because of ??? x is no longer a string if we just pass it through
const vert = x => (" " + x);
const frag = x => (" " + x);

class BasicCube {
    constructor(gl, vertexShader, fragmentShader) {
        let defaultVertexShader = vert`
            in vec4 aPosition;
            in vec4 aColor;

            out vec3 vColor;

            uniform mat4 P;
            uniform mat4 MV;

            void main() {
                gl_Position = P * MV * vec4(aPosition.xyz * 0.3, aPosition.w);
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

        let positions     = new Attribute(gl, program, "aPosition", cubePositions, 3, gl.FLOAT);
        let colors        = new Attribute(gl, program, "aColor"   , cubeColors   , 3, gl.FLOAT);

        this.draw = () => {
            program.use();

            positions.enable();
            colors.enable();

            gl.drawArrays(gl.TRIANGLES, 0, cubePositions.length / 3);

            positions.disable();
            colors.disable();
        };
    }
};