

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