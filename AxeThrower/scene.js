
function Scene(objects = [], camera){
    this.objects = objects;
    this.camera = camera;

    this.update = function(){
        this.objects.forEach( obj => {
            if(typeof obj.update === 'function') {
                obj.update();
            }
        });
    }
}


class wallNorth {
    static getVerts() { 
        var vertices = [ vec4( -50, 0.0,  50, 1.0 ),
                     vec4(  50, 0.0,  50, 1.0 ),
                     vec4(  50, 20,   50, 1.0 ),
                     vec4( -50, 20,   50, 1.0 ) ];
        return vertices;
    }
    static getIndices(){
        var indices = [ 0, 1, 2,
                    0, 2, 3 ];
        return indices;
    }
}

class wallSouth {
    static getVerts() { 
        var vertices = [ vec4( -50, 0.0,  -50, 1.0 ),
                     vec4(  50, 0.0,  -50, 1.0 ),
                     vec4(  50, 20,   -50, 1.0 ),
                     vec4( -50, 20,   -50, 1.0 ) ];
        return vertices;
    }
    static getIndices(){
        var indices = [ 0, 1, 2,
                    0, 2, 3 ];
        return indices;
    }
}

class wallWest{
    static getVerts() { 
        var vertices = [ vec4( -50, 0.0,  -50, 1.0 ),
                     vec4( -50, 0.0,   50, 1.0 ),
                     vec4( -50, 20,    50, 1.0 ),
                     vec4( -50, 20,   -50, 1.0 ) ];
        return vertices;
    }
    static getIndices(){
        var indices = [ 0, 1, 2,
                    0, 2, 3 ];
        return indices;
    }
}

class wallEast{
    static getVerts() { 
        var vertices = [ vec4( 50, 0.0,  -50, 1.0 ),
                     vec4( 50, 0.0,   50, 1.0 ),
                     vec4( 50, 20,    50, 1.0 ),
                     vec4( 50, 20,   -50, 1.0 ) ];
        return vertices;
    }
    static getIndices(){
        var indices = [ 0, 1, 2,
                    0, 2, 3 ];
        return indices;
    }
}

class floor{
    static getVerts() { 
        var vertices = [ vec4( -50, 0.0, -50, 1.0 ),
                     vec4( -50, 0.0,  50, 1.0 ),
                     vec4(  50, 0.0,  50, 1.0 ),
                     vec4(  50, 0.0, -50, 1.0 ) ];
        return vertices;
    }
    static getIndices(){
        var indices = [ 0, 1, 2,
                    0, 2, 3 ];
        return indices;
    }
}