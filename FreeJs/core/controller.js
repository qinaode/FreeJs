(function (window) {
    //预留游戏手柄
    var gamePad = {

    };

    /*
        鼠标
    */
    function Mouse() {
        /*
            预留功能
                //是否被锁定
                var isLock = false;
        */

        //按键状态
        this.leftButton = false;
        this.rightButton = false;
        this.middleButton = false;

        //当前位置
        this.x = 0;
        this.y = 0;

        //画布对象
        var canvasObj = document.getElementById(canvas.objectName);

        /*
            设置按钮状态
            参数:
              --鼠标事件
              --状态值
        */
        var setButtonState = function (e, state) {
            if (!+"\v1")
            {
                switch (e.button)
                {
                    case 1: window.mouse.leftButton = state; break;
                    case 2: window.mouse.rightButton = state; break;
                    case 4: window.mouse.middleButton = state; break;
                }
            }
            else
            {
                switch (e.which)
                {
                    case 1: window.mouse.leftButton = state; break;
                    case 2: window.mouse.middleButton = state; break;
                    case 3: window.mouse.rightButton = state; break;
                }
            }
        };

        //不显示右键菜单
        canvasObj.oncontextmenu = function () { return false; };

        //绑定鼠标按下事件
        canvasObj.addEventListener('mousedown', function (e) {
            setButtonState(e, true);
        }, false);

        //绑定鼠标松开事件
        canvasObj.addEventListener('mouseup', function (e) {
            setButtonState(e, false);
        }, false);

        //绑定鼠标移动事件
        canvasObj.addEventListener('mousemove', function (e) {
            //元素位置
            var elLocation = page.getObjectLocation(canvas.objectName);
            if (!checker.isFullscreen())
            {
                window.mouse.x = e.clientX - elLocation.x + 1;
                window.mouse.y = e.clientY - elLocation.y + 1;
            }
            else
            {
                window.mouse.x = e.clientX + 1;
                window.mouse.y = e.clientY + 1;
            }
        }, false);
    }

    /*
        键盘
    */
    function Keyboard() {
        //按键列表
        var keyArray = [];

        //画布对象
        var canvasObj = document.getElementById(canvas.objectName);

        /*
            设置按键状态
            参数:
              --按键
              --状态
        */
        var setKeyState = function (keyCode, state) {
            if (state)
            {
                for (var i = keyArray.length; i--;)
                {
                    if (keyArray[i] == keyCode) return;
                }
                keyArray.add(keyCode);
            }
            else
            {
                for (var i = keyArray.length; i--;)
                {
                    if (keyArray[i] == keyCode)
                    {
                        keyArray = keyArray.remove(i);
                    }
                }
            }
        };

        //绑定键盘按下事件
        document.onkeydown = function (e) {
            var currKey = 0, e = e || event;
            currKey = e.keyCode || e.which || e.charCode;
            setKeyState(currKey, true);
        };

        //绑定键盘松开事件
        document.onkeyup = function (e) {
            var currKey = 0, e = e || event;
            currKey = e.keyCode || e.which || e.charCode;
            setKeyState(currKey, false);
        };

        /*
            判断按键是否按下
        */
        this.isKeyDown = function (keyCode) {
            for (var i = keyArray.length; i--;)
            {
                if (keyArray[i] === keyCode)
                {
                    return true;
                }
            }
            return false;
        };
    }

    //公开对象
    window.mouse = new Mouse();
    window.keyboard = new Keyboard();
})(window);