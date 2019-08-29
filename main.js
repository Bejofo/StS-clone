WebFont.load({
    google: {
        families: ['Kreon'] // Same font Sts uses.
    },
    active: e => {
        console.log("font loaded!");
        init();
    }
});

const app = new PIXI.Application({
    backgroundColor: 0x1099bb,
    width: 1200,
    height: 600
});
document.body.appendChild(app.view);



class Card {
    constructor(title) {
        this.title = title;
    }
    generateSprite(x, y, i) {
        const graphics = new PIXI.Graphics();
        graphics.lineStyle(3, 0x5e4a3a, 1); // Oak color
        graphics.beginFill(0xefdecd, 1); // Almond color
        graphics.drawRoundedRect(0, 0, 200, 300, 16);  
        graphics.endFill();
        var texture = app.renderer.generateTexture(graphics);
        var blankCard = new PIXI.Sprite(texture);
        var card = new PIXI.Container();
        var text = new PIXI.Text(this.title, {
            fontFamily: 'Kreon',
            fontSize: 36,
            fill: 0x000000,
        });
        text.anchor.set(0.5, 0);
        text.x = 100;
        card.addChild(blankCard);
        card.addChild(text);

        function onDragStart(event) {
            // store a reference to the data
            // the reason for this is because of multitouch
            // we want to track the movement of this particular touch
            this.data = event.data;
            this.alpha = 0.9;
            this.zIndex = 100;
            this.dragging = true;
        }

        function onDragEnd() {
            this.alpha = 1;
            this.dragging = false;
            // set the interaction data to null
            this.data = null;
            const coords = {
                x: this.x,
                y: this.y,
                r: this.rotation
            };
			const dt = (cx,cy,x,y)=>(x-cx<0?Math.PI:0)+(Math.atan((y-cy)/(x-cx))+Math.PI/2); // Good luck reading that
            var t = dt(app.view.width / 2, app.view.height + 500, this.ox, this.oy);
            t - coords.r > Math.PI ? t -= 2 * Math.PI : (coords.r - t > Math.PI ? t += 2 * Math.PI : null) // Send help
            this.zIndex = this.oz
            const tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
                .to({
                    x: this.ox,
                    y: this.oy,
                    r: t
                }, 340) // Miliseconds
                .easing(TWEEN.Easing.Back.Out) // Quadratic.Out
                .onUpdate(() => { // Called after tween.js updates 'coords'.
                    this.x = coords.x;
                    this.y = coords.y;
                    this.rotation = coords.r;
                })
                .start();
        }

        function onDragMove() {
            if (this.dragging) {
                const newPosition = this.data.getLocalPosition(this.parent);
                this.x = newPosition.x;
                this.y = newPosition.y;
                //var theta = Math.atan(3/(this.x-400)) + 3.14/2;
				const dt = (cx,cy,x,y)=>(x-cx<0?Math.PI:0)+(Math.atan((y-cy)/(x-cx))+Math.PI/2)
                this.rotation = dt(app.view.width / 2, app.view.height + 500, this.x, this.y); // X y of f arc
            }
        }

        // enable the bunny to be interactive... this will allow it to respond to mouse and touch events
        card.interactive = true;
        // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
        card.buttonMode = true;
        // center the bunny's anchor point
        card.pivot.x = 100;
        card.pivot.y = 150;
        //c.pivot.y = c.height / 2;
        card.scale.set(0.4);
        card
            .on('pointerdown', onDragStart)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointermove', onDragMove);
        // For mouse-only events
        // .on('mousedown', onDragStart)
        // .on('mouseup', onDragEnd)
        // .on('mouseupoutside', onDragEnd)
        // .on('mousemove', onDragMove);
        // For touch-only events
        // .on('touchstart', onDragStart)
        // .on('touchend', onDragEnd)
        // .on('touchendoutside', onDragEnd)
        // .on('touchmove', onDragMove);
        card.x = x;
        card.y = y;
        card.ox = x;
        card.oy = y;
        card.oz = i;
        card.zIndex = i;
        card.rotation = this.determineTilt(app.view.width / 2, app.view.height + 500, x, y);
        return card;
    }
	determineTilt(cx, cy, x, y) { // one-liner unreadable version : (cx,cy,x,y)=>(x-cx<0?Math.PI:0)+(Math.atan((y-cy)/(x-cx))+Math.PI/2)
        var theta = Math.atan((y - cy) / (x - cx)) + Math.PI / 2;
        theta += x - cx < 0 ? Math.PI : 0;
        return theta;
    }
}




function init() {
    app.stage.sortableChildren = true;

    const arc = new PIXI.Graphics();
    arc.lineStyle(5, 0xAA00BB, 1);
    arc.arc(app.view.width / 2, app.view.height + 500, 600, (4 / 3) * Math.PI, (5 / 3) * Math.PI);
    app.stage.addChild(arc)

    // Scale mode for pixelation
    //texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;


    for (let i = 0; i < 11; i++) {
        var theta = (((5 / 3) * Math.PI - (4 / 3) * Math.PI) / 10) * i; // Calcute the degrees of seperateion between each card. 
        theta += (5 / 6) * Math.PI; // I don't know why I need this
        var r = 600;
        var x = r * Math.sin(theta);
        var y = r * Math.cos(theta);
        x += app.view.width / 2; // Arc center is at (400,110)
        y += app.view.height + 500;
        //console.log(x,y)
		var a = new Card("Test");
        app.stage.addChild(a.generateSprite(x,y,i));
    }



    function animate(time) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
    }
    requestAnimationFrame(animate);

};