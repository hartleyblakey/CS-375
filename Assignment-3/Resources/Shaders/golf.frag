#version 300 es
precision mediump float;

out vec4 fragColor;
in vec3 p;

void main() {
    fragColor = vec4(normalize(p) * 0.5 + 0.5, 1.0);
}