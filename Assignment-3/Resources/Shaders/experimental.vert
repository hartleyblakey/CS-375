#version 300 es
precision mediump float;

uniform mat4 P;
uniform mat4 MV;
out vec3 pos;

const int[36] i = int[36](

    // 0 1 2 2 3 0

    0, 2, 6,
    6, 4, 0,

    7, 3, 1,
    1, 5, 7,

    3, 2, 0,
    0, 1, 3,

    4, 6, 7,
    7, 5, 4,

    0, 4, 5,
    5, 1, 0,

    7, 6, 2,
    2, 3, 7

);

#define p(v) (vec3((v) >> 2, ((v) >> 1) & 1, (v) & 1)-0.5)
void main() {
    pos = p(i[gl_VertexID]);
    gl_Position = P * MV * vec4(pos,1);
}