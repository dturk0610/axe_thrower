

class Vector4{

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @param {number} w 
     */
    constructor( x = 0, y = 0, z = 0, w = 1 ){
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    get xyzw(){
        return [ this.x, this.y, this.z, this.w ];
    }

    get rgba(){
        return [ this.x, this.y, this.z, this.w ];
    }

    get xyz(){
        return [ this.x, this.y, this.z ];
    }

    get rgb(){
        return [ this.x, this.y, this.z ];
    }

    get xy(){
        return [ this.x, this.y ];
    }

    get r(){
        return this.x;
    }
    get g(){
        return this.y;
    }
    get b(){
        return this.z;
    }
    get a(){
        return this.w;
    }

    get normalized(){
        var invMag = 1/Math.sqrt( this.x*this.x + this.y*this.y + this.z*this.z + this.w*this.w );
        return new Vector4( this.x*invMag, this.y*invMag, this.z*invMag, this.w*invMag );
    }

    /**
     * 
     * @param {Vector4} v 
     * @param {Vector4} u 
     * @returns 
     */
    static Dot( v, u ){
        return ( v.x*u.x + v.y*u.y + v.z*u.z + v.w*u.w );
    }

    /**
     * 
     * @param {Vector4} v 
     * @param {Vector4} u 
     * @returns 
     */
    static Add( v, u ){
        return new Vector4( v.x + u.x, v.y + u.y, v.z + u.z, v.w + u.w );
    }

    static Flatten( varr ){
        var ret = new Float32Array( varr.length * 4 );
        for (var i = 0; i < varr.length; i++){
            ret[i*4 + 0] = varr[i].x;
            ret[i*4 + 1] = varr[i].y;
            ret[i*4 + 2] = varr[i].z;
            ret[i*4 + 3] = varr[i].w;
        }
        return ret;
    }

    static Scale( amount, v ){
        return new Vector4( v.x*amount, v.y*amount, v.z*amount, v.w*amount );
    }

    toVector3(){
        return new Vector3( this.x, this.y, this.z );
    }
}

class Vector3{

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    constructor( x = 0, y = 0, z = 0 ){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    get xyz(){
        return [ this.x, this.y, this.z ];
    }

    get rgb(){
        return [ this.x, this.y, this.z ];
    }

    get xy(){
        return [ this.x, this.y ];
    }

    get normalized(){
        var invMag = 1/Math.sqrt( this.x*this.x +  this.y*this.y +  this.z*this.z );
        return new Vector3( this.x*invMag, this.y*invMag, this.z*invMag );
    }

    /**
     * 
     * @param {Vector3} v 
     * @param {Vector3} u 
     * @returns 
     */
    static Dot( v, u ){
        return ( v.x*u.x + v.y*u.y + v.z*u.z );
    }

    /**
     * 
     * @param {Vector3} v 
     * @param {Vector3} u 
     * @returns 
     */
    static Add( v, u ){
        return new Vector4( v.x + u.x, v.y + u.y, v.z + u.z );
    }

    static Cross( v, u ){
        var newX = v.y*u.z - v.z*u.y;
        var newY = v.z*u.x - v.x*u.z;
        var newZ = v.x*u.y - v.y*u.x;
        return new Vector3( newX, newY, newZ );
    }

    static Flatten( varr ){
        var ret = new Float32Array( varr.length * 3 );
        for (var i = 0; i < varr.length; i++){
            ret[i*3 + 0] = varr[i].x;
            ret[i*3 + 1] = varr[i].y;
            ret[i*3 + 2] = varr[i].z;
        }
        return ret;
    }
}

class Vector2{

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor( x = 0, y = 0 ){
        this.x = x;
        this.y = y;
    }
    
    get xy(){
        return [ this.x, this.y ];
    }

    /**
     * 
     * @param {Vector2} v 
     * @param {Vector2} u 
     * @returns 
     */
    static Dot( v, u ){
        return ( v.x*u.x + v.y*u.y );
    }

    /**
     * 
     * @param {Vector2} v 
     * @param {Vector2} u 
     * @returns 
     */
    static Add( v, u ){
        return new Vector4( v.x + u.x, v.y + u.y );
    }
}