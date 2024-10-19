#version 300 es
// ^ redundant but needed by language server for linting, can remove

// if we dont have to use both P and MV, could combine on the application side
uniform mat4 P, MV;
out vec3 p;

void main() {
    int v = gl_VertexID;

    // cube corner positions
    // looks like |_|
    p = vec3(v / 4, v % 6 > 1, v % 2) - .5;

    // rotates the second |_| to mesh with the first one
    gl_Position = P * MV * vec4(p = gl_InstanceID > 0 ? -p.zyx : p, 1);
}

// // single triangle strip version, longer and not really procedural
// void main() {
//     // vertex ordering from https://www.paridebroggi.com/blogpost/2015/06/16/optimized-cube-opengl-triangle-strip/
//     int i = int[](2,6,0,4,5,6,7,2,3,0,1,5,3,7)[gl_VertexID];
//     gl_Position = P * MV * vec4(p = vec3(i / 4, i / 2 % 2, i % 2) - .5, 1);
// }

// // best attempt at a true 5 line version, no interpolated variable for shading though
// uniform mat4 P, MV;
// void main() {
//     vec3 p = vec3(gl_VertexID / 4, gl_VertexID % 6 > 1, gl_VertexID % 2) - .5;
//     gl_Position = P * MV * vec4(gl_InstanceID > 0 ? -p.zyx : p, 1);
// }
