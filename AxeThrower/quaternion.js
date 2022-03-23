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
        angle = angle * Math.PI / 180.0;
        axis = normalize(axis); // makes sure that the axis is truly normalized
        this.x = axis[0] * Math.sin( angle/2 );
        this.y = axis[1] * Math.sin( angle/2 );
        this.z = axis[2] * Math.sin( angle/2 );
        this.w = Math.cos( angle/2 );
    }

    /**
     * https://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToMatrix/index.htm
     * @param {Quat} q 
     */
    static toMat4( q ){
        var mat1 = mat4(
            [  q.w,  q.z, -q.y, q.x ],
            [ -q.z,  q.w,  q.x, q.y ],
            [  q.y, -q.x,  q.w, q.z ],
            [ -q.x, -q.y, -q.z, q.w ]
        );
        var mat2 = mat4(
            [  q.w,  q.z, -q.y, -q.x ],
            [ -q.z,  q.w,  q.x, -q.y ],
            [  q.y, -q.x,  q.w, -q.z ],
            [  q.x,  q.y,  q.z,  q.w ]
        );
        return mult( mat1, mat2 );
    }
}