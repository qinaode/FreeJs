/*
    检查
*/
var checker = {
    //用户代理字符串
    userAgent: window.navigator.userAgent,
    /*
        检查本地存储
        返回值：
          --bool类型
    */
    hasLocalStorage: function () {
        //检查是否支持本地存储
        if (window.localStorage)
        {
            try
            {
                //Safari浏览器的私密浏览模式会触发存储空间已满的异常
                offLineSave.write("localStorageTest", "1");
                offLineSave.remove("localStorageTest");
                return true;
            }
            catch (e)
            {
                return false;
            }
        }
        return false;
    },
    /*
        检查环境语言
        返回值：
          --字符串类型
    */
    usingLanguage: function () {
        return (window.navigator.systemLanguage || window.navigator.language).toLowerCase();
    },
    /*
        检查是否为iPad
        返回值：
          --bool类型
    */
    isIpad: function () {
        return (checker.userAgent.indexOf('iPad') !== -1);
    },
    /*
        检查是否为iPhone
        返回值：
          --bool类型
    */
    isIphone: function () {
        return (checker.userAgent.indexOf('iPhone') !== -1);
    },
    /*
        检查Canvas支持
        返回值：
          --bool类型
        错误处理：
          --弹出对话框并输出到控制台
    */
    hasCanvas: function () {
        if (!document.createElement("canvas").getContext)
        {
            throw "该浏览器不支持Html5画布标签。";
        }
        return true;
    },
    /*
        检查是否支持Flash
    */
    hasFlash: function () {
        var isIE = (navigator.appVersion.indexOf("MSIE") >= 0);
        var hasFlash = true;
        if (isIE)
        {
            try
            {
                var objFlash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
            } catch (e)
            {
                hasFlash = false;
            }
        } else
        {
            if (!navigator.plugins["Shockwave Flash"])
            {
                hasFlash = false;
            }
        }
        return hasFlash;
    },
    /*
        检查支持格式
        返回值：
          --字符串格式
    */
    supportAudioFormat: function () {
        return new Audio().canPlayType("audio/ogg") ? ".ogg" : ".mp3";
    },
    /*
        检查浏览器
        返回值：
          --字符串格式
    */
    usingBrowser: function () {
        var ua = checker.userAgent.toLowerCase();
        if (ua === null) { return "ie"; }
        else if (ua.indexOf('chrome') !== -1) { return "chrome"; }
        else if (ua.indexOf('opera') !== -1) { return "opera"; }
        else if (ua.indexOf('msie') !== -1) { return "ie"; }
        else if (ua.indexOf('safari') !== -1) { return "safari"; }
        else if (ua.indexOf('firefox') !== -1) { return "firefox"; }
        else if (ua.indexOf('gecko') !== -1) { return "gecko"; }
        else { return "ie"; }
    },
    /*
        检查是否被内嵌在frame或iframe中
    */
    isFrame: function () {
        return (top != window || (self.frameElement != null && self.frameElement.tagName == "IFRAME"));
    },
    /*
        检测是否支持全屏
    */
    hasFullscreen: function () {
        var doc = document.documentElement;
        var isSupport = ('requestFullscreen' in doc) ||
               ('webkitRequestFullScreen' in doc) ||
               // 对Firefox除了能力判断，还加上了属性判断
               ('mozRequestFullScreen' in doc && document.mozFullScreenEnabled) ||
               false;
        return (isSupport && !checker.isFrame());
    },
    /*
        检查全屏状态
    */
    isFullscreen: function () {
        return window.fullScreenApi.isFullScreen();
    },
    /*
        检查是否支持通知
    */
    hasNotification: function () {
        return window.webkitNotifications || window.Notifications;
    },
    /*
        检查是否获得通知权限
    */
    isNotificationPermission: function () {
        return !!(checker.hasNotification().checkPermission() === 0);
    },
    /*
        检查是否支持网页连接
    */
    hasWebSockets: function () {
        return !!(window.WebSocket);
    }
};