print("initing");
water1 = createrendertarget(1024, 1024, 1, GL_RGBA, GL_RGBA32F);
water2 = createrendertarget(1024, 1024, 1, GL_RGBA, GL_RGBA32F);
normalbuffer = createrendertarget(1024, 1024, 1, GL_RGBA, GL_RGBA32F);
plane = generateplane(50);
blit = loadshader("blit.vert", "blit.frag", 0, 0, 0);
normal = loadshader("normal.vert", "normal.frag", 0, 0, 0);
waves = loadshader("waves.vert", "waves.frag", 0, 0, 0);
background = loadimage("rocks.jpg");

setdefaultfilter(GL_LINEAR, GL_LINEAR_MIPMAP_LINEAR);
var droptime = 0;
function dowater(buftarget, bufsource)
{
    beginpass(buftarget);
    {
        var dirx = Math.random() - 0.5;
        var diry = Math.random() - 0.5;
        culling(CULL_NONE);
        cleardepth();
        bindshader(waves);
        bindattribute("in_Position", MESH_FLAG_POSITION);
        bindattribute("in_Uvs", MESH_FLAG_TEXCOORD0);
        bindrendertarget("water", bufsource, 0, GL_LINEAR, GL_LINEAR, GL_CLAMP_TO_EDGE);
        setuniformf("offset", dirx, diry);

        if(MOUSE_1 & PRESSED)
        {
            setuniformf("rainpos", MOUSE_X / WINDOW_WIDTH, 1 - (MOUSE_Y / WINDOW_HEIGHT));
            setuniformf("rain", 1);
        }
        else
        {
            setuniformf("rainpos", Math.random(), Math.random());
            droptime += DELTA_TIME;

            if(droptime > 0.25)
            {
                droptime = 0;
                setuniformf("rain", 0.0009);
            }
            else
            {
                setuniformf("rain", 0);
            }
        }

        setuniformi("clear", MOUSE_2);
        drawmesh(plane);
        bindshader(-1);
    }
    endpass();
}
function loop()
{
    if(MOUSE_INSIDE)
    {
        if(MOUSE_1 & PRESSED)
        {
        }
    }

    dowater(water1, water2);
    dowater(water2, water1);
    beginpass(normalbuffer);
    {
        culling(CULL_NONE);
        cleardepth();
        bindshader(normal);
        bindattribute("in_Position", MESH_FLAG_POSITION);
        bindattribute("in_Uvs", MESH_FLAG_TEXCOORD0);
        bindrendertarget("height", water1, 0, GL_LINEAR, GL_LINEAR, GL_CLAMP_TO_EDGE);
        drawmesh(plane);
        bindshader(-1);
    }
    endpass();
    beginpass();
    {
        if(KEY_W & PRESSED)
        {
            wireframe(1);
        }

        culling(CULL_NONE);
        clear(0, 0, 0);
        //cleardepth();
        bindshader(blit);
        bindattribute("in_Position", MESH_FLAG_POSITION);
        bindattribute("in_Uvs", MESH_FLAG_TEXCOORD0);
        bindrendertarget("normaltex", normalbuffer, 0, GL_LINEAR, GL_LINEAR);
        bindrendertarget("heighttex", water1, 0, GL_LINEAR, GL_LINEAR);
        bindtexture("background", background);
        drawmesh(plane);
        bindshader(-1);
        wireframe(0);
    }
    endpass();
}
