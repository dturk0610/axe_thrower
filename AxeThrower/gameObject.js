class GameObject{
    constructor( position = vec3( 0, 0, 0 ), rotation = new Quat( 0, 0, 0, 1 ), verts = [], indices = [] ){
        this.position = position;
        this.rotation = rotation;
        this.verts = verts;
        this.indices = indices;
    }
}