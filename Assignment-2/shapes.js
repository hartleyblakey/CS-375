
window.onload = () => {
    let canvas = document.getElementById("webgl-canvas");
    let gl = canvas.getContext("webgl2");

    gl.clearColor(0.2, 0.2, 0.2, 1.0);

    let axes = new Axes(gl);
    let ms = new MatrixStack();
    let angle = 0.0;

    let render = () => {
        gl.clear(gl.COLOR_BUFFER_BIT);

        angle += 3.0;
        angle %= 360.0;

        ms.push();
        ms.rotate(angle, [1, 1, 0]);
        axes.MV = ms.current();
        axes.draw();
        ms.pop();

        requestAnimationFrame(render);
    };

    render();
};
