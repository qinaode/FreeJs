function create5star(pointX, pointY, size) {
    var points = [];
    var dig = math.pi / 5 * 4;
    //画5条边
    for (var i = 0; i < 5; i++)
    {
        points[points.length] = {
            x: (pointX + Math.sin(i * dig) * size) >> 0,
            y: (pointY + Math.cos(i * dig) * size) >> 0
        };
    }
    return points;
}

window.onload = function () {
    game.start("testCanvas", "2d", update, draw);
    texture2D.load("test", "Title.jpg");
    texture2D.load("bg", "qiang.jpg");
};

var r = 0;
var s = 0;
var sd = true;
var rd = true;
var rcolor = "";

function update() {
    if (sd)
    {
        if (s > 25) sd = false;
        s += 0.05;
    } else
    {
        if (s < 0) sd = true;
        s -= 0.05;
    }

    if (rd)
    {
        if (r > 2500)
        {
            rd = false;
            rcolor = "rgba(" + (Math.random() * 255 >> 0) + "," + (Math.random() * 255 >> 0) + "," + (Math.random() * 255 >> 0) + ",1.0)";
        }
        r += 5;
    } else
    {
        if (r < 0)
        {
            rd = true;
            rcolor = "rgba(" + (Math.random() * 255 >> 0) + "," + (Math.random() * 255 >> 0) + "," + (Math.random() * 255 >> 0) + ",1.0)";
        }
        r -= 5;
    }
}

function draw() {
    var sb = spriteBatch;

    graphics.clear("rgb(100, 149, 237)");

    //绘制被掩盖的底层
    sb.begin();
    sb.fillRect(0, 0, 800, 600, sb.getPattern(texture2D.get("bg")));

    sb.setShadow(5, -5, 10, color.black);
    sb.fillRect(10, 10, 50, 50, "#00ff00");
    sb.fillRect(40, 40, 50, 50, "#0000ff");
    sb.setShadow(3, 1, 5, color.black);
    sb.drawEllipse(400, 200, 100, 100, color.yellow);
    sb.drawPolygon([{ x: 575, y: 250 }, { x: 450, y: 400 }, { x: 700, y: 400 }], color.greenYellow);
    sb.beginTransform(math.pi / 180 * r);
    sb.fillPolygon(create5star(650, 100, 70), color.yellow);
    sb.endTransform();
    sb.setShadow();
    sb.drawLine(100, 100, 100, 400, color.red, 10);
    sb.beginTransform(math.pi / 180 * -r, null);
    sb.draw(texture2D.get("test"), 150, 200, 100, 100);
    sb.endTransform();
    sb.end();

    //绘制遮罩层
    sb.begin(null, "destination-atop");
    sb.beginTransform(math.pi / 180 * r, s);
    sb.fillEllipse(188, 144, 50, 25, color.green);
    sb.fillEllipse(195, 137, 25, 50, color.yellow);
    sb.end();

    //绘制持久可见层
    sb.begin();
    sb.drawRect(350, 250, 100, 100, rcolor, 10);
    sb.endTransform();
    sb.setShadow(3, -3, 10, color.blue);
    sb.fillText("FreeJs2D图形库图元演示", 100, 450, color.skyBlue, "Bold 52px 宋体");
    sb.fillText("by. Nivk", 500, 520, color.cyan, "Bold 52px 宋体");
    sb.setShadow(0, 0, 10, color.black);
    sb.fillText("鼠标: Locked=" + mouse.isLocked + " X=" + mouse.x + " Y=" + mouse.y, 10, 500, color.white, "Bold 24px 宋体");
    sb.fillText("按钮: L=" + mouse.leftButton + " M=" + mouse.middleButton + " R=" + mouse.rightButton, 10, 530, color.white, "Bold 24px 宋体");
    sb.fillText("按键: K=" + keyboard.isKeyDown(keys.k) + " E=" + keyboard.isKeyDown(keys.e) + " Y=" + keyboard.isKeyDown(keys.y), 10, 560, color.white, "Bold 24px 宋体");
    sb.end();
}
