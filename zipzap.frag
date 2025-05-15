#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform float time;

#define speed 0.2

vec2 my_tanh(vec2 p) {
    vec2 v = (exp(2.*p)-1.)/(exp(2.*p)+1.);
    return clamp(v, -1., 1.);
}

void main(void)
{
    vec2 res = resolution.xy;
    //remap the UV coordinates to go from -1 to +1 vertically, square aspect ratio
    vec2 uv = gl_FragCoord.xy;
    uv = (uv+uv-res)/res.y;
    //zooms in on the middle fifth, where the effect is most interesting
    uv *= 0.2;
    
    if(uv.x*uv.x + uv.y*uv.y < 0.1){
    gl_FragColor = vec4(1.,1.,1.,1.);
    }else{
    
    vec4 baseLightColour = gl_FragColor = vec4(1,2,3,0);
    
    float fractalScale = .5;
    float t = time*speed;
    
    //the basic idea is that we add up a bunch of lights with accumulating distortion
    //the layers are rotated and squished around, resulting in a cloudy effect
     
    //we accumulate 18 fractal octaves
    for ( float i=1.; ++i < 19.; )
    {
        //changes fractal ratio each iteration
        //by octave 18 it's close to 1, so each successive layer will be the same size
        //so we have a few big layers and a bunch of similarly sized small layers
        fractalScale += 0.03;
        
        //creates a mix of colours
        ++t;
        
        //pow(fractalScale,i) has an exponential effect on the scale
        //however removing it doesn't actually seem to change very much
        //vec2 b = 7.*uv*pow(fractalScale, i);
        vec2 b = 7.*uv;
        
        //w is used when calculating the light contribution
        vec2 w = cos(t - b);
        //causes radial falloff effect of brightness variation
        w -= 5.*uv;
        
        //in each layer, accumulate adjustments onto the previous layer
        //so the UVs get more and more screwed up in each layer
        
        //first we multiply by a 2x2 matrix with cosines of various values
        //this ends up rotating each layer
        //11 is about 3.5pi and 33 is about 10.5pi
        //so this approximates the sine terms in the rotation matrix
        uv *= mat2(cos(i + .02*t - vec4(0,11,33,0)));
        
        //uv broadly speaking increases away from the origin
        //so this is a radial polar coordinate
        vec2 first = vec2(40. * dot(uv ,uv));
        
        //the cos adds some random wigglies and creates the 'cloudy' look
        first *= cos(1e2*uv.yx + t);
        
        //tanh functions as a soft ceiling/floor, reducing noisy falloff/interference
        first = my_tanh(first);
        
        //this term works on the brightness of the accumulating fragment colour itself
        //so it's most active near lights
        //however it's been turned down to near zero
        //if you increase its influence it adds ring-like distortions around the lights
        float second = cos(4./exp(dot(gl_FragColor,gl_FragColor)/1e2) + t);
        //second = 0.;
        
        //uvs from the previous layer, with the fractal multiplier
        //this brings the smaller lights in towards the centre
        vec2 third = fractalScale * uv;
        
        //we accumulate modifications to the UVs for each layer
        uv += first/200. + second/300. + 0.2 * third;
        
        //now we add in the lights for this layer
        //this adjusts the hue of each light
        vec4 light = (1. + cos(baseLightColour+t));
        
        //this term is some kind of remapping operation, tweaks the scale
        vec2 falloff = 1.5*uv/(.5-dot(uv,uv));
        
        //this term makes the lights move in wiggly ways
        falloff -= 9.*uv.yx;
        
        //this term makes the lights shoot around instead of roughly staying put on their layers
        falloff += t;
        
        //this term makes sure each layer has multiple lights, so there will be something near the centre
        falloff = sin(falloff);
        
        //this gives the lights a falloff, screen is white without
        //removing the dot(w,w) (so it's just 1+i) makes the effect much busier and higher frequency
        falloff *= 1. + i * dot(w,w);
        light /= length(falloff);
        
        gl_FragColor += light;
    }
        
    //tonemapping operation
    gl_FragColor = 25.6 / (min(gl_FragColor, 13.) + 164. / gl_FragColor) - dot(uv, uv) / 250.;
    }
}

