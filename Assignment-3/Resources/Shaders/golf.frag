#version 300 es
precision mediump float;

out vec4 fragColor;
in vec3 p;

void main() {
    fragColor = vec4(normalize(p) * 0.5 + 0.5, 1.0);
    if (!gl_FrontFacing) {
        fragColor = vec4(normalize(p) * 0.5 + 0.5, 5.0) * 0.1 + 0.5;
    }
}