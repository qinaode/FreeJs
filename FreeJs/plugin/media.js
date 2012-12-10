(function (window) {
    navigator.getUserMedia = (navigator.getUserMedia ||
                                 navigator.webkitGetUserMedia ||
                                 navigator.mozGetUserMedia ||
                                 navigator.msGetUserMedia);

    window.URL = window.URL || window.webkitURL;

    //摄像头对象
    var camera = {
        //是否启用
        isEnable: false
    };

    //摄像头视频对象
    var cameraVideo = null;

    /*
        启用摄像头
        参数:
          --宽度
          --高度
    */
    camera.enable = function (width, height) {
        if (camera.isEnable) return;
        if (!cameraVideo)
        {
            cameraVideo = page.creatObject("freeJsCamera", "video");
            cameraVideo.style.width = (width || 800) + "px";
            cameraVideo.style.height = (height || 600) + "px";
            cameraVideo.style.display = "none";
        }

        if (!navigator.getUserMedia) return;

        navigator.getUserMedia({ video: true, audio: false }, goStream, noStream);
        //打开摄像头
        function goStream(stream) {
            camera.isEnable = true;
            //摄像头停用
            camera.stop = function () {
                if (!camera.isEnable) return;
                camera.isEnable = false;
                if (navigator.mozGetUserMedia) cameraVideo.mozSrcObject = null;
                else stream.stop();
            };
            //设置错误事件
            cameraVideo.onerror = function () {
                camera.isEnable = false;
                if (navigator.mozGetUserMedia) cameraVideo.mozSrcObject = null;
                else stream.stop();
                streamError();
            };

            try
            {
                //设置摄像头源
                if (navigator.mozGetUserMedia)
                {
                    cameraVideo.mozSrcObject = stream;
                } else
                {
                    cameraVideo.src = window.URL.createObjectURL(stream) || stream;
                }
                cameraVideo.play();
            }
            catch (e)
            {
                camera.isEnable = false;
                noStream();
            }
        }
        //找不到摄像头
        function noStream() {
            throw "无法获取到摄像头";
        }

        //流错误
        function streamError() {
            throw "摄像头控制发生异常";
        }
    };

    /*
        获取摄像头
    */
    camera.get = function () {
        return cameraVideo;
    };

    /*
        停用摄像头
    */
    camera.stop = function () { };

    //公开对象
    window.camera = camera;
})(window);