/*
    离线存储
*/
window.offLineSave = {
    /*
        写入
        参数：
          --键
          --值
    */
    write: function (key, value) {
        offLineSave.remove(key);
        localStorage.setItem(key, value);
    },
    /*
        读取
        参数：
          --键
        返回值：
          --字符串类型
    */
    read: function (key) {
        return localStorage.getItem(key);
    },
    /*
        移除
        参数：
          --键
        返回值：
          --本函数体
    */
    remove: function (key) {
        localStorage.removeItem(key);
        return offLineSave.remove;
    },
    /*
        清空
    */
    clear: function () {
        localStorage.clear();
    }
};

/*
    显示消息通知
    参数：
      --图标地址
      --标题
      --内容
      --停留时间
*/
function showNotification(icon, title, body, time) {
    var c = checker;
    if (!c.isSupportNotification()) return false;
    if (!c.isNotificationPermission())
    {
        c.isSupportNotification().requestPermission();
    }
    if (c.isNotificationPermission())
    {
        var _notify = c.isSupportNotification().createNotification(icon || "", title || "Tips", body);
        if (time)
        {
            _notify.ondisplay = function () { setTimeout(function () { _notify.cancel(); }, time); };
            _notify.onshow = _notify.ondisplay;
        }
        _notify.show();
        return true;
    }
    return false;
};

/*
    全屏
    参数：
      --是否全屏
*/
page.Fullscreen = function (isFull) {
    fullScreenApi.isFill = isFull;
    //如果不支持全屏使用欺骗全屏
    if (!window.fullScreenApi.supportsFullScreen)
    {
        if (isFull) fullScreenApi.cheatFullScreen();
        else fullScreenApi.cancelCheatFullScreen();
        return;
    }
    var fs = window.fullScreenApi, el = document.getElementById(canvas.objectName);
    if (isFull) fs.requestFullScreen(el);
    else fs.cancelFullScreen(el);
};


(function (window) {
    /*
        全屏Api
    */
    var fullScreenApi = {
        supportsFullScreen: false,
        isFullScreen: function () { return false; },
        requestFullScreen: function () { },
        cancelFullScreen: function () { },
        fullScreenEventName: '',
        prefix: '',
        isFill: false,
        winScW: 0,
        winScH: 0,
        //启用欺骗全屏
        //设置CSS
        cheatFullScreen: function (size) {
            var el = document.getElementById(canvas.objectName);
            var browser = checker.usingBrowser();
            browser == "ie" ? document.body.style.margin = "0px" : null;
            var w = (typeof (size) != "undefined" ? (size.width - (browser == "ie" ? 5 : 0)) : screen.width);
            var h = (typeof (size) != "undefined" ? (size.height - (browser == "ie" ? 5 : 0)) : screen.height);
            if (browser == "ie")
            {
                w = window.innerWidth - 20;
                h = window.innerHeight;
            }
            //设置元素大小
            canvas.styleWidth = w + 'px';
            canvas.styleHeight = h + 'px';
            canvas.styleSize = { width: w + 'px', height: h + 'px' };
            el.style.width = w + 'px';
            el.style.height = h + 'px';
            fullScreenApi.winScW = (canvas.width / w);
            fullScreenApi.winScH = (canvas.height / h);
        },
        //取消欺骗全屏
        cancelCheatFullScreen: function () {
            var el = document.getElementById(canvas.objectName);
            el.style.width = canvas.width + 'px';
            el.style.height = canvas.height + 'px';
        }
    },
		browserPrefixes = 'webkit moz o ms khtml'.split(' ');
    if (typeof document.cancelFullScreen != 'undefined')
    {
        fullScreenApi.supportsFullScreen = true;
    } else
    {
        for (var i = 0, il = browserPrefixes.length; i < il; i++)
        {
            fullScreenApi.prefix = browserPrefixes[i];
            if (typeof document[fullScreenApi.prefix + 'CancelFullScreen'] != 'undefined')
            {
                fullScreenApi.supportsFullScreen = true;
                break;
            }
        }
    }
    //判断是否支持全屏
    if (fullScreenApi.supportsFullScreen)
    {
        fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';
        fullScreenApi.isFullScreen = function () {
            switch (this.prefix)
            {
                case '':
                    return document.fullScreen;
                case 'webkit':
                    return document.webkitIsFullScreen;
                default:
                    return document[this.prefix + 'FullScreen'];
            }
        };
        //进入全屏
        fullScreenApi.requestFullScreen = function (el) {
            if (el.requestFullscreen)
            {
                el.requestFullscreen();
            }
            else if (el.webkitRequestFullScreen)
            {
                // 对 Chrome 特殊处理，
                // 参数 Element.ALLOW_KEYBOARD_INPUT 使全屏状态中可以键盘输入。
                if (checker.usingBrowser() == "chrome")
                {
                    el.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                }
                else
                {
                    // Safari 浏览器中，如果方法内有参数，则 Fullscreen 功能不可用。
                    el.webkitRequestFullScreen();
                }
            }
            else if (el.mozRequestFullScreen)
            {
                el.mozRequestFullScreen();
            }
        };
        //取消全屏
        fullScreenApi.cancelFullScreen = function () {
            if (document.exitFullscreen)
            {
                document.exitFullscreen();
            }
            else if (document.webkitCancelFullScreen)
            {
                document.webkitCancelFullScreen();
            }
            else if (document.mozCancelFullScreen)
            {
                document.mozCancelFullScreen();
            }
        };
    }
    else
    {
        fullScreenApi.isFullScreen = function () {
            if (checker.usingBrowser() == "ie")
            {
                return fullScreenApi.isFill;
            }
        };
    }

    //绑定全屏状态更改事件
    document.addEventListener(fullScreenApi.fullScreenEventName, function (evt) {
        (checker.isFullscreen()) ? fullScreenApi.cheatFullScreen() : fullScreenApi.cancelCheatFullScreen();
        fullScreenApi.isFill = checker.isFullscreen();
    }, false);

    window.fullScreenApi = fullScreenApi;
})(window);