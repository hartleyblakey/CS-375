/////////////////////////////////////////////////////////////////////////////
//
//  ExperimentalCube.js
//
//  A cube defined ???
//
import resourceLoader from "./modules/ResourceLoader.js";

const defaultShaderName = "golf";

resourceLoader.requestShader(defaultShaderName);

class ExperimentalCube {
    constructor(/** @type {WebGL2RenderingContext} */gl   , vertexShader, fragmentShader) {
        let defaultShader = resourceLoader.getShader(defaultShaderName);

        vertexShader    ||= defaultShader.vert;
        fragmentShader  ||= defaultShader.frag;

        let program = new ShaderProgram(gl, this, vertexShader, fragmentShader);

        this.draw = () => {
            program.use();
            gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, 6);
        };
    }
};

export default ExperimentalCube;