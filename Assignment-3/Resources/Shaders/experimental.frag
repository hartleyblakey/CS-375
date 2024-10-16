#version 300es
precision mediump float;

out vec4 fragColor;
in vec3 pos;

void main() {
    fragColor = vec4(normalize(pos) * 0.5 + 0.5, 1.0);
}