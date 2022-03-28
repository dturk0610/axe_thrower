var gl;
var numVertices;
var numTriangles;
var orthographicIsOn;
var myShaderProgram;

// This code renders the teapot in orthographic and perspective projection with a single
// point light source using Gouraud shading.
//
// You can use this code as a starting point for lab 4.
// The teapot sits in a bounding box that ranges between -20 and 20 in x, y, and z.
// The curvy chair in Lab4Simpler sits in a bounding box that ranges between -40 and 40 in x, y, and z,
// which means that you would have to scale up the coordinates of the eye (i.e. the camera
// location), the projection matrices, and light location by 2.
// The unknown object in Lab4 sits in an unknown bounding box, but an idea is to try a variety of
// scale factors from this starting point.
//
// If you use the point light source here, you must add a second light source (either directional
// or spotlight). You can also just use a directional and spotlight and circumvent the point
// light if you wish, in accordance with the Lab4 requirements.
//
// Your code must also switch off and on the two lights independently, and switch off and on
// the specular component, so you need to have flags for all these switches.
//
// Note: since the distances are large, the squared distance falls of quite quickly, which means
// the point light or spot light may not show a visible result. The easiest solution to this
// is to use the lighting calculation improvements section in the notes and scale the squared
// distance with a constant value. The vertex shader illustrates this.
//


var h, w, invh, invw;
var myScene;

var floorShader, lightShader;

function initGL(){
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    h = parseFloat(canvas.height); invh = 1.0/h;
    w = parseFloat(canvas.width); invw = 1.0/w;

    window.addEventListener("keydown", onKeyDown, false);
    window.addEventListener("keyup", onKeyUp, false);

    canvas.addEventListener("mousedown", function(e) { tryClick(canvas, e); }); 
    canvas.addEventListener("mouseup", function(e) { endClick(canvas, e); }); 
    canvas.addEventListener("mousemove", function(e) { mouseMove(canvas, e); });
    canvas.addEventListener("mouseout", function(e) { endClick(canvas, e); });
    

    setupGL();
    setupScene();
    drawScene();

};

function setupGL(){
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.viewport( 0, 0, w, h );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    MeshRenderer.setGL(gl);
    
    floorShader = initShaders( gl, "vertex-shader-quad", "fragment-shader" );
    lightShader = initShaders( gl, "vertex-phrongLighting", "fragment-phrongLighting" );
}


