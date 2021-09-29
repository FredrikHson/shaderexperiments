print("initing");
plane = generateplane(0);
neural = loadshader("neural.vert", "neural.frag", 0, 0, 0);

var rotx = 0.2;
var roty = 0.5;

function loop()
{
    if(MOUSE_INSIDE)
    {
        if(MOUSE_1 & PRESSED)
        {
            roty -= MOUSE_DELTA_X * 0.01;
            rotx -= MOUSE_DELTA_Y * 0.01;
        }
    }

    debugmode(DEBUG_RENDERALLSTEPS);
    debugrange(-0.010, 0.01);
    beginpass();
    {
        if(KEY_W & PRESSED)
        {
            wireframe(1);
        }

        culling(CULL_NONE);
        clear(1, 0, 0);
        //cleardepth();
        bindshader(neural);
        bindattribute("in_Position", MESH_FLAG_POSITION);
        bindattribute("in_Uvs", MESH_FLAG_TEXCOORD0);
        setuniformf("iResolution", RENDER_WIDTH, RENDER_HEIGHT);
        setuniformf("iMouse", MOUSE_X, MOUSE_Y, MOUSE_1 & PRESSED);
        setuniformf("iTime", TIME);
        setuniformf("rot", rotx, roty);
        drawmesh(plane);
        bindshader(-1);
        wireframe(0);
    }
    endpass();
}
