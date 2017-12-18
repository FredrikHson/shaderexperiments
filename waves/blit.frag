#version 440
uniform sampler2D normaltex;
uniform sampler2D heighttex;
uniform sampler2D background;
out vec4 color;
in vec2 texcoord;
void main()
{
    vec4 normal = texture(normaltex, texcoord);
    float height = texture(heighttex, texcoord).x;
    normal = normal * 2 - 1;
    float spec = pow(max(0, dot(normalize(vec3(-1, 1, 0)), normal.xyz)), 32);
    color = texture(background, texcoord + (normal.xy));
    color += spec;
    vec4 watercolor = mix(vec4(1, 1, 1, 1), vec4(0.2, 0.3, 1, 1), min(1,height));
    color *= watercolor;
}
