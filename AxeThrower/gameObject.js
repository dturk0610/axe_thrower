
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
     * @param {vec4} position 
     * @param {Quat} rotation 
     * @param {[vec3]} verts 
     * @param {[int]} indices 
     */
    constructor( tag = "new game object", position = vec4( 0, 0, 0, 1 ), rotation = new Quat( 0, 0, 0, 1 ), scale = vec3( 1, 1, 1 ), verts = [], indices = [] ){
        this.tag = tag;
        this.transform = new Transform( position, rotation, scale );
        this.verts = verts;
        this.indices = indices;
        this.worldMat = this.calcWorldMat();
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

    /**
     * Eventually this will be a bit more complex as I plan to add in a child-parent relationship
     * so that objects can have a more hierarchical like structure
     * @returns the transform matrix, local to world matrix.
     */
    calcWorldMat(){
        return this.transform.calcWorldMat();
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
     * @param {vec4} position 
     * @param {Quat} rotation 
     * @returns 
     */
    constructor( width = 1, depth = 1, position = vec4( 0.0, 0.0, 0.0, 1.0 ), rotation = new Quat( 0.0, 0.0, 0.0, 1.0 ), scale = vec3( 1, 1, 1 ) ){
        // While these verts are layed out in a row maner, they are still expressed in the matrix as a 
        // column
        this.verts = [
             vec4( -width * 0.5, 0.0, -depth * 0.5, 1.0 ),
             vec4( -width * 0.5, 0.0,  depth * 0.5, 1.0 ),
             vec4(  width * 0.5, 0.0,  depth * 0.5, 1.0 ),
             vec4(  width * 0.5, 0.0, -depth * 0.5, 1.0 )
        ];
        this.indices = [ 0, 1, 2,
                         0, 2, 3 ];
        this.depth = depth;
        this.width = width;
        return new GameObject( "new Quad", position, rotation, scale , this.verts, this.indices );
    }
}

/**
 * This class will house my implementation of a "transform" type object which will be used
 * to store the physical qualities like scale, rotation and position in the 3d space.
 */
class Transform{

    /**
     * 
     * @param {vec4} position 
     * @param {Quat} rotation 
     * @param {vec4} fwdVec 
     * @param {vec4} upVec 
     * @param {vec4} rightVec 
     */
    constructor( position = vec4( 0, 0, 0, 1 ), rotation = new Quat( 0, 0, 0, 1 ), scale = vec3( 1, 1, 1 ) ){
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        if ( !Quat.isEqual(rotation, Quat.identity) ){
            var rotMat = Quat.toMat4(rotation);
            this.rightVec = Matrix.vecMatMult( vec4( 1, 0, 0, 1 ), rotMat );
            this.upVec = Matrix.vecMatMult( vec4( 0, 1, 0, 1 ), rotMat );
            this.fwdVec = Matrix.vecMatMult( vec4( 0, 0, 1, 1 ), rotMat );
        }else{
            this.rightVec = vec3( 1, 0, 0 );
            this.upVec = vec3( 0, 1, 0 );
            this.fwdVec = vec3( 0, 0, 1 );
        }
    }

    updateRotation(){
        var rotMat = Quat.toMat4(this.rotation);
        this.rightVec = Matrix.vecMatMult( vec4( 1, 0, 0, 1 ), rotMat );
        this.upVec = Matrix.vecMatMult( vec4( 0, 1, 0, 1 ), rotMat );
        this.fwdVec = Matrix.vecMatMult( vec4( 0, 0, 1, 1 ), rotMat );
    }

    calcWorldMat(){
        var scaleMat = [ 
                        this.scale[0],             0,             0, 0,
                                    0, this.scale[1],             0, 0,
                                    0,             0, this.scale[2], 0,
                                    0,             0,             0, 1
                        ];
        var rotMat = Quat.toMat4( this.rotation );
        var moveMat = [
                         1.0,              0.0,              0.0, 0.0,
                         0.0,              1.0,              0.0, 0.0,
                         0.0,              0.0,              1.0, 0.0,
            this.position[0], this.position[1], this.position[2], 1.0 
        ];
        var scaleRotMat = Matrix.mult4x4( rotMat, scaleMat );
        return Matrix.mult4x4( moveMat, scaleRotMat );
    }
}

/**
 * This class will house implementation of a class to better seperate the rendering from
 * a gameobject and to help giving different rendering methods to different objects.
 */
class Mesh{

    constructor(  verts = [], indicies = [] ){

    }


}