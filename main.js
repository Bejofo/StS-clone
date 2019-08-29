WebFont.load({
    google: {
        families: ['Kreon']
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
        createBunny(x, y, i);
    }

    function createBunny(x, y, i) {
        // create our little bunny friend..
        //const bunny = new PIXI.Sprite(texture);
        const graphics = new PIXI.Graphics();
        graphics.lineStyle(3, 0x5e4a3a, 1);
        graphics.beginFill(0xefdecd, 1);
        graphics.drawRoundedRect(0, 0, 200, 300, 16);
        graphics.endFill();
        var texture = app.renderer.generateTexture(graphics);
        var c = new PIXI.Sprite(texture);
        var card = new PIXI.Container();
        text = new PIXI.Text('Test', {
            fontFamily: 'Kreon',
            fontSize: 36,
            fill: 0x000000,
            //wordWrap:true,
            //wordWrapWidth:200
        });
        text.anchor.set(0.5, 0);
        text.x = 100;
        card.addChild(c);
        card.addChild(text);
        c = card;

        // enable the bunny to be interactive... this will allow it to respond to mouse and touch events
        c.interactive = true;
        // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
        c.buttonMode = true;
        // center the bunny's anchor point
        c.pivot.x = 100;
        c.pivot.y = 150;
        //c.pivot.y = c.height / 2;
        c.scale.set(0.4);
        c
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
        c.x = x;
        c.y = y;
        c.ox = x;
        c.oy = y;
        c.oz = i;
        c.zIndex = i;
        c.rotation = determineTilt(app.view.width / 2, app.view.height + 500, x, y);
        app.stage.addChild(c);
        console.log(c);
    }

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
        var t = determineTilt(app.view.width / 2, app.view.height + 500, this.ox, this.oy);
        /*if(t-coords.r>Math.PI){
        	t-=2*Math.PI;
        } else if(coords.r-t>Math.PI){
        	t+=2*Math.PI;
        }*/
        t - coords.r > Math.PI ? t -= 2 * Math.PI : (coords.r - t > Math.PI ? t += 2 * Math.PI : null) // Send help
        //t=t-coords.r>Math.PI?t-2*Math.PI:(); // I want to die
        console.log(coords.r, t);
        this.zIndex = this.oz
        const tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
            .to({
                x: this.ox,
                y: this.oy,
                r: t
            }, 340) // Move to (300, 200) in 1 second.
            .easing(TWEEN.Easing.Back.Out) // Quadratic.Out
            .onUpdate(() => { // Called after tween.js updates 'coords'.
                // Move 'box' to the position described by 'coords' with a CSS translation.
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
            this.rotation = determineTilt(app.view.width / 2, app.view.height + 500, this.x, this.y); // X y of f arc
        }
    }

    function determineTilt(cx, cy, x, y) {
        var theta = Math.atan((y - cy) / (x - cx)) + Math.PI / 2;
        theta += x - cx < 0 ? Math.PI : 0;
        //theta%= 2*Math.PI;
        return theta;
    }




    function animate(time) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
    }
    requestAnimationFrame(animate);

};