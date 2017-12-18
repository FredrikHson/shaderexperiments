#version 440
uniform sampler2D water;
out vec4 color;
in vec2 texcoord;

uniform float rain;
uniform int clear;
uniform vec2 rainpos;
vec4 get(vec2 offset)
{
    vec2 uv = texcoord.xy + vec2(dFdx(texcoord.x), dFdy(texcoord.y)) * offset;
    return texture(water, uv);
}
void main()
{
    float centerprev = get(vec2(0, 0)).y;
    float center = get(vec2(0, 0)).x;
    float newdepth = get(vec2(1, 0)).x + get(vec2(-1, 0)).x;
    newdepth += get(vec2(0, 1)).x + get(vec2(0, -1)).x;
    newdepth /= 2;
    newdepth -= centerprev;
    newdepth -= (newdepth - center) * 0.01;
    color = vec4(newdepth, center, 0, 0);
    //color.x = (sin(texcoord.x * 20) + cos(texcoord.y * 20));
    //if(color.x < 0)
    //{
    //color.x *= -0.5;
    //}
    //color.x = clamp(color.x, 0, 1);
    float raindist = distance(rainpos, texcoord);

    if(raindist < 0.01)
    {
        color.x += rain;
    }

    if(clear != 0)
    {
        color.x = 0;
    }

    // evaporate
    color.x *= 0.999996;
}
