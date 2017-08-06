export class Buhin {
	// method
	set(name, data) { // void
		this.hash[name] = data;
	}

	search(name) { // string
		if (this.hash[name]) {
			return this.hash[name];
		}
		return ""; // no data
	}

	constructor() {
		// initialize
		// no operation
		this.hash = {};
	}
}

Buhin.prototype.push = Buhin.prototype.set;
