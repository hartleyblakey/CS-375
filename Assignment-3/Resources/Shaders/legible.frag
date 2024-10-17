#version 300 es
precision mediump float;

out vec4 fragColor;
in vec3 vPosition;

void main() {
    fragColor = vec4(normalize(vPosition) * 0.5 + 0.5, 1.0);
}