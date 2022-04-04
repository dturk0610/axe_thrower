class Quat{

    /**
     * Constructor for the quaternion class
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
     * Rebuilds the current quaternion so that its new axis and angle are the ones entered
     * @param {Vector3} axis axis to rotate around
     * @param {number} angle angle in degress to rotate around by
     */
    setWithAxisAndAngle( axis, angle ){
        axis = axis.normalized; // makes sure that the axis is truly normalized
        angle = angle * Math.PI / 180.0;
        this.x = axis.x * Math.sin( angle/2 );
        this.y = axis.y * Math.sin( angle/2 );
        this.z = axis.z * Math.sin( angle/2 );
        this.w = Math.cos( angle/2 );
    }

    /**
     * 
     * @param {Vector3} axis axis to rotate around.
     * @param {number} angle angle in degress to rotate around by.
     * @returns new quaternion built from rotation axis and angle.
     */
    static fromAxisAndAngle( axis, angle ){
        axis = axis.normalized; // makes sure that the axis is truly normalized
        angle = angle * Math.PI / 180.0;
        var x = axis.x * Math.sin( angle/2 );
        var y = axis.y * Math.sin( angle/2 );
        var z = axis.z * Math.sin( angle/2 );
        var w = Math.cos( angle/2 );
        return new Quat( x, y, z, w );
    }

    static scale( q, s ){
        return new Quat( q.x*s, q.y*s, q.z*s, q.w*s );
    }

    /**
     * The matrix implemented here can be found at this url.
     * https://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToMatrix/index.htm
     * @param {Quat} q 
     * @returns A 4x4 rotation matrix that this quaternion represents.
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
     * Understanding how to go from euler angels to quaternions is a pretty important
     * precedure, the url below as of first writing this better explains this process.
     * https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles
     * @param {number} yaw.
     * @param {number} pitch.
     * @param {number} roll.
     * @returns a quaternion based on the yaw, pitch and roll entered.
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
    
    /**
     * straight linear addition of quaternions.
     * @param {Quat} q1.
     * @param {Quat} q2.
     * @returns the added quaternions.
     */
    static add( q1, q2 ){
        return new Quat( q1.x + q2.x, q1.y + q2.y, q1.z + q2.z, q1.w + q2.w )
    }
    
    /**
     * straight linear addition of quaternions.
     * @param {Quat} q1.
     * @param {Quat} q2.
     * @returns the added quaternions.
     */
    add( q ){
        return new Quat( this.x + q.x, this.y + q.y, this.z + q.z, this.w + q.w )
    }
    
    /**
     * straight linear addition of quaternions.
     * @param {Quat} q1.
     * @param {Quat} q2.
     * @returns the added quaternions.
     */
    sub( q ){
        return new Quat( this.x - q.x, this.y - q.y, this.z - q.z, this.w - q.w )
    }

    /**
     * This does the dot product of the inner xyz values.
     * @param {Quat} q1 Q1 used for calculation, inner dot product of the xyz components.
     * @param {Quat} q2 Q2 used for calculation, inner dot product of the xyz components.
     * @returns a float value representing the inner dot product of the quaternion.
     */
    static innerDot( q1, q2 ){
        return q1.x * q2.x + q1.y * q2.y + q1.z * q2.z;
    }

    /**
     * Once again, this method was found on the listed paper/url. This one is coming from
     * an actual mathematical paper though, so I trust it more than wikipedia...
     * https://graphics.stanford.edu/courses/cs348a-17-winter/Papers/quaternion.pdf
     * @param {Quat} p p side of multiplication equation found in paper (not commutative)
     * @param {Quat} q q side of multiplication equation found in paper (not commutative)
     * @returns a new quaternion that is the resulting multiplication of the two entered.
     */
    static mult( p, q ){
        var xs = p.w * q.x + q.w * p.x + p.y * q.z - p.z * q.y;
        var ys = p.w * q.y + q.w * p.y + p.z * q.x - p.x * q.z;
        var zs = p.w * q.z + q.w * p.z + p.x * q.y - p.y * q.x;
        var ws = p.w * q.w - Quat.innerDot( p, q );
        return new Quat( xs, ys, zs, ws );
    }

    /**
     * Not a necessary attribute, but could prove to be useful. This is just the
     * starting quaternion that objects will have.
     */
    static identity = new Quat( 0, 0, 0, 1 );

    /**
     * Straight forward comparison of the two input quaternions. Later it would be
     * smart to add in floating point error edge case scenarios.
     * @param {Quat} q1 
     * @param {Quat} q2 
     * @returns true or false depending on if the quaternions are determined to be equal
     */
    static isEqual( q1, q2 ){
        return ( q1.x == q2.x && q1.y == q2.y && q1.z == q2.z && q1.w == q2.w );
    }

    /**
     * Returns the linear interpolation between the two vectors
     * https://docs.unity3d.com/ScriptReference/Vector3.Lerp.html
     * @param {Quat} q1
     * @param {Quat} q2 
     * @param {number} ratio
     */
     static lerp( q1, q2, ratio ){
        return q1.add( Quat.scale(  q2.sub(q1), ratio ) );
    }
}