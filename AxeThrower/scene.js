
class Scene{

    static mainCam;
    static DirectionalLights = [];
    static PointLights = [];
    static MaxDirLights = 5; // This value matches the one in the fragment shader for this
    static MaxPtLights = 10; // This value matches the one in the fragment shader for this

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

    addObject( obj ){
        this.objects.push( obj );
    }
}
