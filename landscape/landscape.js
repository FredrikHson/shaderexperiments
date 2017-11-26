print("initing");
heightbuffer1 = createrendertarget(1024, 1024, 1, GL_RGB, GL_RGBA32F);
heightbuffer2 = createrendertarget(1024, 1024, 1, GL_RGB, GL_RGBA32F);
heightbuffer3 = createrendertarget(1024, 1024, 1, GL_RGB, GL_RGBA32F);
normalbuffer = createrendertarget(1024, 1024, 1, GL_RGB, GL_RGBA32F);
noise = loadimage("noise.png");
plane = loadmesh("quad.obj");

perlin = loadshader("perlin.vert", "perlin.frag", 0, 0, 0);

var tess = 1;

if(tess)
{
    blit = loadshader("blit.vert", "blit.frag", 0, "tess.cont", "tess.eval");
}
else
{
    blit = loadshader("blit.vert", "blit.frag", 0, 0, 0);
}

normal = loadshader("normal.vert", "normal.frag", 0, 0, 0);
sand = loadshader("sand.vert", "sand.frag", 0, 0, 0);

setdefaultfilter(GL_LINEAR, GL_LINEAR_MIPMAP_LINEAR);
setmat4anglemode(DEGREES);

var angles = [0.0, 0.0];
var pos = [0.0, 0.0, -3.0];
registerglobal("angles");
registerglobal("pos");
var resettime = 0;
function initHeight()
{
    beginpass(heightbuffer1);
    {
        culling(CULL_NONE);
        cleardepth();
        bindshader(perlin);
        setuniformf("time", TIME);
        bindattribute("in_Position", MESH_FLAG_POSITION);
        bindattribute("in_Uvs", MESH_FLAG_TEXCOORD0);
        bindtexture("noise", noise, GL_LINEAR, GL_LINEAR);
        drawmesh(plane);
        bindshader(-1);
    }
    endpass();
}

initHeight();
function loop()
{
    var zrotmat = mat4setrotation(angles[0], 0, 1, 0);
    var yrotmat = mat4setrotation(angles[1], 1, 0, 0);
    var rotmat = mat4mul(zrotmat, yrotmat);

    if(MOUSE_INSIDE)
    {
        if(MOUSE_1 & PRESSED && (KEY_LEFT_CONTROL & PRESSED || KEY_RIGHT_CONTROL & PRESSED))
        {
            pos[2] += MOUSE_DELTA_Y / 40;
        }
        else if(MOUSE_1 & PRESSED)
        {
            angles[0] += MOUSE_DELTA_X;
            angles[1] += MOUSE_DELTA_Y;
        }

        if(MOUSE_1 & PRESSED_NOW)
        {
            initHeight();
        }
    }

    resettime += DELTA_TIME;

    if(resettime >= 2)
    {
        initHeight();
        resettime = 0;
    }

    beginpass(heightbuffer2);
    {
        var dirx = Math.random() - 0.5;
        var diry = Math.random() - 0.5;
        culling(CULL_NONE);
        cleardepth();
        bindshader(sand);
        bindattribute("in_Position", MESH_FLAG_POSITION);
        bindattribute("in_Uvs", MESH_FLAG_TEXCOORD0);
        bindrendertarget("height", heightbuffer1, 0, GL_LINEAR, GL_LINEAR, GL_CLAMP_TO_EDGE);
        setuniformf("offset", dirx, diry);
        drawmesh(plane);
        bindshader(-1);
    }
    endpass();
    beginpass(heightbuffer1);
    {
        var dirx = Math.random() - 0.5;
        var diry = Math.random() - 0.5;
        culling(CULL_NONE);
        cleardepth();
        bindshader(sand);
        bindattribute("in_Position", MESH_FLAG_POSITION);
        bindattribute("in_Uvs", MESH_FLAG_TEXCOORD0);
        bindrendertarget("height", heightbuffer2, 0, GL_LINEAR, GL_LINEAR, GL_CLAMP_TO_EDGE);
        setuniformf("offset", dirx, diry);
        drawmesh(plane);
        bindshader(-1);
    }
    endpass();
    beginpass(normalbuffer);
    {
        culling(CULL_NONE);
        cleardepth();
        bindshader(normal);
        bindattribute("in_Position", MESH_FLAG_POSITION);
        bindattribute("in_Uvs", MESH_FLAG_TEXCOORD0);
        bindrendertarget("height", heightbuffer1, 0, GL_LINEAR, GL_LINEAR, GL_CLAMP_TO_EDGE);
        drawmesh(plane);
        bindshader(-1);
    }
    endpass();
    beginpass();
    {
        if(MOUSE_1 & PRESSED)
        {
            wireframe(1);
        }

        culling(CULL_NONE);
        clear(0, 0, 0);
        //cleardepth();
        bindshader(blit);
        bindattribute("in_Position", MESH_FLAG_POSITION);
        bindattribute("in_Uvs", MESH_FLAG_TEXCOORD0);
        bindrendertarget("image", normalbuffer, 0, GL_LINEAR, GL_LINEAR);
        bindrendertarget("heightmap", heightbuffer1, 0, GL_LINEAR, GL_LINEAR);
        var level = sin(TIME / 4.0) * 64.0;

        if(level <= 0)
        {
            level = -level;
        }

        setuniformf("mpos", MOUSE_X / RENDER_WIDTH, MOUSE_Y / RENDER_HEIGHT);
        setuniformf("TessLevel", level);
        drawmesh(plane);
        bindshader(-1);
        wireframe(0);
    }
    endpass();
}
