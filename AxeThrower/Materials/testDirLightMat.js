
dirRenderSetup = function(){

    this.indexBuffer = gl.createBuffer();
    this.verticesBuffer = gl.createBuffer();
    this.vertexPosition = gl.getAttribLocation( this.shaderProgram, "vertexPosition");
    this.normalsBuffer = gl.createBuffer();
    this.vertexNormalPointer = gl.getAttribLocation( this.shaderProgram, "nv" )
    this.worldMatLocation = gl.getUniformLocation( this.shaderProgram, "worldMat" );
    this.worldMatInverseLocation = gl.getUniformLocation( this.shaderProgram, "worldMatInverse" );
    this.worldMatTransposeInverseLocation = gl.getUniformLocation( this.shaderProgram, "worldMatTransposeInverse" );
    this.perspectiveProjectionMatricLocation = gl.getUniformLocation( this.shaderProgram, "projectMat" );
    this.reverseLightDirLocation = gl.getUniformLocation( this.shaderProgram, "u_reverseLightDirection" );
    this.lightStrengthLocation = gl.getUniformLocation( this.shaderProgram, "u_lightStrength" );
    this.colUniformLocation = gl.getUniformLocation( this.shaderProgram, "u_color" );
    
}

dirRender = function(){
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
    var worldMatTransposeInverse = Matrix.transpose( worldMatInverse );

    gl.uniformMatrix4fv( this.worldMatLocation, false, worldMat );
    gl.uniformMatrix4fv( this.worldMatTransposeInverseLocation, false, worldMatTransposeInverse );
    gl.uniformMatrix4fv( this.worldMatInverseLocation, false, worldMatInverse );

    gl.uniformMatrix4fv( this.perspectiveProjectionMatricLocation, false, viewProjectMat );
    
    var color = this.gameObject.color;
    gl.uniform4f( this.colUniformLocation, color.r, color.g, color.b, color.a );

    var lightDir = this.material.lightDir;
    gl.uniform3f( this.reverseLightDirLocation, -lightDir.x, -lightDir.y, -lightDir.z );
    gl.uniform1f( this.lightStrengthLocation, this.material.lightStrength );
    gl.drawElements( gl.TRIANGLES, 3 * numTriangles, gl.UNSIGNED_SHORT, 0 );
}

function lightDirMatSetup(){
    var shader = initShaders( gl, "vertex-lighting", "fragment-lighting" );

    var dirMaterial = new Material( shader );

    dirMaterial.lightDir = (new Vector3( 1, -1, 0 )).normalized;
    dirMaterial.lightStrength = 1.0;

    dirMaterial.renderSetup = dirRenderSetup;
    dirMaterial.render = dirRender;

    return dirMaterial;

}



