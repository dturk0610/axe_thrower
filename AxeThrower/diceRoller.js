class DiceRoller{

    constructor( diceObj ){
        this.diceObj = diceObj;
        this.timeLeftToRoll = 10000;
        this.startTime = Date.now();
        this.lerpSpeed = .1;
        this.hitNum = 5;
        var randX = Math.random() * 2 - 1;
        var randY = Math.random() * 2 - 1;
        var randZ = Math.random() * 2 - 1;
        var randVec = new Vector3( randX, randY, randZ ).normalized;
        var randAngle = Math.random() * 360 - 180;
        this.newRot = Quat.fromAxisAndAngle( randVec, randAngle );
    }

    update(){
        this.diceObj.transform.rotation = Quat.lerp( this.diceObj.transform.rotation, this.newRot, this.lerpSpeed );
        if ( Quat.sub( this.diceObj.transform.rotation, this.newRot ).magnitude < .2 ){
            this.hitNum--;
            var randX = Math.random() * 2 - 1;
            var randY = Math.random() * 2 - 1;
            var randZ = Math.random() * 2 - 1;
            var randVec = new Vector3( randX, randY, randZ ).normalized;
            var randAngle = Math.random() * 360 - 180;
            this.newRot = Quat.fromAxisAndAngle( randVec, randAngle );
        }
        if ( this.hitNum <= 0 || Date.now() - this.startTime > this.timeLeftToRoll ){
            var indToDelete = myScene.objects.findIndex( elem => typeof ( elem.timeLeftToRoll ) === undefined );
            myScene.objects.splice( indToDelete, 1 );
            delete this;
        }
    }


}