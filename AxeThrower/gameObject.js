class GameObject{

    /**
     * 
     * @param {string} tag 
     * @param {vec3} position 
     * @param {Quat} rotation 
     * @param {[vec3]} verts 
     * @param {[int]} indices 
     */
    constructor( tag = "new game object", position = vec4( 0, 0, 0, 1 ), rotation = new Quat( 0, 0, 0, 1 ), verts = [], indices = [] ){
        this.tag = tag;
        this.position = position;
        this.rotation = rotation;
        this.verts = verts;
        this.indices = indices;
    }
    
    getVertices(){
        var rotMat = Quat.toMat4( this.rotation );
        var moveMat = mat4(
                         1.0, 0.0, 0.0, this.position[0],
                         0.0, 1.0, 0.0, this.position[1],
                         0.0, 0.0, 1.0, this.position[2],
                         0.0, 0.0, 0.0,              1.0 
                         );
        var tranMat = mult( rotMat, moveMat );
        var transposeVerts = transpose( this.verts ); // We transpose here and after to get the
        var retMat = mult( tranMat, transposeVerts ); // verts into a good format for the multiplication
        return transpose( retMat ); // then re-transpose in order to get them back in their vec4 format
    }
    getFaces(){
        return this.indices;
    }
}

class Quad{

    /**
     * 
     * @param {number} width the width of the plane
     * @param {number} depth the height of the plane
     * @param {vec3} position 
     * @param {Quat} rotation 
     * @returns 
     */
    constructor( width, depth, position = vec4( 0, 0, 0, 1 ), rotation = Quat.fromAxisAndAngle( vec3( 0, 1, 0 ), 0 )){
        this.position = position;
        this.rotation = rotation;
        // While these verts are layed out in a row maner, they are still expressed in the matrix as a 
        // column
        this.verts = [
             vec4( -width * .5, 0, -depth *.5, 1 ),
             vec4( -width * .5, 0,  depth *.5, 1 ),
             vec4(  width * .5, 0,  depth *.5, 1 ),
             vec4(  width * .5, 0, -depth *.5, 1 )
        ];
        this.verts.matrix = true;
        this.indices = [ 0, 1, 2,
                         0, 2, 3 ];
        this.depth = depth;
        this.width = width;
        return new GameObject( "new Quad", this.position, this.rotation, this.verts, this.indices );
    }
}