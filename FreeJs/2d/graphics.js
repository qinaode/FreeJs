(function (window) {
    //图形设备管理器
    var graphics = {};

    //画笔
    var spriteBatch = {};

    //上下文对象
    var ctx = canvas.context;

    //画布宽高
    var width = canvas.width;
    var height = canvas.height;

    //变换矩阵
    spriteBatch.transform = null;

    //是否已经开始变换矩阵
    spriteBatch.isBeginTransform = false;

    /*
        清空画布
        参数:
          --[可空]颜色
    */
    graphics.clear = function (color) {
        if (!color) return ctx.clearRect(0, 0, width, height);
        spriteBatch.fillRect(0, 0, width, height, color);
    };

    /*
        获取上下文
    */
    graphics.getContext = function () {
        return ctx;
    };

    /*
        设置大小
        参数:
          --宽度
          --高度
          --[可空]真设置或假设置
    */
    graphics.setSize = function (width, height, isTrue) {
        var c = document.getElementById(canvas.objectName);
        if (isTrue)
        {
            c.width = width;
            c.height = height;
            //设置画布大小
            canvas.width = width;
            canvas.height = height;
            canvas.size = { width: width, height: height };
        }
        else
        {
            c.style.width = width + "px";
            c.style.height = height + "px";
            //设置元素大小
            canvas.styleWidth = width;
            canvas.styleHeight = height;
            canvas.styleSize = { width: width, height: height };
        }
        c = null;
        delete c;
    };

    /*
        开始绘制
        参数:
          --[可空]全局Alpha值
          --[可空]全局合成操作
    */
    spriteBatch.begin = function (alpha, composite) {
        ctx.save();
        ctx.globalAlpha = alpha || 1.0;
        ctx.globalCompositeOperation = composite || "source-over";
    };

    /*
        结束绘制
    */
    spriteBatch.end = function () {
        ctx.restore();
    };

    /*
        开始变换矩阵
        参数:
          --[可空]旋转值
          --[可空]X缩放
          --[可空]Y缩放
    */
    spriteBatch.beginTransform = function (rotate, scaleX, scaleY) {
        spriteBatch.isBeginTransform = true;
        spriteBatch.transform = {
            scaleX: scaleX || null,
            scaleY: scaleY || null,
            rotate: rotate || null
        };
    };

    /*
        使用变换矩阵
        参数:
          --[System]
    */
    spriteBatch.useTransform = function (x, y, w, h) {
        if (!spriteBatch.isBeginTransform) return;
        var t = spriteBatch.transform;
        ctx.translate(x + .5 * w, y + .5 * h);
        if (t.rotate)
        {
            ctx.rotate(t.rotate);
        }
        if (t.scaleX)
        {
            if (t.scaleY) ctx.scale(t.scaleX, t.scaleY);
            else ctx.scale(t.scaleX, t.scaleX);
        }
    };

    /*
        使用后的变换矩阵
        参数:
          --[System]
    */
    spriteBatch.usedTransform = function (x, y, w, h) {
        if (!spriteBatch.isBeginTransform) return;
        var t = spriteBatch.transform;
        if (t.rotate)
        {
            ctx.rotate(-t.rotate);
        }
        if (t.scaleX)
        {
            if (t.scaleY) ctx.scale(1 / t.scaleX, 1 / t.scaleY);
            else ctx.scale(1 / t.scaleX, 1 / t.scaleX);
            spriteBatch.scale = null;
        }
        ctx.translate(-(x + .5 * w), -(y + .5 * h));
    };

    /*
        结束变换矩阵
    */
    spriteBatch.endTransform = function () {
        spriteBatch.isBeginTransform = false;
        spriteBatch.transform = null;
    };

    /*
        设置阴影
        参数:
          --[可空]偏移X坐标
          --[可空]偏移Y坐标
          --[可空]模糊度
          --[可空]颜色
    */
    spriteBatch.setShadow = function (offsetX, offsetY, blur, color) {
        if (arguments.length === 0)
        {
            ctx.shadowOffsetX = ctx.shadowOffsetY = ctx.shadowBlur = ctx.shadowColor = null;
        }
        else
        {
            ctx.shadowOffsetX = offsetX;
            ctx.shadowOffsetY = offsetY;
            ctx.shadowBlur = blur;
            ctx.shadowColor = color;
        }
    };

    /*
        绘制图像
        参数:
          --图像对象
          --X位置
          --Y位置
          --[可空]宽度
          --[可空]高度
          --[可空]剪裁X位置
          --[可空]剪裁Y位置
          --[可空]剪裁宽度
          --[可空]剪裁高度
    */
    spriteBatch.draw = function (obj, x1, y1, w1, h1, x2, y2, w2, h2) {
        spriteBatch.useTransform(x1, y1, w1, h1);
        if (spriteBatch.isBeginTransform)
        {
            x1 = -0.5 * w1;
            y1 = -0.5 * h1;
        }
        switch (arguments.length)
        {
            case 1:
                ctx.drawImage(obj, 0, 0);
                break;
            case 3:
                ctx.drawImage(obj, x1, y1);
                break;
            case 5:
                ctx.drawImage(obj, x1, y1, w1, h1);
                break;
            case 9:
                ctx.drawImage(obj, x2, y2, w2, h2, x1, y1, w1, h1);
                break;
        }
        spriteBatch.usedTransform(x1, y1, w1, h1);
    };

    /*
        获取贴图
        参数:
          --图像
    */
    spriteBatch.getPattern = function (img) {
        return ctx.createPattern(img, "repeat");
    };

    /*
        绘制填充矩形
        参数:
          --X坐标
          --Y坐标
          --宽度
          --高度
          --[可空]颜色
    */
    spriteBatch.fillRect = function (x, y, w, h, color) {
        ctx.fillStyle = color || "#000000";
        spriteBatch.useTransform(x, y, w, h);
        if (spriteBatch.isBeginTransform) ctx.fillRect(-0.5 * w, -0.5 * h, w, h);
        else ctx.fillRect(x, y, w, h);
        spriteBatch.usedTransform(x, y, w, h);
    };

    /*
        绘制空心矩形
        参数:
          --X坐标
          --Y坐标
          --宽度
          --高度
          --[可空]颜色
          --[可空]线条宽度
    */
    spriteBatch.drawRect = function (x, y, w, h, color, lineWidth) {
        ctx.strokeStyle = color || "#000000";
        ctx.lineWidth = lineWidth || 1.0;
        spriteBatch.useTransform(x, y, w, h);
        if (spriteBatch.isBeginTransform) ctx.strokeRect(-0.5 * w, -0.5 * h, w, h);
        else ctx.strokeRect(x, y, w, h);
        spriteBatch.usedTransform(x, y, w, h);
    };

    /*
        绘制线条
        参数:
          --点1的X坐标
          --点1的Y坐标
          --点2的X坐标
          --点2的Y坐标
          --[可空]颜色
          --[可空]线条宽度
          --[可空]闭合样式
    */
    spriteBatch.drawLine = function (x1, y1, x2, y2, color, lineWidth, cap) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.strokeStyle = color || "#000000";
        ctx.lineWidth = lineWidth || 1.0;
        ctx.lineCap = cap || "butt";
        spriteBatch.useTransform(x1, y1, x2, y2);
        ctx.stroke();
        spriteBatch.usedTransform(x1, y1, x2, y2);
    };

    /*
        绘制填充椭圆
        参数:
          --X坐标
          --Y坐标
          --宽度
          --高度
          --[可空]颜色
          --[可空]线条宽度
    */
    spriteBatch.fillEllipse = function (x, y, w, h, color, lineWidth) {
        spriteBatch.drawEllipse(x, y, w, h, color, lineWidth, true);
    };

    /*
        绘制空心椭圆
        参数:
          --X坐标
          --Y坐标
          --宽度
          --高度
          --[可空]颜色
          --[可空]线条宽度
          --[System]
    */
    spriteBatch.drawEllipse = function (x, y, w, h, color, lineWidth, isFill) {
        //关键是bezierCurveTo中两个控制点的设置
        //0.5和0.6是两个关键系数（在本函数中为试验而得）
        var ox = 0.5 * w,
        oy = 0.6 * h;

        ctx.translate(x, y);
        spriteBatch.useTransform(x, y, w, h);
        ctx.beginPath();
        //从椭圆纵轴下端开始逆时针方向绘制
        ctx.moveTo(0, h);
        ctx.bezierCurveTo(ox, h, w, oy, w, 0);
        ctx.bezierCurveTo(w, -oy, ox, -h, 0, -h);
        ctx.bezierCurveTo(-ox, -h, -w, -oy, -w, 0);
        ctx.bezierCurveTo(-w, oy, -ox, h, 0, h);
        ctx.closePath();
        if (isFill) ctx.fillStyle = color || "#000000";
        else ctx.strokeStyle = color || "#000000";
        ctx.lineWidth = lineWidth || 1.0;
        (isFill) ? ctx.fill() : ctx.stroke();
        spriteBatch.usedTransform(x, y, w, h);
        ctx.translate(-x, -y);
    };

    /*
        绘制实心圆
        参数:
          --X坐标
          --Y坐标
          --半径
          --[可空]颜色
          --[可空]线条宽度
    */
    spriteBatch.fillCircle = function (x, y, radius, color, lineWidth) {
        spriteBatch.drawCircle(x, y, radius, color, lineWidth, true);
    };

    /*
        绘制空心圆
        参数:
          --X坐标
          --Y坐标
          --半径
          --[可空]颜色
          --[可空]线条宽度
          --[System]
    */
    spriteBatch.drawCircle = function (x, y, radius, color, lineWidth, isFill) {
        spriteBatch.useTransform(x, y, x + radius, y + radius);
        ctx.beginPath();
        if (isFill) ctx.fillStyle = color || "#000000";
        else ctx.strokeStyle = color || "#000000";
        ctx.lineWidth = lineWidth || 1.0;
        ctx.arc(x, y, radius, 0, Math.PI * 2, false);
        ctx.closePath();
        (isFill) ? ctx.fill() : ctx.stroke();
        spriteBatch.usedTransform(x, y, x + radius, y + radius);
    };

    /*
        绘制填充文字
        参数:
          --文本
          --X坐标
          --Y坐标
          --[可空]颜色
          --[可空]字体
    */
    spriteBatch.fillText = function (text, x, y, color, font) {
        ctx.fillStyle = color || "#000000";
        ctx.font = font || "Bold 14px Arial";
        ctx.fillText(text, x, y);
    };

    /*
        绘制空心文字
        参数:
          --文本
          --X坐标
          --Y坐标
          --[可空]颜色
          --[可空]字体
    */
    spriteBatch.drawText = function (text, x, y, color, font) {
        ctx.strokeStyle = color || "#000000";
        ctx.font = font || "Bold 14px Arial";
        ctx.strokeText(text, x, y);
    };

    /*
        绘制填充多边形
        参数:
          --点数组
          --[可空]颜色
    */
    spriteBatch.fillPolygon = function (list, color) {
        spriteBatch.drawPolygon(list, color || "#000000", null, null, true);
    };

    /*
        绘制空心多边形
        参数:
          --点数组
          --[可空]颜色
          --[可空]线条宽度
          --[可空]线条加入样式
          --[System]
    */
    spriteBatch.drawPolygon = function (list, color, lineWidth, lineJoin, isFill) {
        var x = list[0].x;
        var y = list[0].y;
        var w = list[0].x;
        var h = list[0].y;
        if (spriteBatch.isBeginTransform)
        {
            for (var i = list.length; i-- > 0;)
            {
                if (list[i].x < x) x = list[i].x;
                if (list[i].y < y) y = list[i].y;
                if (list[i].x > w) w = list[i].x;
                if (list[i].y > h) h = list[i].y;
            }
            w -= x;
            h -= y;
        }
        spriteBatch.useTransform(x, y, w, h);
        ctx.beginPath();
        if (spriteBatch.isBeginTransform)
        {
            for (var i = list.length; i--; ctx.lineTo((list[i].x - x) + (-0.5 * w), (list[i].y - y) + (-0.5 * h)));
        } else
        {
            ctx.moveTo(list[0].x, list[0].y);
            for (var i = list.length; i-- > 0; ctx.lineTo(list[i].x, list[i].y));
        }
        ctx.closePath();
        if (isFill) ctx.fillStyle = color || "#000000";
        else ctx.strokeStyle = color || "#000000";
        ctx.lineWidth = lineWidth || 1.0;
        ctx.lineJoin = lineJoin || "miter";
        (isFill) ? ctx.fill() : ctx.stroke();
        spriteBatch.usedTransform(x, y, w, h);
    };

    //公开对象
    window.graphics = graphics;
    window.spriteBatch = spriteBatch;
})(window);