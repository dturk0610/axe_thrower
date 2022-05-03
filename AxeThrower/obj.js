class OBJ{

    static knownOBJKeywords = [ "#", "v", "vt", "g", "f", "mtllib", "o", "vn", "usemtl", "s" ];
    static knownMTLKeywords = [ "#", "newmtl", "Ns", "Ka", "Kd", "Ks", "Ke", "Ni", "d", "illum", "map_Kd" ];

    static buildGOFromOBJ( tag, verts = [], textVerts = [], objs = null, norms = null, mat = null ){
        var objsKeys = Object.keys(objs);

        var cameWithNorms = ( norms == null ) ? false : true;
        var midPoint = new Vector4( 0, 0, 0, 0 );
        var retObjs = [];

        var invVertLen = 1.0/verts.length;
        for ( var i = 0; i < verts.length; i++ ){ 
            midPoint = Vector4.add( midPoint, Vector4.scale( invVertLen, verts[i] ) );
        }
        for ( var i = 0; i < verts.length; i++ ){ 
            verts[i] = verts[i].sub( midPoint ); 
        }

        if ( objsKeys.length == 1 ) tag = objs[objsKeys[0]].tag;
        var parentObj = new GameObject( "Parent " + tag, new Vector4( 0, 0, 0, 1 ), Quat.identity, new Vector3( 1, 1, 1 ) );
        retObjs.push(parentObj);

        for (var k = 0; k < objsKeys.length; k++ ){
            var key = objsKeys[k];
            var newGO = new GameObject( objs[key].tag, new Vector4( 0, 0, 0, 1 ), Quat.identity, new Vector3( 1, 1, 1 ) );

            var subVerts = [];
            var subInds = [];
            var subTextCoords = [];
            var subNorms = [];

            var faces = objs[key].faces;
            var ind = 0;
            faces.forEach( currFace =>{
                if ( currFace.length >= 3 ){
                    var numInfo = currFace[0].length;
                    for ( var i = 0; i < currFace.length - 2; i++){
                        var faceVal1 = currFace[0], faceVal2 = currFace[i + 1], faceVal3 = currFace[i + 2];
                        switch ( numInfo ){
                            case 3:
                                subNorms.push( norms[faceVal1[2] - 1], norms[faceVal2[2] - 1], norms[faceVal3[2] - 1] );
                            case 2:
                                subTextCoords.push( textVerts[faceVal1[1] - 1], textVerts[faceVal2[1] - 1], textVerts[faceVal3[1] - 1] );
                            case 1:
                                var vert1 = verts[faceVal1[0] - 1], vert2 = verts[faceVal2[0] - 1], vert3 = verts[faceVal3[0] - 1];
                                subVerts.push( vert1, vert2, vert3 );
                                if ( !cameWithNorms ){
                                    var v = new Vector3( vert1.x, vert1.y, vert1.z );
                                    var u = new Vector3( vert2.x, vert2.y, vert2.z );
                                    var w = new Vector3( vert3.x, vert3.y, vert3.z );
                                    var n = Vector3.cross( Vector3.sub( u, v ), Vector3.sub( w, v ) ).normalized;
                                    subNorms.push( n );
                                }
                            default:
                                subInds.push( ind, ind + i + 1, ind + i + 2 );
                                break;
                        }
                    }
                    ind += currFace.length;
                }
            });
            newGO.mesh = new Mesh( subVerts, subInds, subNorms );
            var material = new Material( baseTextShader, newGO );
            var textImg = ( mat != null ) ? mat[objs[key].usemtl].map_Kd : null;
            newGO.meshRenderer = new MeshRenderer( newGO, material, objTextRenderSetup, objTextRender, subTextCoords, textImg );
            newGO.transform.setParent(parentObj.transform);
            retObjs.push( newGO );
        }
        return retObjs;
    }

    static parse( objText ){

        var tag = "";
        var verts = [];
        var textVerts = [];
        var faces = [];
        var norms = null;
        var mat = null;
        var objs = null;
        var currObj = "";

        var parsedText = objText.replaceAll( '\r', '' ).split( "\n" );
        for ( var i = 0; i < parsedText.length; i++ ){
            if ( parsedText[i] == "" ) continue;
            var lineParse = parsedText[i].split(' ');
            if ( !OBJ.knownOBJKeywords.includes( lineParse[0] ) ) OBJ.knownOBJKeywords.push( lineParse[0] );

            switch( lineParse[0] ){
                case "o":
                    lineParse.shift();
                    if ( objs == null ) objs = {};
                    currObj = lineParse.join(" ");
                    objs[currObj] = {};
                    objs[currObj].tag = currObj;
                    break;
                case "v":
                    lineParse.shift();
                    var vec = new Vector4( parseFloat(lineParse[0]), parseFloat(lineParse[1]), parseFloat(lineParse[2]), 1.0 );
                    verts.push( vec );
                    break;
                case "vt":
                    lineParse.shift();
                    textVerts.push( new Vector2( parseFloat(lineParse[0]), 1-parseFloat(lineParse[1]) ) );
                    break;
                case "vn":
                    lineParse.shift();
                    if ( norms == null ) norms = [];
                    norms.push( new Vector3( lineParse[0], lineParse[1], lineParse[2] ) );
                    break;
                case "f":
                    lineParse.shift();
                    var face = [];
                    lineParse.forEach(element => {
                        var ints = element.split("/");
                        switch ( ints.length ){
                            case 3: face.push( [ parseInt(ints[0]), parseInt(ints[1]), parseInt(ints[2]) ] ); break;
                            case 2: face.push( [ parseInt(ints[0]), parseInt(ints[1]) ] ); break;
                            case 1: face.push( [ parseInt(ints[0]) ] ); break;
                        }
                    });
                    faces.push( face );
                    if ( objs[currObj].faces == null ) objs[currObj].faces = [];
                    objs[currObj].faces.push( face );
                    break;
                case "mtllib":
                    lineParse.shift();
                    if ( mat == null ) mat = {};
                    var mtlFile = OBJ.readFile( "Models/" + lineParse[0] );
                    var parsedMtl = mtlFile.replaceAll("\r", '').split('\n');
                    var currMat = null;

                    for ( var j = 0; j < parsedMtl.length; j++ ){
                        var mtlLineParse = parsedMtl[j].split(' ');
                        if ( !OBJ.knownMTLKeywords.includes( mtlLineParse[0] ) ) OBJ.knownMTLKeywords.push( mtlLineParse[0] );
                        switch (mtlLineParse[0]){
                            case "newmtl":
                                mtlLineParse.shift();
                                currMat = mtlLineParse.join(" ");
                                mat[currMat] = {};
                                break;
                            case "map_Kd":
                                mtlLineParse.shift();
                                mat[currMat].map_Kd = "Models/" + mtlLineParse.join(" ");
                                break;
                        }

                    }
                    break;
                case "usemtl":
                    lineParse.shift();
                    objs[currObj].usemtl = lineParse.join(" ");
                    break;
            }
        }
        //console.log( verts );
        //console.log( textVerts );
        //console.log( faces );
        //console.log(norms);
        //console.log(objs);
        //console.log(Object.keys(objs).length);
        return OBJ.buildGOFromOBJ( tag, verts, textVerts, objs, norms, mat );
    }

    static gameObjectFromOBJ( fileName ){
        return OBJ.parse( OBJ.readFile( fileName ) );
    }

    static readFile( fileName ){
        var http = new XMLHttpRequest();

        http.open( "GET", fileName, false );
        http.send();

        return http.responseText;
    }

}