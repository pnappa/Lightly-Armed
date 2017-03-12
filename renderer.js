//
//	Functions used to render UI and other features to the canvas
//
var drawElements = {};
var mainMenuAnims = {};

class Renderer {
	constructor(context, gameState) {
		this.ctx = context;
		this.gs = gameState;
	}

	_draw(obj) {
		//TOOD: draw the object onto the context
		// console.log(obj);
		if (obj.type == "text") {
			this.ctx.save();

			if ("rotation" in obj) {
				this.ctx.rotate(obj.rotation);
			}

			this.ctx.fillStyle = obj.colour;
			this.ctx.font = "" + obj["font-size"] + "px " + obj["font-family"];
			this.ctx.fillText(obj.value, obj["pos"][0], obj["pos"][1]);

			this.ctx.restore();

		} else if (obj.type == "shape") {
			this.ctx.save();

			if (obj.shape === "rect") {
				this.ctx.fillStyle = obj.colour;
				this.ctx.fillRect(obj.pos[0], obj.pos[1], obj.width, obj.height);
			}

			this.ctx.restore();
		} else if (obj.type == "image") {
			console.log("image cunt");
		}
	} 

	render() {

		this.ctx.clearRect(0,0,gameState.canvas.width,gameState.canvas.height);

		// warning! this assumes each array in getDraw is ordered by zlevel
		let objs = gameState.getDraws();

		// probe through draw objs to find next z val
		let cIndices = [];
		let lens = [];
		//total indices we can search
		let sum = 0;
		//current sum of indicies in cIndices
		let cSum = 0;
		Object.values(objs).forEach(
			(val, index) => 
				{ 
					cIndices.push(0); 
					lens.push(val.length);
					sum += val.length;
				});

		while (cSum < sum) {
			//find the next lowest zLevel
			let lowest = Infinity;
			let lowInd = 0;
			let lowObj = null;
			Object.values(objs).forEach(
				(state, index) =>
				{
					// we've drawn all for this obj
					if (cIndices[index] >= lens[index]) return;

					//if we found a new minimum, set that as the best candidate for next draw
					if (state[cIndices[index]]["zlevel"] <= lowest) {
						lowObj = state[cIndices[index]];
						lowest = lowObj["zlevel"];
						lowInd = index;
					}
				});

			if (!lowObj) throw "invalid render state";
			//draw the candidate
			cSum++;
			this._draw(lowObj);
			cIndices[lowInd]++;
		}
	}
}
