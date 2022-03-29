
floorRenderSetup = function(){

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

floorRender = function(){
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
    
    
    gl.uniform3f( this.kaloc, this.ka.x, this.ka.y, this.ka.z );
    gl.uniform3f( this.kdloc, this.kd.x, this.kd.y, this.kd.z );
    gl.uniform3f( this.ksloc, this.ks.x, this.ks.y, this.ks.z );
    
    gl.uniform1f( this.alphaloc, this.alpha );
    
    var posX = cam.transform.position.x;
    var posY = cam.transform.position.y*3;
    var posZ = cam.transform.position.z;

    gl.uniform3f( this.p0loc, posX, posY, posZ );
    
    gl.uniform3f( this.Ialoc, this.Ia.x, this.Ia.y, this.Ia.z );
    gl.uniform3f( this.Idloc, this.Id.x, this.Id.y, this.Id.z );
    gl.uniform3f( this.Isloc, this.Is.x, this.Is.y, this.Is.z );
    gl.uniform3f( this.abcDistloc, this.abcDist.x, this.abcDist.y, this.abcDist.z );
    
    gl.drawElements( gl.TRIANGLES, 3 * numTriangles, gl.UNSIGNED_SHORT, 0 );
}


//var shader = initShaders( gl, "vertex-phrongLighting", "fragment-phrongLighting" );

//var floorMaterial = new Material( shader );

// floorMaterial.ka = new Vector3( 0.5, 0.5, 0.5 );
// floorMaterial.kd = new Vector3( 0.5, 0.5, 0.5 );
// floorMaterial.ks = new Vector3( 1.0, 1.0, 1.0 );
// floorMaterial.alpha = 4.0;
// floorMaterial.Ia = new Vector3( 2.0, 2.0, 2.0 );
// floorMaterial.Id = new Vector3( 0.8, 0.8, 0.5 );
// floorMaterial.Is = new Vector3( 0.8, 0.8, 0.8 );
//floorMaterial.abcDist = new Vector3( .05, 0.0, 0.0 );
