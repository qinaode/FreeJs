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
        //动画数组
        animationArray: []
    };

    //创建材质对象
    var texture2D = {};

    //创建音频对象
    var audio = {};

    //创建动画对象
    var animation = {};

    /*
        加载材质
        参数:
          --名称
          --文件名称
    */
    texture2D.load = function (name, fileName, fun) {
        var img = new Image();
        img.onload = function () {
            resources.imgArray.add({ name: name, image: img });
            resources.loadDoneNum++;
            if (fun) fun();
            checkLoad();
        };
        img.onerror = function () {
            throw "加载材质对象\"" + name + "\"失败";
            return;
        }
        img.src = fileName;
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
                return ri[i].image;
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
        加载动画
        参数:
          --名称
          --文件名称
          --材质名称
          --速度
    */
    animation.load = function (name, fileName, textureName, speed) {
        var file = new window.loadFile(fileName, false, function () {
            resources.animationArray.add({
                isPlayed: false, name: name, action: eval('(' + file.getText() + ')'), actionName: "", speed: speed || 100, curIndex: 0, timer: null, play:
            function (actionName) {
                if (animation.get(name).timer) animation.get(name).stop();
                animation.get(name).curIndex = 0;
                animation.get(name).actionName = actionName;
                animation.get(name).timer = setInterval(function () {
                    animation.get(name).curIndex++;
                    if (animation.get(name).curIndex >= animation.get(name).action[actionName].length)
                    {
                        animation.get(name).curIndex = 0;
                        animation.get(name).isPlayed = true;
                    }
                }, animation.get(name).speed);
            }, stop: function () {
                clearInterval(animation.get(name).timer);
            }, draw: function (x, y, scale) {
                if (!scale) scale = 1;
                var action = animation.get(name);
                var actionRect = action.action[action.actionName][action.curIndex];
                spriteBatch.draw(texture2D.get(textureName), x - actionRect.width / 2, y - actionRect.height / 2, actionRect.width * scale, actionRect.height * scale, actionRect.x, actionRect.y, actionRect.width, actionRect.height);
            }
            });
        });
        file.sendData();
        return animation.get(name);
    };

    /*
        获取动画
        参数:
          --名称
    */
    animation.get = function (name) {
        var ar = resources.animationArray;
        for (var i = ar.length; i--;)
        {
            if (name === ar[i].name)
            {
                return ar[i];
            }
        }
    };

    /*
        移除动画
        参数:
          --名称
    */
    animation.remove = function (name) {
        var ar = resources.animationArray;
        for (var i = ar.length; i--;)
        {
            if (name === ar[i].name)
            {
                resources.animationArray = ar.remove(i);
            }
        }
    };

    /*
        清空动画
    */
    animation.clear = function () {
        resources.animationArray.clear();
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
    window.audio = audio;
    window.animation = animation;
})(window);