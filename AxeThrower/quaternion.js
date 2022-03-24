class Quat{

    /**
     * http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-17-quaternions/
     * @param {number} x Rotation axis x * sin( rotationangle / 2 )
     * @param {number} y Rotation axis y * sin( rotationangle / 2 )
     * @param {number} z Rotation axis z * sin( rotationangle / 2 )
     * @param {number} w cos( Rotation angle/2 )
     */
    constructor( x = 0, y = 0, z = 0, w = 1 ){
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    /**
     * 
     * @param {vec3} axis axis to rotate around
     * @param {number} angle angle in degress to rotate around by
     */
    setWithAxisAndAngle( axis, angle ){
        axis = normalize(axis); // makes sure that the axis is truly normalized
        angle = angle * Math.PI / 180.0;
        this.x = axis[0] * Math.sin( angle/2 );
        this.y = axis[1] * Math.sin( angle/2 );
        this.z = axis[2] * Math.sin( angle/2 );
        this.w = Math.cos( angle/2 );
    }

    /**
     * 
     * @param {vec3} axis axis to rotate around
     * @param {number} angle angle in degress to rotate around by
     * @returns new Quat built from rotation axis and angle
     */
    static fromAxisAndAngle( axis, angle ){
        axis = normalize(axis); // makes sure that the axis is truly normalized
        angle = angle * Math.PI / 180.0;
        var x = axis[0] * Math.sin( angle/2 );
        var y = axis[1] * Math.sin( angle/2 );
        var z = axis[2] * Math.sin( angle/2 );
        var w = Math.cos( angle/2 );
        return new Quat( x, y, z, w );
    }

    /**
     * https://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToMatrix/index.htm
     * @param {Quat} q 
     */
    static toMat4( q ){
        var mat1 = [  
             q.w, -q.z,  q.y, -q.x,
             q.z,  q.w, -q.x, -q.y,
            -q.y,  q.x,  q.w, -q.z,
             q.x,  q.y,  q.z,  q.w
        ];
        var mat2 = [
             q.w, -q.z,  q.y,  q.x,
             q.z,  q.w, -q.x,  q.y,
            -q.y,  q.x,  q.w,  q.z,
            -q.x, -q.y, -q.z,  q.w 
        ];
        return Matrix.mult4x4( mat1, mat2 );
    }
    
    /**
     * https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles
     * @param {number} yaw 
     * @param {number} pitch 
     * @param {number} roll 
     * @returns 
     */
    static EulerToQuaternion( yaw, pitch, roll ){
    
        var cy = Math.cos(yaw * 0.5);
        var sy = Math.sin(yaw * 0.5);
        var cp = Math.cos(pitch * 0.5);
        var sp = Math.sin(pitch * 0.5);
        var cr = Math.cos(roll * 0.5);
        var sr = Math.sin(roll * 0.5);

        var q = new Quat();
        q.w = cr * cp * cy + sr * sp * sy;
        q.x = sr * cp * cy - cr * sp * sy;
        q.y = cr * sp * cy + sr * cp * sy;
        q.z = cr * cp * sy - sr * sp * cy;

        return q;
    }

    static identity = new Quat( 0, 0, 0, 1 );
    static isEqual( q1, q2 ){
        return ( q1.x == q2.x && q1.y == q2.y && q1.z == q2.z && q1.w == q2.w );
    }
}