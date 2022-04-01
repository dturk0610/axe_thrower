
floorRenderSetup = function(){

    this.indexBuffer = gl.createBuffer();
    this.verticesBuffer = gl.createBuffer();
    this.vertexPosition = gl.getAttribLocation( this.shaderProgram, "vertexPosition");
    this.normalsBuffer = gl.createBuffer();
    this.vertexNormalPointer = gl.getAttribLocation( this.shaderProgram, "nv" )
    this.worldMatLocation = gl.getUniformLocation( this.shaderProgram, "worldMat" );
    this.worldMatInverseLocation = gl.getUniformLocation( this.shaderProgram, "worldMatInverse" );
    this.perspectiveProjectionMatricLocation = gl.getUniformLocation( this.shaderProgram, "projectMat" );
    this.p0loc = gl.getUniformLocation( this.shaderProgram, "p0" );
    this.Ialoc = gl.getUniformLocation( this.shaderProgram, "Ia" );
    this.Idloc = gl.getUniformLocation( this.shaderProgram, "Id" );
    this.Isloc = gl.getUniformLocation( this.shaderProgram, "Is" );
    this.abcDistloc = gl.getUniformLocation( this.shaderProgram, "abcDist" );
    this.kaloc = gl.getUniformLocation( this.shaderProgram, "ka" );
    this.kdloc = gl.getUniformLocation( this.shaderProgram, "kd" );
    this.ksloc = gl.getUniformLocation( this.shaderProgram, "ks" );
    this.alphaloc = gl.getUniformLocation( this.shaderProgram, "alpha" );
    this.colUniformLocation = gl.getUniformLocation( this.shaderProgram, "col" );
    
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
    
    
    gl.uniform3f( this.kaloc, this.material.ka.x, this.material.ka.y, this.material.ka.z );
    gl.uniform3f( this.kdloc, this.material.kd.x, this.material.kd.y, this.material.kd.z );
    gl.uniform3f( this.ksloc, this.material.ks.x, this.material.ks.y, this.material.ks.z );
    
    gl.uniform1f( this.alphaloc, this.material.alpha );
    
    var posX = cam.transform.position.x;
    var posY = cam.transform.position.y*3;
    var posZ = cam.transform.position.z;

    gl.uniform3f( this.p0loc, posX, posY, posZ );
    
    gl.uniform3f( this.Ialoc, this.material.Ia.x, this.material.Ia.y, this.material.Ia.z );
    gl.uniform3f( this.Idloc, this.material.Id.x, this.material.Id.y, this.material.Id.z );
    gl.uniform3f( this.Isloc, this.material.Is.x, this.material.Is.y, this.material.Is.z );
    gl.uniform3f( this.abcDistloc, this.material.abcDist.x, this.material.abcDist.y, this.material.abcDist.z );
    
    gl.drawElements( gl.TRIANGLES, 3 * numTriangles, gl.UNSIGNED_SHORT, 0 );
}

function floorMatSetup(){
    var shader = initShaders( gl, "vertex-phrongLighting", "fragment-phrongLighting" );

    var floorMaterial = new Material( shader );

    floorMaterial.ka = new Vector3( 0.5, 0.5, 0.5 );
    floorMaterial.kd = new Vector3( 0.5, 0.5, 0.5 );
    floorMaterial.ks = new Vector3( 1.0, 1.0, 1.0 );
    floorMaterial.alpha = 4.0;
    floorMaterial.Ia = new Vector3( 3.0, 3.0, 3.0 );
    floorMaterial.Id = new Vector3( 0.8, 0.8, 0.5 );
    floorMaterial.Is = new Vector3( 0.8, 0.8, 0.8 );
    floorMaterial.abcDist = new Vector3( .05, 0.0, 0.0 );

    return floorMaterial;

}



