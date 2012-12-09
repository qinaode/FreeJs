(function (window) {
    //资源对象
    var resources = {
        //是否正在加载
        isLoading: false,
        //图像数量
        imgNum: 0,
        //音频数量
        audioNum: 0,
        //加载完成数量
        loadDoneNum: 0,
        //图像数组
        imgArray: [],
        //音频数组
        audioArray: [],
        //渲染器数组
        shaderArray: []
    };

    //创建材质对象
    var texture2D = {};

    //创建渲染器对象
    var shader = {};

    //创建音频对象
    var audio = {};

    /*
        绑定材质
        参数:
          --材质对象
    */
    function bindTexture(texture) {
        var g = graphics.getContext();
        g.bindTexture(g.TEXTURE_2D, texture);
        g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, true);
        g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, texture.image);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.NEAREST);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.NEAREST);
        g.bindTexture(g.TEXTURE_2D, null);
        var error = g.getError();
        if (error !== g.NO_ERROR && error !== g.CONTEXT_LOST_WEBGL)
        {
            throw error;
            return;
        }
    }

    /*
        加载材质
    */
    texture2D.load = function (name, fileName) {
        var g = graphics.getContext();
        var t = g.createTexture();
        t.image = new Image();
        t.image.onload = function () {
            bindTexture(t);
            resources.imgArray.add({ name: name, texture: t });
            resources.loadDoneNum++;
            checkLoad();
        };
        t.image.onerror = function () {
            throw "加载材质对象\"" + name + "\"失败";
            return;
        }
        t.image.src = fileName;
        resources.imgNum++;
        checkLoad();
    };

    /*
        获取材质
        参数:
          --名称
    */
    texture2D.get = function (name) {
        var ri = resources.imgArray;
        for (var i = ri.length; i--;)
        {
            if (name === ri[i].name)
            {
                return ri[i].texture;
            }
        }
    };

    /*
        移除材质
        参数:
          --名称
    */
    texture2D.remove = function (name) {
        var ri = resources.imgArray;
        for (var i = ri.length; i--;)
        {
            if (name === ri[i].name)
            {
                ri[i] = null;
                delete ri[i];
                resources.imgArray = ri.remove(i);
            }
        }
    };

    /*
        清空材质
    */
    texture2D.clear = function () {
        resources.imgArray.clear();
    };

    /*
        加载渲染器
        参数:
          --名称
          --文件名称
          --渲染器类型
    */
    shader.load = function (name, fileName, type) {
        var g = graphics.getContext();
        var shaderType = (type === "vs" ? "VERTEX_SHADER" : (type === "fs" ? "FRAGMENT_SHADER" : ""));
        if (shaderType === "")
        {
            throw "渲染器类型错误。";
            return;
        }
        var content = new window.loadFile(fileName, false, function () {
            var shaderObj = g.createShader(g[shaderType]);
            g.shaderSource(shaderObj, content.getText());
            g.compileShader(shaderObj);
            var error = g.getError();
            if (error !== g.NO_ERROR && error !== g.CONTEXT_LOST_WEBGL)
            {
                throw error;
                return;
            }
            if (!g.getShaderParameter(shaderObj, g.COMPILE_STATUS))
            {
                throw g.getShaderInfoLog(shaderObj);
                return;
            }
            resources.shaderArray.add({ name: name, shader: shaderObj });
        });
        content.sendData();
    };

    /*
        获取渲染器
        参数:
          --名称
    */
    shader.get = function (name) {
        var rs = resources.shaderArray;
        for (var i = rs.length; i--;)
        {
            if (name === rs[i].name)
            {
                return rs[i].shader;
            }
        }
    };

    /*
        移除渲染器
        参数:
          --名称
    */
    shader.remove = function (name) {
        var g = graphics.getContext();
        var rs = resources.shaderArray;
        for (var i = rs.length; i--;)
        {
            if (name === rs[i].name)
            {
                g.deleteShader(rs[i].shader);
                resources.shaderArray = rs.remove(i);
            }
        }
    };

    /*
        清空渲染器
    */
    shader.clear = function () {
        var g = graphics.getContext();
        var rs = resources.shaderArray;
        var i = rs.length;
        for (; i--;)
        {
            g.deleteShader(rs[i].shader);
        }
        resources.shaderArray.clear();
    };

    /*
        加载音频
        参数:
          --名称
          --文件名称
          --额外设置
    */
    audio.load = function (name, fileName, fun) {
        var o = page.creatObject(name, "audio");
        o.addEventListener("loadeddata", function () {
            resources.loadDoneNum++;
            resources.audioArray.add({ name: name, audio: this });
            checkLoad();
        }, false);
        o.onerror = function () {
            if (this.error.code == 4)
            {
                throw "无法播放音频";
                resources.loadDoneNum++;
                checkLoad();
            }
            else
            {
                throw "创建音频对象\"" + name + "\"失败";
                return;
            }
        }
        o.setAttribute("preload", "preload");
        if (fun)
        {
            fun(o);
        }
        o.src = fileName + checker.supportAudioFormat();
        resources.audioNum++;
        checkLoad();
    };

    /*
        获取音频
        参数:
          --名称
    */
    audio.get = function (name) {
        var aa = resources.audioArray;
        for (var i = aa.length; i--;)
        {
            if (name === aa[i].name)
            {
                return aa[i].audio;
            }
        }
    };

    /*
        移除音频
        参数:
          --名称
    */
    audio.remove = function (name) {
        var aa = resources.audioArray;
        for (var i = aa.length; i--;)
        {
            if (name === aa[i].name)
            {
                document.body.removeChild(document.getElementById(name));
                resources.audioArray = aa.remove(i);
            }
        }
    };

    /*
        清空音频
    */
    audio.clear = function () {
        for (var i = resources.audioArray.length; i--;)
        {
            audio.remove(resources.audioArray[i]);
        }
    };

    /*
        检查是否正在加载
    */
    function checkLoad() {
        if ((resources.imgNum + resources.audioNum) === resources.loadDoneNum) resources.isLoading = false;
        else resources.isLoading = true;
    }

    //将对象公开
    window.resources = resources;
    window.texture2D = texture2D;
    window.shader = shader;
    window.audio = audio;
})(window);