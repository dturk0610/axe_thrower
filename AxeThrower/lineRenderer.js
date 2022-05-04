//myScene.objects.findIndex( elem => elem.tag == "LineRenderer" )

class LineRenderer{

    static recurNum = 4;
    /**
     * 
     * @param {Vector4} cp1 Control Point one to render line for
     * @param {Vector4} cp2 Control Point two to render line for
     * @param {Vector4} cp3 Control Point three to render line for
     * @param {Vector4} cp4 Control Point four to render line for
     */
    constructor( cp1, cp2, cp3, cp4, shaderProgram, gameObject ){
        this.cp1 = cp1;
        this.cp2 = cp2;
        this.cp3 = cp3;
        this.cp4 = cp4;
        this.calculateVerts();
        this.shaderProgram = shaderProgram;
        this.gameObject = gameObject;
        this.verticesBuffer = gl.createBuffer();
        this.vertexPosition = gl.getAttribLocation( this.shaderProgram, "vertexPosition");
        this.worldMatLocation = gl.getUniformLocation( this.shaderProgram, "worldMat" );
        this.perspectiveProjectionMatricLocation = gl.getUniformLocation( this.shaderProgram, "projectMat" );
    }

    updateCPs( cp1, cp2, cp3, cp4 ){
        this.cp1 = cp1;
        this.cp2 = cp2;
        this.cp3 = cp3;
        this.cp4 = cp4;
        this.calculateVerts();
    }

    calculateVerts(){
        this.verts = [];
        LineRenderer.subDivide( LineRenderer.recurNum, this.cp1, this.cp2, this.cp3, this.cp4, this.verts );
    }

    render(){        
        gl.useProgram( this.shaderProgram );
        var verts = this.verts;

        gl.bindBuffer( gl.ARRAY_BUFFER, this.verticesBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, Vector4.flatten(verts), gl.STATIC_DRAW );
        
        gl.vertexAttribPointer( this.vertexPosition, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( this.vertexPosition );

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
        var worldMat = this.gameObject.transform.worldMat;

        gl.uniformMatrix4fv( this.worldMatLocation, false, worldMat );
        gl.uniformMatrix4fv( this.perspectiveProjectionMatricLocation, false, viewProjectMat );

        //gl.drawElements( gl.LINE_STRIP, verts.length, gl.UNSIGNED_SHORT, 0 );
        gl.drawArrays( gl.LINE_STRIP, 0, verts.length);
    }
    
    static subDivide( depth, p0, p1, p2, p3, ptsArr ){
        var q0 = p0;
        var q6 = p3;
        var q1 = Vector4.scale( .5, Vector4.add( p0, p1 ) );
        var q =  Vector4.scale( .5, Vector4.add( p1, p2 ) );
        var q5 = Vector4.scale( .5, Vector4.add( p2, p3 ) );
        var q2 = Vector4.scale( .5, Vector4.add( q1, q  ) );
        var q4 = Vector4.scale( .5, Vector4.add(  q, q5 ) );
        var q3 = Vector4.scale( .5, Vector4.add( q2, q4 ) );
        if ( depth == 0 ){ 
            ptsArr.push(q0);
            ptsArr.push(q1);
            ptsArr.push(q2);
            ptsArr.push(q3);
            ptsArr.push(q4);
            ptsArr.push(q5);
            ptsArr.push(q6);
        }
        else{
            LineRenderer.subDivide( depth - 1, q0, q1, q2, q3, ptsArr );
            LineRenderer.subDivide( depth - 1, q3, q4, q5, q6, ptsArr );
        }
    }
}