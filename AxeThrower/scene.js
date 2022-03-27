
class Scene{

    static mainCam;

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

    addObject( obj ){
        this.objects.push( obj );
    }
}
