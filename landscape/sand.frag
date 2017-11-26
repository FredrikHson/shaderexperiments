#version 330
uniform sampler2D height;
uniform vec2 offset;
out vec4 color;
in vec2 texcoord;
float slope = 1.0 / 280.0;

float getHeight(vec2 offset)
{
    vec2 uv = texcoord.xy + vec2(dFdx(texcoord.x), dFdy(texcoord.y)) * offset;
    return texture(height, uv).x;
}
void main()
{
    float offsetsize = 1.0;
    vec2 dir = normalize(offset);
    float h = getHeight(vec2(0, 0));
    float h2 = getHeight(dir);
    float h3 = getHeight(-dir);
    float diff1 = h2 - h;
    float diff2 = h3 - h;

    if(diff1 > slope)
    {
        h += max(0, abs(diff1 / 2) - slope);
    }

    if(diff1 < -slope)
    {
        h -= max(0, abs(diff1 / 2) - slope);
    }

    if(diff2 > slope)
    {
        h += max(0, abs(diff2 / 2) - slope);
    }

    if(diff2 < -slope)
    {
        h -= max(0, abs(diff2 / 2) - slope);
    }

    color = vec4(h);
}
