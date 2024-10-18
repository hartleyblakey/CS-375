#version 300 es
precision mediump float;

uniform mat4 P;
uniform mat4 MV;
out vec3 p;

void main() {
    int i = gl_InstanceID;
    int v = gl_VertexID;

    // the extra component of the position changes halfway through
    p = vec3(i / 3);

    // quad vertices
    vec2 q = vec2(v & 1, v / 2);  

    // quads 0, 2, 4 need to be flipped
    v = i & 1;

    // p[1, 0, 0, 1, 0, 0] = quad.y(or quad.x if flipped)
    p[(i + 1) % 3 & 1] = q[v];
      
    // p[2, 2, 1, 2, 2, 1] = quad.x(or quad.y if flipped)
    p[2 - i % 3 / 2] = q[v ^ 1];   

    gl_Position = P * MV * vec4(p -= .5f, 1);
}