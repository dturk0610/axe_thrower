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

    setupGL();
    setupScene();


    gl.useProgram( myShaderProgram );

    ////////////////////////////////////////////////////////////////////////////////////////////////
    numVertices = 531;
    numTriangles = 1062;

    vertices = getVertices(); // vertices and faces are defined in teapot20.js
    indexList = getFaces();
    
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexList), gl.STATIC_DRAW);
    var verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    
    var vertexPosition = gl.getAttribLocation(myShaderProgram,"vertexPosition");
    gl.vertexAttribPointer( vertexPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vertexPosition );
    
    
    // Insert your code here
    
    // Compute vertex normals. You first need to get the normals for each face.
    var faceNormals=getFaceNormals( vertices, indexList, numTriangles );
    // Then you need to get the normals for each vertex, given the normals for each face.
    var vertexNormals=getVertexNormals( vertices, indexList, faceNormals, numVertices, numTriangles );
    
    // We have an attribute called 'nv' in the vertex shader. We need to provide
    // vertex normals for every vertex to 'nv'. For this, buffer the vertex normals
    // on the GPU, and set up an attribute pointer to iterate over the buffer.
    
    // Create the buffer for the normals
    var normalsbuffer = gl.createBuffer();
    // bind the buffer to the ARRAY_BUFFER target for WebGL to see it
    gl.bindBuffer( gl.ARRAY_BUFFER,normalsbuffer );
    // send the data to the GPU.
    gl.bufferData( gl.ARRAY_BUFFER, flatten( vertexNormals ), gl.STATIC_DRAW );
    // Set up a pointer to iterate over the the buffered normals,
    // and associate it with the attribute 'nv' in the shader
    var vertexNormalPointer = gl.getAttribLocation( myShaderProgram, "nv" );
    // Set up the vertex normal pointer to iterate over every 3 adjacent
    // values (x, y, and z coordinates of normal)
    gl.vertexAttribPointer( vertexNormalPointer, 3, gl.FLOAT, false, 0, 0 );
    // Active the vertex normal pointer to iterate over the array
    gl.enableVertexAttribArray( vertexNormalPointer );
    
    // Set up your uniforms for viewing
    
    // Modelview matrix (look at method)
    var e = vec3( 30.0, 40.0, 60.0 );
    var a = vec3( 0.0, 0.0, 0.0 );
    var vup = vec3( 0.0, 1.0, 0.0 );
    var n = normalize( vec3( e[0] - a[0], e[1] - a[1], e[2] - a[2] ) );
    var u = normalize( cross( vup, n ) );
    var v = normalize( cross( n, u ) );
    var negUDotE = -dot( u, e );
    var negVDotE = -dot( v, e );
    var negNDotE = -dot( n, e );
    var modelViewMatrix = [     u[0],     v[0],     n[0], 0.0,
    u[1],     v[1],     n[1], 0.0,
    u[2],     v[2],     n[2], 0.0,
    negUDotE, negVDotE, negNDotE, 1.0 ];
    
    // Modelview inverse transpose
    var modelViewMatrixInverseTranspose = [ u[0], v[0], n[0], e[0],
    u[1], v[1], n[1], e[1],
    u[2], v[2], n[2], e[2],
    0.0,  0.0,  0.0,  1.0 ];
    
    var modelViewMatrixLocation = gl.getUniformLocation( myShaderProgram, "M" );
    gl.uniformMatrix4fv( modelViewMatrixLocation, false, modelViewMatrix );
    var modelViewMatrixInverseTransposeLocation = gl.getUniformLocation( myShaderProgram, "M_inverseTranspose" );
    gl.uniformMatrix4fv( modelViewMatrixInverseTransposeLocation, false, modelViewMatrixInverseTranspose );
    
    
    // Projection matrix
    var left = -30.0;
    var right = 30.0;
    var top_ = 30.0;
    var bottom = -30.0;
    var near = 50.0;
    var far = 100.0;
    
    var orthographicProjectionMatrix = [ 2.0/(right - left),                          0.0,                     0.0, 0.0,
    0.0,          2.0/(top_ - bottom),                     0.0, 0.0,
    0.0,                          0.0,       -2.0/(far - near), 0.0, 
    -(left+right)/(right-left), -(top_+bottom)/(top_-bottom), -(far+near)/(far-near), 1.0 ];
    
    var perspectiveProjectionMatrix = [     2.0*near/(right-left),                         0.0,                        0.0,  0.0,
    0.0,      2.0*near/(top_-bottom),                        0.0,  0.0,
    (right+left)/(right-left), (top_+bottom)/(top_-bottom),     -(far+near)/(far-near), -1.0,
    0.0,                         0.0,   -2.0*far*near/(far-near),  0.0 ];
    
    var orthographicProjectionMatricLocation = gl.getUniformLocation( myShaderProgram, "P_orth" );
    gl.uniformMatrix4fv( orthographicProjectionMatricLocation, false, orthographicProjectionMatrix );
    
    var perspectiveProjectionMatricLocation = gl.getUniformLocation( myShaderProgram, "P_persp" );
    gl.uniformMatrix4fv( perspectiveProjectionMatricLocation, false, perspectiveProjectionMatrix );
    
    orthographicIsOn = 1.0;
    orthographicIsOnLocation = gl.getUniformLocation( myShaderProgram, "orthIsOn" );
    gl.uniform1f( orthographicIsOnLocation, orthographicIsOn );
    
    ////////////////////////////////////////////////////////////////////////////////////////////////

    var kaloc = gl.getUniformLocation( myShaderProgram, "ka" );
    var kdloc = gl.getUniformLocation( myShaderProgram, "kd" );
    var ksloc = gl.getUniformLocation( myShaderProgram, "ks" );
    gl.uniform3f( kaloc, 0.5, 0.5, 0.5 );
    gl.uniform3f( kdloc, 0.5, 0.5, 0.5 );
    gl.uniform3f( ksloc, 1.0, 1.0, 1.0 );

    var alphaloc = gl.getUniformLocation( myShaderProgram, "alpha" );
    gl.uniform1f( alphaloc, 4.0 );

    var p0loc = gl.getUniformLocation( myShaderProgram, "p0" );
    gl.uniform3f( p0loc, 0.0, 0.0, 45.0 );


    var Ialoc = gl.getUniformLocation( myShaderProgram, "Ia" );
    var Idloc = gl.getUniformLocation( myShaderProgram, "Id" );
    var Isloc = gl.getUniformLocation( myShaderProgram, "Is" );
    gl.uniform3f( Ialoc, 0.1, 0.1, 0.1 );
    gl.uniform3f( Idloc, 0.8, 0.8, 0.5 );
    gl.uniform3f( Isloc, 0.8, 0.8, 0.8 );

    // render the object
    //drawObject();

    drawScene();

};

