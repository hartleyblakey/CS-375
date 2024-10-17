#version 300 es
precision mediump float;

uniform mat4 P;
uniform mat4 MV;
out vec3 vPosition;

vec2 quadVertices(int idx) {
    return vec2(idx % 2, idx / 2) - 0.5;
    // 0: bottom left  : (-0.5, -0.5)
    // 1: bottom right : (0.5, -0.5)
    // 2: top left     : (-0.5, 0.5)
    // 3: top right    : (0.5, 0.5)
}

void main() {
    vec2 quad = quadVertices(gl_VertexID);
    switch(gl_InstanceID) {
        case 0:
            vPosition.x = quad.x;
            vPosition.y = quad.y;
            vPosition.z = -0.5;
            vPosition = vPosition.yxz; // flip to front facing
            break;
        case 1:
            vPosition.x = quad.x;
            vPosition.y = quad.y;
            vPosition.z = 0.5;
            
            break;
        case 2:
            vPosition.x = quad.x;
            vPosition.y = -0.5;
            vPosition.z = quad.y;
            
            break;
        case 3:
            vPosition.x = quad.x;
            vPosition.y = 0.5;
            vPosition.z = quad.y;
            vPosition = vPosition.zyx; // flip to front facing
            break;
        case 4:
            vPosition.x = -0.5;
            vPosition.y = quad.x;
            vPosition.z = quad.y;
            vPosition = vPosition.xzy; // flip to front facing
            break;
        case 5:
            vPosition.x = 0.5;
            vPosition.y = quad.x;
            vPosition.z = quad.y;
            
            break;
    }
    gl_Position = P * MV * vec4(vPosition,1);
}