function setupScene(){
    
    var cam = new Camera( vec3( 0, 1, 0, 1 ), new Quat( 0, 0, 0, 1 ), w/h, .01, 4000, 60 );
    myScene = new Scene( cam );

    var baseObjRenderSetup = function( shaderProgram, meshRenederer ){
        meshRenederer.indexBuffer = this.gl.createBuffer();
        meshRenederer.verticesBuffer = this.gl.createBuffer();
        meshRenederer.vertexPosition = this.gl.getAttribLocation( shaderProgram, "vertexPosition");
        meshRenederer.perspectiveProjectionMatricLocation = this.gl.getUniformLocation( shaderProgram, "viewProjectMat" );
        meshRenederer.worldMatLocation = this.gl.getUniformLocation( shaderProgram, "worldMat" );
        meshRenederer.colUniformLocation = this.gl.getUniformLocation( shaderProgram, "col" );
    }

    var baseObjReneder = function(){
        this.gl.useProgram( this.shaderProgram );

        var mesh = this.gameObject.mesh;
        var numTriangles = mesh.numTriangles;
        var verts = mesh.getVertices();
        var indexList = mesh.getFaces();

        this.gl.bindBuffer( this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer );
        this.gl.bufferData( this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexList), this.gl.STATIC_DRAW );
        this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.verticesBuffer );
        this.gl.bufferData( this.gl.ARRAY_BUFFER, flatten(verts), this.gl.STATIC_DRAW );
        this.gl.vertexAttribPointer( this.vertexPosition, 4, this.gl.FLOAT, false, 0, 0 );
        this.gl.enableVertexAttribArray( this.vertexPosition );

        var projectionMat = Scene.mainCam.projectionMat;
        var viewMat = Scene.mainCam.viewMat;
        var viewProjectMat = Matrix.mult4x4( projectionMat, viewMat );

        this.gl.uniformMatrix4fv( this.perspectiveProjectionMatricLocation, false, flatten( viewProjectMat ) );
        this.gl.uniformMatrix4fv( this.worldMatLocation, false, flatten( this.gameObject.worldMat ) );
        
        var color = this.gameObject.color;
        this.gl.uniform4f( this.colUniformLocation, color[0], color[1], color[2], color[3] );
        this.gl.drawElements( this.gl.TRIANGLES, 3 * numTriangles, this.gl.UNSIGNED_SHORT, 0 )
    }

    var lightObjRenderSetup = function( shaderProgram, meshRenderer ){
        var gl = this.gl;
        meshRenderer.indexBuffer = gl.createBuffer();
        meshRenderer.verticesBuffer = gl.createBuffer();
        meshRenderer.vertexPosition = gl.getAttribLocation( shaderProgram, "vertexPosition");
        meshRenderer.normalsBuffer = gl.createBuffer();
        meshRenderer.vertexNormalPointer = gl.getAttribLocation( shaderProgram, "nv" )
        meshRenderer.worldMatLocation = gl.getUniformLocation( shaderProgram, "worldMat" );
        meshRenderer.worldMatInverseLocation = gl.getUniformLocation( shaderProgram, "worldMatInverse" );
        meshRenderer.perspectiveProjectionMatricLocation = gl.getUniformLocation( shaderProgram, "projectMat" );
        meshRenderer.p0loc = gl.getUniformLocation( shaderProgram, "p0" );
        meshRenderer.Ialoc = gl.getUniformLocation( shaderProgram, "Ia" );
        meshRenderer.Idloc = gl.getUniformLocation( shaderProgram, "Id" );
        meshRenderer.Isloc = gl.getUniformLocation( shaderProgram, "Is" );
        meshRenderer.abcDist = gl.getUniformLocation( shaderProgram, "abcDist" );
        meshRenderer.kaloc = gl.getUniformLocation( shaderProgram, "ka" );
        meshRenderer.kdloc = gl.getUniformLocation( shaderProgram, "kd" );
        meshRenderer.ksloc = gl.getUniformLocation( shaderProgram, "ks" );
        meshRenderer.alphaloc = gl.getUniformLocation( shaderProgram, "alpha" );
        meshRenderer.colUniformLocation = gl.getUniformLocation( shaderProgram, "col" );
    }

    var lightObjReneder = function(){
        var gl = this.gl;
        gl.useProgram( this.shaderProgram );

        var mesh = this.gameObject.mesh;
        var numTriangles = mesh.numTriangles;
        var verts = mesh.getVertices();
        var indexList = mesh.getFaces();

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexList), gl.STATIC_DRAW );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.verticesBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(verts), gl.STATIC_DRAW );

        gl.vertexAttribPointer( this.vertexPosition, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( this.vertexPosition );

        //var faceNormals = mesh.faceNormals;
        var vertexNormals = mesh.vertexNormals;
        
        gl.bindBuffer( gl.ARRAY_BUFFER, this.normalsBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten( vertexNormals ), gl.STATIC_DRAW );

        gl.vertexAttribPointer( this.vertexNormalPointer, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( this.vertexNormalPointer );

        var cam = Scene.mainCam;

        var projectionMat = cam.projectionMat;
        var viewMat = cam.viewMat;
        var viewProjectMat = Matrix.mult4x4( projectionMat, viewMat );
        var worldMat = this.gameObject.worldMat;
        var worldMatInverse = Matrix.inverseM4x4( this.gameObject.worldMat );

        gl.uniformMatrix4fv( this.worldMatLocation, false, flatten( worldMat ) );
        gl.uniformMatrix4fv( this.worldMatInverseLocation, false, flatten( worldMatInverse ) );
        gl.uniformMatrix4fv( this.perspectiveProjectionMatricLocation, false, flatten( viewProjectMat ) );
        
        var color = this.gameObject.color;
        gl.uniform4f( this.colUniformLocation, color[0], color[1], color[2], color[3] );
        
        
        gl.uniform3f( this.kaloc, 0.5, 0.5, 0.5 );
        gl.uniform3f( this.kdloc, 0.5, 0.5, 0.5 );
        gl.uniform3f( this.ksloc, 1.0, 1.0, 1.0 );
        
        gl.uniform1f( this.alphaloc, 4.0 );
        
        var posX = cam.transform.position[0];
        var posY = cam.transform.position[1] * 3;
        var posZ = cam.transform.position[2];

        gl.uniform3f( this.p0loc, posX, posY, posZ );
        
        gl.uniform3f( this.Ialoc, 0.1, 0.1, 0.1 );
        gl.uniform3f( this.Idloc, 0.8, 0.8, 0.5 );
        gl.uniform3f( this.Isloc, 0.8, 0.8, 0.8 );
        gl.uniform3f( this.abcDist, .05, 0.0, 0.0 );
        
        gl.drawElements( gl.TRIANGLES, 3 * numTriangles, gl.UNSIGNED_SHORT, 0 );
    }

    var floor = new Quad( 10, 10, vec4( 0, 0, 0, 1), new Quat( 0, 0, 0, 1 ), vec3( 1, 1, 1 ) );
    floor.meshRenderer = new MeshRenderer( floor, floorShader, baseObjRenderSetup, baseObjReneder );
    floor.color = vec4( 1, 0, 0, 1 );
    myScene.addObject( floor );

    var wall1 = new Quad( 10, 2, vec4(  0, 1, 5, 1), Quat.fromAxisAndAngle( vec3( 1, 0, 0 ), 90 ), vec3( 1, 1, 1 ) );
    wall1.meshRenderer = new MeshRenderer( wall1, lightShader, lightObjRenderSetup, lightObjReneder );
    wall1.color = vec4( 1, 1, 0, 1 );
    myScene.addObject( wall1 );

    var yTurn = Quat.fromAxisAndAngle( vec3( 0, 1, 0 ), 90 );
    var zTurn = Quat.fromAxisAndAngle( vec3( 0, 0, -1 ), 90 );
    var wall2 = new Quad( 10, 2, vec4(  5, 1, 0, 1), Quat.mult( yTurn, zTurn ), vec3( 1, 1, 1 ) );
    wall2.meshRenderer = new MeshRenderer( wall2, lightShader, lightObjRenderSetup, lightObjReneder );
    wall2.color = vec4( 0, 1, 0, 1 );
    myScene.addObject( wall2 );

    var wall3 = new Quad( 10, 2, vec4(  0, 1, -5, 1), Quat.fromAxisAndAngle( vec3( -1, 0, 0 ), 90 ), vec3( 1, 1, 1 ) );
    wall3.meshRenderer = new MeshRenderer( wall3, lightShader, lightObjRenderSetup, lightObjReneder );
    wall3.color = vec4( 0, 0, 1, 1 );
    myScene.addObject( wall3 );

    var yTurn = Quat.fromAxisAndAngle( vec3( 0, 1, 0 ), 90 );
    var zTurn = Quat.fromAxisAndAngle( vec3( 0, 0, 1 ), 90 );
    var wall4 = new Quad( 10, 2, vec4( -5, 1, 0, 1), Quat.mult( yTurn, zTurn ), vec3( 1, 1, 1 ) );
    wall4.meshRenderer = new MeshRenderer( wall4, lightShader, lightObjRenderSetup, lightObjReneder );
    wall4.color = vec4( 0.8, 0.2, 1, 1 );
    myScene.addObject( wall4 );


    var chair = new GameObject( "chair", vec4( 0, .45, -4, 1 ), Quat.identity, vec3( .02, .02, .02 ) );
    chair.mesh = new Mesh( getChairVertices(), getChairFaces() );
    chair.meshRenderer = new MeshRenderer( chair, lightShader, lightObjRenderSetup, lightObjReneder );
    chair.color = vec4( 0.8, 0.2, .4, 1 );
    myScene.addObject( chair );

}

