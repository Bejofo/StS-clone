WebFont.load({
    google: {
        families: ['Kreon'] // Same font Sts uses.
    },
    active: e => {
        console.log("font loaded!");
    }
});

const config = {
	screenWidth:1200,
	screenHeight:600,
	cardArcRadius:600,
	cardArcCenterYOffSet:500,
	cardWidth:200,
	cardHeight:300,
	cardRadius:16,
	cardInitalScale:0.4,
	cardZoomedScale:0.7,
	cardDescFontSize:26
}

const app = new PIXI.Application({
    backgroundColor: 0x1099bb,
    width: config.screenWidth,
    height: config.screenHeight
});
document.body.appendChild(app.view);



class Card {
    constructor(card) {
		this.effect = Object.assign({},card.effect);
		this.upgradedEffect = Object.assign({},card.upgradedEffect);
		this.upgrade = card.upgrade;
		this.desc = card.description;
		this.baseCost = card.baseCost.valueOf();
		this.id = card.id.valueOf();
        this.title = card.title.valueOf();
		this.sprite = null;
    }
    generateSprite(x, y, i) {
        const graphics = new PIXI.Graphics();
        graphics.lineStyle(3, 0x5e4a3a, 1); // Oak color
        graphics.beginFill(0xefdecd, 1); // Almond color
        graphics.drawRoundedRect(0, 0, config.cardWidth, config.cardHeight, config.cardRadius);  
        graphics.endFill();
        var texture = app.renderer.generateTexture(graphics);
        var blankCard = new PIXI.Sprite(texture);
        var card = new PIXI.Container();
        var title = new PIXI.Text(this.title, {
            fontFamily: 'Kreon',
            fontSize: 36,
            fill: 0x000000,
        });
        title.anchor.set(0.5, 0);
        title.x = 100;
		var desc = new PIXI.Text(this.desc(), {
            fontFamily: 'Kreon',
            fontSize: config.cardDescFontSize,
            fill: 0x000000,
			wordWrap:true,
			wordWrapWidth:180
        });
        desc.anchor.set(0.5, 0);
        desc.x = 100;
		desc.y = 50;
        card.addChild(blankCard);
        card.addChild(title);
		card.addChild(desc);
		function unzoom(){
			var scaly = {s:this.scale.x}
			const tween = new TWEEN.Tween(scaly).to({s:0.4},200).easing(TWEEN.Easing.Quadratic.Out).onUpdate(()=>this.scale.set(scaly.s)).start();
		}
        function onDragStart(event) {
            // store a reference to the data
            // the reason for this is because of multitouch
            // we want to track the movement of this particular touch
            this.data = event.data;
            this.alpha = 0.9;
            this.zIndex = 100;
            this.dragging = true;
			this.offset = Object.assign({}, event.data.global);
			this.offset.x -= this.x
			this.offset.y -= this.y
			var scaly = {s:this.scale.x}
			const tween = new TWEEN.Tween(scaly).to({s:0.7},200).easing(TWEEN.Easing.Quadratic.Out).onUpdate(()=>this.scale.set(scaly.s)).start();
			//this.pivot.x = this.offset.x;
			//this.pivot.y = this.offset.y;
		}

        function onDragEnd() {
            this.alpha = 1;
            this.dragging = false;
            // set the interaction data to null
            this.data = null;
            const coords = {
                x: this.x,
                y: this.y,
                r: this.rotation,
				s: this.scale.x
            };
			const dt = (cx,cy,x,y)=>(x-cx<0?Math.PI:0)+(Math.atan((y-cy)/(x-cx))+Math.PI/2); // Good luck reading that
            var t = dt(app.view.width / 2, app.view.height + 500, this.ox, this.oy);
            t - coords.r > Math.PI ? t -= 2 * Math.PI : (coords.r - t > Math.PI ? t += 2 * Math.PI : null) // Send help
            this.zIndex = this.oz
            const tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
                .to({
                    x: this.ox,
                    y: this.oy,
                    r: t,
					s: config.cardInitalScale
                }, 340) // Miliseconds
                .easing(TWEEN.Easing.Back.Out) // Quadratic.Out
                .onUpdate(() => { // Called after tween.js updates 'coords'.
                    this.x = coords.x;
                    this.y = coords.y;
                    this.rotation = coords.r;
					this.scale.set(coords.s)
                })
                .start();
        }
        function onDragMove(e) {
            if (this.dragging) {
                const n = this.data.getLocalPosition(this.parent);
				const dt = (cx,cy,x,y)=>(x-cx<0?Math.PI:0)+(Math.atan((y-cy)/(x-cx))+Math.PI/2);
				/*
                this.x += e.data.originalEvent.movementX;
                this.y += e.data.originalEvent.movementY;*/
				this.rotation = dt(app.view.width / 2, app.view.height + 500, n.x - this.offset.x, n.y - this.offset.y)
                this.x = (n.x - this.offset.x);
                this.y = (n.y - this.offset.y);
				//console.log(this.offset.x,n.x,this.x);
                //this.dragging = newPosition;
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
        card.scale.set(config.cardInitalScale);
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
        card.rotation = this.determineTilt(app.view.width / 2, app.view.height + config.cardArcCenterYOffSet, x, y);
		this.sprite = card;
        return card;
    }
	determineTilt(cx, cy, x, y) { // one-liner unreadable version : (cx,cy,x,y)=>(x-cx<0?Math.PI:0)+(Math.atan((y-cy)/(x-cx))+Math.PI/2)
        var theta = Math.atan((y - cy) / (x - cx)) + Math.PI / 2;
        theta += x - cx < 0 ? Math.PI : 0;
        return theta;
    }
}




//function init() {
    app.stage.sortableChildren = true;

    // const arc = new PIXI.Graphics();
    // arc.lineStyle(5, 0xAA00BB, 1);
    //arc.arc(app.view.width / 2, app.view.height + 500, 600, (4 / 3) * Math.PI, (5 / 3) * Math.PI);
    //app.stage.addChild(arc)
    // Scale mode for pixelation
    //texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
		var cards = [];

	function oldSpreadcards(c){
		for (let i = 0; i < c; i++) {
			var starting = (5 / 3) * Math.PI
			var ending = (4 / 3) * Math.PI
			var theta = ((starting - ending) / 9) * i; // Calcute the degrees of seperateion between each card. 
			var idk = (starting - ending)/2;
			theta += (5 / 6) * Math.PI; // I don't know why I need this
			theta += (10-c)*(idk/9); // Scale it;; 
			var r = config.cardArcRadius;
			var x = r * Math.sin(theta);
			var y = r * Math.cos(theta);
			x += app.view.width / 2; // Arc center is at (400,110)
			y += app.view.height + config.cardArcCenterYOffSet;
			var a = new Card(strike);
			cards.push(a);
			a.generateSprite(x,y,i);
			app.stage.addChild(a.sprite);
		}
	}
	
	oldSpreadcards(10);
	//console.log(startingDegreeAndIncremnet(10));

    function animate(time) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
    }
    requestAnimationFrame(animate);

//};