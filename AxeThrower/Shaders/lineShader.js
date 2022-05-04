const lineVertShader = `
precision mediump float;
    
attribute vec4 vertexPosition;

uniform mat4 worldMat, projectMat;

void main() {

    vec4 vertexPositionTransformed = worldMat * vertexPosition;
    gl_Position = projectMat * vertexPositionTransformed;

}`;

const lineFragShader = `
precision mediump float;

void main() {
    gl_FragColor = vec4( 0, 1, 0, 1.0 );
}
`;