
/**
 * Welcome to my demise. If you are reading this then I am very surprised. The following classes in
 * this file will help to build an incredibly reliable game engine like experience so that making
 * a game in an html application is easier. This is probably the worst idea I have EVER had but, here
 * we are. I am here writing this at some past time for you and you are reading this in the present.
 * The idea of this is to have the components of these game objects seperated to that they can be fairly
 * customizeable. Not only this, but so it is easier to control them through code and using modern tactics
 * of programing for games or applications. Please send help for this is a very ambitious task for me alone.
 * Thank jesus I didn't have to implement webgl myself.
 */

/**
 * The first class is the straight game object class. This class represents an object that the user wants
 * in the scene, either to be rendered or to act as a parent-child separator to helps with animations
 * or more understandable movements.
 */
class GameObject{

    /**
     * 
     * @param {string} tag 
     * @param {Vector4} position 
     * @param {Quat} rotation 
     * @param {[Vector3]} verts 
     * @param {[int]} indices 
     */
    constructor( tag = "new game object", position = new Vector4( 0, 0, 0, 1 ), rotation = new Quat( 0, 0, 0, 1 ), scale = new Vector3( 1, 1, 1 ) ){
        this.tag = tag;
        this.transform = new Transform( position, rotation, scale );
        this.worldMat = this.calcWorldMat();
    }


    /**
     * Eventually this will be a bit more complex as I plan to add in a child-parent relationship
     * so that objects can have a more hierarchical like structure
     * @returns the transform matrix, local to world matrix.
     */
    calcWorldMat(){
        return this.transform.calcWorldMat();
    }

    update(){
        this.worldMat = this.calcWorldMat();
        this.transform.updateRotation();
    }

}

/**
 * The second class will house my take on the primitive type of quad, or otherwise understood as 
 * a bounded plane. Where a plane streches to infinity, this will only strech to the width and
 * depth of the square.
 */
class Quad{

    /**
     * 
     * @param {number} width the width of the plane
     * @param {number} depth the height of the plane
     * @param {Vector4} position 
     * @param {Quat} rotation 
     * @returns 
     */
    constructor( width = 1, depth = 1, position = new Vector4( 0.0, 0.0, 0.0, 1.0 ), rotation = new Quat( 0.0, 0.0, 0.0, 1.0 ), scale = new Vector3( 1, 1, 1 ) ){
        // While these verts are layed out in a row maner, they are still expressed in the matrix as a 
        // column
        var verts = [
            new Vector4( -width * 0.5, 0.0, -depth * 0.5, 1.0 ),
            new Vector4( -width * 0.5, 0.0,  depth * 0.5, 1.0 ),
            new Vector4(  width * 0.5, 0.0,  depth * 0.5, 1.0 ),
            new Vector4(  width * 0.5, 0.0, -depth * 0.5, 1.0 )
        ];
        var indexList = [ 0, 1, 2,
                         0, 2, 3 ];
        this.depth = depth;
        this.width = width;
        var gO = new GameObject( "new Quad", position, rotation, scale , this.verts, this.indices );
        gO.mesh = new Mesh( verts, indexList )
        return gO;
    }
}

/**
 * This class will house my implementation of a "transform" type object which will be used
 * to store the physical qualities like scale, rotation and position in the 3d space.
 */
class Transform{

    /**
     * 
     * @param {Vector4} position 
     * @param {Quat} rotation 
     * @param {Vector3} scale
     */
    constructor( position = new Vector4( 0, 0, 0, 1 ), rotation = new Quat( 0, 0, 0, 1 ), scale = new Vector3( 1, 1, 1 ) ){
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        if ( !Quat.isEqual(rotation, Quat.identity) ){
            var rotMat = Quat.toMat4(rotation);
            this.rightVec = Matrix.vecMatMult( new Vector4( 1, 0, 0, 1 ), rotMat ).toVector3();
            this.upVec = Matrix.vecMatMult( new Vector4( 0, 1, 0, 1 ), rotMat ).toVector3();
            this.fwdVec = Matrix.vecMatMult( new Vector4( 0, 0, -1, 1 ), rotMat ).toVector3();
        }else{
            this.rightVec = new Vector3( 1, 0, 0 );
            this.upVec = new Vector3( 0, 1, 0 );
            this.fwdVec = new Vector3( 0, 0, -1 );
        }
    }

    updateRotation(){
        var rotMat = Quat.toMat4(this.rotation);
        this.rightVec = Matrix.vecMatMult( new Vector4( 1, 0, 0, 1 ), rotMat ).toVector3();
        this.upVec = Matrix.vecMatMult( new Vector4( 0, 1, 0, 1 ), rotMat ).toVector3();
        this.fwdVec = Matrix.vecMatMult( new Vector4( 0, 0, -1, 1 ), rotMat ).toVector3();
    }

    calcWorldMat(){
        var scaleMat = [ 
                        this.scale.x,             0,             0, 0,
                                    0, this.scale.y,             0, 0,
                                    0,             0, this.scale.z, 0,
                                    0,             0,             0, 1
                        ];
        var rotMat = Quat.toMat4( this.rotation );
        var moveMat = [
                        1.0,             0.0,             0.0, 0.0,
                        0.0,             1.0,             0.0, 0.0,
                        0.0,             0.0,             1.0, 0.0,
            this.position.x, this.position.y, this.position.z, 1.0 
        ];
        var scaleRotMat = Matrix.mult4x4( rotMat, scaleMat );
        return Matrix.mult4x4( moveMat, scaleRotMat );
    }

