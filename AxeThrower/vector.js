

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

    /**
     * @returns the magnitude of the current vector
     */
     get magnitude(){
        return Math.sqrt( this.x*this.x + this.y*this.y + this.z*this.z + this.w*this.w );
    }

    /**
     * @returns an array of the x, y, z and w positions of this vector.
     */
    get xyzw(){
        return [ this.x, this.y, this.z, this.w ];
    }

    /**
     * This version is to be used when the vector is being represented as a color.
     * @returns an array of the x, y, z and w positions of this vector.
     */
    get rgba(){
        return [ this.x, this.y, this.z, this.w ];
    }

    /**
     * @returns an array of the x, y and z positions of this vector.
     */
    get xyz(){
        return [ this.x, this.y, this.z ];
    }

    /**
     * This version is to be used when the vector is being represented as a color.
     * @returns an array of the x, y and z positions of this vector.
     */
    get rgb(){
        return [ this.x, this.y, this.z ];
    }

    /**
     * @returns an array of the x and y positions of this vector.
     */
    get xy(){
        return [ this.x, this.y ];
    }

    /**
     * @returns the x component of the vector, assumed to be represnting the r channel for collor
     */
    get r(){
        return this.x;
    }

    /**
     * @returns the y component of the vector, assumed to be represnting the g channel for collor
     */
    get g(){
        return this.y;
    }

    /**
     * @returns the z component of the vector, assumed to be represnting the b channel for collor
     */
    get b(){
        return this.z;
    }

    /**
     * @returns the w component of the vector, assumed to be represnting the a channel for collor
     */
    get a(){
        return this.w;
    }

    /**
     * @returns this vector normalized.
     */
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
    static dot( v, u ){
        return ( v.x*u.x + v.y*u.y + v.z*u.z + v.w*u.w );
    }

    /**
     * So far this is specifically used for positioning, so the w component should always be 1
     * @param {Vector4} v 
     * @param {Vector4} u 
     * @returns 
     */
    static add( v, u ){
        return new Vector4( v.x + u.x, v.y + u.y, v.z + u.z );
    }

    /**
     * So far this is specifically used for positioning, so the w component should always be 1
     * this + v
     * @param {Vector4} v 
     * @returns 
     */
    add( v ){
        return new Vector4( this.x + v.x, this.y + v.y, this.z + v.z );
    }

    /**
     * So far this is specifically used for positioning, so the w component should always be 1
     * v - u
     * @param {Vector4} v 
     * @param {Vector4} u 
     * @returns 
     */
     static sub( v, u ){
        return new Vector4( v.x - u.x, v.y - u.y, v.z - u.z );
    }

    /**
     * So far this is specifically used for positioning, so the w component should always be 1
     * this - v
     * @param {Vector4} v 
     * @returns 
     */
     sub( v ){
        return new Vector4( this.x - v.x, this.y - v.y, this.z - v.z );
    }

    /**
     * 
     * @param {[Vector4]} varr array of vectors to flatten to the GPU.
     * @returns 
     */
    static flatten( varr ){
        var ret = new Float32Array( varr.length * 4 );
        for (var i = 0; i < varr.length; i++){
            ret[i*4 + 0] = varr[i].x;
            ret[i*4 + 1] = varr[i].y;
            ret[i*4 + 2] = varr[i].z;
            ret[i*4 + 3] = varr[i].w;
        }
        return ret;
    }

    static scale( amount, v ){
        return new Vector4( v.x*amount, v.y*amount, v.z*amount );
    }

    /**
     * Returns the linear interpolation between the two vectors
     * https://docs.unity3d.com/ScriptReference/Vector3.Lerp.html
     * @param {Vector3} v 
     * @param {Vector3} u 
     * @param {number} ratio
     */
     static lerp( v, u, ratio ){
        return v.add( Vector4.scale( ratio, u.sub( v )) );
    }
    
    /**
     * 
     * @param {Vector4} v1 
     * @param {Vector4} v2 
     * @returns 
     */
     static isEqual( v1, v2 ){
        return ( v1.x == v2.x && v1.y == v2.y && v1.z == v2.z && v1.w == v2.w );
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

    /**
     * @returns the magnitude of the current vector
     */
    get magnitude(){
        return Math.sqrt( this.x*this.x + this.y*this.y + this.z*this.z );
    }

    /**
     * @returns an array of the x, y and z positions of this vector.
     */
    get xyz(){
        return [ this.x, this.y, this.z ];
    }

    /**
     * This version is to be used when the vector is being represented as a color.
     * @returns an array of the x, y and z positions of this vector.
     */
    get rgb(){
        return [ this.x, this.y, this.z ];
    }

    /**
     * @returns an array of the x and y positions of this vector.
     */
    get xy(){
        return [ this.x, this.y ];
    }

    /**
     * @returns this vector normalized.
     */
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
    static dot( v, u ){
        return ( v.x*u.x + v.y*u.y + v.z*u.z );
    }

    /**
     * 
     * @param {Vector3} v 
     * @param {Vector3} u 
     * @returns 
     */
     static add( v, u ){
        return new Vector3( v.x + u.x, v.y + u.y, v.z + u.z );
    }

    /**
     * this + v
     * @param {Vector3} v 
     * @returns 
     */
    Add( v ){
        return new Vector3( this.x + v.x, this.y + v.y, this.z + v.z );
    }

    /**
     * v - u
     * @param {Vector3} v 
     * @param {Vector3} u 
     * @returns 
     */
     static sub( v, u ){
        return new Vector3( v.x - u.x, v.y - u.y, v.z - u.z );
    }

    /**
     * this - v
     * @param {Vector3} v 
     * @returns 
     */
     sub( v ){
        return new Vector3( this.x - v.x, this.y - v.y, this.z - v.z );
    }

    /**
     * 
     * @param {Vector3} v 
     * @param {Vector3} u 
     * @returns 
     */
    static cross( v, u ){
        var newX = v.y*u.z - v.z*u.y;
        var newY = v.z*u.x - v.x*u.z;
        var newZ = v.x*u.y - v.y*u.x;
        return new Vector3( newX, newY, newZ );
    }

    /**
     * 
     * @param {[Vector3]} varr array of vectors to flatten to the GPU.
     * @returns 
     */
    static flatten( varr ){
        var ret = new Float32Array( varr.length * 3 );
        for (var i = 0; i < varr.length; i++){
            ret[i*3 + 0] = varr[i].x;
            ret[i*3 + 1] = varr[i].y;
            ret[i*3 + 2] = varr[i].z;
        }
        return ret;
    }

    /**
     * Returns the linear interpolation between the two vectors
     * https://docs.unity3d.com/ScriptReference/Vector3.Lerp.html
     * @param {Vector3} v 
     * @param {Vector3} u 
     * @param {number} ratio
     */
    static lerp( v, u, ratio ){
        return v.add( Vector3.scale( ratio, u.sub(v)) );
    }

    /**
     * 
     * @param {Vector3} v1 
     * @param {Vector3} v2 
     * @returns 
     */
    static isEqual( v1, v2 ){
        return ( v1.x == v2.x && v1.y == v2.y && v1.z == v2.z );
    }

    static zero = new Vector3( 0, 0, 0 );
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
    static dot( v, u ){
        return ( v.x*u.x + v.y*u.y );
    }

    /**
     * 
     * @param {Vector2} v 
     * @param {Vector2} u 
     * @returns 
     */
    static add( v, u ){
        return new Vector3( v.x + u.x, v.y + u.y );
    }

    /**
     * 
     * @param {[Vector2]} varr array of vectors to flatten to the GPU.
     * @returns 
     */
    static flatten( varr ){
        var ret = new Float32Array( varr.length * 2 );
        for (var i = 0; i < varr.length; i++){
            ret[i*2 + 0] = varr[i].x;
            ret[i*2 + 1] = varr[i].y;
        }
        return ret;
    }
}