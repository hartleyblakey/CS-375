/////////////////////////////////////////////////////////////////////////////
//
//  IndexedCube.js
//
//  A cube defined of 12 triangles using vertex indices.
//



class IndexedCube {

    

    constructor(gl, vertexShader, fragmentShader) {

        // sphere?
        let cubeColorsIndexed = [
            add(mult(normalize(add(cubePositionsIndexed[0], vec3(-0.5, -0.5, -0.5))), vec3(0.5, 0.5, 0.5)), vec3(0.5, 0.5, 0.5)),
            add(mult(normalize(add(cubePositionsIndexed[1], vec3(-0.5, -0.5, -0.5))), vec3(0.5, 0.5, 0.5)), vec3(0.5, 0.5, 0.5)),
            add(mult(normalize(add(cubePositionsIndexed[2], vec3(-0.5, -0.5, -0.5))), vec3(0.5, 0.5, 0.5)), vec3(0.5, 0.5, 0.5)),
            add(mult(normalize(add(cubePositionsIndexed[3], vec3(-0.5, -0.5, -0.5))), vec3(0.5, 0.5, 0.5)), vec3(0.5, 0.5, 0.5)),

            add(mult(normalize(add(cubePositionsIndexed[4], vec3(-0.5, -0.5, -0.5))), vec3(0.5, 0.5, 0.5)), vec3(0.5, 0.5, 0.5)),
            add(mult(normalize(add(cubePositionsIndexed[5], vec3(-0.5, -0.5, -0.5))), vec3(0.5, 0.5, 0.5)), vec3(0.5, 0.5, 0.5)),
            add(mult(normalize(add(cubePositionsIndexed[6], vec3(-0.5, -0.5, -0.5))), vec3(0.5, 0.5, 0.5)), vec3(0.5, 0.5, 0.5)),
            add(mult(normalize(add(cubePositionsIndexed[7], vec3(-0.5, -0.5, -0.5))), vec3(0.5, 0.5, 0.5)), vec3(0.5, 0.5, 0.5)),

        ];

        

        let defaultVertexShader = /*glsl*/`
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

        let defaultFragmentShader = /*glsl*/`
            out vec4 fragColor;
            
            in vec3 vColor;
            
            void main() {
                fragColor = vec4(vColor, 1.0);
            }
        `;

        vertexShader    ||= defaultVertexShader;
        fragmentShader  ||= defaultFragmentShader;


        let program = new ShaderProgram(gl, this, vertexShader, fragmentShader);

        let positions     = new Attribute(gl, program, "aPosition", new Float32Array(cubePositionsIndexed.flat()), 3, gl.FLOAT);
        let colors        = new Attribute(gl, program, "aColor"   , new Float32Array(cubeColorsIndexed.flat())   , 3, gl.FLOAT);
        let indices       = new Indices(  gl, cubeIndices)
        this.draw = () => {
            program.use();

            positions.enable();
            colors.enable();
            indices.enable();

            gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

            indices.disable();
            positions.disable();
            colors.disable();
        };
    }
};