function drawScene(){

    var cam = myScene.camera;

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    myScene.objects.forEach( obj => {
        if (obj.meshRenderer !== undefined){
            obj.meshRenderer.render();
        }        
    });

    requestAnimationFrame(drawScene);
}

var mouseDown = false;
var mouseDownPos = vec2(0, 0); 
function tryClick( canvas, event ){
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = rect.height - (event.clientY - rect.top);
    mouseDownPos = vec2( x, y );
    mouseDown = true;
}

// found a good way to handle this here:
//https://gamedev.stackexchange.com/questions/30644/how-to-keep-my-quaternion-using-fps-camera-from-tilting-and-messing-up/30669#30669
var turnAmount = .3;
function mouseMove( canvas, event ){
    if (mouseDown){
        var cam = myScene.camera;
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = rect.height - (event.clientY - rect.top);
        var xDiff = parseFloat( x - mouseDownPos[0] );
        var yDiff = parseFloat( y - mouseDownPos[1] );
        //pitch +=  * turnAmount;
        
        var currRot = cam.transform.rotation;
        var currRight = cam.transform.rightVec;
        var xRotAmountMat = Quat.fromAxisAndAngle( currRight, -turnAmount*yDiff );
        currRot = Quat.mult( currRot, xRotAmountMat );
        var yRotAmountMat = Quat.fromAxisAndAngle( vec3( 0, 1, 0 ), turnAmount*xDiff );
        //console.log(Quat.mult( yRotAmountMat, currRot ));
        currRot = Quat.mult( currRot, yRotAmountMat );

        cam.transform.rotation = currRot;

        cam.update();
        mouseDownPos = vec2( x, y );
        //drawScene();
    }
}

