const resourcePath = "./Resources";
const shaderPath = resourcePath + "/Shaders";

async function getShaderSource(name) {
    var res = Object();
    res.frag = await((await fetch(shaderPath + "/" + name + ".frag", {cache: "no-cache"})).text());
    res.vert = await((await fetch(shaderPath + "/" + name + ".vert", {cache: "no-cache"})).text());
    if (!res.frag || !res.vert) {
        alert("unable to find shaders at " + shaderPath + name);
    }
    return res
}

cubePositions = [
    // -z
    vec3(0, 0, 0),
    vec3(0, 1, 0),
    vec3(1, 1, 0),

    vec3(1, 1, 0),
    vec3(1, 0, 0),
    vec3(0, 0, 0),

    // +z
    vec3(1, 1, 1),
    vec3(0, 1, 1),
    vec3(0, 0, 1),
    
    vec3(0, 0, 1),
    vec3(1, 0, 1),
    vec3(1, 1, 1),

    // -x
    vec3(0, 1, 1),
    vec3(0, 1, 0),
    vec3(0, 0, 0),
    
    
    vec3(0, 0, 0),
    vec3(0, 0, 1),
    vec3(0, 1, 1),

    // +x
    vec3(1, 0, 0),
    vec3(1, 1, 0),
    vec3(1, 1, 1),

    vec3(1, 1, 1),
    vec3(1, 0, 1),
    vec3(1, 0, 0),

    // -y
    vec3(0, 0, 0),
    vec3(1, 0, 0),
    vec3(1, 0, 1),

    vec3(1, 0, 1),
    vec3(0, 0, 1),
    vec3(0, 0, 0),

    // +y
    vec3(1, 1, 1),
    vec3(1, 1, 0),
    vec3(0, 1, 0),
    
    vec3(0, 1, 0),
    vec3(0, 1, 1),
    vec3(1, 1, 1),
];

cubePositionsIndexed = [
    vec3(0, 0, 0),
    vec3(0, 0, 1),
    vec3(0, 1, 0),
    vec3(0, 1, 1),
    vec3(1, 0, 0),
    vec3(1, 0, 1),
    vec3(1, 1, 0),
    vec3(1, 1, 1),
];

cubeIndices = new Uint16Array([
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
    2, 3, 7,
]);



cubeNormalsFlat = [
    // -z
    vec3(0.5, 0.5, 0.0),
    vec3(0.5, 0.5, 0.0),
    vec3(0.5, 0.5, 0.0),

    vec3(0.5, 0.5, 0.0),
    vec3(0.5, 0.5, 0.0),
    vec3(0.5, 0.5, 0.0),

    // +z
    vec3(0.5, 0.5, 1.0),
    vec3(0.5, 0.5, 1.0),
    vec3(0.5, 0.5, 1.0),

    vec3(0.5, 0.5, 1.0),
    vec3(0.5, 0.5, 1.0),
    vec3(0.5, 0.5, 1.0),

    // -x
    vec3(0.0, 0.5, 0.5),
    vec3(0.0, 0.5, 0.5),
    vec3(0.0, 0.5, 0.5),

    vec3(0.0, 0.5, 0.5),
    vec3(0.0, 0.5, 0.5),
    vec3(0.0, 0.5, 0.5),

    // +x
    vec3(1.0, 0.5, 0.5),
    vec3(1.0, 0.5, 0.5),
    vec3(1.0, 0.5, 0.5),

    vec3(1.0, 0.5, 0.5),
    vec3(1.0, 0.5, 0.5),
    vec3(1.0, 0.5, 0.5),

    // -y
    vec3(0.5, 0.0, 0.5),
    vec3(0.5, 0.0, 0.5),
    vec3(0.5, 0.0, 0.5),

    vec3(0.5, 0.0, 0.5),
    vec3(0.5, 0.0, 0.5),
    vec3(0.5, 0.0, 0.5),

    // +y
    vec3(0.5, 1.0, 0.5),
    vec3(0.5, 1.0, 0.5),
    vec3(0.5, 1.0, 0.5),

    vec3(0.5, 1.0, 0.5),
    vec3(0.5, 1.0, 0.5),
    vec3(0.5, 1.0, 0.5),
];




