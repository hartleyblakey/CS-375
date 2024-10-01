
class Spaceship {
    constructor(gl) {
        this.hull = new Cylinder(gl, 8);
        this.hull.color = vec4(0.4, 0.4, 0.4, 1.0);
        
        this.cap = new Cone(gl, 8);
        this.cap.color = vec4(0.4, 0.4, 0.4, 1.0);

        this.thruster = new Cone(gl, 8);
        this.thruster.color = vec4(1.0, 1.0, 1.0, 1.0);

        this.wings = new Cylinder(gl, 8);
        this.wings.color = vec4(0.4, 0.4, 0.4, 1.0);

        this.laser = new Axes(gl);

        this.gl = gl;
    }

    draw(ms, shouldFire) {
        ms.push();
            ms.scale(1, 1, 8)
            this.hull.MV = ms.current();
            this.hull.draw();
        ms.pop();

        ms.push();
            ms.translate(0, 0, 8);
            ms.scale(1, 1, 4);
            this.cap.MV = ms.current();
            this.cap.draw();
        ms.pop();

        ms.push();
            ms.translate(0, 0, 2.0);
            ms.scale(8, 0.5, 4);
            this.wings.MV = ms.current();
            this.wings.draw();
        ms.pop();

        ms.push();
            ms.translate(0, 0, -4);
            ms.scale(1, 1, 4);
            this.thruster.MV = ms.current();
            this.thruster.draw();
        ms.pop();

        if (shouldFire) {
            // right laser
            ms.push();
                ms.translate(6.0, 0.001, 6.05);
                ms.rotate(-90, [0, 1, 0]);
                ms.scale(60.0, 0.01, 0.01)
                this.laser.MV = ms.current();
                this.laser.draw();
            ms.pop();

            // left laser
            ms.push();
                ms.translate(-6.0, 0.001, 6.05);
                ms.rotate(-90, [0, 1, 0]);
                ms.scale(60.0, 0.01, 0.01)
                this.laser.MV = ms.current();
                this.laser.draw();
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
    let ship = new Spaceship(gl);
    let ufo = new Tetrahedron(gl);
    ufo.color = vec4(0.4, 0.4, 0.7, 1.0);
    let star = new Tetrahedron(gl);
    star.color = vec4(1, 1, 1, 1);
    let ms = new MatrixStack();
    ms.loadIdentity();
    
    var lastTime = performance.now();
    function vis() {
        axes.MV = ms.current();
        axes.draw();
    }

    let angle = 0.0;
    let cameraAngle = 0.0;

    gl.enable(gl.DEPTH_TEST);
    let render = () => {
        let time = performance.now();
        let dt = (time - lastTime) / 1000.0; // convert to seconds
        lastTime = time;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        angle += 90.0 * dt;
        angle %= 360.0;

        cameraAngle += 10.0 * dt;
        cameraAngle %= 360.0;

        ms.push();
        ms.rotate(cameraAngle, [0, 1, 0]);
        
        // draw stars
        for (var i = 0; i < 100; i++) {
            ms.push();
                // random enough rotations
                ms.rotate(i * 100, [0, 0, 1]);
                ms.rotate(i * 46, [1, 0, 0]);
                ms.rotate(i * 11, [0, 1, 0]);
                ms.translate(0.5, 0.0, 0.0);
                ms.scale(0.01);
                star.MV = ms.current();
                star.draw();
            ms.pop();
        }

        ms.push();
        ms.scale(0.1, 0.1, 0.1);
        planet.MV = ms.current();
        planet.color = vec4(0.4, 0.5, 0.3, 1.0);
        planet.draw();
            ms.push();
                ms.translate(-0.01, -0.01, -0.01);
                planet.color = vec4(0.2, 0.3, 0.2, 1.0);
                planet.MV = ms.current();
                planet.draw();
            ms.pop(); // planet shadow
        ms.pop(); // planet

        ms.push();
            ms.rotate(90, [1, 1, 0]);
            ms.rotate(angle, [1, 0, 0]);
            ms.push();
                ms.translate(0.0, 0.0, 0.5);
                ms.rotate(90.0, [1, 0, 0]);
                ms.scale(0.008);
                ship.draw(ms);
            ms.pop(); // ship 1
            ms.rotate(-50, [1, 0, 0]);
            ms.push();
                ms.translate(0.0, 0.0, 0.5);
                ms.rotate(90.0, [1, 0, 0]);
                ms.scale(0.005);
                ship.draw(ms, Math.random() > 0.8);
            ms.pop(); // ship 2
        ms.pop(); // ships
        
        ms.push();
            ms.scale(0.05);
            ms.rotate(angle * 2.0 - 40, [1, 1, 0]);
            ms.rotate(angle * 2 - 20, [1, 0, 1]);
            ms.translate(3.3, 0.0, 0.0);
            ms.scale(1.0 + Math.random() * 0.5);
            ufo.MV = ms.current();
            ufo.draw();
        ms.pop(); // ufo

        ms.pop(); // initial push
        requestAnimationFrame(render);
    };

    render();
};

