#version 300 es
precision mediump float;

uniform mat4 P;
uniform mat4 MV;
out vec3 p;

void main() {
    int v = gl_VertexID;

    // cube vertices
    // looks like |_|
    p = vec3(v % 2, (v / 2 + 1) / 2 % 2, v / 4) - .5;

    // rotates the |_| if its the second instance
    // could be inlined if I didnt want position to color the cube
    p = gl_InstanceID > 0 ? -p.zyx : p;

    gl_Position = P * MV * vec4(p, 1);
}