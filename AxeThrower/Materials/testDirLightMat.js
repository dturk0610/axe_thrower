
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
    this.colUniformLocation = gl.getUniformLocation( this.shaderProgram, "u_color" );

// #region DIRECTIONAL LIGHT LOCATIONS

    this.gNumDirLightLoc = gl.getUniformLocation( this.shaderProgram, "gNumDirLight" );
    this.reverseLightDir0Location = gl.getUniformLocation( this.shaderProgram, "dirLights[0].lightDirection" );
    this.lightStrength0Location = gl.getUniformLocation( this.shaderProgram, "dirLights[0].lightStrength" );
    this.reverseLightDir1Location = gl.getUniformLocation( this.shaderProgram, "dirLights[1].lightDirection" );
    this.lightStrength1Location = gl.getUniformLocation( this.shaderProgram, "dirLights[1].lightStrength" );
    this.reverseLightDir2Location = gl.getUniformLocation( this.shaderProgram, "dirLights[2].lightDirection" );
    this.lightStrength2Location = gl.getUniformLocation( this.shaderProgram, "dirLights[2].lightStrength" );
    this.reverseLightDir3Location = gl.getUniformLocation( this.shaderProgram, "dirLights[3].lightDirection" );
    this.lightStrength3Location = gl.getUniformLocation( this.shaderProgram, "dirLights[3].lightStrength" );
    this.reverseLightDir4Location = gl.getUniformLocation( this.shaderProgram, "dirLights[4].lightDirection" );
    this.lightStrength4Location = gl.getUniformLocation( this.shaderProgram, "dirLights[4].lightStrength" );
    
// #endregion

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

    var dirLightsInScene = Scene.GetDirLights();
    var numDirLightsInScene = dirLightsInScene.length;

// #region DIRECTIONAL LIGHT SETTINGS

    gl.uniform1i( this.gNumDirLightLoc, numDirLightsInScene );
    switch( numDirLightsInScene ){
        case 5: 
            var currLight = dirLightsInScene[4];
            gl.uniform3fv( this.reverseLightDir4Location, currLight.direction.xyz );
            gl.uniform1f( this.lightStrength4Location, currLight.strength );
        case 4:
            var currLight = dirLightsInScene[3];
            gl.uniform3fv( this.reverseLightDir3Location, currLight.direction.xyz );
            gl.uniform1f( this.lightStrength3Location, currLight.strength );
        case 3:
            var currLight = dirLightsInScene[2];
            gl.uniform3fv( this.reverseLightDir2Location, currLight.direction.xyz );
            gl.uniform1f( this.lightStrength2Location, currLight.strength );
        case 2:
            var currLight = dirLightsInScene[1];
            gl.uniform3fv( this.reverseLightDir1Location, currLight.direction.xyz );
            gl.uniform1f( this.lightStrength1Location, currLight.strength );
        case 1:
            var currLight = dirLightsInScene[0];
            gl.uniform3fv( this.reverseLightDir0Location, currLight.direction.xyz );
            gl.uniform1f( this.lightStrength0Location, currLight.strength );
        default: break;
    }

// #endregion




    gl.drawElements( gl.TRIANGLES, 3 * numTriangles, gl.UNSIGNED_SHORT, 0 );
}

function lightDirMatSetup(){
    var shader = initShaders( gl, "vertex-lighting", "fragment-lighting" );

    var dirMaterial = new Material( shader );

    //dirMaterial.lightDir = (new Vector3( 1, -1, 0 )).normalized;
    //dirMaterial.lightStrength = 1.0;

    dirMaterial.renderSetup = dirRenderSetup;
    dirMaterial.render = dirRender;

    return dirMaterial;

}



