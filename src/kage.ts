import { Buhin } from "./buhin";
import { Polygons } from "./polygons";
import { stretch, Stroke } from "./stroke";
import { Font, select as selectFont } from "./font";

export enum KShotai {
	kMincho = 0,
	kGothic = 1,
}

export class Kage {
	// TODO: should be static
	public kMincho = KShotai.kMincho;
	public kGothic = KShotai.kGothic;

	public kFont: Font;

	// properties
	public get kShotai(): KShotai {
		return this.kFont.shotai;
	}
	public set kShotai(shotai: KShotai) {
		this.kFont = selectFont(shotai);
	}
	public kRate: number = 100; // must divide 1000
	public kMinWidthY: number;
	public kMinWidthT: number;
	public kWidth: number;
	public kKakato: number;
	public kL2RDfatten: number;
	public kMage: number;
	public kUseCurve: boolean;

	/** for KAKATO adjustment 000,100,200,300,400 */
	public kAdjustKakatoL: number[];
	/** for KAKATO adjustment 000,100,200,300 */
	public kAdjustKakatoR: number[];
	/** check area width */
	public kAdjustKakatoRangeX: number;
	/** 3 steps of checking */
	public kAdjustKakatoRangeY: number[];
	/** number of steps */
	public kAdjustKakatoStep: number;

	/** for UROKO adjustment 000,100,200,300 */
	public kAdjustUrokoX: number[];
	/** for UROKO adjustment 000,100,200,300 */
	public kAdjustUrokoY: number[];
	/** length for checking */
	public kAdjustUrokoLength: number[];
	/** number of steps */
	public kAdjustUrokoLengthStep: number;
	/** check for crossing. corresponds to length */
	public kAdjustUrokoLine: number[];

	public kAdjustUroko2Step: number;
	public kAdjustUroko2Length: number;
	public kAdjustTateStep: number;
	public kAdjustMageStep: number;

	public kBuhin: Buhin;

	public stretch = stretch;

	constructor(size?: number) {
		this.kShotai = KShotai.kMincho;
		if (size === 1) {
			this.kMinWidthY = 1.2;
			this.kMinWidthT = 3.6;
			this.kWidth = 3;
			this.kKakato = 1.8;
			this.kL2RDfatten = 1.1;
			this.kMage = 6;
			this.kUseCurve = false;

			this.kAdjustKakatoL = [8, 5, 3, 1, 0];
			this.kAdjustKakatoR = [4, 3, 2, 1];
			this.kAdjustKakatoRangeX = 12;
			this.kAdjustKakatoRangeY = [1, 11, 14, 18];
			this.kAdjustKakatoStep = 3;

			this.kAdjustUrokoX = [14, 12, 9, 7];
			this.kAdjustUrokoY = [7, 6, 5, 4];
			this.kAdjustUrokoLength = [13, 21, 30];
			this.kAdjustUrokoLengthStep = 3;
			this.kAdjustUrokoLine = [13, 15, 18];
		} else {
			this.kMinWidthY = 2;
			this.kMinWidthT = 6;
			this.kWidth = 5;
			this.kKakato = 3;
			this.kL2RDfatten = 1.1;
			this.kMage = 10;
			this.kUseCurve = false;

			this.kAdjustKakatoL = [14, 9, 5, 2, 0];
			this.kAdjustKakatoR = [8, 6, 4, 2];
			this.kAdjustKakatoRangeX = 20;
			this.kAdjustKakatoRangeY = [1, 19, 24, 30];
			this.kAdjustKakatoStep = 3;

			this.kAdjustUrokoX = [24, 20, 16, 12];
			this.kAdjustUrokoY = [12, 11, 9, 8];
			this.kAdjustUrokoLength = [22, 36, 50];
			this.kAdjustUrokoLengthStep = 3;
			this.kAdjustUrokoLine = [22, 26, 30];

			this.kAdjustUroko2Step = 3;
			this.kAdjustUroko2Length = 40;

			this.kAdjustTateStep = 4;

			this.kAdjustMageStep = 5;
		}

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
			this.kFont.adjustStrokes(this, strokesArray);
			strokesArray.forEach((stroke) => {
				this.kFont.draw(this, polygons, stroke);
			});
		}
	}

	public makeGlyph3(data: string): Polygons[] {
		const result: Polygons[] = [];
		if (data !== "") {
			const strokesArray = this.getEachStrokes(data);
			this.kFont.adjustStrokes(this, strokesArray);
			strokesArray.forEach((stroke) => {
				const polygons = new Polygons();
				this.kFont.draw(this, polygons, stroke);
				result.push(polygons);
			});
		}
		return result;
	}

	public makeGlyphSeparated(data: string[]): Polygons[] {
		const strokesArrays = data.map((subdata) => this.getEachStrokes(subdata));
		this.kFont.adjustStrokes(this, strokesArrays.reduce((left, right) => left.concat(right), []));
		const polygons = new Polygons();
		return strokesArrays.map((strokesArray) => {
			const startIndex = polygons.array.length;
			strokesArray.forEach((stroke) => {
				this.kFont.draw(this, polygons, stroke);
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
