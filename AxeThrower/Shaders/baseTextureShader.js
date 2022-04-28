const baseTextVert = `
precision mediump float;
    
attribute vec4 vertexPosition;
attribute vec3 nv;
attribute vec2 a_texcoord;

uniform mat4 worldMat, worldMatInverse, projectMat, worldMatTransposeInverse;

varying vec3 v_normal;
varying vec3 fragPos;
varying vec2 v_texcoord;

void main() {

    vec4 vertexPositionTransformed = worldMat * vertexPosition;
    fragPos = (worldMat * vertexPosition).xyz;
    gl_Position = projectMat * vertexPositionTransformed;

    vec4 tempNV = vec4( nv.x, nv.y, nv.z, 1.0 );
    tempNV = worldMatTransposeInverse * tempNV;
    v_normal = tempNV.xyz;

    v_texcoord = a_texcoord;

}`;

const baseTextFrag = `
precision mediump float;

varying vec3 v_normal;

struct BaseLight{
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    bool isOn;
};

struct DirectionalLight{
    vec3 lightDirection;
    float lightStrength;
    BaseLight base;
};

uniform DirectionalLight dirLights[5];
uniform int gNumDirLight;

struct PointLight{
    BaseLight base;
    vec3 pos;
    float constant;
    float linear;
    float quadratic;
};

uniform PointLight pointLights[10];
uniform int gNumPointLight;

struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
};

uniform Material material;
uniform bool useSpec;
uniform vec3 viewPos;
varying vec3 fragPos;
varying vec2 v_texcoord;

uniform sampler2D u_texture;

vec3 CalcDirLight( DirectionalLight dirLight, vec3 n ){

    vec3 ambient = dirLight.base.ambient * material.ambient;

    float diff = max( dot( n, -dirLight.lightDirection ), 0.0 );
    vec3 diffuse = dirLight.base.diffuse * diff * material.diffuse;

    vec3 specular = vec3( 0.0 );
    if ( useSpec ){
        vec3 viewDir = normalize( viewPos - fragPos );
        vec3 reflectDir = reflect( dirLight.lightDirection, n );
        float spec = pow( max( dot( viewDir, reflectDir ), 0.0 ), material.shininess );
        specular = dirLight.base.specular * spec * material.specular;
    }

    return ambient + diffuse + specular;
}

vec3 CalcPointLight( PointLight light, vec3 n )
{
    vec3 lightDir = normalize( light.pos - fragPos );
    // diffuse shading
    float diff = max( dot( n, lightDir ), 0.0 );

    // attenuation
    float distance = length( light.pos - fragPos );
    float attenuation = 1.0 / ( light.constant + light.linear * distance + light.quadratic * ( distance * distance )  + 0.00001 );    

    // combine results
    vec3 ambient  = light.base.ambient  * material.ambient;
    vec3 diffuse  = light.base.diffuse  * diff * material.diffuse;
    vec3 specular = vec3( 0.0 );

    if ( useSpec ){
        // specular shading
        vec3 viewDir = normalize( viewPos - fragPos );
        vec3 reflectDir = reflect( -lightDir, n );
        float spec = pow( max( dot( viewDir, reflectDir ), 0.0 ), material.shininess );
        specular = light.base.specular * spec * material.specular;
    }

    ambient  *= attenuation;
    diffuse  *= attenuation;
    specular *= attenuation;

    return (ambient + diffuse + specular);
}

void main() {

    vec3 normal = normalize(v_normal);
    vec3 total = vec3( 0.0, 0.0, 0.0 );

    for ( int i = 0; i < 5; i++ ){
        if ( i >= gNumDirLight ) break;
        if ( dirLights[i].base.isOn ) total += CalcDirLight( dirLights[i], normal );
    }

    for ( int i = 0; i < 10; i++ ){
        if ( i >= gNumPointLight ) break;
        if ( pointLights[i].base.isOn ) total += CalcPointLight( pointLights[i], normal );
    }
    vec4 texCol = texture2D( u_texture, v_texcoord );
    //gl_FragColor = texCol;
    gl_FragColor = vec4( texCol.r*total.r, texCol.g*total.g, texCol.b*total.b, 1.0 );
}
`;