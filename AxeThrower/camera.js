class Camera{

    /**
     * 
     * @param {vec3} position 
     * @param {number} aspect 
     * @param {number} nearPlane 
     * @param {number} farPlane 
     * @param {number} fov field of view in degrees
     */
    constructor( position = vec4(0, 0, 0, 1), rotation = new Quat( 0, 0, 0, 1), aspect = 1, nearPlane = .01, farPlane = 1000, fov = 30 ){
        this.position = position;
        this.rotation = rotation;
        this.aspect = aspect;
        this.nearPlane = nearPlane;
        this.farPlane = farPlane;
        this.fov = fov * Math.PI / 180.0;
        this.projectionMat = this.constructPerspectiveMat();
        this.cameraMat = this.calculateCameraMatrix();
        this.viewMat = this.calculateViewMatrix();
        this.viewProjectMatrix = mult(this.projectionMat, this.viewMat);
    }

    // aspect = right/top
    // tanfovy = top/near -> invf = near/top
    // invf/aspect = (near/top)/(right/top) = near/right
    constructPerspectiveMat = function(){
        var invf = Math.tan( Math.PI * 0.5 - this.fov*0.5 ); // subtracting half our fov from pi/2 inverts tan(fov/2)
        var invRange = 1.0 / (this.nearPlane - this.farPlane); // the negatives that would be found in the
                                                               // perspective matrix gets absorbed into this
        
        return mat4(
         invf/this.aspect,    0,                                         0,                                         0,
                        0, invf,                                         0,                                         0,
                        0,    0, (this.farPlane + this.nearPlane)*invRange, 2.0*this.nearPlane*this.farPlane*invRange,  // negatives absorbed into the invRange
                        0,    0,                                        -1,                                         0
        );
    }

    calculateCameraMatrix = function(){
        var rotMat = Quat.toMat4(this.rotation);
        var translateMat = mat4(
                        1, 0, 0, this.position[0],
                        0, 1, 0, this.position[1],
                        0, 0, 1, this.position[2],
                        0, 0, 0,               1 
        );
        return mult( rotMat, translateMat );
    }

    calculateViewMatrix = function(){
        return inverse(this.cameraMat);
    }
}