function setupGL(){
    gl.enable(gl.DEPTH_TEST);
    gl.viewport( 0, 0, w, h );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    myShaderProgram = initShaders( gl, "vertex-shader", "fragment-shader" );
    floorShader =  initShaders( gl, "vertex-shader", "fragment-shader" );
}


function setupScene(){
    var cam = new Camera( vec3( 0, 1.6, -1 ), new Quat( 0, 0, 0, 1 ), w/h, .01, 1000, 60 );
    myScene = new Scene( cam );

    var floor = new Quad( 50, 50, vec4( 0, 0, 0, 1), Quat.fromAxisAndAngle( vec3( 0, 1, 0 ), 0 ));
    floor.program = floorShader;
    myScene.addObject( floor );

    var wall1 = new Quad( 50, 50, vec4( -50, 0, 0, 1), Quat.fromAxisAndAngle( vec3( 1, 0, 0 ), 0 ));
    wall1.program = floorShader;
    myScene.addObject( wall1 );
    var wall2 = new Quad( 50, 50, vec4( 50, 0, 0, 1), Quat.fromAxisAndAngle( vec3( -1, 0, 0 ), 0 ));
    wall2.program = floorShader;
    myScene.addObject( wall2 );
    var wall3 = new Quad( 50, 50, vec4( 0, 0, -50, 1), Quat.fromAxisAndAngle( vec3( 0, 0, 1 ), 0 ));
    wall3.program = floorShader;
    myScene.addObject( wall3 );
    var wall4 = new Quad( 50, 50, vec4( 0, 0, 50, 1), Quat.fromAxisAndAngle( vec3( 0, 0, -1 ), 0 ));
    wall4.program = floorShader;
    myScene.addObject( wall4 );



}


