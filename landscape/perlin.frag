#version 330
uniform sampler2D noise;
out vec4 color;
in vec2 texcoord;
uniform float time;

uniform vec4 scale=vec4(1.0,2.0,1.3,1.5);

float myTexResolution = 512;
vec4 getTexel(vec2 uv)
{
    float textureResolution = 512.0;
    uv = uv * textureResolution + 0.5;
    vec2 iuv = floor(uv);
    vec2 fuv = fract(uv);
    uv = iuv + fuv * fuv * (3.0 - 2.0 * fuv); // fuv*fuv*fuv*(fuv*(fuv*6.0-15.0)+10.0);;
    uv = (uv - 0.5) / textureResolution;
    return texture2D(noise, uv);
}

void main()
{
    float h = 0;
    vec2 ranoffset = texture(noise, texcoord / 128).xy / 10;
    vec2 uv = (texcoord + vec2(time, 0) + ranoffset) / 64;
    float tex = getTexel(uv).x;
    h += tex * 0.5;
    ranoffset = texture(noise, texcoord / 128).xy * 2;
    uv = (texcoord + vec2(time, time) + ranoffset / 5) / 32;
    tex = getTexel(uv).y;
    h += tex * 0.25;
    uv = (texcoord + vec2(-time, 0.2150)) / 16;
    tex = getTexel(uv).z;
    h += tex * 0.125;
    uv = (texcoord + vec2(time, -time)) / 8;
    tex = getTexel(uv).x;
    h += tex * 0.0625;
    uv = (texcoord + vec2(time, -time)) / 4;
    tex = getTexel(uv).x;
    h += tex * 0.03125;
    uv = (texcoord + vec2(time, -time)) / 2;
    tex = getTexel(uv).x;
    h += tex * 0.015625;
    uv = (texcoord + vec2(time, -time));
    tex = getTexel(uv).x;
    h += tex * 0.007812;
    h = (h * (scale.y - scale.x)) + scale.x;
    h = min(scale.w, max(scale.z, h));
    /*h=max(0,h-0.5)*2;*/
    color = vec4(h);
}
