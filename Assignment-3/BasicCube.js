/////////////////////////////////////////////////////////////////////////////
//
//  BasicCube.js
//
//  A cube defined of 12 triangles
//

class BasicCube {
    // for syntax highlighting, [stage]`` needs to be valid syntax
    // because of ??? x is no longer a string if we just pass it through
    vert = x => (x + " ");
    frag = x => (x + " ");

    defaultVertexShader = vert`
        in vec4 aPosition;
        in vec4 aColor;

        uniform mat4 P;
        uniform mat4 MV;

        void main() {
            gl_Position = P * MV * aPosition;
        }
    `;

    defaultFragmentShader = frag`
        out vec4 fragColor;

        void main() {
            fragColor = vec4(0, 0.6, 0.6);
        }
    `;

    cubePositions = Float32Array(
        // -z
        -1, -1, -1,
        -1, +1, -1,
        +1, +1, -1,

        +1, +1, -1,
        +1, -1, -1,
        -1, -1, -1

       // +z
       -1, -1, +1,
       -1, +1, +1,
       +1, +1, +1,

       +1, +1, +1,
       +1, -1, +1,
       -1, -1, +1

        // -x
        -1, -1, -1,
        -1, +1, -1,
        -1, +1, +1,

        -1, +1, +1,
        -1, -1, +1,
        -1, -1, -1,
    );

    cubeColors = Float32Array(
        0.2, 0.4, 0.6,
        0.2, 0.4, 0.6,
        0.2, 0.4, 0.6,

        0.2, 0.4, 0.6,
        0.2, 0.4, 0.6,
        0.2, 0.4, 0.6,

        0.2, 0.4, 0.6,
        0.2, 0.4, 0.6,
        0.2, 0.4, 0.6,

        0.2, 0.4, 0.6,
        0.2, 0.4, 0.6,
        0.2, 0.4, 0.6,

        0.2, 0.4, 0.6,
        0.2, 0.4, 0.6,
        0.2, 0.4, 0.6,

        0.2, 0.4, 0.6,
        0.2, 0.4, 0.6,
        0.2, 0.4, 0.6,
    );

    constructor(gl, vertexShader, fragmentShader) {
        vertexShader    |= this.defaultVertexShader;
        fragmentShader  |= this.defaultFragmentShader;

        this.program = new ShaderProgram(gl, this, vertexShader, fragmentShader);

        this.positions   = new Attribute(gl, program, "aPosition", cubePositions, 3, gl.FLOAT, false, 24, 0);
        this.colors      = new Attribute(gl, program, "aColor"   , cubeColors   , 3, gl.FLOAT, false, 24, 12);

        this.draw = () => {
            this.program.use();

            this.positions.enable();
            this.colors.enable();

            gl.drawArrays();

            this.positions.disable();
            this.colors.disable();
        };
    }
};