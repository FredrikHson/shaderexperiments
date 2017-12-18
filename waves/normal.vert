#version 330
in vec3 in_Position;
in vec2 in_Uvs;
out vec2 texcoord;


void main(void)
{
    gl_Position = vec4(in_Position, 1.0);
    texcoord = in_Uvs;
}
