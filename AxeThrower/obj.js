class OBJ{

    static knownKeywords = [ "#", "v", "vt", "g", "f", "mtllib", "o", "vn", "usemtl", "s" ];

    static parse( objText ){

        var verts = [];
        var textVerts = [];

        var parsedText = objText.replaceAll('\r', '').split("\n");
        for ( var i = 0; i < parsedText.length; i++ ){
            if ( parsedText[i] == "" ) continue;
            var lineParse = parsedText[i].split(' ');
            if ( !OBJ.knownKeywords.includes( lineParse[0] ) ) OBJ.knownKeywords.push( lineParse[0] );

            switch( lineParse[0] ){
                case "v":
                    lineParse.shift();
                    verts.push( new Vector3( lineParse[0], lineParse[1], lineParse[2] ) );
                    break;
                case "vt":
                    lineParse.shift();
                    textVerts.push( new Vector2( lineParse[0], lineParse[1] ) );
                    break;
                case "f":
                    lineParse.shift();
                    for ( var i = 0; i < lineParse.length )
                    break;
            }
        }
        console.log( verts );
        console.log( textVerts );
        return "Yes";
    }

    static readFile( fileName ){
        var http = new XMLHttpRequest();

        http.open( "GET", fileName, false );
        http.send();

        return OBJ.parse(http.responseText);
    }

}