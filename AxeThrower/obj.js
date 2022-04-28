class OBJ{

    static knownKeywords = [];

    static parse( objText ){
        var parsedText = objText.replaceAll('\r', '').split("\n");
        for ( var i = 0; i < parsedText.count; i++ ){
            if ( parsedText[i] == '' ) continue;
            var lineParse = parsedText[i].split(' ');
            console.log(lineParse);
            if ( !OBJ.knownKeywords.includes( lineParse[0] ) ) OBJ.knownKeywords.push( lineParse[0] );
        }
        console.log(  );
    }

    static readFile( fileName ){
        var http = new XMLHttpRequest();

        http.open( "GET", fileName, false );
        http.send();
        return OBJ.parse(http.responseText);
    }

}