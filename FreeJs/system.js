(function (window) {
    //创建页面对象
    var page = {};

    //创建画布对象
    var canvas = {};

    //创建游戏对象
    var game = {};

    //根目录
    var rootDirectory = "";

    /*
        设置根目录
    */
    window.setRootDirectory = function (url) {
        rootDirectory = url;
    };

    /*
        Ajax加载文件
        参数:
          --文件地址
          --是否异步
          --回调函数
    */
    window.loadFile = function (url, syne, fun) {
        var XMLHttp = null;
        var o = this;
        if (!url)
        {
            throw "文件地址错误。";
            return;
        }
        this.sendData = function () {
            try
            {
                if (window.XMLHttpRequest)
                {
                    XMLHttp = new XMLHttpRequest();
                } else if (window.ActiveXObject)
                {
                    XMLHttp = new ActiveXObject("Microsoft.XMLHTTP");
                }
            }
            catch (e) { throw "Ajax对象初始化失败。"; }
            with (XMLHttp)
            {
                open("GET", url, syne);
                onreadystatechange = o.CallBack;
                try
                {
                    send(null);
                }
                catch (e) { throw "无法跨域加载文件。"; }
            }
        };
        this.CallBack = function () {
            if (XMLHttp.readyState == 4)
            {
                if (fun)
                {
                    fun();
                }
            }
        };
        this.getText = function () {
            if (XMLHttp == null) { throw "Ajax无法使用未初始化的对象。"; }
            if (XMLHttp.readyState == 4) { return XMLHttp.responseText; }
            return XMLHttp.readyState;
        };
    };

    /*
        动态导入js文件
        参数:
          --连接地址
          --回调函数
    */
    window.using = function (src, fun) {
        var d = document;
        if (d.getElementById(src))
        {
            throw "id为\"" + src + "\"的脚本已无法重复载入。";
            return;
        }

        //检测文件路径
        var jpath;
        src = src.replace(/\_/g, '\/');
        jpath = (src.lastIndexOf(".js") !== (src.length - 2) && src.lastIndexOf(".JS") != (src.length - 2)) ? src + ".js" : src;
        jpath += "?r=" + Math.random() + "" + Math.random();

        //加载文件
        var jsFile = new window.loadFile(jpath, false, function () {
            //创建Script标签
            var domScript = d.createElement('script');
            domScript.id = src;
            domScript.innerHTML = jsFile.getText();
            d.getElementsByTagName('head')[0].appendChild(domScript);
            domScript.innerHTML = "";
            d.getElementsByTagName('head')[0].removeChild(domScript);

            //调用回调函数
            if (fun) fun();
        });
        jsFile.sendData();
    };

    /*
        获取页面参数
        参数：
          --参数名称
        返回值：
          --String
    */
    page.getQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return "";
    };

    /*
        创建Dom元素
        参数：
          --对象id
          --类型
        返回值：
          --Object
    */
    page.creatObject = function (id, type) {
        var d = document;

        //重复对象检测
        if (d.getElementById(id))
        {
            throw "id为\"" + id + "\"的对象已存在。";
            return d.getElementById(id);
        }

        //创建元素并设置属性
        var obj = d.createElement(type);
        obj.setAttribute("id", id);
        obj.setAttribute("name", id);
        d.body.appendChild(obj);
        return obj;
    };

    /*
        获取对象位置
        参数:
          --对象id
        返回值:
          --Point
    */
    page.getObjectLocation = function (id) {
        var p = { x: -1, y: -1 };
        var element = document.getElementById(id);
        if (!element) return p;
        if (checker.usingBrowser() == "opera")
        {
            p.x = element.getBoundingClientRect().left;
            p.y = element.getBoundingClientRect().top;
            element = null;
            return p;
        }
        var actualLeft = element.offsetLeft;
        var currentLeft = element.offsetParent;
        while (currentLeft !== null)
        {
            actualLeft += currentLeft.offsetLeft;
            currentLeft = currentLeft.offsetParent;
        }
        var actualTop = element.offsetTop;
        var currentTop = element.offsetParent;
        while (currentTop !== null)
        {
            actualTop += currentTop.offsetTop;
            currentTop = currentTop.offsetParent;
        }
        p.x = actualLeft;
        p.y = actualTop;
        return p;
    };

    /*
        初始化画布
        参数:
          --对象id
        返回值:
          --Canvas元素
    */
    canvas.initialize = function (id, mode) {
        var c = document.getElementById(id);
        if (!c || !c.getContext)
        {
            throw "id为\"" + id + "\"的对象不是Canvas元素。";
            return null;
        }
        //获取对象名称
        canvas.objectName = id;

        //要获取的上下文对象名称
        var names;
        if (mode === "3d")
        {
            names = ["experimental-webgl", "webgl"];
        }
        else if (mode === "2d")
        {
            var names = ["2d"];
        }
        else
        {
            throw "模式设置失败。";
            return;
        }

        var useName = null;
        for (var i = names.length; i--;)
        {
            //获取上下文
            canvas.context = c.getContext(names[i]);
            //判断是否获取到上下文
            if (canvas.context)
            {
                useName = names[i];
                break;
            }
        }

        //获取上下文失败
        if (!canvas.context)
        {
            if (mode === "2d")
            {
                throw "该浏览器不支持Html5画布标签。";
            }
            else
            {
                throw "该浏览器不支持WebGL绘图技术。";
            }
            return;
        }

        //获取画布大小
        canvas.width = c.width;
        canvas.height = c.height;
        canvas.size = { width: c.width, height: c.height };

        //获取元素大小
        canvas.styleWidth = c.style.width;
        canvas.styleHeight = c.style.height;
        canvas.styleSize = { width: c.style.width, height: c.style.height };

        //载入常量定义文件
        window.using(rootDirectory + "core_const");

        //载入检查器文件
        window.using(rootDirectory + "core_checker");

        //载入扩展功能文件
        window.using(rootDirectory + "core_extend");

        //载入控制器文件
        window.using(rootDirectory + "core_controller");

        //选择要载入的库
        var useLibrary = (useName === "2d" ? "2d" : "3d");

        //载入资源管理器
        window.using(rootDirectory + useLibrary + "_resources");

        //载入图形管理器
        window.using(rootDirectory + useLibrary + "_graphics");

        //设置是否使用WebGL属性
        canvas.isWebGL = (useLibrary === "3d");

        window.requestAnimationFrame = (function () {
            return window.requestAnimationFrame ||
                   window.webkitRequestAnimationFrame ||
                   window.mozRequestAnimationFrame ||
                   window.oRequestAnimationFrame ||
                   window.msRequestAnimationFrame ||
                   function (/* function */ callback, /* DOMElement */ element) {
                       return window.setTimeout(callback, 1000 / 60);
                   }
        })();

        window.cancelAFrame = (function () {
            return window.cancelAnimationFrame ||
                   window.webkitCancelAnimationFrame ||
                   window.mozCancelAnimationFrame ||
                   window.oCancelAnimationFrame ||
                   function (id) {
                       window.clearTimeout(id);
                   };
        })();

        function draw() {
            if (resources.isLoading)
            {
                if (canvas.drawLoad) canvas.drawLoad();
            }
            else
            {
                if (canvas.update) canvas.update();
                if (canvas.draw) canvas.draw();
                if (window.mouse.isLock) window.mouse.x = window.mouse.y = 0;
            }
            window.requestAnimationFrame(draw, c);
        }

        window.requestAnimationFrame(draw, c);

        ////设置更新绘制计时器
        //setInterval(function () {
        //    if (resources.isLoading)
        //    {
        //        if (canvas.drawLoad) canvas.drawLoad();
        //    }
        //    else
        //    {
        //        if (canvas.update) canvas.update();
        //        if (canvas.draw) canvas.draw();
        //        if (window.mouse.isLock) window.mouse.x = window.mouse.y = 0;
        //    }
        //}, 16.7);

        /*
            禁止页面选择
        */
        window.onselectstart = function () { return false; };
        document.body.style.MozUserSelect = "none";
        document.body.style.WebkitUserSelect = "none";
        c.style.WebkitUserSelect = "none";
        c.style.WebkitTapHighlightColor = "rgba(0,0,0,0)";

        //返回对象名称
        return id;
    };

    /*
        开始游戏
        参数:
          --画布名称
          --绘图模式
          --更新函数
          --绘制函数
          --加载绘制函数
    */
    game.start = function (canvasName, mode, update, draw, drawLoad) {
        canvas.initialize(canvasName, mode);
        canvas.draw = draw;
        canvas.update = update;
        canvas.drawLoad = drawLoad;
    };

    /*
        结束游戏
    */
    game.exit = function () {
        canvas.draw = canvas.update = canvas.drawLoad = {};
    };

    /*
        添加元素
        参数：
          --对象
        返回值：
          --对象
    */
    Array.prototype.add = function (obj) {
        for (var i = this.length; i--;)
        {
            if (this[i] === obj)
            {
                return this;
            }
        }
        return (this[this.length] = obj);
    };

    /*
        删除元素
        参数：
          --索引
        返回值：
          --Array对象
    */
    Array.prototype.remove = function (n) {
        return (n < 0) ? this : this.slice(0, n).concat(this.slice(n + 1, this.length));
    };

    /*
        清空元素
    */
    Array.prototype.clear = function () {
        this.length = 0;
    };

    /*
        错误事件
    */
    window.onerror = function (e) {
        alert("发现错误:" + e);
    };

    //公开对象
    window.page = page;
    window.canvas = canvas;
    window.game = game;
})(window);