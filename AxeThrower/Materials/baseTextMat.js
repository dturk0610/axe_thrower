
baseTextRenderSetup = function(){

    this.texCoordBuffer = gl.createBuffer();
    this.texcoordLocation = gl.getAttribLocation(this.shaderProgram, "a_texcoord");

    gl.bindBuffer( gl.ARRAY_BUFFER, this.texCoordBuffer );
    var textCoords = getTextCoords();
    gl.bufferData( gl.ARRAY_BUFFER, Vector2.flatten(textCoords), gl.STATIC_DRAW );

    // Create a texture.
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
    // Asynchronously load an image
    var image = new Image();
    image.crossOrigin = "";
    image.src = "/Lab%205/d20Texture.png";
    image.addEventListener('load', function() {
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture( gl.TEXTURE_2D, texture );
      gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );
      gl.generateMipmap( gl.TEXTURE_2D );
    });

    this.textureLocation = gl.getUniformLocation( this.shaderProgram, "u_texture" );

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
    this.useSpecLoc = gl.getUniformLocation( this.shaderProgram, "useSpec" );

// #region DIRECTIONAL LIGHT LOCATIONS

    this.gNumDirLightLoc = gl.getUniformLocation( this.shaderProgram, "gNumDirLight" );
    
    this.dirLight0Location = gl.getUniformLocation( this.shaderProgram, "dirLights[0].lightDirection" );
    this.dirLight0BaseAmbientLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[0].base.ambient" );
    this.dirLight0BaseDiffuseLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[0].base.diffuse" );
    this.dirLight0BaseSpecLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[0].base.specular" );
    this.dirLight0BaseIsOnLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[0].base.isOn" );

    this.dirLight1Location = gl.getUniformLocation( this.shaderProgram, "dirLights[1].lightDirection" );
    this.dirLight1BaseAmbientLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[1].base.ambient" );
    this.dirLight1BaseDiffuseLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[1].base.diffuse" );
    this.dirLight1BaseSpecLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[1].base.specular" );
    this.dirLight1BaseIsOnLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[1].base.isOn" );

    this.dirLight2Location = gl.getUniformLocation( this.shaderProgram, "dirLights[2].lightDirection" );
    this.dirLight2BaseAmbientLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[2].base.ambient" );
    this.dirLight2BaseDiffuseLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[2].base.diffuse" );
    this.dirLight2BaseSpecLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[2].base.specular" );
    this.dirLight2BaseIsOnLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[2].base.isOn" );

    this.dirLight3Location = gl.getUniformLocation( this.shaderProgram, "dirLights[3].lightDirection" );
    this.dirLight3BaseAmbientLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[3].base.ambient" );
    this.dirLight3BaseDiffuseLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[3].base.diffuse" );
    this.dirLight3BaseSpecLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[3].base.specular" );
    this.dirLight3BaseIsOnLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[3].base.isOn" );

    this.dirLight4Location = gl.getUniformLocation( this.shaderProgram, "dirLights[4].lightDirection" );
    this.dirLight4BaseAmbientLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[4].base.ambient" );
    this.dirLight4BaseDiffuseLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[4].base.diffuse" );
    this.dirLight4BaseSpecLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[4].base.specular" );
    this.dirLight4BaseIsOnLoc = gl.getUniformLocation( this.shaderProgram, "dirLights[4].base.isOn" );

// #endregion

