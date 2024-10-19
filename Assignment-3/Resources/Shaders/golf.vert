#version 300 es
precision mediump float;

uniform mat4 P;
uniform mat4 MV;
out vec3 p;

void main() {
    int v = gl_VertexID;

    // cube vertices
    // looks like |_|
    p = vec3(v / 4, v % 6 > 1, v % 2) - .5;

    // rotates the second |_| to mesh with the first one
    // assignment could be skipped if I didn't need p for shading later

    // if we dont have to use P and MV, could combine on the application side
    // into a mat4 T[2] array indexed by instanceID, which would shave a lot
    gl_Position = P * MV * vec4(p = gl_InstanceID > 0 ? -p.zyx : p, 1);
}