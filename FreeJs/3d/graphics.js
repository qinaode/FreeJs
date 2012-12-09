(function (window) {
    //图形设备管理器
    var graphics = {};

    //上下文对象
    var ctx = canvas.context;

    //设置初始参数
    ctx.viewportWidth = ctx.canvas.width;
    ctx.viewportHeight = ctx.canvas.height;
    ctx.enable(ctx.DEPTH_TEST);
    ctx.depthFunc(ctx.LEQUAL);
    ctx.viewport(0, 0, ctx.viewportWidth, ctx.viewportHeight);

    /*
        获取上下文
    */
    graphics.getContext = function () {
        return ctx;
    };

    /*
        清空画布
        参数:
          --[可空]颜色
    */
    graphics.clear = function (r, g, b, a) {
        if (r && g && b && a)
        {
            if (r === 0 && g === 0 && b === 0 && a === 0)
            {
                ctx.clearColor(0.0, 0.0, 0.0, 0.0);
            }
            else
            {
                ctx.clearColor(r / 255, g / 255, b / 255, a);
            }
        }
        ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
    };

    /*
        获取着色程序
        参数:
          --顶点着色器
          --片断着色器
    */
    graphics.getProgram = function (vs, fs) {
        var g = graphics.getContext();
        var p = g.createProgram();
        //附加顶点着色器和片断着色器
        g.attachShader(p, vs);
        g.attachShader(p, fs);
        g.bindAttribLocation(p, 0, "g_Position");
        g.bindAttribLocation(p, 1, "g_TexCoord0");
        g.linkProgram(p);
        var error = g.getError();
        if (error !== g.NO_ERROR && error !== g.CONTEXT_LOST_WEBGL)
        {
            throw error;
            return;
        }
        if (!g.getProgramParameter(p, g.LINK_STATUS))
        {
            throw g.getProgramInfoLog(p);
            g.deleteProgram(p);
            return;
        }
        g.useProgram(p);
        return p;
    };

    /*
        释放着色程序
        参数:
          --着色程序
    */
    graphics.freeProgram = function (p) {
        graphics.getContext().deleteProgram(p);
    };

    //公开对象
    window.graphics = graphics;
})(window);