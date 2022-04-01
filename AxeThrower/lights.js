
//https://learnopengl.com/Lighting/Multiple-lights
class BaseLight{

    /**
     * 
     * @param {Vector3} ambient the rgb representing the ambient color
     * @param {Vector3} diffuse the rgb representing the diffuse color
     * @param {Vector3} specular the rgb representing the specular color
     */
    constructor( ambient = new Vector3( 0.0, 0.0, 0.0 ), diffuse = new Vector3( 0.0, 0.0, 0.0 ), specular = new Vector3( 0.0, 0.0, 0.0 ) ){
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
    }

}

class DirectionalLight{

    /**
     * 
     * @param {BaseLight} base the base light class that all lights extend from
     * @param {Vec3} direction quaternion representing the direction it is pointing
     */
    constructor( base = new BaseLight(), direction = new Vec3( 0, -1, 0 ) ){
        this.base = base;
        this.direction = direction.normalized;
    }
}

class PointLight{

    /**
     * 
     * @param {BaseLight} base 
     * @param {Vector3} pos 
     * @param {number} constant 
     * @param {number} linear 
     * @param {number} quadratic 
     */
    constructor( base = BaseLight(), pos = new Vector3( 0.0, 0.0, 0.0 ), constant = 0.0, linear = 0.0, quadratic = 0.0 ){
        this.base = base;
        this.pos = pos;
        this.constant = constant;
        this.linear = linear;
        this.quadratic = quadratic;
    }
}