    lookAt( pos ){
        var fwd = this.fwdVec.normalized;
        var dirToPoint = Vector4.sub( pos, this.position ).toVector3().normalized;
        var speed = 15.0;
        var dotXVal = Vector3.dot( fwd, dirToPoint );
        if ( dotXVal > 1.0 ) dotXVal = 1.0;
        else if (dotXVal < -1.0 ) dotXVal = -1.0;
        var axis = Vector3.cross( fwd, dirToPoint );
        var angleX = Math.acos( dotXVal ) * 180/Math.PI; // these are converted to degrees
                                                         // because the quat function expects degrees
        var currRot = this.rotation;
        currRot = Quat.mult( currRot, Quat.fromAxisAndAngle( axis, -angleX ) );

        this.updateRotation();
        var right = this.rightVec;
        var newRight = Vector3.cross( this.fwdVec, new Vector3( 0, 1, 0 ) ).normalized;
        var dotYVal = Vector3.dot( newRight, right );
        if ( dotYVal > 1.0 ) dotYVal = 1.0;
        else if (dotYVal < -1.0 ) dotYVal = -1.0;
        var sign = 1.0;
        if ( right.y < 0 ) sign = -1.0;
        var angleY = Math.acos( dotYVal ) * 180/Math.PI * sign; // these are converted to degrees
                                                         // because the quat function expects degrees
        this.rotation =  Quat.mult( currRot, Quat.fromAxisAndAngle( dirToPoint, -angleY ) );
    }

}

/**
 * This class will house implementation of a class to better seperate the rendering from
 * a gameobject and to help giving different rendering methods to different objects.
 */
class Mesh{

    /**
     * 
     * @param {*} verts 
     * @param {*} indices 
     */
    constructor(  verts = [], indices = [] ){
        this.verts = verts;
        this.numVertices = verts.length;
        this.indices = indices;
        this.numTriangles = indices.length/3;
        this.faceNormals = this.getFaceNormals();
        this.vertexNormals = this.getVertexNormals();
    }
  
    /**
     * This will likely be moved to a different class later as some game object may not necesarily
     * need verticies.
     * @returns the verticies comprising the object
     */
     getVertices(){
        return this.verts;
    }

    /**
     * This will likely be moved to a different class later as some game object may not necesarily
     * need verticies.
     * @returns the indicies comprising the object
     */
    getFaces(){
        return this.indices;
    }

    // The following function takes in vertices, indexList, and numTriangles
    // and outputs the face normals
    getFaceNormals() {
        
        var vertices = this.verts;
        var indexList = this.indices;
        var numTriangles = this.numTriangles;
        var faceNormals=[];
        // Iterate through all the triangles (i.e., from 0 to numTriangles-1)
        for (var i = 0; i < numTriangles; i++) {
            var p0 = new Vector3( vertices[indexList[3*i]].x, vertices[indexList[3*i]].y, vertices[indexList[3*i]].z );
            var p1 = new Vector3( vertices[indexList[3*i + 1]].x, vertices[indexList[3*i + 1]].y, vertices[indexList[3*i + 1]].z );
            var p2 = new Vector3( vertices[indexList[3*i + 2]].x, vertices[indexList[3*i + 2]].y, vertices[indexList[3*i + 2]].z );

            var p1minusp0 = new Vector3( p1.x - p0.x, p1.y - p0.y, p1.z - p0.z );
            var p2minusp0 = new Vector3( p2.x - p0.x, p2.y - p0.y, p2.z - p0.z );
            var faceNormal = Vector3.cross( p1minusp0, p2minusp0 );
            faceNormal = faceNormal.normalized;
            faceNormals.push( faceNormal );
        }
        // return the array of face normals
        return faceNormals;
    }
    // The following function takes in vertices, indexList, faceNormals, numVertices, and numTriangles,
    // and outputs the vertex normals
    getVertexNormals() {
        // This function provides a simple method to get vertex normals. There are
        // faster methods to get them.
        var vertexNormals=[];
        var faceNormals = this.faceNormals;
        var indexList = this.indices;
        var numVertices = this.verts.length;
        var numTriangles = this.numTriangles;
        // Iterate through all the vertices
        for (var j = 0; j < numVertices; j++) {
            var vertexNormal = new Vector3( 0, 0, 0 );
            // Iterate through triangles
            for (var i = 0; i < numTriangles; i++) {
                if ( indexList[3*i] == j | indexList[3*i + 1] == j | indexList[3*i + 2] == j ){
                    vertexNormal.x = vertexNormal.x + faceNormals[i].x;
                    vertexNormal.y = vertexNormal.y + faceNormals[i].y;
                    vertexNormal.z = vertexNormal.z + faceNormals[i].z;
                }
            }
            vertexNormal = vertexNormal.normalized;
            vertexNormals.push( vertexNormal );
        }

        // return the array of vertex normals
        return vertexNormals;
    }
}

class Material{

    /**
     * 
     * @param {*} shader 
     * @param {GameObject} gameObj
     * @param {Vector3} ambient 
     * @param {Vector3} diffuse 
     * @param {Vector3} specular 
     * @param {number} shininess 
     */
    constructor( shader, gameObj, ambient = new Vector3( 1.0, 0.5, 0.31 ), diffuse = new Vector3( 1.0, 0.5, 0.31 ), specular = new Vector3( 0.5, 0.5, 0.5 ), shininess = 32.0 ){
        this.shaderProgram = shader;
        this.gameObject = gameObj;
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess;;
    }

}

/**
 * This class is the neccesary 
 */
class MeshRenderer{

    static gl;

    static setGL ( gl ) { MeshRenderer.gl = gl; };

    constructor( gameObj, material, renderSetup, render ){
        this.gameObject = gameObj;
        this.material = material;
        this.shaderProgram = this.material.shaderProgram;
        this.setupFunc = renderSetup;
        this.renderFunc = render;
        this.gl = MeshRenderer.gl;
        this.setupFunc();
    }

    render(){
        this.renderFunc();
    }
}