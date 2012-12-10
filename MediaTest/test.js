window.onload = function () {
    //导入媒体控制文件
    using("../FreeJs/plugin/media");

    //启用摄像头
    camera.enable();

    //开始游戏
    game.start("testCanvas", "2d", null, draw, null);

    texture2D.load("photoFrame", "images/photoFrame.png");
};

function draw() {
    //清空画布
    graphics.clear("#FFFFFF");

    //如果启用摄像头则绘制画面
    if (camera.isEnable)
    {
        spriteBatch.draw(camera.get(), 0, 0, 800, 600);
        spriteBatch.draw(texture2D.get("photoFrame"), 0, 0, 800, 600);
    }
}