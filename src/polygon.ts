export class Polygon {
	// resolution : 0.1
	public get array(): ReadonlyArray<Readonly<{ x: number, y: number, off: boolean }>> {
		return this._array.map((_, i) => this.get(i));
	}
	public get length() {
		return this._array.length;
	}
	private _array: Array<{ x: number; y: number; off: boolean; }>;
	constructor(number?: number);
	constructor(array: Array<{ x: number; y: number; off?: boolean; }>);
	constructor(param?: number | Array<{ x: number; y: number; off?: boolean; }>) {
		// property
		this._array = [];
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
		this._array.push({ x, y, off });
	}

	public set(index: number, x: number, y: number, off: boolean = false) {
		this._array[index].x = x;
		this._array[index].y = y;
		this._array[index].off = off;
	}

	public get(index: number): Readonly<{ x: number, y: number, off: boolean }> {
		const { x, y, off } = this._array[index];
		return {
			x: Math.floor(x * 10) / 10, // should be Math.round?
			y: Math.floor(y * 10) / 10, // should be Math.round?
			off,
		};
	}

	public reverse() {
		this._array.reverse();
	}

	public concat(poly: Polygon) {
		this._array = this._array.concat(poly._array);
	}

	public shift() {
		this._array.shift();
	}

	public unshift(x: number, y: number, off: boolean = false) {
		this._array.unshift({ x, y, off });
	}

	public clone() {
		const newpolygon = new Polygon();
		this._array.forEach(({ x, y, off }) => {
			newpolygon.push(x, y, off);
		});
		return newpolygon;
	}

	public translate(dx: number, dy: number) {
		this._array.forEach((point) => {
			point.x += dx;
			point.y += dy;
		});
		return this; // for chaining
	}

	public transformMatrix(a: number, b: number, c: number, d: number) {
		this._array.forEach((point) => {
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
		this._array.forEach((point) => {
			point.x *= -1;
		});
		return this; // for chaining
	}

	public reflectY() {
		this._array.forEach((point) => {
			point.y *= -1;
		});
		return this; // for chaining
	}

	public rotate180() {
		return this.reflectX().reflectY(); // for chaining
	}

}
