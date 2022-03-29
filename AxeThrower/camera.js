class Camera{

    /**
     * 
     * @param {Vector4} position 
     * @param {number} aspect 
     * @param {number} nearPlane 
     * @param {number} farPlane 
     * @param {number} fov field of view in degrees
     */
    constructor( position = Vector4( 0.0, 0.0, 10.0, 1.0 ), rotation = new Quat( 0.0, 0.0, 0.0, 1.0 ), aspect = 1, nearPlane = .01, farPlane = 1000.0, fov = 30, left = -0.5, right = 0.5, top = 0.5, bottom = -0.5 ){
        this.transform = new Transform( position, rotation );
        this.aspect = aspect;
        this.nearPlane = nearPlane;
        this.farPlane = farPlane;
        this.fov = fov * Math.PI / 180.0;
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
        this.projectionMat = this.constructPerspectiveMat();
        this.orthoMat = this.constructOthoMat();
        this.cameraToWorldMatrix = this.calculateCameraMatrix();
        this.viewMat = this.calculateViewMatrix();
        this.orthoOn = false;
    }

    // aspect = right/top
    // tanfovy = top/near -> invf = near/top
    // invf/aspect = (near/top)/(right/top) = near/right
    constructPerspectiveMat(){
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

    constructOthoMat(){
        var invRminL = 1 / ( this.right - this.left );
        var invTminB = 1 / ( this.top - this.bottom );
        var invFminN = 1 / ( this.farPlane - this.nearPlane );
        var LplusR = this.left + this.right;
        var TplusB = this.top + this.bottom;
        var FplusN = this.farPlane + this.nearPlane;
       return [
                  2*invRminL,                0,                0, 0,
                           0,       2*invTminB,                0, 0,
                           0,                0,      -2*invFminN, 0,
            -LplusR*invRminL, -TplusB*invTminB, -FplusN*invFminN,1
       ];
    }

    calculateCameraMatrix(){
        var rotMat = Quat.toMat4(this.transform.rotation);
        var translateMat = [
                                     1,                          0,                          0, 0,
                                     0,                          1,                          0, 0,
                                     0,                          0,                          1, 0,
             this.transform.position.x,  this.transform.position.y,  this.transform.position.z, 1 
        ];
        return Matrix.mult4x4( translateMat, rotMat );
    }

    calculateViewMatrix(){
        return Matrix.inverseM4x4(this.cameraToWorldMatrix);
    }

    move( dir ){
        // we are ignoring the y direction so we don't fly away to space
        var moveAmount = .1;
        this.transform.position.x += dir.x * moveAmount;
        this.transform.position.z += dir.z * moveAmount;
        this.update();
    } 

    update(){
        this.cameraToWorldMatrix = this.calculateCameraMatrix();
        this.viewMat = this.calculateViewMatrix();
        this.transform.updateRotation();
    }
}