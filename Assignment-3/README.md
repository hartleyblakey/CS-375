This is my submission for assignment 3 of CS-375.
[It is hosted here](https://blue.cs.sonoma.edu/~hblakey/CS-375/Assignment-3/cubes.html)

It makes use of async modules and the fetch api, so I can write shaders in their own files 
with autocomplete and inline documentation.

It renders a cube using three different methods:

1. With non-indexed rendering, in BasicCube.js
   1. Uses gl.drawArrays()
      1. Each triangle is independant
      2. Each vertex corresponds to one corner of one triangle
   2. Per vertex attributes for color and position stored in separate buffers
2. With indexed rendering, in IndexedCube.js
   1. Uses gl.drawElements()
      1. Triangles share vertices
      2. Each vertex can be a part of multiple triangles
   2. Per vertex attributes for color and position stored in separate buffers
3. With bufferless rendering, in ExperimentalCube.js
   1. Uses gl.drawArraysInstanced() wtih gl.TRIANGLE_STRIP
      1. Triangles share vertices via connected primitives
      2. Uses two instances, each draws three cube faces
   2. Model space vertex positions are generated in the vertex shader
   3. Uses no vertex attributes