// #region POINT LIGHT LOCATIONS

    this.gNumPointLightLoc = gl.getUniformLocation( this.shaderProgram, "gNumPointLight" );

    this.ptLight0PosLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[0].pos" );
    this.ptLight0ConstLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[0].constant" );
    this.ptLight0LinLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[0].linear" );
    this.ptLight0QuadLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[0].quadratic" );
    this.ptLight0BaseAmbientLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[0].base.ambient" );
    this.ptLight0BaseDiffuseLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[0].base.diffuse" );
    this.ptLight0BaseSpecLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[0].base.specular" );
    this.ptLight0BaseIsOnLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[0].base.isOn" );

    this.ptLight1PosLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[1].pos" );
    this.ptLight1ConstLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[1].constant" );
    this.ptLight1LinLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[1].linear" );
    this.ptLight1QuadLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[1].quadratic" );
    this.ptLight1BaseAmbientLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[1].base.ambient" );
    this.ptLight1BaseDiffuseLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[1].base.diffuse" );
    this.ptLight1BaseSpecLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[1].base.specular" );
    this.ptLight1BaseIsOnLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[1].base.isOn" );

    this.ptLight2PosLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[2].pos" );
    this.ptLight2ConstLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[2].constant" );
    this.ptLight2LinLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[2].linear" );
    this.ptLight2QuadLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[2].quadratic" );
    this.ptLight2BaseAmbientLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[2].base.ambient" );
    this.ptLight2BaseDiffuseLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[2].base.diffuse" );
    this.ptLight2BaseSpecLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[2].base.specular" );
    this.ptLight2BaseIsOnLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[2].base.isOn" );

    this.ptLight3PosLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[3].pos" );
    this.ptLight3ConstLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[3].constant" );
    this.ptLight3LinLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[3].linear" );
    this.ptLight3QuadLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[3].quadratic" );
    this.ptLight3BaseAmbientLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[3].base.ambient" );
    this.ptLight3BaseDiffuseLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[3].base.diffuse" );
    this.ptLight3BaseSpecLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[3].base.specular" );
    this.ptLight3BaseIsOnLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[3].base.isOn" );

    this.ptLight4PosLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[4].pos" );
    this.ptLight4ConstLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[4].constant" );
    this.ptLight4LinLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[4].linear" );
    this.ptLight4QuadLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[4].quadratic" );
    this.ptLight4BaseAmbientLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[4].base.ambient" );
    this.ptLight4BaseDiffuseLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[4].base.diffuse" );
    this.ptLight4BaseSpecLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[4].base.specular" );
    this.ptLight4BaseIsOnLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[4].base.isOn" );

    this.ptLight5PosLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[5].pos" );
    this.ptLight5ConstLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[5].constant" );
    this.ptLight5LinLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[5].linear" );
    this.ptLight5QuadLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[5].quadratic" );
    this.ptLight5BaseAmbientLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[5].base.ambient" );
    this.ptLight5BaseDiffuseLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[5].base.diffuse" );
    this.ptLight5BaseSpecLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[5].base.specular" );
    this.ptLight5BaseIsOnLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[5].base.isOn" );

    this.ptLight6PosLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[6].pos" );
    this.ptLight6ConstLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[6].constant" );
    this.ptLight6LinLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[6].linear" );
    this.ptLight6QuadLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[6].quadratic" );
    this.ptLight6BaseAmbientLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[6].base.ambient" );
    this.ptLight6BaseDiffuseLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[6].base.diffuse" );
    this.ptLight6BaseSpecLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[6].base.specular" );
    this.ptLight6BaseIsOnLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[6].base.isOn" );

    this.ptLight7PosLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[7].pos" );
    this.ptLight7ConstLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[7].constant" );
    this.ptLight7LinLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[7].linear" );
    this.ptLight7QuadLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[7].quadratic" );
    this.ptLight7BaseAmbientLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[7].base.ambient" );
    this.ptLight7BaseDiffuseLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[7].base.diffuse" );
    this.ptLight7BaseSpecLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[7].base.specular" );
    this.ptLight7BaseIsOnLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[7].base.isOn" );

    this.ptLight8PosLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[8].pos" );
    this.ptLight8ConstLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[8].constant" );
    this.ptLight8LinLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[8].linear" );
    this.ptLight8QuadLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[8].quadratic" );
    this.ptLight8BaseAmbientLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[8].base.ambient" );
    this.ptLight8BaseDiffuseLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[8].base.diffuse" );
    this.ptLight8BaseSpecLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[8].base.specular" );
    this.ptLight8BaseIsOnLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[8].base.isOn" );

    this.ptLight9PosLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[9].pos" );
    this.ptLight9ConstLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[9].constant" );
    this.ptLight9LinLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[9].linear" );
    this.ptLight9QuadLocation = gl.getUniformLocation( this.shaderProgram, "pointLights[9].quadratic" );
    this.ptLight9BaseAmbientLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[9].base.ambient" );
    this.ptLight9BaseDiffuseLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[9].base.diffuse" );
    this.ptLight9BaseSpecLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[9].base.specular" );
    this.ptLight9BaseIsOnLoc = gl.getUniformLocation( this.shaderProgram, "pointLights[9].base.isOn" );

// #endregion


// #region MATERIAL LOCATIONS

    this.materialAmbientLoc = gl.getUniformLocation( this.shaderProgram, "material.ambient" );
    this.materialDiffuseLoc = gl.getUniformLocation( this.shaderProgram, "material.diffuse" );
    this.materialSpecLoc = gl.getUniformLocation( this.shaderProgram, "material.specular" );
    this.materialShineLoc = gl.getUniformLocation( this.shaderProgram, "material.shininess" );

