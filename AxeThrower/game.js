var gl;
var h, w, invh, invw;
var myScene;
var pastTime;

var floorShader, lightShader;
var baseShader;

function init(){
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    h = parseFloat(canvas.height); invh = 1.0/h;
    w = parseFloat(canvas.width); invw = 1.0/w;

    window.addEventListener("keydown", onKeyDown, false);
    window.addEventListener("keyup", onKeyUp, false);

    canvas.addEventListener("mousedown", function(e) { tryClick(canvas, e); }); 
    canvas.addEventListener("mouseup", function(e) { endClick(canvas, e); }); 
    canvas.addEventListener("mousemove", function(e) { mouseMove(canvas, e); });
    canvas.addEventListener("mouseout", function(e) { endClick(canvas, e); });
    

    setupGL();
    setupScene();
    requestAnimationFrame( drawScene );

};

function setupGL(){
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.viewport( 0, 0, w, h );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    MeshRenderer.setGL(gl);
    
    baseShader = initShaders( gl, baseVert, baseFrag );
    baseTextShader = initShaders( gl, baseTextVert, baseTextFrag );
}


function setupScene(){
    var aspect = w/h;

    var cam = new Camera( new Vector4( 0, 1, 0, 1 ), new Quat( 0, 0, 0, 1 ), aspect, .01, 1000, 60, -1*aspect, 1*aspect, 1, -1 );
    myScene = new Scene( cam );

    var dir1Base = new BaseLight( new Vector3( 0.2, 0.2, 0.2 ), new Vector3( 0.5, 0.5, 0.5 ), new Vector3( 1.0, 1.0, 1.0 ) );
    var dirLight1 = new DirectionalLight( dir1Base, new Vector3( 1, -1, 0 ) );
    Scene.AddDirLight( dirLight1 );

    var dir2Base = new BaseLight( new Vector3( 0.1, 0.1, 0.1 ), new Vector3( 0.3, 0.2, 0.3 ), new Vector3( 1.0, 1.0, 1.0 ) );
    var dirLight2 = new DirectionalLight( dir2Base, new Vector3( 1, -1, -1 ) );
    Scene.AddDirLight( dirLight2 );

    var dir3Base = new BaseLight( new Vector3( 0.1, 0.1, 0.1 ), new Vector3( 0.3, 0.2, 0.3 ), new Vector3( 1.0, 1.0, 1.0 ) );
    var dirLight3 = new DirectionalLight( dir3Base, new Vector3( -1, -1, 1 ) );
    Scene.AddDirLight( dirLight3 );

    var pt1Base = new BaseLight( new Vector3( 0.1, 0.1, 0.1 ), new Vector3( 0.3, 0.2, 0.3 ), new Vector3( 1.0, 1.0, 1.0 ) );
    var ptLight1 = new PointLight( pt1Base, new Vector3( 2.0, 0.5, -4.5 ), 0.05, 0.04, 0.3 );
    Scene.AddPtLight( ptLight1 );
    
    var pt2Base = new BaseLight( new Vector3( 0.1, 0.1, 0.1 ), new Vector3( 0.3, 0.2, 0.3 ), new Vector3( 1.0, 1.0, 1.0 ) );
    var ptLight2 = new PointLight( pt2Base, new Vector3( -3.5, 1.0, -3.5 ), 0.5, 0.2, 1.0 );
    Scene.AddPtLight( ptLight2 );
    
    var pt3Base = new BaseLight( new Vector3( 0.1, 0.1, 0.1 ), new Vector3( 0.3, 0.2, 0.3 ), new Vector3( 1.0, 1.0, 1.0 ) );
    var ptLight3 = new PointLight( pt3Base, new Vector3( 4.5, 1.0, 4.5 ), 0.5, 0.2, 1.0 );
    Scene.AddPtLight( ptLight3 );



    var brownCol = new Vector4( 15.0/256.0, 50.0/256.0, 10.0/256.0, 1.0 );
    var floor = new Quad( 10, 10, new Vector4( 0, 0, 0, 1), new Quat( 0, 0, 0, 1 ), new Vector3( 1, 1, 1 ) );
    var basicMaterial = new Material( baseShader, floor, brownCol, brownCol, undefined, 10000.0 );
    floor.meshRenderer = new MeshRenderer( floor, basicMaterial, baseRenderSetup, baseRender );
    myScene.addObject( floor );

    var wall1 = new Quad( 10, 2, new Vector4(  0, 1, 5, 1), Quat.fromAxisAndAngle( new Vector3( 1, 0, 0 ), 90 ), new Vector3( 1, 1, 1 ) );
    var basicMaterial = new Material( baseShader, wall1, brownCol, undefined, undefined, 10.0 );
    wall1.meshRenderer = new MeshRenderer( wall1, basicMaterial, baseRenderSetup, baseRender );
    myScene.addObject( wall1 );

    var yTurn = Quat.fromAxisAndAngle( new Vector3( 0, 1, 0 ), 90 );
    var zTurn = Quat.fromAxisAndAngle( new Vector3( 0, 0, -1 ), 90 );
    var wall2 = new Quad( 10, 2, new Vector4(  5, 1, 0, 1), Quat.mult( yTurn, zTurn ), new Vector3( 1, 1, 1 ) ); 
    var basicMaterial = new Material( baseShader, wall2, brownCol );
    wall2.meshRenderer = new MeshRenderer( wall2, basicMaterial, baseRenderSetup, baseRender );
    myScene.addObject( wall2 );

    var wall3 = new Quad( 10, 2, new Vector4(  0, 1, -5, 1), Quat.fromAxisAndAngle( new Vector3( -1, 0, 0 ), 90 ), new Vector3( 1, 1, 1 ) );
    var basicMaterial = new Material( baseShader, wall3, brownCol );
    wall3.meshRenderer = new MeshRenderer( wall3, basicMaterial, baseRenderSetup, baseRender );
    myScene.addObject( wall3 );

    var yTurn = Quat.fromAxisAndAngle( new Vector3( 0, 1, 0 ), 90 );
    var zTurn = Quat.fromAxisAndAngle( new Vector3( 0, 0, 1 ), 90 );
    var wall4 = new Quad( 10, 2, new Vector4( -5, 1, 0, 1), Quat.mult( yTurn, zTurn ), new Vector3( 1, 1, 1 ) );
    var basicMaterial = new Material( baseShader, wall4, brownCol );
    wall4.meshRenderer = new MeshRenderer( wall4, basicMaterial, baseRenderSetup, baseRender );
    myScene.addObject( wall4 );


    var chair = new GameObject( "chair", new Vector4( 0, .45, -4, 1 ), Quat.identity, new Vector3( .02, .02, .02 ) );
    chair.mesh = new Mesh( getChairVertices(), getChairFaces() );
    var basicMaterial = new Material( baseShader, chair );
    chair.meshRenderer = new MeshRenderer( chair, basicMaterial, baseRenderSetup, baseRender );
    myScene.addObject( chair );

    var dice = new GameObject( "die", new Vector4( 0, 1, -1, 1 ), Quat.identity, new Vector3( .1, .1, .1 ) );
    dice.mesh = new Mesh( getIcosaVerts(), getIcosaFaces() );
    var basicTextMaterial = new Material( baseTextShader, dice, new Vector3( 1, 0, 0 ), new Vector3( .8, 0, 0 ), new Vector3( 0, 0, 1 ), 10 );
    dice.meshRenderer = new MeshRenderer( dice, basicTextMaterial, baseTextRenderSetup, baseTextRender );
    myScene.addObject( dice );


}

