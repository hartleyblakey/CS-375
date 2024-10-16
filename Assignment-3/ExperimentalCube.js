/////////////////////////////////////////////////////////////////////////////
//
//  ExperimentalCube.js
//
//  A cube defined ???
//
import resourceLoader from "./modules/ResourceLoader.js";

resourceLoader.requestShader("experimental");

class ExperimentalCube {
    constructor(gl, vertexShader, fragmentShader) {
        let defaultShader = resourceLoader.getShader("experimental");

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