// #endregion


}

baseTextRender = function(){
    gl.useProgram( this.shaderProgram );
    var mesh = this.gameObject.mesh;
    var numTriangles = mesh.numTriangles;
    var verts = mesh.getVertices();
    var indexList = mesh.getFaces();

    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexList), gl.STATIC_DRAW );

    gl.bindBuffer( gl.ARRAY_BUFFER, this.verticesBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, Vector4.flatten(verts), gl.STATIC_DRAW );
    
    gl.vertexAttribPointer( this.vertexPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( this.vertexPosition );

    var vertexNormals = mesh.vertexNormals;
    
    gl.bindBuffer( gl.ARRAY_BUFFER, this.normalsBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, Vector3.flatten( vertexNormals ), gl.STATIC_DRAW );

    gl.vertexAttribPointer( this.vertexNormalPointer, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( this.vertexNormalPointer );


    gl.enableVertexAttribArray( this.texcoordLocation );
    gl.bindBuffer( gl.ARRAY_BUFFER, this.texCoordBuffer );
    gl.vertexAttribPointer( this.texcoordLocation, 2, gl.FLOAT, false, 0, 0);


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

    gl.uniform1i( this.useSpecLoc, Scene.useSpecular );

// #region DIRECTIONAL LIGHT SETTINGS

    var dirLightsInScene = Scene.GetDirLights();
    var numDirLightsInScene = dirLightsInScene.length;

    gl.uniform1i( this.gNumDirLightLoc, numDirLightsInScene );
    switch( numDirLightsInScene ){
        case 5: 
            var currLight = dirLightsInScene[4];
            gl.uniform3fv( this.dirLight4Location, currLight.direction.xyz );
            gl.uniform3fv( this.dirLight4BaseAmbientLoc, currLight.base.ambient.rgb );
            gl.uniform3fv( this.dirLight4BaseDiffuseLoc, currLight.base.diffuse.rgb );
            gl.uniform3fv( this.dirLight4BaseSpecLoc, currLight.base.specular.rgb );
            gl.uniform1i( this.dirLight4BaseIsOnLoc, currLight.base.isOn );
        case 4:
            var currLight = dirLightsInScene[3];
            gl.uniform3fv( this.dirLight3Location, currLight.direction.xyz );
            gl.uniform3fv( this.dirLight3BaseAmbientLoc, currLight.base.ambient.rgb );
            gl.uniform3fv( this.dirLight3BaseDiffuseLoc, currLight.base.diffuse.rgb );
            gl.uniform3fv( this.dirLight3BaseSpecLoc, currLight.base.specular.rgb );
            gl.uniform1i( this.dirLight3BaseIsOnLoc, currLight.base.isOn );
        case 3:
            var currLight = dirLightsInScene[2];
            gl.uniform3fv( this.dirLight2Location, currLight.direction.xyz );
            gl.uniform3fv( this.dirLight2BaseAmbientLoc, currLight.base.ambient.rgb );
            gl.uniform3fv( this.dirLight2BaseDiffuseLoc, currLight.base.diffuse.rgb );
            gl.uniform3fv( this.dirLight2BaseSpecLoc, currLight.base.specular.rgb );
            gl.uniform1i( this.dirLight2BaseIsOnLoc, currLight.base.isOn );
        case 2:
            var currLight = dirLightsInScene[1];
            gl.uniform3fv( this.dirLight1Location, currLight.direction.xyz );
            gl.uniform3fv( this.dirLight1BaseAmbientLoc, currLight.base.ambient.rgb );
            gl.uniform3fv( this.dirLight1BaseDiffuseLoc, currLight.base.diffuse.rgb );
            gl.uniform3fv( this.dirLight1BaseSpecLoc, currLight.base.specular.rgb );
            gl.uniform1i( this.dirLight1BaseIsOnLoc, currLight.base.isOn );
        case 1:
            var currLight = dirLightsInScene[0];
            gl.uniform3fv( this.dirLight0Location, currLight.direction.xyz );
            gl.uniform3fv( this.dirLight0BaseAmbientLoc, currLight.base.ambient.rgb );
            gl.uniform3fv( this.dirLight0BaseDiffuseLoc, currLight.base.diffuse.rgb );
            gl.uniform3fv( this.dirLight0BaseSpecLoc, currLight.base.specular.rgb );
            gl.uniform1i( this.dirLight0BaseIsOnLoc, currLight.base.isOn );
        default: break;
    }

// #endregion

// #region POINT LIGHT SETTINGS

    var ptLightsInScene = Scene.GetPtLights();
    var numPtLightsInScene = ptLightsInScene.length;

    gl.uniform1i( this.gNumPointLightLoc, numPtLightsInScene );
    switch( numPtLightsInScene ){
        case 10: 
            var currLight = ptLightsInScene[9];
            gl.uniform3fv( this.ptLight9PosLocation, currLight.pos.xyz );
            gl.uniform1f( this.ptLight9ConstLocation, currLight.constant );
            gl.uniform1f( this.ptLight9LinLocation, currLight.linear );
            gl.uniform1f( this.ptLight9QuadLocation, currLight.quadratic );
            gl.uniform3fv( this.ptLight9BaseAmbientLoc, currLight.base.ambient.rgb );
            gl.uniform3fv( this.ptLight9BaseDiffuseLoc, currLight.base.diffuse.rgb );
            gl.uniform3fv( this.ptLight9BaseSpecLoc, currLight.base.specular.rgb );
            gl.uniform1i( this.ptLight9BaseIsOnLoc, currLight.base.isOn );
        case 9: 
            var currLight = ptLightsInScene[8];
            gl.uniform3fv( this.ptLight8PosLocation, currLight.pos.xyz );
            gl.uniform1f( this.ptLight8ConstLocation, currLight.constant );
            gl.uniform1f( this.ptLight8LinLocation, currLight.linear );
            gl.uniform1f( this.ptLight8QuadLocation, currLight.quadratic );
            gl.uniform3fv( this.ptLight8BaseAmbientLoc, currLight.base.ambient.rgb );
            gl.uniform3fv( this.ptLight8BaseDiffuseLoc, currLight.base.diffuse.rgb );
            gl.uniform3fv( this.ptLight8BaseSpecLoc, currLight.base.specular.rgb );
            gl.uniform1i( this.ptLight8BaseIsOnLoc, currLight.base.isOn );
        case 8: 
            var currLight = ptLightsInScene[7];
            gl.uniform3fv( this.ptLight7PosLocation, currLight.pos.xyz );
            gl.uniform1f( this.ptLight7ConstLocation, currLight.constant );
            gl.uniform1f( this.ptLight7LinLocation, currLight.linear );
            gl.uniform1f( this.ptLight7QuadLocation, currLight.quadratic );
            gl.uniform3fv( this.ptLight7BaseAmbientLoc, currLight.base.ambient.rgb );
            gl.uniform3fv( this.ptLight7BaseDiffuseLoc, currLight.base.diffuse.rgb );
            gl.uniform3fv( this.ptLight7BaseSpecLoc, currLight.base.specular.rgb );
            gl.uniform1i( this.ptLight7BaseIsOnLoc, currLight.base.isOn );
        case 7: 
            var currLight = ptLightsInScene[6];
            gl.uniform3fv( this.ptLight6PosLocation, currLight.pos.xyz );
            gl.uniform1f( this.ptLight6ConstLocation, currLight.constant );
            gl.uniform1f( this.ptLight6LinLocation, currLight.linear );
            gl.uniform1f( this.ptLight6QuadLocation, currLight.quadratic );
            gl.uniform3fv( this.ptLight6BaseAmbientLoc, currLight.base.ambient.rgb );
            gl.uniform3fv( this.ptLight6BaseDiffuseLoc, currLight.base.diffuse.rgb );
            gl.uniform3fv( this.ptLight6BaseSpecLoc, currLight.base.specular.rgb );
            gl.uniform1i( this.ptLight6BaseIsOnLoc, currLight.base.isOn );
        case 6: 
            var currLight = ptLightsInScene[5];
            gl.uniform3fv( this.ptLight5PosLocation, currLight.pos.xyz );
            gl.uniform1f( this.ptLight5ConstLocation, currLight.constant );
            gl.uniform1f( this.ptLight5LinLocation, currLight.linear );
            gl.uniform1f( this.ptLight5QuadLocation, currLight.quadratic );
            gl.uniform3fv( this.ptLight5BaseAmbientLoc, currLight.base.ambient.rgb );
            gl.uniform3fv( this.ptLight5BaseDiffuseLoc, currLight.base.diffuse.rgb );
            gl.uniform3fv( this.ptLight5BaseSpecLoc, currLight.base.specular.rgb );
            gl.uniform1i( this.ptLight5BaseIsOnLoc, currLight.base.isOn );
        case 5: 
            var currLight = ptLightsInScene[4];
            gl.uniform3fv( this.ptLight4PosLocation, currLight.pos.xyz );
            gl.uniform1f( this.ptLight4ConstLocation, currLight.constant );
            gl.uniform1f( this.ptLight4LinLocation, currLight.linear );
            gl.uniform1f( this.ptLight4QuadLocation, currLight.quadratic );
            gl.uniform3fv( this.ptLight4BaseAmbientLoc, currLight.base.ambient.rgb );
            gl.uniform3fv( this.ptLight4BaseDiffuseLoc, currLight.base.diffuse.rgb );
            gl.uniform3fv( this.ptLight4BaseSpecLoc, currLight.base.specular.rgb );
            gl.uniform1i( this.ptLight4BaseIsOnLoc, currLight.base.isOn );
        case 4:
            var currLight = ptLightsInScene[3];
            gl.uniform3fv( this.ptLight3PosLocation, currLight.pos.xyz );
            gl.uniform1f( this.ptLight3ConstLocation, currLight.constant );
            gl.uniform1f( this.ptLight3LinLocation, currLight.linear );
            gl.uniform1f( this.ptLight3QuadLocation, currLight.quadratic );
            gl.uniform3fv( this.ptLight3BaseAmbientLoc, currLight.base.ambient.rgb );
            gl.uniform3fv( this.ptLight3BaseDiffuseLoc, currLight.base.diffuse.rgb );
            gl.uniform3fv( this.ptLight3BaseSpecLoc, currLight.base.specular.rgb );
            gl.uniform1i( this.ptLight3BaseIsOnLoc, currLight.base.isOn );
        case 3:
            var currLight = ptLightsInScene[2];
            gl.uniform3fv( this.ptLight2PosLocation, currLight.pos.xyz );
            gl.uniform1f( this.ptLight2ConstLocation, currLight.constant );
            gl.uniform1f( this.ptLight2LinLocation, currLight.linear );
            gl.uniform1f( this.ptLight2QuadLocation, currLight.quadratic );
            gl.uniform3fv( this.ptLight2BaseAmbientLoc, currLight.base.ambient.rgb );
            gl.uniform3fv( this.ptLight2BaseDiffuseLoc, currLight.base.diffuse.rgb );
            gl.uniform3fv( this.ptLight2BaseSpecLoc, currLight.base.specular.rgb );
            gl.uniform1i( this.ptLight2BaseIsOnLoc, currLight.base.isOn );
        case 2:
            var currLight = ptLightsInScene[1];
            gl.uniform3fv( this.ptLight1PosLocation, currLight.pos.xyz );
            gl.uniform1f( this.ptLight1ConstLocation, currLight.constant );
            gl.uniform1f( this.ptLight1LinLocation, currLight.linear );
            gl.uniform1f( this.ptLight1QuadLocation, currLight.quadratic );
            gl.uniform3fv( this.ptLight1BaseAmbientLoc, currLight.base.ambient.rgb );
            gl.uniform3fv( this.ptLight1BaseDiffuseLoc, currLight.base.diffuse.rgb );
            gl.uniform3fv( this.ptLight1BaseSpecLoc, currLight.base.specular.rgb );
            gl.uniform1i( this.ptLight1BaseIsOnLoc, currLight.base.isOn );
        case 1:
            var currLight = ptLightsInScene[0];
            gl.uniform3fv( this.ptLight0PosLocation, currLight.pos.xyz );
            gl.uniform1f( this.ptLight0ConstLocation, currLight.constant );
            gl.uniform1f( this.ptLight0LinLocation, currLight.linear );
            gl.uniform1f( this.ptLight0QuadLocation, currLight.quadratic );
            gl.uniform3fv( this.ptLight0BaseAmbientLoc, currLight.base.ambient.rgb );
            gl.uniform3fv( this.ptLight0BaseDiffuseLoc, currLight.base.diffuse.rgb );
            gl.uniform3fv( this.ptLight0BaseSpecLoc, currLight.base.specular.rgb );
            gl.uniform1i( this.ptLight0BaseIsOnLoc, currLight.base.isOn );
        default: break;
    }

// #endregion

    var material = this.material;
    gl.uniform3fv( this.materialAmbientLoc, material.ambient.rgb );
    gl.uniform3fv( this.materialDiffuseLoc, material.diffuse.rgb );
    gl.uniform3fv( this.materialSpecLoc, material.specular.rgb );
    gl.uniform1f( this.materialShineLoc, material.shininess );

    gl.uniform1i( this.textureLocation, 0.0 );

    gl.drawElements( gl.TRIANGLES, 3 * numTriangles, gl.UNSIGNED_SHORT, 0 );
}

