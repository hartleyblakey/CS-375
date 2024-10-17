/////////////////////////////////////////////////////////////////////////////
//
//  ExperimentalCube.js
//
//  A cube defined ???
//
import resourceLoader from "./modules/ResourceLoader.js";

const defaultShaderName = "experimental";

resourceLoader.requestShader(defaultShaderName);

class ExperimentalCube {
    constructor(gl, vertexShader, fragmentShader) {
        let defaultShader = resourceLoader.getShader(defaultShaderName);

        vertexShader    ||= defaultShader.vert;
        fragmentShader  ||= defaultShader.frag;

        let program = new ShaderProgram(gl, this, vertexShader, fragmentShader);

        this.draw = () => {
            program.use();

            gl.drawArrays(gl.TRIANGLES, 0, 36);

        };
    }
};

export default ExperimentalCube;