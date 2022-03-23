class GameObject{
    constructor( position = vec4( 0, 0, 0, 1 ), rotation = new Quat( 0, 0, 0, 1 ), verts = [], indices = [] ){
        this.position = position;
        this.rotation = rotation;
        this.verts = verts;
        this.indices = indices;
    }
}

class Quad{
    constructor(height, width, position = vec4( 0, 0, 0, 1 ), rotation = new Quat( 0, 0, 0, 1 )){
        this.position = position;
        this.rotation = rotation;
        this.verts = [
            vec4( -width * .5, -height *.5, 0, 1 ),
            vec4( -width * .5,  height *.5, 0, 1 ),
            vec4(  width * .5,  height *.5, 0, 1 ),
            vec4(  width * .5, -height *.5, 0, 1 )
        ];
    }
}