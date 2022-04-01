
class Scene{

    static mainCam;
    static DirectionalLights = [];
    static PointLights = [];
    static MaxDirLights = 5; // This value matches the one in the fragment shader for this
    static MaxPtLights = 10; // This value matches the one in the fragment shader for this
    static useSpecular = true;

    constructor( camera, objects = [] ){
        this.objects = objects;
        this.camera = camera;
        Scene.mainCam = camera;

        this.update = function(){
            this.objects.forEach( obj => {
                if(typeof obj.update === 'function') {
                    obj.update();
                }
            });
        }
    }

    static AddDirLight( dirLight ){
        if ( Scene.DirectionalLights.length < Scene.MaxDirLights ){
            Scene.DirectionalLights.push( dirLight );
        }
        else { alert("Tried adding too many directional lights!"); }
    }

    static GetDirLights(){
        return Scene.DirectionalLights;
    }

    static AddPtLight( ptLight ){
        if ( Scene.PointLights.length < Scene.MaxPtLights ){
            Scene.PointLights.push( ptLight );
        }
        else { alert("Tried adding too many point lights!"); }
    }

    static GetPtLights(){
        return Scene.PointLights;
    }

    /**
     * 
     * @param {string} tag the name of the object when loaded in scene
     * @returns the first object with a tag matching the one passed in
     */
    getObjectWithTag( tag ){
        for (var i = 0; i < this.objects.length; i++){
            var currObj = this.objects[i];
            if ( currObj.tag == tag ) return currObj;
        }
    }

    addObject( obj ){
        this.objects.push( obj );
    }

    static ToggleSpec(){
        Scene.useSpecular = !Scene.useSpecular;
    }
}
