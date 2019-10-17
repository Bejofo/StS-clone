var GraphicGenerator = {
    blankCard: function(width,height,radius,outlineC,fillC){
        const graphics = new PIXI.Graphics();
        graphics.lineStyle(3, 0x5e4a3a, 1); // Oak color
        graphics.beginFill(0xefdecd, 1); // Almond color
        graphics.drawRoundedRect(0, 0, config.cardWidth, config.cardHeight, config.cardRadius);
        graphics.endFill();
        var texture = app.renderer.generateTexture(graphics);
        return new PIXI.Sprite(texture);
    }
}