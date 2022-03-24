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
        this.worldMat = this.calcWorldMat();
    }
    
    getVertices(){
        return this.verts;
    }

    getFaces(){
        return this.indices;
    }

    calcWorldMat(){
        var rotMat = Quat.toMat4( this.rotation );
        var moveMat = [
                         1.0,              0.0,              0.0, 0.0,
                         0.0,              1.0,              0.0, 0.0,
                         0.0,              0.0,              1.0, 0.0,
            this.position[0], this.position[1], this.position[2], 1.0 
        ];
        return Matrix.mult4x4( moveMat, rotMat );
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
    constructor( width, depth, position = vec4( 0.0, 0.0, 0.0, 1.0 ), rotation = new Quat( 0.0, 0.0, 0.0, 1.0 ) ){
        this.position = position;
        this.rotation = rotation;
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
        return new GameObject( "new Quad", this.position, this.rotation, this.verts, this.indices );
    }
}