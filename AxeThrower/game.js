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
    var aspect = w/h;

    var cam = new Camera( new Vector4( 0, 1, 0, 1 ), new Quat( 0, 0, 0, 1 ), aspect, .01, 4000, 60, -1*aspect, 1*aspect, 1, -1 );
    myScene = new Scene( cam );

    var baseObjRenderSetup = function( shaderProgram, meshRenederer ){
        meshRenederer.indexBuffer = gl.createBuffer();
        meshRenederer.verticesBuffer = gl.createBuffer();
        meshRenederer.vertexPosition = gl.getAttribLocation( shaderProgram, "vertexPosition");
        meshRenederer.perspectiveProjectionMatricLocation = gl.getUniformLocation( shaderProgram, "viewProjectMat" );
        meshRenederer.worldMatLocation = gl.getUniformLocation( shaderProgram, "worldMat" );
        meshRenederer.colUniformLocation = gl.getUniformLocation( shaderProgram, "col" );
    }

    var baseObjReneder = function(){
        gl.useProgram( this.shaderProgram );

        var mesh = this.gameObject.mesh;
        var numTriangles = mesh.numTriangles;
        var verts = mesh.getVertices();
        var indexList = mesh.getFaces();

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexList), gl.STATIC_DRAW );
        gl.bindBuffer( gl.ARRAY_BUFFER, this.verticesBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, Vector4.Flatten(verts), gl.STATIC_DRAW );
        gl.vertexAttribPointer( this.vertexPosition, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( this.vertexPosition );

        var projectionMat = Scene.mainCam.projectionMat;
        var viewMat = Scene.mainCam.viewMat;
        var viewProjectMat = Matrix.mult4x4( projectionMat, viewMat );

        gl.uniformMatrix4fv( this.perspectiveProjectionMatricLocation, false, viewProjectMat );
        gl.uniformMatrix4fv( this.worldMatLocation, false, this.gameObject.worldMat );
        
        var color = this.gameObject.color;
        gl.uniform4f( this.colUniformLocation, color.r, color.g, color.b, color.b );
        gl.drawElements( gl.TRIANGLES, 3 * numTriangles, gl.UNSIGNED_SHORT, 0 )
    }

    var lightObjRenderSetup = function( shaderProgram, meshRenderer ){
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
        meshRenderer.abcDistloc = gl.getUniformLocation( shaderProgram, "abcDist" );
        meshRenderer.kaloc = gl.getUniformLocation( shaderProgram, "ka" );
        meshRenderer.kdloc = gl.getUniformLocation( shaderProgram, "kd" );
        meshRenderer.ksloc = gl.getUniformLocation( shaderProgram, "ks" );
        meshRenderer.alphaloc = gl.getUniformLocation( shaderProgram, "alpha" );
        meshRenderer.colUniformLocation = gl.getUniformLocation( shaderProgram, "col" );
    }

    var lightObjReneder = function(){
        gl.useProgram( this.shaderProgram );

        var mesh = this.gameObject.mesh;
        var numTriangles = mesh.numTriangles;
        var verts = mesh.getVertices();
        var indexList = mesh.getFaces();

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexList), gl.STATIC_DRAW );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.verticesBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, Vector4.Flatten(verts), gl.STATIC_DRAW );
        
        gl.vertexAttribPointer( this.vertexPosition, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( this.vertexPosition );

        var vertexNormals = mesh.vertexNormals;
        
        gl.bindBuffer( gl.ARRAY_BUFFER, this.normalsBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, Vector3.Flatten( vertexNormals ), gl.STATIC_DRAW );

        gl.vertexAttribPointer( this.vertexNormalPointer, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( this.vertexNormalPointer );

        var cam = Scene.mainCam;
        var projectionMat;
        if (!cam.orthoOn){
            projectionMat = cam.projectionMat;
        }
        else{
            projectionMat = cam.orthoMat;
        }


        var viewMat = cam.viewMat;
        var viewProjectMat = Matrix.mult4x4( projectionMat, viewMat );
        var worldMat = this.gameObject.worldMat;
        var worldMatInverse = Matrix.inverseM4x4( this.gameObject.worldMat );

        gl.uniformMatrix4fv( this.worldMatLocation, false, worldMat );
        gl.uniformMatrix4fv( this.worldMatInverseLocation, false, worldMatInverse );
        gl.uniformMatrix4fv( this.perspectiveProjectionMatricLocation, false, viewProjectMat );
        
        var color = this.gameObject.color;
        gl.uniform4f( this.colUniformLocation, color.r, color.g, color.b, color.a );
        
        
        gl.uniform3f( this.kaloc, 0.5, 0.5, 0.5 );
        gl.uniform3f( this.kdloc, 0.5, 0.5, 0.5 );
        gl.uniform3f( this.ksloc, 1.0, 1.0, 1.0 );
        
        gl.uniform1f( this.alphaloc, 4.0 );
        
        var posX = cam.transform.position.x;
        var posY = cam.transform.position.y*3;
        var posZ = cam.transform.position.z;

        gl.uniform3f( this.p0loc, posX, posY, posZ );
        
        gl.uniform3f( this.Ialoc, 2.0, 2.0, 2.0 );
        gl.uniform3f( this.Idloc, 0.8, 0.8, 0.5 );
        gl.uniform3f( this.Isloc, 0.8, 0.8, 0.8 );
        gl.uniform3f( this.abcDistloc, .05, 0.0, 0.0 );
        
        gl.drawElements( gl.TRIANGLES, 3 * numTriangles, gl.UNSIGNED_SHORT, 0 );
    }

    var brownCol = new Vector4( 66.0/256.0, 40.0/256.0, 14.0/256.0, 1.0 );
    var floor1 = new Quad( 10, 10, new Vector4( 0, 0, 0, 1), new Quat( 0, 0, 0, 1 ), new Vector3( 1, 1, 1 ) );
    floor1.meshRenderer = new MeshRenderer( floor1, lightShader, lightObjRenderSetup, lightObjReneder );
    floor1.color = Vector4.Scale( 1.2, brownCol );
    myScene.addObject( floor1 );

    var wall1 = new Quad( 10, 2, new Vector4(  0, 1, 5, 1), Quat.fromAxisAndAngle( new Vector3( 1, 0, 0 ), 90 ), new Vector3( 1, 1, 1 ) );
    wall1.meshRenderer = new MeshRenderer( wall1, lightShader, lightObjRenderSetup, lightObjReneder );
    wall1.color = brownCol;
    myScene.addObject( wall1 );

    var yTurn = Quat.fromAxisAndAngle( new Vector3( 0, 1, 0 ), 90 );
    var zTurn = Quat.fromAxisAndAngle( new Vector3( 0, 0, -1 ), 90 );
    var wall2 = new Quad( 10, 2, new Vector4(  5, 1, 0, 1), Quat.mult( yTurn, zTurn ), new Vector3( 1, 1, 1 ) );
    wall2.meshRenderer = new MeshRenderer( wall2, lightShader, lightObjRenderSetup, lightObjReneder );
    wall2.color = brownCol;
    myScene.addObject( wall2 );

    var wall3 = new Quad( 10, 2, new Vector4(  0, 1, -5, 1), Quat.fromAxisAndAngle( new Vector3( -1, 0, 0 ), 90 ), new Vector3( 1, 1, 1 ) );
    wall3.meshRenderer = new MeshRenderer( wall3, lightShader, lightObjRenderSetup, lightObjReneder );
    wall3.color = brownCol;
    myScene.addObject( wall3 );

    var yTurn = Quat.fromAxisAndAngle( new Vector3( 0, 1, 0 ), 90 );
    var zTurn = Quat.fromAxisAndAngle( new Vector3( 0, 0, 1 ), 90 );
    var wall4 = new Quad( 10, 2, new Vector4( -5, 1, 0, 1), Quat.mult( yTurn, zTurn ), new Vector3( 1, 1, 1 ) );
    wall4.meshRenderer = new MeshRenderer( wall4, lightShader, lightObjRenderSetup, lightObjReneder );
    wall4.color = brownCol;
    myScene.addObject( wall4 );


    var chair = new GameObject( "chair", new Vector4( 0, .45, -4, 1 ), Quat.identity, new Vector3( .02, .02, .02 ) );
    chair.mesh = new Mesh( getChairVertices(), getChairFaces() );
    chair.meshRenderer = new MeshRenderer( chair, lightShader, lightObjRenderSetup, lightObjReneder );
    chair.color = new Vector4( 0.8, 0.2, .4, 1 );
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
var mouseDownPos = new Vector2( 0, 0 ); 
function tryClick( canvas, event ){
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = rect.height - (event.clientY - rect.top);
    mouseDownPos = new Vector2( x, y );
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
        var xDiff = parseFloat( x - mouseDownPos.x );
        var yDiff = parseFloat( y - mouseDownPos.y );
        //pitch +=  * turnAmount;
        
        var currRot = cam.transform.rotation;
        var currRight = cam.transform.rightVec;
        var xRotAmountMat = Quat.fromAxisAndAngle( currRight, -turnAmount*yDiff );
        currRot = Quat.mult( currRot, xRotAmountMat );
        var yRotAmountMat = Quat.fromAxisAndAngle( new Vector3( 0, 1, 0 ), turnAmount*xDiff );
        currRot = Quat.mult( currRot, yRotAmountMat );

        cam.transform.rotation = currRot;

        cam.update();
        mouseDownPos = new Vector2( x, y );
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
    var totDir = new Vector3( 0, 0, 0 );
    var keyCode = event.keyCode;
    switch (keyCode) {
        case 87: totDir.x -= fwdVec.x;    totDir.y -= fwdVec.y;     totDir.z -= fwdVec.z;     break; // w
        case 65: totDir.x -= rightVec.x;  totDir.y -= rightVec.y;   totDir.z -= rightVec.z;   break; // a
        case 83: totDir.x += fwdVec.x;    totDir.y += fwdVec.y;     totDir.z += fwdVec.z;     break; // s
        case 68: totDir.x += rightVec.x;  totDir.y += rightVec.y;   totDir.z += rightVec.z;   break; // d 
        case 79: Scene.mainCam.orthoOn = !Scene.mainCam.orthoOn; break;
    }

    if ( totDir.x != 0 || totDir.y != 0 || totDir.z != 0 ){
        totDir = totDir.normalized;
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
