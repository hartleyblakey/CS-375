#version 300 es
precision highp float;
// ^ both redundant but needed by language server for linting, can remove

out vec4 fragColor;
in vec3 p;

void main() {
    fragColor = vec4(mix(p + .5, vec3(.5), .4), 1);
}