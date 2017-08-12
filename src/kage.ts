import { isCrossBoxWithOthers, isCrossWithOthers } from "./2d";
import { Buhin } from "./buhin";
import { dfDrawFont } from "./kagedf";
import { Polygons } from "./polygons";
import { stretch, Stroke } from "./stroke";
import { hypot, normalize } from "./util";

export enum KShotai {
	kMincho = 0,
	kGothic = 1,
}

export class Kage {
	// TODO: should be static
	public kMincho = KShotai.kMincho;
	public kGothic = KShotai.kGothic;

	// properties
	public kShotai: KShotai = KShotai.kMincho;
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
	public makeGlyph(polygons: Polygons, buhin: string) {
		const glyphData = this.kBuhin.search(buhin);
		this.makeGlyph2(polygons, glyphData);
	}

	public makeGlyph2(polygons: Polygons, data: string) {
		if (data !== "") {
			const strokesArray = this.adjustKirikuchi(
				this.adjustUroko2(
					this.adjustUroko(
						this.adjustKakato(
							this.adjustTate(
								this.adjustMage(
									this.adjustHane(
										this.getEachStrokes(data))))))));
			strokesArray.forEach((stroke) => {
				dfDrawFont(this, polygons, stroke);
			});
		}
	}

	public makeGlyph3(data: string) {
		const result: Polygons[] = [];
		if (data !== "") {
			const strokesArray = this.adjustKirikuchi(
				this.adjustUroko2(
					this.adjustUroko(
						this.adjustKakato(
							this.adjustTate(
								this.adjustMage(
									this.adjustHane(
										this.getEachStrokes(data))))))));
			strokesArray.forEach((stroke) => {
				const polygons = new Polygons();
				dfDrawFont(this, polygons, stroke);
				result.push(polygons);
			});
		}
		return result;
	}

