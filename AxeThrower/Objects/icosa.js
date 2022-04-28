
function getIcosaVerts(){
    var phi = ( 1 + Math.sqrt( 5 ) ) * 0.5;
    var icosaVerts = [  
        new Vector4(  0.0,  1.0,  phi, 1.0 ), // Top-Front     0
        new Vector4(  0.0,  1.0,  phi, 1.0 ), // Top-Front     0
        new Vector4(  0.0,  1.0,  phi, 1.0 ), // Top-Front     0
        new Vector4(  0.0,  1.0,  phi, 1.0 ), // Top-Front     0
        new Vector4(  0.0,  1.0,  phi, 1.0 ), // Top-Front     0

        new Vector4(  0.0,  1.0, -phi, 1.0 ), // Top-Back      1
        new Vector4(  0.0,  1.0, -phi, 1.0 ), // Top-Back      1
        new Vector4(  0.0,  1.0, -phi, 1.0 ), // Top-Back      1
        new Vector4(  0.0,  1.0, -phi, 1.0 ), // Top-Back      1
        new Vector4(  0.0,  1.0, -phi, 1.0 ), // Top-Back      1

        new Vector4(  0.0, -1.0,  phi, 1.0 ), // Bottom-Front  2
        new Vector4(  0.0, -1.0,  phi, 1.0 ), // Bottom-Front  2
        new Vector4(  0.0, -1.0,  phi, 1.0 ), // Bottom-Front  2
        new Vector4(  0.0, -1.0,  phi, 1.0 ), // Bottom-Front  2
        new Vector4(  0.0, -1.0,  phi, 1.0 ), // Bottom-Front  2

        new Vector4(  0.0, -1.0, -phi, 1.0 ), // Bottom-Back   3
        new Vector4(  0.0, -1.0, -phi, 1.0 ), // Bottom-Back   3
        new Vector4(  0.0, -1.0, -phi, 1.0 ), // Bottom-Back   3
        new Vector4(  0.0, -1.0, -phi, 1.0 ), // Bottom-Back   3
        new Vector4(  0.0, -1.0, -phi, 1.0 ), // Bottom-Back   3

        new Vector4(  1.0,  phi,  0.0, 1.0 ), // Right-Top     4
        new Vector4(  1.0,  phi,  0.0, 1.0 ), // Right-Top     4
        new Vector4(  1.0,  phi,  0.0, 1.0 ), // Right-Top     4
        new Vector4(  1.0,  phi,  0.0, 1.0 ), // Right-Top     4
        new Vector4(  1.0,  phi,  0.0, 1.0 ), // Right-Top     4

        new Vector4(  1.0, -phi,  0.0, 1.0 ), // Right-Bottom  5
        new Vector4(  1.0, -phi,  0.0, 1.0 ), // Right-Bottom  5
        new Vector4(  1.0, -phi,  0.0, 1.0 ), // Right-Bottom  5
        new Vector4(  1.0, -phi,  0.0, 1.0 ), // Right-Bottom  5
        new Vector4(  1.0, -phi,  0.0, 1.0 ), // Right-Bottom  5

        new Vector4( -1.0,  phi,  0.0, 1.0 ), // Left-Top      6
        new Vector4( -1.0,  phi,  0.0, 1.0 ), // Left-Top      6
        new Vector4( -1.0,  phi,  0.0, 1.0 ), // Left-Top      6
        new Vector4( -1.0,  phi,  0.0, 1.0 ), // Left-Top      6
        new Vector4( -1.0,  phi,  0.0, 1.0 ), // Left-Top      6

        new Vector4( -1.0, -phi,  0.0, 1.0 ), // Left-Bottom   7
        new Vector4( -1.0, -phi,  0.0, 1.0 ), // Left-Bottom   7
        new Vector4( -1.0, -phi,  0.0, 1.0 ), // Left-Bottom   7
        new Vector4( -1.0, -phi,  0.0, 1.0 ), // Left-Bottom   7
        new Vector4( -1.0, -phi,  0.0, 1.0 ), // Left-Bottom   7

        new Vector4(  phi,  0.0,  1.0, 1.0 ), // Right-Front   8
        new Vector4(  phi,  0.0,  1.0, 1.0 ), // Right-Front   8
        new Vector4(  phi,  0.0,  1.0, 1.0 ), // Right-Front   8
        new Vector4(  phi,  0.0,  1.0, 1.0 ), // Right-Front   8
        new Vector4(  phi,  0.0,  1.0, 1.0 ), // Right-Front   8
        
        new Vector4( -phi,  0.0,  1.0, 1.0 ), // Left-Front    9
        new Vector4( -phi,  0.0,  1.0, 1.0 ), // Left-Front    9
        new Vector4( -phi,  0.0,  1.0, 1.0 ), // Left-Front    9
        new Vector4( -phi,  0.0,  1.0, 1.0 ), // Left-Front    9
        new Vector4( -phi,  0.0,  1.0, 1.0 ), // Left-Front    9
        
        new Vector4(  phi,  0.0, -1.0, 1.0 ), // Right-Back    10
        new Vector4(  phi,  0.0, -1.0, 1.0 ), // Right-Back    10
        new Vector4(  phi,  0.0, -1.0, 1.0 ), // Right-Back    10
        new Vector4(  phi,  0.0, -1.0, 1.0 ), // Right-Back    10
        new Vector4(  phi,  0.0, -1.0, 1.0 ), // Right-Back    10
        
        new Vector4( -phi,  0.0, -1.0, 1.0 ),// Left-Back     11
        new Vector4( -phi,  0.0, -1.0, 1.0 ),// Left-Back     11
        new Vector4( -phi,  0.0, -1.0, 1.0 ),// Left-Back     11
        new Vector4( -phi,  0.0, -1.0, 1.0 ),// Left-Back     11
        new Vector4( -phi,  0.0, -1.0, 1.0 ),// Left-Back     11
    ];
    return icosaVerts;
}

