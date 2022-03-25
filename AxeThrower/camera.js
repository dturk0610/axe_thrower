class Camera{

    /**
     * 
     * @param {vec3} position 
     * @param {number} aspect 
     * @param {number} nearPlane 
     * @param {number} farPlane 
     * @param {number} fov field of view in degrees
     */
    constructor( position = vec4( 0.0, 0.0, 10.0, 1.0 ), rotation = new Quat( 0.0, 0.0, 0.0, 1.0 ), aspect = 1, nearPlane = .01, farPlane = 1000.0, fov = 30 ){
        this.transform = new Transform( position, rotation );
        this.aspect = aspect;
        this.nearPlane = nearPlane;
        this.farPlane = farPlane;
        this.fov = fov * Math.PI / 180.0;
        this.projectionMat = this.constructPerspectiveMat();
        this.cameraToWorldMatrix = this.calculateCameraMatrix();
        this.viewMat = this.calculateViewMatrix();
    }

    // aspect = right/top
    // tanfovy = top/near -> invf = near/top
    // invf/aspect = (near/top)/(right/top) = near/right
    constructPerspectiveMat = function(){
        var invf = Math.tan( Math.PI * 0.5 - this.fov*0.5 ); // subtracting half our fov from pi/2 inverts tan(fov/2)
        var invRange = 1.0 / (this.nearPlane - this.farPlane); // the negatives that would be found in the
                                                               // perspective matrix gets absorbed into this
        
        return [
            invf/this.aspect,  0.0,                                       0.0,  0.0,
                         0.0, invf,                                       0.0,  0.0,
                         0.0,  0.0, (this.farPlane + this.nearPlane)*invRange, -1.0,  // negatives absorbed into the invRange
                         0.0,  0.0, 2.0*this.nearPlane*this.farPlane*invRange,  0.0
        ];
    }

    calculateCameraMatrix = function(){
        var rotMat = Quat.toMat4(this.transform.rotation);
        var translateMat = [
                                     1,                          0,                          0, 0,
                                     0,                          1,                          0, 0,
                                     0,                          0,                          1, 0,
            this.transform.position[0], this.transform.position[1], this.transform.position[2], 1 
        ];
        return Matrix.mult4x4( translateMat, rotMat );
    }

    calculateViewMatrix = function(){
        return Matrix.inverseM4x4(this.cameraToWorldMatrix);
    }

    move( dir ){
        
    } 

    update(){
        this.cameraToWorldMatrix = this.calculateCameraMatrix();
        this.viewMat = this.calculateViewMatrix();
        this.transform.updateRotation();
    }

    moveForward(){
        var moveAmount = .1;
        var fwd = this.transform.fwdVec;
        this.transform.position[0] -= fwd[0] * moveAmount;
        //this.transform.position[1] -= fwd[1] * moveAmount;
        this.transform.position[2] -= fwd[2] * moveAmount;
        this.update();
    }
}