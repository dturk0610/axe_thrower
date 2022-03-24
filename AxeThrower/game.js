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

var floorShader;

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
    
    floorShader =  initShaders( gl, "vertex-shader-quad", "fragment-shader" );
}


function setupScene(){
    
    var cam = new Camera( vec3( 0, 1, 0, 1 ), new Quat( 0, 0, 0, 1 ), w/h, .3, 4000, 60 );
    myScene = new Scene( cam );

    var floor = new Quad( 10, 10, vec4( 0, 0, 0, 1), new Quat( 0, 0, 0, 1 ));
    floor.program = floorShader;
    floor.color = vec4( 1, 0, 0, 1 );
    myScene.addObject( floor );

    var wall1 = new Quad( 10, 10, vec4( 0, 5, 5, 1), Quat.fromAxisAndAngle( vec3( 1, 0, 0 ), 90 ));
    wall1.program = floorShader;
    wall1.color = vec4( 1, 1, 0, 1 );
    myScene.addObject( wall1 );

    var wall2 = new Quad( 10, 10, vec4( 5, 5, 0, 1), Quat.fromAxisAndAngle( vec3( 0, 0, -1 ), 90 ));
    wall2.program = floorShader;
    wall2.color = vec4( 0, 1, 0, 1 );
    myScene.addObject( wall2 );

    var wall3 = new Quad( 10, 10, vec4( 0, 5, -5, 1), Quat.fromAxisAndAngle( vec3( -1, 0, 0 ), 90 ));
    wall3.program = floorShader;
    wall3.color = vec4( 0, 0, 1, 1 );
    myScene.addObject( wall3 );

    var wall4 = new Quad( 10, 10, vec4( -5, 5, 0, 1), Quat.fromAxisAndAngle( vec3( 0, 0, 1 ), 90 ));
    wall4.program = floorShader;
    wall4.color = vec4( 0.8, 0.2, 1, 1 );
    myScene.addObject( wall4 );

}

function drawScene(){

    var cam = myScene.camera;

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    myScene.objects.forEach( obj => {
        var currProgram = obj.program;
        gl.useProgram( currProgram );

        var numVerts = obj.verts.length;
        var numTriangles = obj.indices.length/3;

        var verts = obj.getVertices();


        //console.log(verts);
        var indexList = obj.getFaces();

        var indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexList), gl.STATIC_DRAW);

        var verticesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(verts), gl.STATIC_DRAW);

        var vertexPosition = gl.getAttribLocation(currProgram, "vertexPosition");
        gl.vertexAttribPointer( vertexPosition, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vertexPosition );

        var projectionMat = cam.projectionMat;
        var viewMat = cam.viewMat;
        var viewProjectMat = Matrix.mult4x4( projectionMat, viewMat );

        // for (var i = 0; i < numVerts; i++){
        //     console.log(Matrix.vecMatMult(verts[i], projectionMat ));
        // }
        var perspectiveProjectionMatricLocation = gl.getUniformLocation( currProgram, "viewProjectMat" );
        gl.uniformMatrix4fv( perspectiveProjectionMatricLocation, false, flatten( viewProjectMat ) );

        var worldMatLocation = gl.getUniformLocation( currProgram, "worldMat" );
        gl.uniformMatrix4fv( worldMatLocation, false, flatten( obj.worldMat ) );
        
        var colUniformLocation = gl.getUniformLocation( currProgram, "col" );
        var color = obj.color;
        gl.uniform4f( colUniformLocation, color[0], color[1], color[2], color[3] );

        gl.drawElements( gl.TRIANGLES, 3 * numTriangles, gl.UNSIGNED_SHORT, 0 )
    });
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
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = rect.height - (event.clientY - rect.top);
        var xDiff = parseFloat( x - mouseDownPos[0] );
        var yDiff = parseFloat( y - mouseDownPos[1] );
        //pitch +=  * turnAmount;
        
        var currRot = myScene.camera.transform.rotation;

        if ( Math.abs(xDiff) > Math.abs(yDiff) ){
            var yRotAmountMat = Quat.fromAxisAndAngle( vec3( 0, 1, 0 ), turnAmount*xDiff );
            //console.log(Quat.mult( yRotAmountMat, currRot ));
            currRot = Quat.mult( yRotAmountMat, currRot );
        }else{
            var xRotAmountMat = Quat.fromAxisAndAngle( vec3( 1, 0, 0 ), -turnAmount*yDiff );
            currRot = Quat.mult( currRot, xRotAmountMat );
        }
        myScene.camera.transform.rotation = currRot;

        myScene.camera.update();
        mouseDownPos = vec2( x, y );
        drawScene();
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
    var keyCode = event.keyCode;
    switch (keyCode) {
        case 87: keyW = true; myScene.camera.moveForward(); drawScene(); break; // w
        case 65: keyA = true; break; // a
        case 83: keyS = true; break; // s
        case 68: keyD = true; break; // d 
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


// The following function takes in vertices, indexList, and numTriangles
// and outputs the face normals
function getFaceNormals( vertices, indexList, numTriangles ) {
    var faceNormals=[];
    // Iterate through all the triangles (i.e., from 0 to numTriangles-1)
    for (var i = 0; i < numTriangles; i++) {
        var p0 = vec3( vertices[indexList[3*i]][0], vertices[indexList[3*i]][1], vertices[indexList[3*i]][2] );
        var p1 = vec3( vertices[indexList[3*i + 1]][0], vertices[indexList[3*i + 1]][1], vertices[indexList[3*i + 1]][2] );
        var p2 = vec3( vertices[indexList[3*i + 2]][0], vertices[indexList[3*i + 2]][1], vertices[indexList[3*i + 2]][2] );

        var p1minusp0 = vec3( p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2] );
        var p2minusp0 = vec3( p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2] );
        var faceNormal = cross( p1minusp0, p2minusp0 );
        faceNormal = normalize( faceNormal );
        faceNormals.push( faceNormal );
    }
    // return the array of face normals
    return faceNormals;
}

// The following function takes in vertices, indexList, faceNormals, numVertices, and numTriangles,
// and outputs the vertex normals
function getVertexNormals( vertices, indexList, faceNormals, numVertices, numTriangles ) {
    // This function provides a simple method to get vertex normals. There are
    // faster methods to get them.
    var vertexNormals=[];
    // Iterate through all the vertices
    for (var j = 0; j < numVertices; j++) {
        
        var vertexNormal = vec3( 0, 0, 0 );
        // Iterate through triangles
        for (var i = 0; i < numTriangles; i++) {
            if ( indexList[3*i] == j | indexList[3*i + 1] == j | indexList[3*i + 2] == j ){
                vertexNormal[0] = vertexNormal[0] + faceNormals[i][0];
                vertexNormal[1] = vertexNormal[1] + faceNormals[i][1];
                vertexNormal[2] = vertexNormal[2] + faceNormals[i][2];
            }
        }
        
        vertexNormal = normalize( vertexNormal );
        vertexNormals.push( vertexNormal );
    }

    // return the array of vertex normals
    return vertexNormals;
}
