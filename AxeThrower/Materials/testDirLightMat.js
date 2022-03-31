
dirRenderSetup = function(){

    this.indexBuffer = gl.createBuffer();
    this.verticesBuffer = gl.createBuffer();
    this.vertexPosition = gl.getAttribLocation( this.shaderProgram, "vertexPosition");
    this.normalsBuffer = gl.createBuffer();
    this.vertexNormalPointer = gl.getAttribLocation( this.shaderProgram, "nv" )
    this.viewPosLoc = gl.getUniformLocation( this.shaderProgram, "viewPos" );

    this.worldMatLocation = gl.getUniformLocation( this.shaderProgram, "worldMat" );
    this.worldMatInverseLocation = gl.getUniformLocation( this.shaderProgram, "worldMatInverse" );
    this.worldMatTransposeInverseLocation = gl.getUniformLocation( this.shaderProgram, "worldMatTransposeInverse" );
    this.perspectiveProjectionMatricLocation = gl.getUniformLocation( this.shaderProgram, "projectMat" );
    this.colUniformLocation = gl.getUniformLocation( this.shaderProgram, "u_color" );

// #region DIRECTIONAL LIGHT LOCATIONS

    this.gNumDirLightLoc = gl.getUniformLocation( this.shaderProgram, "gNumDirLight" );
    
    this.lightDir0Location = gl.getUniformLocation( this.shaderProgram, "dirLights[0].lightDirection" );
    this.dirLight0BaseAmbientLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[0].base.ambient" );
    this.dirLight0BaseDiffuseLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[0].base.diffuse" );
    this.dirLight0BaseSpecLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[0].base.specular" );

    this.lightDir1Location = gl.getUniformLocation( this.shaderProgram, "dirLights[1].lightDirection" );
    this.dirLight1BaseAmbientLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[1].base.ambient" );
    this.dirLight1BaseDiffuseLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[1].base.diffuse" );
    this.dirLight1BaseSpecLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[1].base.specular" );

    this.lightDir2Location = gl.getUniformLocation( this.shaderProgram, "dirLights[2].lightDirection" );
    this.dirLight2BaseAmbientLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[2].base.ambient" );
    this.dirLight2BaseDiffuseLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[2].base.diffuse" );
    this.dirLight2BaseSpecLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[2].base.specular" );

    this.lightDir3Location = gl.getUniformLocation( this.shaderProgram, "dirLights[3].lightDirection" );
    this.dirLight3BaseAmbientLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[3].base.ambient" );
    this.dirLight3BaseDiffuseLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[3].base.diffuse" );
    this.dirLight3BaseSpecLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[3].base.specular" );

    this.lightDir4Location = gl.getUniformLocation( this.shaderProgram, "dirLights[4].lightDirection" );
    this.dirLight4BaseAmbientLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[4].base.ambient" );
    this.dirLight4BaseDiffuseLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[4].base.diffuse" );
    this.dirLight4BaseSpecLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[4].base.specular" );

// #endregion

// #region MATERIAL LOCATIONS

    this.materialAmbientLoc = gl.getUniformLocation( this.shaderProgram, "material.ambient" );
    this.materialDiffuseLoc = gl.getUniformLocation( this.shaderProgram, "material.diffuse" );
    this.materialSpecLoc = gl.getUniformLocation( this.shaderProgram, "material.specular" );
    this.materialShineLoc = gl.getUniformLocation( this.shaderProgram, "material.shininess" );

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

    gl.uniform3fv( this.viewPosLoc, cam.transform.position.xyz );
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
            gl.uniform3fv( this.lightDir4Location, currLight.direction.xyz );
            gl.uniform3fv( this.dirLight4BaseAmbientLoc, currLight.base.ambient.rgb );
            gl.uniform3fv( this.dirLight4BaseDiffuseLoc, currLight.base.diffuse.rgb );
            gl.uniform3fv( this.dirLight4BaseSpecLoc, currLight.base.specular.rgb );
        case 4:
            var currLight = dirLightsInScene[3];
            gl.uniform3fv( this.lightDir3Location, currLight.direction.xyz );
            gl.uniform3fv( this.dirLight3BaseAmbientLoc, currLight.base.ambient.rgb );
            gl.uniform3fv( this.dirLight3BaseDiffuseLoc, currLight.base.diffuse.rgb );
            gl.uniform3fv( this.dirLight3BaseSpecLoc, currLight.base.specular.rgb );
        case 3:
            var currLight = dirLightsInScene[2];
            gl.uniform3fv( this.lightDir2Location, currLight.direction.xyz );
            gl.uniform3fv( this.dirLight2BaseAmbientLoc, currLight.base.ambient.rgb );
            gl.uniform3fv( this.dirLight2BaseDiffuseLoc, currLight.base.diffuse.rgb );
            gl.uniform3fv( this.dirLight2BaseSpecLoc, currLight.base.specular.rgb );
        case 2:
            var currLight = dirLightsInScene[1];
            gl.uniform3fv( this.lightDir1Location, currLight.direction.xyz );
            gl.uniform3fv( this.dirLight1BaseAmbientLoc, currLight.base.ambient.rgb );
            gl.uniform3fv( this.dirLight1BaseDiffuseLoc, currLight.base.diffuse.rgb );
            gl.uniform3fv( this.dirLight1BaseSpecLoc, currLight.base.specular.rgb );
        case 1:
            var currLight = dirLightsInScene[0];
            gl.uniform3fv( this.lightDir0Location, currLight.direction.xyz );
            gl.uniform3fv( this.dirLight0BaseAmbientLoc, currLight.base.ambient.rgb );
            gl.uniform3fv( this.dirLight0BaseDiffuseLoc, currLight.base.diffuse.rgb );
            gl.uniform3fv( this.dirLight0BaseSpecLoc, currLight.base.specular.rgb );
        default: break;
    }

// #endregion

    var material = this.material;
    gl.uniform3fv( this.materialAmbientLoc, material.ambient.rgb );
    gl.uniform3fv( this.materialDiffuseLoc, material.diffuse.rgb );
    gl.uniform3fv( this.materialSpecLoc, material.specular.rgb );
    gl.uniform1f( this.materialShineLoc, material.shininess );


    gl.drawElements( gl.TRIANGLES, 3 * numTriangles, gl.UNSIGNED_SHORT, 0 );
}

function lightDirMatSetup(){
    var shader = initShaders( gl, "vertex-lighting", "fragment-lighting" );

    var dirMaterial = new Material( shader );

    dirMaterial.ambient = new Vector3( 1.0, 0.5, 0.31 );
    dirMaterial.diffuse = new Vector3( 1.0, 0.5, 0.31 );
    dirMaterial.specular = new Vector3( 0.5, 0.5, 0.5 );
    dirMaterial.shininess = 10.0;

    //dirMaterial.lightDir = (new Vector3( 1, -1, 0 )).normalized;
    //dirMaterial.lightStrength = 1.0;

    dirMaterial.renderSetup = dirRenderSetup;
    dirMaterial.render = dirRender;

    return dirMaterial;

}



