export class Polygon {
	// resolution : 0.1
	// method
	push(x, y, off) { // void
		if (off != 1) {
			off = 0;
		}
		this.array.push({
			x: Math.floor(x * 10) / 10,
			y: Math.floor(y * 10) / 10,
			off,
		});
	}

	set(index, x, y, off) { // void
		this.array[index].x = Math.floor(x * 10) / 10;
		this.array[index].y = Math.floor(y * 10) / 10;
		if (off != 1) {
			off = 0;
		}
		this.array[index].off = off;
	}

	reverse() { // void
		this.array.reverse();
	}

	concat(poly) { // void
		this.array = this.array.concat(poly.array);
	}

	shift() { // void
		this.array.shift();
	}

	unshift(x, y, off) { // void
		if (off != 1) {
			off = 0;
		}
		this.array.unshift({
			x: Math.floor(x * 10) / 10,
			y: Math.floor(y * 10) / 10,
			off,
		});
	}

	constructor(number) {
	// property
		this.array = [];
		// initialize
		if (number) {
			for (let i = 0; i < number; i++) {
				this.push(0, 0, 0);
			}
		}
	}
}
