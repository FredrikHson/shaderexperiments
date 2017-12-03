#version 460
uniform sampler2D image;
uniform sampler2D heightmap;
out vec4 color;
in vec2 texcoord;
void main()
{
    color = texture(image, texcoord);
    float h = texture(heightmap, texcoord).x;
    float v = 0;

    if(h < 0.02 && h > -0.02)
    {
        v = 2;
    }

    //h = 1 - (max(0.8, sin(h * 100)) - 0.8) / 0.2;
    h = fract(h * 10);

    if(h < 0.3)
    {
        h = 0.5;
    }
    else
    {
        h = 1;
    }

    h += v;
    //color *= vec4(h);
    /*color = vec4(1, 0, 0, 1);*/
    /*color=color*2-1;*/
    /*float diffuse=max(0,dot(color.xyz,normalize(vec3(0,0,1))));*/
    /*color=vec4(pow(1-diffuse,5));*/
}
