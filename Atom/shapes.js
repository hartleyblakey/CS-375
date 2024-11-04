window.onload = () => {
    let canvas = document.getElementById("webgl-canvas");
    let gl = canvas.getContext("webgl2");
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0.1, 0.1, 0.1, 1.0);

    let proton_s = new Sphere(gl, 36, 18);
    proton_s.color = vec4(1.0, 0.2, 0.2, 1.0);

    let electron_s = new Sphere(gl, 36, 18);
    electron_s.color = vec4(0.2, 0.2, 1.0, 1.0);



    let axes = new Axes(gl);

    let ms = new MatrixStack();
    ms.loadIdentity();
    




    var lastTime = performance.now();

    function vis() {
        axes.MV = ms.current();
        axes.draw();
    }

    let proton = () => {
        
        proton_s.MV = ms.current();
        proton_s.draw();
        
    }

    let electron = () => {
        vis();
        electron_s.MV = ms.current();
        electron_s.draw();
        
    }

    proton.radius = 0.1;
    electron.radius = 0.05;
    electron.orbit_radius = 0.5;

    let angle = 0.0;
    let cameraAngle = 0.0;

    gl.enable(gl.DEPTH_TEST);
    let render = () => {
        let t = performance.now() / 1000.0;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        vis();
        ms.push();
            ms.rotate(5 * t, [0, 0, 1]);
            ms.push();
                ms.rotate(0, [0, 0, 1]);
                ms.translate(0, proton.radius, 0);
                ms.scale(proton.radius);
                proton();
            ms.pop();
            ms.push();
                ms.rotate(120, [0, 0, 1]);
                ms.translate(0, proton.radius, 0);
                ms.scale(proton.radius);
                proton();
            ms.pop();
            ms.push();
                ms.rotate(240, [0, 0, 1]);
                ms.translate(0, proton.radius, 0);
                ms.scale(proton.radius);
                proton();
            ms.pop();
        ms.pop();
        ms.push();
            ms.rotate(90 * t, [0, 0, 1]);
            ms.push();
                ms.rotate(0, [0, 0, 1]);
                ms.translate(0, electron.orbit_radius, 0);
                ms.scale(electron.radius);
                electron();
            ms.pop();
            ms.push();
                ms.rotate(180, [0, 0, 1]);
                ms.translate(0, electron.orbit_radius, 0);
                ms.scale(electron.radius);
                electron();
            ms.pop();
        ms.pop();

        requestAnimationFrame(render);
    };

    render();
};

