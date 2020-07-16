import { Buhin } from "./buhin";
import { Polygons } from "./polygons";
import { stretch, Stroke } from "./stroke";
import { Font, select as selectFont } from "./font";

export enum KShotai {
	kMincho = 0,
	kGothic = 1,
}

export class Kage {
	static Buhin = Buhin;
	static Polygons = Polygons;

	// TODO: should be static
	public kMincho = KShotai.kMincho;
	public kGothic = KShotai.kGothic;

	public kFont: Font = selectFont(KShotai.kMincho);

	// properties
	public get kShotai(): KShotai {
		return this.kFont.shotai;
	}
	public set kShotai(shotai: KShotai) {
		this.kFont = selectFont(shotai);
	}

	public get kUseCurve(): boolean {
		return this.kFont.kUseCurve;
	}
	public set kUseCurve(value: boolean) {
		this.kFont.kUseCurve = value;
	}

	public kBuhin: Buhin;

	public stretch = stretch;

	constructor(size?: number) {
		this.kFont.setSize(size);

		this.kBuhin = new Buhin();
	}
	// method
	public makeGlyph(polygons: Polygons, buhin: string): void {
		const glyphData = this.kBuhin.search(buhin);
		this.makeGlyph2(polygons, glyphData);
	}

	public makeGlyph2(polygons: Polygons, data: string): void {
		if (data !== "") {
			const strokesArray = this.getEachStrokes(data);
			this.kFont.adjustStrokes(strokesArray);
			strokesArray.forEach((stroke) => {
				this.kFont.draw(polygons, stroke);
			});
		}
	}

	public makeGlyph3(data: string): Polygons[] {
		const result: Polygons[] = [];
		if (data !== "") {
			const strokesArray = this.getEachStrokes(data);
			this.kFont.adjustStrokes(strokesArray);
			strokesArray.forEach((stroke) => {
				const polygons = new Polygons();
				this.kFont.draw(polygons, stroke);
				result.push(polygons);
			});
		}
		return result;
	}

	public makeGlyphSeparated(data: string[]): Polygons[] {
		const strokesArrays = data.map((subdata) => this.getEachStrokes(subdata));
		this.kFont.adjustStrokes(strokesArrays.reduce((left, right) => left.concat(right), []));
		const polygons = new Polygons();
		return strokesArrays.map((strokesArray) => {
			const startIndex = polygons.array.length;
			strokesArray.forEach((stroke) => {
				this.kFont.draw(polygons, stroke);
			});
			const result = new Polygons();
			result.array = polygons.array.slice(startIndex);
			return result;
		});
	}

	protected getEachStrokes(glyphData: string): Stroke[] {
		let strokesArray: Stroke[] = [];
		const strokes = glyphData.split("$");
		strokes.forEach((stroke) => {
			const columns = stroke.split(":");
			if (Math.floor(+columns[0]) !== 99) {
				strokesArray.push(new Stroke([
					Math.floor(+columns[0]),
					Math.floor(+columns[1]),
					Math.floor(+columns[2]),
					Math.floor(+columns[3]),
					Math.floor(+columns[4]),
					Math.floor(+columns[5]),
					Math.floor(+columns[6]),
					Math.floor(+columns[7]),
					Math.floor(+columns[8]),
					Math.floor(+columns[9]),
					Math.floor(+columns[10]),
				]));
			} else {
				const buhin = this.kBuhin.search(columns[7]);
				if (buhin !== "") {
					strokesArray = strokesArray.concat(this.getEachStrokesOfBuhin(
						buhin,
						Math.floor(+columns[3]), Math.floor(+columns[4]),
						Math.floor(+columns[5]), Math.floor(+columns[6]),
						Math.floor(+columns[1]), Math.floor(+columns[2]),
						Math.floor(+columns[9]), Math.floor(+columns[10])));
				}
			}
		});
		return strokesArray;
	}

	protected getEachStrokesOfBuhin(
		buhin: string,
		x1: number, y1: number,
		x2: number, y2: number,
		sx: number, sy: number,
		sx2: number, sy2: number): Stroke[] {
		const strokes = this.getEachStrokes(buhin);
		const box = this.getBox(strokes);
		if (sx !== 0 || sy !== 0) {
			if (sx > 100) {
				sx -= 200;
			} else {
				sx2 = 0;
				sy2 = 0;
			}
		}
		strokes.forEach((stroke) => {
			if (sx !== 0 || sy !== 0) {
				stroke.stretch(sx, sx2, sy, sy2, box.minX, box.maxX, box.minY, box.maxY);
			}
			stroke.x1 = x1 + stroke.x1 * (x2 - x1) / 200;
			stroke.y1 = y1 + stroke.y1 * (y2 - y1) / 200;
			stroke.x2 = x1 + stroke.x2 * (x2 - x1) / 200;
			stroke.y2 = y1 + stroke.y2 * (y2 - y1) / 200;
			stroke.x3 = x1 + stroke.x3 * (x2 - x1) / 200;
			stroke.y3 = y1 + stroke.y3 * (y2 - y1) / 200;
			stroke.x4 = x1 + stroke.x4 * (x2 - x1) / 200;
			stroke.y4 = y1 + stroke.y4 * (y2 - y1) / 200;
		});
		return strokes;
	}

	protected getBox(strokes: Stroke[]): { minX: number, maxX: number, minY: number, maxY: number } {
		let minX = 200;
		let minY = 200;
		let maxX = 0;
		let maxY = 0;

		strokes.forEach((stroke) => {
			const {
				minX: sminX,
				maxX: smaxX,
				minY: sminY,
				maxY: smaxY,
			} = stroke.getBox();
			minX = Math.min(minX, sminX);
			maxX = Math.max(maxX, smaxX);
			minY = Math.min(minY, sminY);
			maxY = Math.max(maxY, smaxY);
		});
		return { minX, maxX, minY, maxY };
	}
}