function getIcosaFaces(){
    var icosaIndexList = [  
        20,  30,   0, //top front
        21,   5,  31, //top back
        25,  10,  35, //bot front
        26,  36,  15, //bot back
        22,  50,   6, //back up right
        23,   1,  40, //front up right
        2,   11,  41, // front right
        3,   45,  12, //front left
        4,   32,  46, //front up left
        7,   51,  16, //back right
        8,   17,  55, //back left
        9,   56,  33, //back up left
        18,  52,  27, //back bot right
        19,  37,  57, //back bot left
        42,  53,  24, //right top
        43,  28,  54, //right bot
        47,  34,  58, //left top
        48,  59,  38, //left bot
        49,  39,  13, //front bot left
        44,  14,  29 //front bot right
    ];
    return icosaIndexList;
}

function getTextCoords(){
    var inv1024 = 1.0/1024.0;
    var textCoords = [
        new Vector2( 632.0*inv1024, 469.0*inv1024 ),//2
        new Vector2( 632.0*inv1024, 469.0*inv1024 ),//2
        new Vector2( 632.0*inv1024, 469.0*inv1024 ),//2
        new Vector2( 632.0*inv1024, 469.0*inv1024 ),//2
        new Vector2( 632.0*inv1024, 469.0*inv1024 ),//2

        new Vector2( 438.0*inv1024, 805.0*inv1024 ),//0
        new Vector2( 438.0*inv1024, 805.0*inv1024 ),//0
        new Vector2( 438.0*inv1024, 805.0*inv1024 ),//0
        new Vector2( 438.0*inv1024, 805.0*inv1024 ),//0
        new Vector2( 438.0*inv1024, 805.0*inv1024 ),//0

        new Vector2( 535.0*inv1024, 301.0*inv1024 ),//3
        new Vector2( 535.0*inv1024, 301.0*inv1024 ),//3
        new Vector2( 535.0*inv1024, 301.0*inv1024 ),//3
        new Vector2( 535.0*inv1024, 301.0*inv1024 ),//3
        new Vector2( 535.0*inv1024, 301.0*inv1024 ),//3

        new Vector2( 244.0*inv1024, 805.0*inv1024 ),//1
        new Vector2( 244.0*inv1024, 805.0*inv1024 ),//1
        new Vector2( 244.0*inv1024, 805.0*inv1024 ),//1
        new Vector2( 244.0*inv1024, 805.0*inv1024 ),//1
        new Vector2( 244.0*inv1024, 805.0*inv1024 ),//1

        new Vector2( 535.0*inv1024, 637.0*inv1024 ),//11
        new Vector2( 535.0*inv1024, 637.0*inv1024 ),//11
        new Vector2( 535.0*inv1024, 637.0*inv1024 ),//11
        new Vector2( 535.0*inv1024, 637.0*inv1024 ),//11
        new Vector2( 535.0*inv1024, 637.0*inv1024 ),//11

        new Vector2( 437.0*inv1024, 133.0*inv1024 ),//9
        new Vector2(  49.0*inv1024, 805.0*inv1024 ),//9
        new Vector2( 146.0*inv1024, 637.0*inv1024 ),//9
        new Vector2( 243.0*inv1024, 469.0*inv1024 ),//9
        new Vector2( 340.0*inv1024, 301.0*inv1024 ),//9

        new Vector2( 730.0*inv1024, 637.0*inv1024 ),//10
        new Vector2( 633.0*inv1024, 805.0*inv1024 ),//10
        new Vector2( 827.0*inv1024, 469.0*inv1024 ),//10
        new Vector2( 536.0*inv1024, 973.0*inv1024 ),//10
        new Vector2( 924.0*inv1024, 301.0*inv1024 ),//10

        new Vector2( 632.0*inv1024, 133.0*inv1024 ),//8
        new Vector2( 147.0*inv1024, 973.0*inv1024 ),//8
        new Vector2( 147.0*inv1024, 973.0*inv1024 ),//8
        new Vector2( 632.0*inv1024, 133.0*inv1024 ),//8
        new Vector2( 632.0*inv1024, 133.0*inv1024 ),//8

        new Vector2( 438.0*inv1024, 469.0*inv1024 ),//4
        new Vector2( 438.0*inv1024, 469.0*inv1024 ),//4
        new Vector2( 438.0*inv1024, 469.0*inv1024 ),//4
        new Vector2( 438.0*inv1024, 469.0*inv1024 ),//4
        new Vector2( 438.0*inv1024, 469.0*inv1024 ),//4

        new Vector2( 729.0*inv1024, 301.0*inv1024 ),//6
        new Vector2( 729.0*inv1024, 301.0*inv1024 ),//6
        new Vector2( 729.0*inv1024, 301.0*inv1024 ),//6
        new Vector2( 729.0*inv1024, 301.0*inv1024 ),//6
        new Vector2( 729.0*inv1024, 301.0*inv1024 ),//6

        new Vector2( 341.0*inv1024, 637.0*inv1024 ),//5
        new Vector2( 341.0*inv1024, 637.0*inv1024 ),//5
        new Vector2( 341.0*inv1024, 637.0*inv1024 ),//5
        new Vector2( 341.0*inv1024, 637.0*inv1024 ),//5
        new Vector2( 341.0*inv1024, 637.0*inv1024 ),//5

        new Vector2( 341.0*inv1024, 973.0*inv1024 ),//7
        new Vector2( 341.0*inv1024, 973.0*inv1024 ),//7
        new Vector2( 341.0*inv1024, 973.0*inv1024 ),//7
        new Vector2( 826.0*inv1024, 133.0*inv1024 ),//7
        new Vector2( 826.0*inv1024, 133.0*inv1024 ),//7

    ];
    return textCoords;
}