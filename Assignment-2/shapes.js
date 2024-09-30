
class Spaceship {
    constructor(gl) {
        this.hull = new Cylinder(gl, 8);
        this.hull.color = vec4(0.4, 0.4, 0.4, 1.0);
        
        this.cap = new Cone(gl, 8);
        this.cap.color = vec4(0.4, 0.4, 0.4, 1.0);

        this.thruster = new Cone(gl, 8);
        this.thruster.color = vec4(1.0, 1.0, 1.0, 1.0);

        this.lazer = new Axes(gl);

        this.gl = gl;
    }

    draw(ms, shouldFire) {
        ms.push();
        ms.scale(1, 1, 8)
        this.hull.MV = ms.current();
        this.hull.draw();
        ms.pop();

        ms.push();
        ms.scale(1, 1, 4);
        ms.translate(0, 0, 2);
        this.cap.MV = ms.current();
        this.cap.draw();
        ms.pop();

        ms.push();
        ms.scale(1, 1, 4);
        ms.translate(0, 0, -1);
        this.thruster.MV = ms.current();
        this.thruster.draw();
        ms.pop();

        if (shouldFire) {
            ms.push();
            ms.rotate(180, [0, 1, 1]);
            ms.rotate(90, [0, 0, 1]);
            ms.scale(50.0, 0.01, 0.01);
            this.lazer.MV = ms.current();
            this.lazer.draw();
            ms.pop();
        }


    }
}



window.onload = () => {
    let canvas = document.getElementById("webgl-canvas");
    let gl = canvas.getContext("webgl2");
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0.1, 0.1, 0.1, 1.0);

    let planet = new Sphere(gl, 36, 18);
    let axes = new Axes(gl);
    let ship1 = new Spaceship(gl);
    let ms = new MatrixStack();
    ms.loadIdentity();
    let angle = 0.0;
    var lastTime = performance.now();
    function vis(gl) {
        axes.MV = ms.current();
        axes.draw();
    }
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    let render = () => {
        let time = performance.now();
        let dt = (time - lastTime) / 1000.0; // convert to seconds
        lastTime = time;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        angle += 180.0 * dt;
        angle %= 360.0;

        ms.push();
        ms.scale(0.1, 0.1, 0.1);
        planet.MV = ms.current();
        planet.color = vec4(0.8, 0.8, 0.8, 1.0);
        planet.draw();
            ms.push();
            ms.translate(-0.01, -0.01, -0.01);
            planet.color = vec4(0.2, 0.2, 0.2, 1.0);
            planet.MV = ms.current();
            planet.draw();
            ms.pop();
        ms.pop();

        ms.push();
            ms.rotate(angle, [1, 1, 0]);
            //vis(gl);
            ms.push();
                ms.translate(0.0, 0.0, 0.5);
                ms.rotate(90.0, [1, 1, 0]);
                ms.scale(0.01);
                ship1.draw(ms);
            ms.pop();

            ms.rotate(-50, [1, 1, 0]);
            ms.push();
                ms.translate(0.0, 0.0, 0.5);
                ms.rotate(90.0, [1, 1, 0]);
                ms.scale(0.01);
                ship1.draw(ms, Math.random() > 0.8);
            ms.pop();
        ms.pop();


        requestAnimationFrame(render);
    };

    render();
};

