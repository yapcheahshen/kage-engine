export class Buhin {
	public push: typeof Buhin.prototype.set;
	protected hash: { [name: string]: string };

	constructor() {
		// initialize
		// no operation
		this.hash = {};
	}

	// method
	public set(name: string, data: string) {
		this.hash[name] = data;
	}

	public search(name: string) {
		if (this.hash[name]) {
			return this.hash[name];
		}
		return ""; // no data
	}
}

Buhin.prototype.push = Buhin.prototype.set;
