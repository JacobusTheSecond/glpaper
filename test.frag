#ifdef GL_ES
precision highp float;
#endif

uniform vec2    resolution;
//uniform vec2    u_mouse;
uniform float   time;

#define speed 10.0

//varying vec2    texCoords;

void main(void) {
    float internalTime = time*speed;
    vec4 color = vec4(vec3(0.0), 1.0);
    
    vec2 uv=gl_FragCoord.xy/resolution.xy-0.5;
    uv.y*=resolution.y/resolution.x;
    uv*=2.0;
    //vec2 pixel = 1.0/resolution.xy;
    //vec2 uv = gl_FragCoord.xy * pixel;
    //vec2 uv = texCoords;
    //st = uv;
    
    //color.rgb = vec3(st.x,st.y,abs(sin(time)));
    if (uv.x < sin(internalTime)){
        color.rgb = vec3(1.0,1.0,1.0);
    }else{
	color.rgb = vec3(0.0,0.0,0.0);
    }
    gl_FragColor = color;
}
