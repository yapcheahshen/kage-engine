export class Polygon {
	// resolution : 0.1
	public array: Array<{x: number; y: number; off: boolean; }>;
	constructor(number?: number) {
	// property
		this.array = [];
		// initialize
		if (number) {
			for (let i = 0; i < number; i++) {
				this.push(0, 0, false);
			}
		}
	}

	// method
	public push(x: number, y: number, off: boolean = false) {
		this.array.push({
			x: Math.floor(x * 10) / 10,
			y: Math.floor(y * 10) / 10,
			off,
		});
	}

	public set(index: number, x: number, y: number, off: boolean = false) {
		this.array[index].x = Math.floor(x * 10) / 10;
		this.array[index].y = Math.floor(y * 10) / 10;
		this.array[index].off = off;
	}

	public reverse() {
		this.array.reverse();
	}

	public concat(poly: Polygon) {
		this.array = this.array.concat(poly.array);
	}

	public shift() {
		this.array.shift();
	}

	public unshift(x: number, y: number, off: boolean = false) {
		this.array.unshift({
			x: Math.floor(x * 10) / 10,
			y: Math.floor(y * 10) / 10,
			off,
		});
	}

}
