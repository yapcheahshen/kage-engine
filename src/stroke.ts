export class Stroke {
	public a1: number;
	public a2: number;
	public a3: number;
	public x1: number;
	public y1: number;
	public x2: number;
	public y2: number;
	public x3: number;
	public y3: number;
	public x4: number;
	public y4: number;

	constructor(data: number[]) {
		[
			this.a1,
			this.a2,
			this.a3,
			this.x1,
			this.y1,
			this.x2,
			this.y2,
			this.x3,
			this.y3,
			this.x4,
			this.y4,
		] = data;
	}
}
