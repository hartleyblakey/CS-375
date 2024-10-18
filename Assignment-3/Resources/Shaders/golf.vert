#version 300 es
precision mediump float;

uniform mat4 P;
uniform mat4 MV;
out vec3 p;

void main() {
    int v = gl_VertexID;
    p = vec3(v % 2, (v / 2 + 1) / 2 % 2, v / 4) - .5;
    p = gl_InstanceID > 0 ? -p.zyx : p;
    gl_Position = P * MV * vec4(p, 1);
}