function drawScene( now ){

    now *= 0.001;
    if (pastTime === undefined){ pastTime = now; }
    var timeDelta = now - pastTime;
    var cam = myScene.camera;

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    myScene.objects.forEach( obj => {
        if (obj.meshRenderer !== undefined){
            obj.meshRenderer.render();
        }        
    });


    cam.update( timeDelta );
    if (holdingE){ 
        var chairObj = myScene.getObjectWithTag( "chair" );
        Scene.mainCam.lookAt( chairObj.transform.position );
    }


    pastTime = now;
    requestAnimationFrame(drawScene);
}

var mouseDown = false;
var mouseDownPos = new Vector2( 0, 0 ); 
function tryClick( canvas, event ){
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = rect.height - (event.clientY - rect.top);
    mouseDownPos = new Vector2( x, y );
    mouseDown = true;
}

// found a good way to handle this here:
//https://gamedev.stackexchange.com/questions/30644/how-to-keep-my-quaternion-using-fps-camera-from-tilting-and-messing-up/30669#30669
var turnAmount = .6;
function mouseMove( canvas, event ){
    if (mouseDown){
        var cam = myScene.camera;
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = rect.height - (event.clientY - rect.top);
        var xDiff = parseFloat( x - mouseDownPos.x );
        var yDiff = parseFloat( y - mouseDownPos.y );
        //pitch +=  * turnAmount;
        
        var currRot = cam.transform.rotation;
        var currRight = cam.transform.rightVec;
        var xRotAmountMat = Quat.fromAxisAndAngle( currRight, -turnAmount*yDiff );
        currRot = Quat.mult( currRot, xRotAmountMat );
        var yRotAmountMat = Quat.fromAxisAndAngle( new Vector3( 0, 1, 0 ), turnAmount*xDiff );
        currRot = Quat.mult( currRot, yRotAmountMat );

        cam.transform.rotation = currRot;

        //cam.update();
        mouseDownPos = new Vector2( x, y );
    }
}

