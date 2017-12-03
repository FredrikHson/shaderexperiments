#version 330
uniform sampler2D rock;
uniform sampler2D sand;
uniform vec2 offset;
out vec4 color;
in vec2 texcoord;

void main()
{
    float h = texture(sand, texcoord).x + texture(rock, texcoord).x;
    color = vec4(h);
}