function drawScene(){
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

    
        // Compute vertex normals. You first need to get the normals for each face.
        var faceNormals = getFaceNormals( verts, indexList, numTriangles );
        // Then you need to get the normals for each vertex, given the normals for each face.
        var vertexNormals = getVertexNormals( verts, indexList, faceNormals, numVerts, numTriangles );

        // Create the buffer for the normals
        var normalsbuffer = gl.createBuffer();
        // bind the buffer to the ARRAY_BUFFER target for WebGL to see it
        gl.bindBuffer( gl.ARRAY_BUFFER,normalsbuffer );
        // send the data to the GPU.
        gl.bufferData( gl.ARRAY_BUFFER, flatten( vertexNormals ), gl.STATIC_DRAW );

        var vertexNormalPointer = gl.getAttribLocation( currProgram, "nv" );
        // Set up the vertex normal pointer to iterate over every 3 adjacent
        // values (x, y, and z coordinates of normal)
        gl.vertexAttribPointer( vertexNormalPointer, 3, gl.FLOAT, false, 0, 0 );
        // Active the vertex normal pointer to iterate over the array
        gl.enableVertexAttribArray( vertexNormalPointer );


        var modelViewMatrixLocation = gl.getUniformLocation( currProgram, "M" );
        gl.uniformMatrix4fv( modelViewMatrixLocation, false, flatten(myScene.camera.viewMat ) );
        var modelViewMatrixInverseTransposeLocation = gl.getUniformLocation( currProgram, "M_inverseTranspose" );
        gl.uniformMatrix4fv( modelViewMatrixInverseTransposeLocation, false, flatten(transpose( inverse( myScene.camera.viewMat ) ) ) );


        var perspectiveProjectionMatricLocation = gl.getUniformLocation( currProgram, "P_persp" );
        gl.uniformMatrix4fv( perspectiveProjectionMatricLocation, false, flatten( myScene.camera.viewProjectMatrix) );
        console.log( mult( myScene.camera.viewProjectMatrix, verts ) );
        orthographicIsOn = 0;
        orthographicIsOnLocation = gl.getUniformLocation( currProgram, "orthIsOn" );
        gl.uniform1f( orthographicIsOnLocation, orthographicIsOn );


        var kaloc = gl.getUniformLocation( currProgram, "ka" );
        var kdloc = gl.getUniformLocation( currProgram, "kd" );
        var ksloc = gl.getUniformLocation( currProgram, "ks" );
        gl.uniform3f( kaloc, 0.5, 0.5, 0.5 );
        gl.uniform3f( kdloc, 0.5, 0.5, 0.5 );
        gl.uniform3f( ksloc, 1.0, 1.0, 1.0 );

        var alphaloc = gl.getUniformLocation( currProgram, "alpha" );
        gl.uniform1f( alphaloc, 4.0 );

        var p0loc = gl.getUniformLocation( currProgram, "p0" );
        gl.uniform3f( p0loc, 0.0, 0.0, 45.0 );


        var Ialoc = gl.getUniformLocation( currProgram, "Ia" );
        var Idloc = gl.getUniformLocation( currProgram, "Id" );
        var Isloc = gl.getUniformLocation( currProgram, "Is" );
        gl.uniform3f( Ialoc, 0.1, 0.1, 0.1 );
        gl.uniform3f( Idloc, 0.8, 0.8, 0.5 );
        gl.uniform3f( Isloc, 0.8, 0.8, 0.8 );


        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
        gl.drawElements( gl.TRIANGLES, 3 * numTriangles, gl.UNSIGNED_SHORT, 0 )
        //requestAnimFrame(drawObject); // remember to have this in so that you
        //                            // can render interactions with buttons
        console.log("yup");
    });

    //requestAnimationFrame(drawScene);
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

// The following function is attached to the
// Orthographic button, and forces the 'orthographicIsOn'
// flag to be 1.
function showOrthographic() {
    orthographicIsOn = 1;
    orthographicIsOnLocation = gl.getUniformLocation(myShaderProgram,"orthIsOn");
    gl.uniform1f(orthographicIsOnLocation,orthographicIsOn);
    console.log("orth");
}

// The following function is attached to the
// Perspective button, and forces the 'orthographicIsOn'
// flat to be 0.
function showPerspective() {
    orthographicIsOn = 0;
    orthographicIsOnLocation = gl.getUniformLocation(myShaderProgram,"orthIsOn");
    gl.uniform1f(orthographicIsOnLocation,orthographicIsOn);
    console.log("persp");
}

function drawObject() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.drawElements( gl.TRIANGLES, 3 * numTriangles, gl.UNSIGNED_SHORT, 0 )
    requestAnimFrame(drawObject); // remember to have this in so that you
                                // can render interactions with buttons
}