function endClick( canvas, event ){
    if (mouseDown){
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = rect.height - (event.clientY - rect.top);
        mouseDown = false;
    }
}


var keyW = false, keyA = false, keyS = false, keyD = false;
function onKeyDown(event) {
    var rightVec = myScene.camera.transform.rightVec;
    var fwdVec = myScene.camera.transform.fwdVec; // To actually move forward we need the negative of this
    var totDir = vec3( 0, 0, 0 );
    var keyCode = event.keyCode;
    switch (keyCode) {
        case 87: totDir[0] -= fwdVec[0];    totDir[1] -= fwdVec[1];     totDir[2] -= fwdVec[2];     break; // w
        case 65: totDir[0] -= rightVec[0];  totDir[1] -= rightVec[1];   totDir[2] -= rightVec[2];   break; // a
        case 83: totDir[0] += fwdVec[0];    totDir[1] += fwdVec[1];     totDir[2] += fwdVec[2];     break; // s
        case 68: totDir[0] += rightVec[0];  totDir[1] += rightVec[1];   totDir[2] += rightVec[2];   break; // d 
    }

    if ( totDir[0] != 0 || totDir[1] != 0 || totDir[2] != 0 ){
        totDir = normalize( totDir );
        myScene.camera.move( totDir );
        //drawScene();
    }
}
function onKeyUp(event) {
    var keyCode = event.keyCode;
    switch (keyCode) {
        case 87: keyW = false; break; // w
        case 65: keyA = false; break; // a
        case 83: keyS = false; break; // s
        case 68: keyD = false; break; // d
    }
}
