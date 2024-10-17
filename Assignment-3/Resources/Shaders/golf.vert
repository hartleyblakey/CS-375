#version 300 es
precision mediump float;

uniform mat4 P;
uniform mat4 MV;
out vec3 p;

void main() {
    int i = gl_InstanceID;
    int v = gl_VertexID;

    // the extra component of the position alternates between 0 and 1
    p = vec3(i & 1);

    // quad vertices
    vec2 q = vec2(v & 1, v / 2);  

    // quads 0, 3, 4 need to be flipped: least significant two bits are the same  
    v = i & 1 ^ (i /= 2) & 1;

    // p.[x, x, x, x, y, y] = quad.x(or quad.y if flipped)
    p[(i + 1) / 2 + 1] = q[v];
      
    // p.[y, y, z, z, z, z] = quad.y(or quad.x if flipped)
    p[i / 2] = q[v ^ 1];   

    gl_Position = P * MV * vec4(p -= .5f, 1);
}