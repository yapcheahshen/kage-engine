export class Buhin {
	protected hash: { [name: string]: string };

	constructor() {
		// initialize
		// no operation
		this.hash = {};
	}

	// method
	public set(name: string, data: string): void {
		this.hash[name] = data;
	}

	public search(name: string): string {
		if (this.hash[name]) {
			return this.hash[name];
		}
		return ""; // no data
	}

	public push(name: string, data: string): void {
		this.set(name, data);
	}
}

