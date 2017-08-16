export class Polygon {
	// resolution : 0.1
	public array: Array<{ x: number; y: number; off: boolean; }>;
	constructor(number?: number);
	constructor(array: Array<{ x: number; y: number; off?: boolean; }>);
	constructor(param?: number | Array<{ x: number; y: number; off?: boolean; }>) {
		// property
		this.array = [];
		// initialize
		if (param) {
			if (typeof param === "number") {
				for (let i = 0; i < param; i++) {
					this.push(0, 0, false);
				}
			} else {
				param.forEach(({ x, y, off }) => {
					this.push(x, y, off);
				});
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

	public clone() {
		const newpolygon = new Polygon();
		this.array.forEach(({ x, y, off }) => {
			newpolygon.push(x, y, off);
		});
		return newpolygon;
	}

	public translate(dx: number, dy: number) {
		this.array.forEach((point) => {
			point.x += dx;
			point.y += dy;
		});
		return this; // for chaining
	}

	public transformMatrix(a: number, b: number, c: number, d: number) {
		this.array.forEach((point) => {
			const { x, y } = point;
			point.x = a * x + b * y;
			point.y = c * x + d * y;
		});
		return this; // for chaining
	}

	/**
	 * Scales by hypot(x, y) and rotates by atan2(y, x). Corresponds to multiplying x+yi on complex plane.
	 */
	public transformMatrix2(x: number, y: number) {
		return this.transformMatrix(x, -y, y, x);
	}

	public reflectX() {
		this.array.forEach((point) => {
			point.x *= -1;
		});
		return this; // for chaining
	}

	public reflectY() {
		this.array.forEach((point) => {
			point.y *= -1;
		});
		return this; // for chaining
	}

	public rotate180() {
		return this.reflectX().reflectY(); // for chaining
	}

}
