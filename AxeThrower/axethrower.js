
var pullBackQuat = Quat.fromAxisAndAngle( new Vector3( 1, 0, 0 ), -15 );
var startQuat = Quat.identity;
function prepareToThrow( timeDelta ){
    var lerpSpeed = 6.0;
    if ( !holdingAxe ) return;
    drawLine();
    var wantedRot = Quat.mult( startQuat, pullBackQuat )
    axeBeingHeld.transform.rotation = Quat.lerp( axeBeingHeld.transform.rotation, wantedRot, timeDelta*lerpSpeed );
}

function stopThrow(){
    axeBeingHeld.transform.position = prevPos;
    axeBeingHeld.transform.rotation = prevRot;
    axeBeingHeld.transform.scale = prevScale;
    delete axeBeingHeld.transform.parent;
    holdingAxe = false;
    tryDestoryLine();
}

var needToThrow = false;
var vertInd = 0;
var vertsToFollow = [];
var axeBeingThrown = null;
var rightVec = new Vector3( 1, 0, 0 );
function throwAxe(){
    if ( !holdingAxe || !lineExists ) return;
    needToThrow = true;
    vertInd = 0;
    var lineRendererGO = myScene.getObjectWithTag("Line");
    vertsToFollow = Matrix.vecArrMatMult( lineRendererGO.lineRenderer.verts, lineRendererGO.transform.worldMat);
    var currAxeRot = Quat.mult( axeBeingHeld.transform.rotation, axeBeingHeld.transform.parent.rotation );
    rightVec = Scene.mainCam.transform.rightVec;
    delete axeBeingHeld.transform.parent;
    axeBeingHeld.transform.rotation = currAxeRot;
    holdingAxe = false;
    axeBeingThrown = axeBeingHeld;
    axeBeingHeld = null;
    var newThrower = new Thrower( vertsToFollow, axeBeingThrown, rightVec );
    myScene.addObject( newThrower );
    tryDestoryLine();
}

class Thrower{

    static numInScene = 0;

    constructor( vertsToFollow, axeBeingThrown, rightVec ){
        this.vertsToFollow = vertsToFollow;
        this.axeBeingThrown = axeBeingThrown;
        this.rightVec = rightVec;
        this.vertInd = 0;
        this.sceneNum = Thrower.numInScene % 3;
        Thrower.numInScene += 1
    }

    update(){
        this.axeBeingThrown.transform.position = this.vertsToFollow[this.vertInd];
        var currRot = this.axeBeingThrown.transform.rotation;
        currRot = Quat.mult( currRot, Quat.fromAxisAndAngle( this.rightVec, 10 ) );
        this.axeBeingThrown.transform.rotation = currRot;
        this.vertInd += 1;
        if ( this.vertInd >= this.vertsToFollow.length - 1 ) {
            var indToDelete = myScene.objects.findIndex( elem => typeof (elem.sceneNum) !== undefined && elem.sceneNum == this.sceneNum );
            myScene.objects.splice( indToDelete, 1 );
            delete this;

            const impactAudio = document.getElementById("impact");
            const newAudio = impactAudio.cloneNode();
            newAudio.volume = 1;
            newAudio.currentTime = .27;
            newAudio.play()
        }
    }

}

function updateThrow(){
    // if ( !needToThrow ) return;
    // axeBeingThrown.transform.position = vertsToFollow[vertInd];
    // var currRot = axeBeingThrown.transform.rotation;
    // currRot = Quat.mult( currRot, Quat.fromAxisAndAngle( rightVec, 10 ) );
    // axeBeingThrown.transform.rotation = currRot;
    // vertInd += 1;
    // if ( vertInd >= vertsToFollow.length - 1 ) needToThrow = false;
}

var holdingAxe = false;
var axeBeingHeld = null;
var prevPos = new Vector4( 0, 0, 0, 1 );
var prevRot = new Quat( 0, 0, 0, 1 );
var prevScale = new Vector3( 1, 1, 1 );
function pickUpDropClosestAxe(){
    
    if ( !holdingAxe ){
        var allAxes = myScene.getObjectsWithTag("Parent Axe");
        var wantedAxe = allAxes[0];
        var prevDist = Vector4.sub( wantedAxe.transform.position, myScene.camera.transform.position ).magnitude;
        allAxes.forEach( axe => {
            var currDist = Vector4.sub( axe.transform.position, myScene.camera.transform.position ).magnitude
            if (  currDist < prevDist ){
                wantedAxe = axe;
                prevDist = currDist;
            }
        });
        if ( prevDist > 1.5 ) wantedAxe = null;
        if ( wantedAxe == null ) return false;
        prevPos = wantedAxe.transform.position;
        prevRot = wantedAxe.transform.rotation;
        prevScale = wantedAxe.transform.scale;
        wantedAxe.transform.setParent(myScene.camera.transform);
        var uprightQuat = Quat.fromAxisAndAngle( new Vector3( 1, 0, 0 ), -90 );
        var fwdQuat = Quat.fromAxisAndAngle( new Vector3( 0, 1, 0 ), -90 );
        wantedAxe.transform.rotation = Quat.mult( uprightQuat, fwdQuat );
        wantedAxe.transform.position = new Vector4( .2, -.05, -.25, 1);
        axeBeingHeld = wantedAxe;
        startQuat = axeBeingHeld.transform.rotation;
        holdingAxe = true;

        const pickupAudio = document.getElementById("axePickup");
        const newAudio = pickupAudio.cloneNode();
        newAudio.volume = .1;
        newAudio.play()

        return true;
    }else{
        stopThrow();
        return true;
    }
}