function endClick( canvas, event ){
    if (mouseDown){
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = rect.height - (event.clientY - rect.top);
        mouseDown = false;
    }
}

var holdingE = false;
function onKeyDown(event) {
    var rightVec = myScene.camera.transform.rightVec;
    var fwdVec = myScene.camera.transform.fwdVec; // To actually move forward we need the negative of this
    var totDir = new Vector3( 0, 0, 0 );
    var keyCode = event.keyCode;
    switch (keyCode) {
        case 87: totDir.x += fwdVec.x;    totDir.y += fwdVec.y;     totDir.z += fwdVec.z;     break; // w
        case 65: totDir.x -= rightVec.x;  totDir.y -= rightVec.y;   totDir.z -= rightVec.z;   break; // a
        case 83: totDir.x -= fwdVec.x;    totDir.y -= fwdVec.y;     totDir.z -= fwdVec.z;     break; // s
        case 68: totDir.x += rightVec.x;  totDir.y += rightVec.y;   totDir.z += rightVec.z;   break; // d 
        case 79: Scene.mainCam.orthoOn = !Scene.mainCam.orthoOn; break; // o
        case 76: Scene.ToggleSpec(); break; // l
        case 69: holdingE = true; break;// e
        case 49: Scene.toggleLight(1); break; // 1
        case 50: Scene.toggleLight(2); break; // 2
        case 51: Scene.toggleLight(3); break; // 3
        case 52: Scene.toggleLight(4); break; // 4
        case 53: Scene.toggleLight(5); break; // 5
        case 54: Scene.toggleLight(6); break; // 6
        case 55: var dice = myScene.getObjectWithTag('die'); dice.transform.rotation = Quat.mult( dice.transform.rotation, Quat.fromAxisAndAngle( new Vector3( 1, 0, 0 ), 5.0) ); dice.update(); break; // 7
        case 56: var dice = myScene.getObjectWithTag('die'); dice.transform.rotation = Quat.mult( dice.transform.rotation, Quat.fromAxisAndAngle( new Vector3( 0, 1, 0 ), 5.0) ); dice.update(); break; // 8
        case 57: var dice = myScene.getObjectWithTag('die'); dice.transform.rotation = Quat.mult( dice.transform.rotation, Quat.fromAxisAndAngle( new Vector3( 0, 0, 1 ), 5.0) ); dice.update(); break; // 9
    }

    if ( totDir.x != 0 || totDir.y != 0 || totDir.z != 0 ){
        totDir = totDir.normalized;
        myScene.camera.move( totDir );
    }
}

function onKeyUp(event) {
    var keyCode = event.keyCode;
    switch (keyCode) {
        case 69: holdingE = false; break;
    }
}
