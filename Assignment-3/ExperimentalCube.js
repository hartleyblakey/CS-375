/////////////////////////////////////////////////////////////////////////////
//
//  ExperimentalCube.js
//
//  A cube defined ???
//

let defaultShader = await getShaderSource("golf");

class ExperimentalCube {
    constructor(/** @type {WebGL2RenderingContext} */gl   , vertexShader, fragmentShader) {
        vertexShader    ||= defaultShader.vert;
        fragmentShader  ||= defaultShader.frag;

        let program = new ShaderProgram(gl, this, vertexShader, fragmentShader);

        this.draw = () => {
            program.use();
            gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 8, 2);
        };
    }
};

export default ExperimentalCube;