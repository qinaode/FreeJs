window.onload = function () {
    using("Oak3D");
    game.start("testCanvas", "3d", null, draw);
    shader.load("testVs", "3DTest.vs", "vs");
    shader.load("testFs", "3DTest.fs", "fs");
    p = graphics.getProgram(shader.get("testVs"), shader.get("testFs"));
    texture2D.load("bg", "nehe.png");
    //初始化着色器
    initShaders();
    //初始化缓冲区
    initBuffers();
    graphics.clear(100, 149, 237, 1);
};

//着色器程序
var cubeVertexPositionBuffer;
var cubeVertexTextureCoordBuffer;
var cubeVertexIndexBuffer;

var mvMatrix;
var mvMatrixStack = [];
var pMatrix;

var p;

function draw() {
    animate();
    var g = graphics.getContext();
    graphics.clear();

    //设置投射矩阵
    pMatrix = okMat4Proj(45, g.viewportWidth / g.viewportHeight, 0.1, 10.0);
    //设置平移矩阵
    mvMatrix = okMat4Trans(0.0, 0.0, -5.0);
    //设置旋转矩阵
    mvMatrix.rotX(OAK.SPACE_LOCAL, animate.xRot, true);
    mvMatrix.rotY(OAK.SPACE_LOCAL, animate.yRot, true);
    mvMatrix.rotZ(OAK.SPACE_LOCAL, animate.zRot, true);

    g.bindBuffer(g.ARRAY_BUFFER, cubeVertexPositionBuffer);
    g.vertexAttribPointer(p.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, g.FLOAT, false, 0, 0);

    g.bindBuffer(g.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    g.vertexAttribPointer(p.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, g.FLOAT, false, 0, 0);

    g.activeTexture(g.TEXTURE0);
    g.bindTexture(g.TEXTURE_2D, texture2D.get("bg"));
    g.uniform1i(p.samplerUniform, 0);
    g.uniform1f(p.alphaUniform, 0.5);
    g.blendFunc(g.SRC_ALPHA, g.ONE);
    g.enable(g.BLEND);
    g.disable(g.DEPTH_TEST);

    g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    setMatrixUniforms();
    g.drawElements(g.TRIANGLES, cubeVertexIndexBuffer.numItems, g.UNSIGNED_SHORT, 0);
}

function mvPushMatrix() {
    var copy = new okMat4();
    mvMatrix.clone(copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0)
    {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms() {
    var g = graphics.getContext();
    g.uniformMatrix4fv(p.pMatrixUniform, false, pMatrix.toArray());
    g.uniformMatrix4fv(p.mvMatrixUniform, false, mvMatrix.toArray());
}

function initShaders() {
    var g = graphics.getContext();
    p.vertexPositionAttribute = g.getAttribLocation(p, "aVertexPosition");
    g.enableVertexAttribArray(p.vertexPositionAttribute);

    p.textureCoordAttribute = g.getAttribLocation(p, "aTextureCoord");
    g.enableVertexAttribArray(p.textureCoordAttribute);

    p.pMatrixUniform = g.getUniformLocation(p, "uPMatrix");
    p.mvMatrixUniform = g.getUniformLocation(p, "uMVMatrix");
    p.samplerUniform = g.getUniformLocation(p, "uSampler");
    p.alphaUniform = g.getUniformLocation(p, "uAlpha");
}

function initBuffers() {
    var g = graphics.getContext();
    cubeVertexPositionBuffer = g.createBuffer();
    g.bindBuffer(g.ARRAY_BUFFER, cubeVertexPositionBuffer);
    vertices = [
            // Front face
            -1.0, -1.0, 1.0,
             1.0, -1.0, 1.0,
             1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
             1.0, 1.0, -1.0,
             1.0, -1.0, -1.0,

            // Top face
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
             1.0, 1.0, 1.0,
             1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0, 1.0,
            -1.0, -1.0, 1.0,

            // Right face
             1.0, -1.0, -1.0,
             1.0, 1.0, -1.0,
             1.0, 1.0, 1.0,
             1.0, -1.0, 1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0,
    ];
    g.bufferData(g.ARRAY_BUFFER, new Float32Array(vertices), g.STATIC_DRAW);
    cubeVertexPositionBuffer.itemSize = 3;
    cubeVertexPositionBuffer.numItems = 24;

    cubeVertexTextureCoordBuffer = g.createBuffer();
    g.bindBuffer(g.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    var textureCoords = [
          // Front face
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,

          // Back face
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
          0.0, 0.0,

          // Top face
          0.0, 1.0,
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,

          // Bottom face
          1.0, 1.0,
          0.0, 1.0,
          0.0, 0.0,
          1.0, 0.0,

          // Right face
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
          0.0, 0.0,

          // Left face
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
    ];
    g.bufferData(g.ARRAY_BUFFER, new Float32Array(textureCoords), g.STATIC_DRAW);
    cubeVertexTextureCoordBuffer.itemSize = 2;
    cubeVertexTextureCoordBuffer.numItems = 24;

    cubeVertexIndexBuffer = g.createBuffer();
    g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    //盒子面
    var cubeVertexIndices = [
            0, 1, 2, 0, 2, 3,    // Front face
            4, 5, 6, 4, 6, 7,    // Back face
            //8, 9, 10, 8, 10, 11,
            0, 0, 0, 0, 0, 0,  // Top face
            //12, 13, 14, 12, 14, 15, // Bottom face
            0, 0, 0, 0, 0, 0,
            16, 17, 18, 16, 18, 19, // Right face
            20, 21, 22, 20, 22, 23  // Left face
    ];
    g.bufferData(g.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), g.STATIC_DRAW);
    cubeVertexIndexBuffer.itemSize = 1;
    cubeVertexIndexBuffer.numItems = 36;
}

/*
    动画函数
*/
function animate() {
    var timeNow = new Date().getTime();
    if (animate.lastTime != 0)
    {
        var elapsed = timeNow - animate.lastTime;

        animate.xRot += (50 * elapsed) / 1000.0;
        animate.yRot += (180 * elapsed) / 1000.0;
        animate.zRot += (50 * elapsed) / 1000.0;
    }
    animate.lastTime = timeNow;
}
animate.xRot = 0;
animate.yRot = 0;
animate.zRot = 0;
animate.lastTime = 0;