function calculateThrowPoints(){
    var camPos = Scene.mainCam.transform.position;
    var rayDir = Scene.mainCam.transform.fwdVec.normalized;
    var allQuads = myScene.getObjectsWithTag("Quad");
    var bestWall = allQuads[0];
    var pointOnWall = null;
    allQuads.forEach( go => {
        var thisQuad = go.quad;
        var pointOnPlane = thisQuad.whereRayIntersects( camPos, rayDir );
        if ( pointOnPlane != null ) {
            var reprojectPointOnQuad = Matrix.vecMatMult( pointOnPlane, Matrix.inverseM4x4( go.transform.worldMat ) );
            if ( Math.abs( reprojectPointOnQuad.x ) < thisQuad.width*.5 && Math.abs( reprojectPointOnQuad.z ) < thisQuad.depth*.5 ){
                bestWall = go;
                pointOnWall = pointOnPlane;
            }
        }
    });
    if ( pointOnWall != null ){
        var diff = Vector4.sub( pointOnWall, axeBeingHeld.transform.worldPosition);
        var dist = diff.magnitude;
        var dir = diff.normalized;
        var up = Scene.mainCam.transform.upVec;
        var increase = dist/3;
        var liftAmt = 1 - Vector3.dot( dir, new Vector3( 0, -1, 0 ) );
        var p0 = new Vector4( 0, 0, 0, 1);
        var p1 = Vector4.add( Vector4.add( p0, Vector4.scale(   increase, dir ) ), Vector4.scale( liftAmt, up ) );
        var p2 = Vector4.add( Vector4.add( p0, Vector4.scale( 2*increase, dir ) ), Vector4.scale( liftAmt, up ) );
        var p3 = diff;
        return [ p0, p1, p2, p3 ];
    }
    return [];
}

var lineExists = false;
function drawLine(){
    if ( !lineExists ){
        var fwd = Scene.mainCam.transform.fwdVec;
        var up = Scene.mainCam.transform.upVec;
        var points = calculateThrowPoints();
        if ( points.length == 0 ) { tryDestoryLine(); return; }
        var p0 = points[0];//new Vector4( 0, 0, 0, 1);
        var p1 = points[1];//Vector4.add( p0, Vector4.add( Vector4.scale( 1, fwd ), Vector4.scale( .5, up ) ) );
        var p2 = points[2];//Vector4.add( p0, Vector4.add( Vector4.scale( 2, fwd ), Vector4.scale( .5, up ) ) );
        var p3 = points[3];//Vector4.add( p0, Vector4.scale( 3, fwd ) );
        var testObj = new GameObject( "Line", axeBeingHeld.transform.worldPosition, Quat.identity, new Vector3( 1, 1, 1 ) );
        var lineRender = new LineRenderer( p0, p1, p2, p3, lineShader, testObj );
        testObj.lineRenderer = lineRender;
        myScene.addObject(testObj);
        lineExists = true;
    }
    else{
        var fwd = Scene.mainCam.transform.fwdVec;
        var up = Scene.mainCam.transform.upVec;
        var points = calculateThrowPoints();
        if ( points.length == 0 ){ tryDestoryLine(); return; }
        var p0 = points[0];//new Vector4( 0, 0, 0, 1);
        var p1 = points[1];//Vector4.add( p0, Vector4.add( Vector4.scale( 1, fwd ), Vector4.scale( .5, up ) ) );
        var p2 = points[2];//Vector4.add( p0, Vector4.add( Vector4.scale( 2, fwd ), Vector4.scale( .5, up ) ) );
        var p3 = points[3];//Vector4.add( p0, Vector4.scale( 3, fwd ) );
        var lineObj = myScene.getObjectWithTag("Line");
        lineObj.lineRenderer.updateCPs( p0, p1, p2, p3 );
        lineObj.transform.position = axeBeingHeld.transform.worldPosition;
    }
}

function tryDestoryLine(){
    if ( myScene.getObjectWithTag( "Line" ) != null ){
        var lineInd = myScene.objects.findIndex( obj => obj.tag == "Line" );
        myScene.objects.splice( lineInd, 1 );
        lineExists = false;
    }
}
