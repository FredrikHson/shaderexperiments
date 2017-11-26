#version 330
uniform sampler2D height;
out vec4 color;
in vec2 texcoord;
float zscale = 0.5;

vec3 getPos(vec2 offset)
{
    vec2 uv=texcoord.xy + vec2(dFdx(texcoord.x), dFdy(texcoord.y)) * offset;
    return vec3(uv, texture(height, uv).x * zscale);
}
void main()
{
    float offsetsize = 1.0;
    vec3 normal = cross(getPos(vec2(0 - offsetsize, 0)) - getPos(vec2(offsetsize, 0)),
                        getPos(vec2(0, 0 - offsetsize)) - getPos(vec2(0, offsetsize)));
    color = vec4((normalize(normal) + 1) / 2, 0);
}
