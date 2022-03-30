

class DirectionalLight{

    /**
     * 
     * @param {Vec3} direction quaternion representing the direction it is pointing
     * @param {number} strength the intensity of the light source
     */
    constructor( direction = new Vec3( 0, -1, 0 ), strength = 1.0 ){
        this.direction = direction.normalized;
        this.strength = strength;
    }
}

class PointLight{

}