	private getEachStrokes(glyphData: string) {
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

	private getEachStrokesOfBuhin(
		buhin: string,
		x1: number, y1: number,
		x2: number, y2: number,
		sx: number, sy: number,
		sx2: number, sy2: number) {
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

	private getBox(strokes: Stroke[]) {
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

	private adjustHane(strokesArray: Stroke[]) {
		strokesArray.forEach((stroke, i) => {
			if ((stroke.a1 === 1 || stroke.a1 === 2 || stroke.a1 === 6) && stroke.a3 === 4) {
				let lpx: number; // lastPointX
				let lpy: number; // lastPointY
				if (stroke.a1 === 1) {
					lpx = stroke.x2;
					lpy = stroke.y2;
				} else if (stroke.a1 === 2) {
					lpx = stroke.x3;
					lpy = stroke.y3;
				} else {
					lpx = stroke.x4;
					lpy = stroke.y4;
				}
				let mn = Infinity; // mostNear
				if (lpx + 18 < 100) {
					mn = lpx + 18;
				}
				strokesArray.forEach((stroke2, j) => {
					if (i !== j
						&& stroke2.a1 === 1
						&& stroke2.x1 === stroke2.x2 && stroke2.x1 < lpx
						&& stroke2.y1 <= lpy && stroke2.y2 >= lpy) {
						if (lpx - stroke2.x1 < 100) {
							mn = Math.min(mn, lpx - stroke2.x1);
						}
					}
				});
				if (mn !== Infinity) {
					stroke.opt3 += 7 - Math.floor(mn / 15);
				}
			}
		});
		return strokesArray;
	}

	private adjustMage(strokesArray: Stroke[]) {
		strokesArray.forEach((stroke, i) => {
			if (stroke.a1 === 3 && stroke.y2 === stroke.y3) {
				strokesArray.forEach((stroke2, j) => {
					if (i !== j && (
						(
							stroke2.a1 === 1
							&& stroke2.y1 === stroke2.y2
							&& !(stroke.x2 + 1 > stroke2.x2 || stroke.x3 - 1 < stroke2.x1)
							&& Math.abs(stroke.y2 - stroke2.y1) < this.kMinWidthT * this.kAdjustMageStep
						) || (
							stroke2.a1 === 3
							&& stroke2.y2 === stroke2.y3
							&& !(stroke.x2 + 1 > stroke2.x3 || stroke.x3 - 1 < stroke2.x2)
							&& Math.abs(stroke.y2 - stroke2.y2) < this.kMinWidthT * this.kAdjustMageStep
						))) {
						stroke.mageAdjustment += this.kAdjustMageStep - Math.floor(Math.abs(stroke.y2 - stroke2.y2) / this.kMinWidthT);
						if (stroke.mageAdjustment > this.kAdjustMageStep) {
							stroke.mageAdjustment = this.kAdjustMageStep;
						}
					}
				});
			}
		});
		return strokesArray;
	}

	private adjustTate(strokesArray: Stroke[]) {
		strokesArray.forEach((stroke, i) => {
			if ((stroke.a1 === 1 || stroke.a1 === 3 || stroke.a1 === 7)
				&& stroke.x1 === stroke.x2) {
				strokesArray.forEach((stroke2, j) => {
					if (i !== j
						&& (stroke2.a1 === 1 || stroke2.a1 === 3 || stroke2.a1 === 7)
						&& stroke2.x1 === stroke2.x2
						&& !(stroke.y1 + 1 > stroke2.y2 || stroke.y2 - 1 < stroke2.y1)
						&& Math.abs(stroke.x1 - stroke2.x1) < this.kMinWidthT * this.kAdjustTateStep) {
						stroke.tateAdjustment += this.kAdjustTateStep - Math.floor(Math.abs(stroke.x1 - stroke2.x1) / this.kMinWidthT);
						if (stroke.tateAdjustment > this.kAdjustTateStep) {
							stroke.tateAdjustment = this.kAdjustTateStep;
						}
					}
				});
			}
		});
		return strokesArray;
	}

	private adjustKakato(strokesArray: Stroke[]) {
		strokesArray.forEach((stroke, i) => {
			if (stroke.a1 === 1
				&& (stroke.a3 === 13 || stroke.a3 === 23)) {
				for (let k = 0; k < this.kAdjustKakatoStep; k++) {
					if (isCrossBoxWithOthers(
						strokesArray, i,
						stroke.x2 - this.kAdjustKakatoRangeX / 2,
						stroke.y2 + this.kAdjustKakatoRangeY[k],
						stroke.x2 + this.kAdjustKakatoRangeX / 2,
						stroke.y2 + this.kAdjustKakatoRangeY[k + 1])
						|| stroke.y2 + this.kAdjustKakatoRangeY[k + 1] > 200 // adjust for baseline
						|| stroke.y2 - stroke.y1 < this.kAdjustKakatoRangeY[k + 1] // for thin box
					) {
						stroke.opt3 += 3 - k;
						break;
					}
				}
			}
		});
		return strokesArray;
	}

	private adjustUroko(strokesArray: Stroke[]) {
		strokesArray.forEach((stroke, i) => {
			if (stroke.a1 === 1 && stroke.a3 === 0) { // no operation for TATE
				for (let k = 0; k < this.kAdjustUrokoLengthStep; k++) {
					let tx;
					let ty;
					let tlen;
					if (stroke.y1 === stroke.y2) { // YOKO
						tx = stroke.x2 - this.kAdjustUrokoLine[k];
						ty = stroke.y2 - 0.5;
						tlen = stroke.x2 - stroke.x1; // should be Math.abs(...)?
					} else {
						const [cosrad, sinrad] = (stroke.x1 === stroke.x2)
							? [0, (stroke.y2 - stroke.y1) / (stroke.x2 - stroke.x1) > 0 ? 1 : -1] // maybe unnecessary?
							: (stroke.x2 - stroke.x1 < 0)
								? normalize([stroke.x1 - stroke.x2, stroke.y1 - stroke.y2]) // for backward compatibility...
								: normalize([stroke.x2 - stroke.x1, stroke.y2 - stroke.y1]);
						tx = stroke.x2 - this.kAdjustUrokoLine[k] * cosrad - 0.5 * sinrad;
						ty = stroke.y2 - this.kAdjustUrokoLine[k] * sinrad - 0.5 * cosrad;
						tlen = hypot(stroke.y2 - stroke.y1, stroke.x2 - stroke.x1);
					}
					if (tlen < this.kAdjustUrokoLength[k]
						|| isCrossWithOthers(strokesArray, i, tx, ty, stroke.x2, stroke.y2)) {
						stroke.opt3 += this.kAdjustUrokoLengthStep - k;
						break;
					}
				}
			}
		});
		return strokesArray;
	}

	private adjustUroko2(strokesArray: Stroke[]) {
		strokesArray.forEach((stroke, i) => {
			if (stroke.a1 === 1 && stroke.a3 === 0 && stroke.y1 === stroke.y2) {
				let pressure = 0;
				strokesArray.forEach((stroke2, j) => {
					if (i !== j && (
						(
							stroke2.a1 === 1
							&& stroke2.y1 === stroke2.y2
							&& !(stroke.x1 + 1 > stroke2.x2 || stroke.x2 - 1 < stroke2.x1)
							&& Math.abs(stroke.y1 - stroke2.y1) < this.kAdjustUroko2Length
						) || (
							stroke2.a1 === 3
							&& stroke2.y2 === stroke2.y3
							&& !(stroke.x1 + 1 > stroke2.x3 || stroke.x2 - 1 < stroke2.x2)
							&& Math.abs(stroke.y1 - stroke2.y2) < this.kAdjustUroko2Length
						))) {
						pressure += (this.kAdjustUroko2Length - Math.abs(stroke.y1 - stroke2.y2)) ** 1.1;
					}
				});
				const result = Math.min(Math.floor(pressure / this.kAdjustUroko2Length), this.kAdjustUroko2Step) * 100;
				if (stroke.a3 < result) { // always true?
					stroke.opt3 = Math.min(Math.floor(pressure / this.kAdjustUroko2Length), this.kAdjustUroko2Step);
				}
			}
		});
		return strokesArray;
	}

	private adjustKirikuchi(strokesArray: Stroke[]) {
		strokesArray.forEach((stroke) => {
			if (stroke.a1 === 2 && stroke.a2 === 32
				&& stroke.x1 > stroke.x2 && stroke.y1 < stroke.y2) {
				for (const stroke2 of strokesArray) { // no need to skip when i == j
					if (stroke2.a1 === 1
						&& stroke2.x1 < stroke.x1 && stroke2.x2 > stroke.x1
						&& stroke2.y1 === stroke.y1 && stroke2.y1 === stroke2.y2) {
						stroke.kirikuchiAdjustment = 1;
						break;
					}
				}
			}
		});
		return strokesArray;
	}
}
