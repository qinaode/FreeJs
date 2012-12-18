(function (window) {
    //连接列表
    var socketList = [];

    //连接对象
    socket = {};

    /*
        打开连接
        参数:
          --名称
          --连接地址
          --打开事件
          --触发消息事件
          --关闭事件
    */
    socket.open = function (name, url, onopen, onmessage, onclose) {
        if (!checker.hasWebSockets())
        {
            throw "不支持WebSockets";
            return;
        }

        var curSocket = new WebSocket(url);
        curSocket.onopen = onopen;
        curSocket.onmessage = onmessage;
        curSocket.onclose = function () {
            if (onclose) onclose();
            socket.close(name);
        };
        curSocket.onerror = function () {
            socket.close(name);
            throw "连接\"" + name + "\"异常断开";
        };
        socketList.add({ name: name, obj: curSocket });
    };

    /*
         发送消息
         参数:
           --名称
           --消息
    */
    socket.send = function (name, message) {
        socket.get(name).send(message);
    };

    /*
        获取连接
        参数:
          --名称
    */
    socket.get = function (name) {
        for (var i = socketList.length; i--;)
        {
            if (socketList[i].name == name)
            {
                return socketList[i].obj;
            }
        }
    };

    /*
        关闭连接
        参数:
          --名称
    */
    socket.close = function (name) {
        for (var i = socketList.length; i--;)
        {
            if (socketList[i].name == name)
            {
                socketList[i].obj.close();
                socketList = socketList.remove(i);
                break;
            }
        }
    };

    window.socket = socket;
})(window);