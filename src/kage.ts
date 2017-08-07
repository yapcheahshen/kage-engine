import { isCrossBoxWithOthers, isCrossWithOthers } from "./2d";
import { Buhin } from "./buhin";
import { dfDrawFont } from "./kagedf";
import { Polygons } from "./polygons";
import { hypot } from "./util";

export enum KShotai {
	kMincho = 0,
	kGothic = 1,
}

export class Kage {
	// TODO: must be static
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

	constructor(size?: number) {
		if (size === 1) {
			this.kMinWidthY = 1.2;
			this.kMinWidthT = 3.6;
			this.kWidth = 3;
			this.kKakato = 1.8;
			this.kL2RDfatten = 1.1;
			this.kMage = 6;
			this.kUseCurve = false;

			this.kAdjustKakatoL = [8, 5, 3, 1, 0]; // for KAKATO adjustment 000,100,200,300,400
			this.kAdjustKakatoR = [4, 3, 2, 1]; // for KAKATO adjustment 000,100,200,300
			this.kAdjustKakatoRangeX = 12; // check area width
			this.kAdjustKakatoRangeY = [1, 11, 14, 18]; // 3 steps of checking
			this.kAdjustKakatoStep = 3; // number of steps

			this.kAdjustUrokoX = [14, 12, 9, 7]; // for UROKO adjustment 000,100,200,300
			this.kAdjustUrokoY = [7, 6, 5, 4]; // for UROKO adjustment 000,100,200,300
			this.kAdjustUrokoLength = [13, 21, 30]; // length for checking
			this.kAdjustUrokoLengthStep = 3; // number of steps
			this.kAdjustUrokoLine = [13, 15, 18]; // check for crossing. corresponds to length
		} else {
			this.kMinWidthY = 2;
			this.kMinWidthT = 6;
			this.kWidth = 5;
			this.kKakato = 3;
			this.kL2RDfatten = 1.1;
			this.kMage = 10;
			this.kUseCurve = false;

			this.kAdjustKakatoL = [14, 9, 5, 2, 0]; // for KAKATO adjustment 000,100,200,300,400
			this.kAdjustKakatoR = [8, 6, 4, 2]; // for KAKATO adjustment 000,100,200,300
			this.kAdjustKakatoRangeX = 20; // check area width
			this.kAdjustKakatoRangeY = [1, 19, 24, 30]; // 3 steps of checking
			this.kAdjustKakatoStep = 3; // number of steps

			this.kAdjustUrokoX = [24, 20, 16, 12]; // for UROKO adjustment 000,100,200,300
			this.kAdjustUrokoY = [12, 11, 9, 8]; // for UROKO adjustment 000,100,200,300
			this.kAdjustUrokoLength = [22, 36, 50]; // length for checking
			this.kAdjustUrokoLengthStep = 3; // number of steps
			this.kAdjustUrokoLine = [22, 26, 30]; // check for crossing. corresponds to length

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
				dfDrawFont(
					this, polygons,
					stroke[0],
					stroke[1], stroke[2],
					stroke[3], stroke[4],
					stroke[5], stroke[6],
					stroke[7], stroke[8],
					stroke[9], stroke[10]);
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
				dfDrawFont(
					this, polygons,
					stroke[0],
					stroke[1], stroke[2],
					stroke[3], stroke[4],
					stroke[5], stroke[6],
					stroke[7], stroke[8],
					stroke[9], stroke[10]);
				result.push(polygons);
			});
		}
		return result;
	}

	public getEachStrokes(glyphData: string) {
		let strokesArray: number[][] = [];
		const strokes = glyphData.split("$");
		strokes.forEach((stroke) => {
			const columns = stroke.split(":");
			if (Math.floor(+columns[0]) !== 99) {
				strokesArray.push([
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
				]);
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

	public getEachStrokesOfBuhin(
		buhin: string,
		x1: number, y1: number,
		x2: number, y2: number,
		sx: number, sy: number,
		sx2: number, sy2: number) {
		const temp = this.getEachStrokes(buhin);
		const result: number[][] = [];
		const box = this.getBox(buhin);
		if (sx !== 0 || sy !== 0) {
			if (sx > 100) {
				sx -= 200;
			} else {
				sx2 = 0;
				sy2 = 0;
			}
		}
		temp.forEach((stroke) => {
			if (sx !== 0 || sy !== 0) {
				stroke[3] = this.stretch(sx, sx2, stroke[3], box.minX, box.maxX);
				stroke[4] = this.stretch(sy, sy2, stroke[4], box.minY, box.maxY);
				stroke[5] = this.stretch(sx, sx2, stroke[5], box.minX, box.maxX);
				stroke[6] = this.stretch(sy, sy2, stroke[6], box.minY, box.maxY);
				if (stroke[0] !== 99) {
					stroke[7] = this.stretch(sx, sx2, stroke[7], box.minX, box.maxX);
					stroke[8] = this.stretch(sy, sy2, stroke[8], box.minY, box.maxY);
					stroke[9] = this.stretch(sx, sx2, stroke[9], box.minX, box.maxX);
					stroke[10] = this.stretch(sy, sy2, stroke[10], box.minY, box.maxY);
				}
			}
			result.push([
				stroke[0], stroke[1], stroke[2],
				x1 + stroke[3] * (x2 - x1) / 200,
				y1 + stroke[4] * (y2 - y1) / 200,
				x1 + stroke[5] * (x2 - x1) / 200,
				y1 + stroke[6] * (y2 - y1) / 200,
				x1 + stroke[7] * (x2 - x1) / 200,
				y1 + stroke[8] * (y2 - y1) / 200,
				x1 + stroke[9] * (x2 - x1) / 200,
				y1 + stroke[10] * (y2 - y1) / 200,
			]);
		});
		return result;
	}

	public getBox(glyph: string) {
		let minX = 200;
		let minY = 200;
		let maxX = 0;
		let maxY = 0;

		const strokes = this.getEachStrokes(glyph);
		strokes.forEach((stroke) => {
			if (stroke[0] === 0) {
				return;
			}
			minX = Math.min(minX, stroke[3], stroke[5]);
			maxX = Math.max(maxX, stroke[3], stroke[5]);
			minY = Math.min(minY, stroke[4], stroke[6]);
			maxY = Math.max(maxY, stroke[4], stroke[6]);
			if (stroke[0] === 1) {
				return;
			}
			if (stroke[0] === 99) {
				return;
			}
			minX = Math.min(minX, stroke[7]);
			maxX = Math.max(maxX, stroke[7]);
			minY = Math.min(minY, stroke[8]);
			maxY = Math.max(maxY, stroke[8]);
			if (stroke[0] === 2 || stroke[0] === 3 || stroke[0] === 4) {
				return;
			}
			minX = Math.min(minX, stroke[9]);
			maxX = Math.max(maxX, stroke[9]);
			minY = Math.min(minY, stroke[10]);
			maxY = Math.max(maxY, stroke[10]);
		});
		return {
			minX,
			maxX,
			minY,
			maxY,
		};
	}

	public stretch(dp: number, sp: number, p: number, min: number, max: number) {
		let p1;
		let p2;
		let p3;
		let p4;
		if (p < sp + 100) {
			p1 = min;
			p3 = min;
			p2 = sp + 100;
			p4 = dp + 100;
		} else {
			p1 = sp + 100;
			p3 = dp + 100;
			p2 = max;
			p4 = max;
		}
		return Math.floor(((p - p1) / (p2 - p1)) * (p4 - p3) + p3);
	}

	private adjustHane(strokesArray: number[][]) {
		strokesArray.forEach((stroke, i) => {
			if ((stroke[0] === 1 || stroke[0] === 2 || stroke[0] === 6) && stroke[2] === 4) {
				let lpx: number; // lastPointX
				let lpy: number; // lastPointY
				if (stroke[0] === 1) {
					lpx = stroke[5];
					lpy = stroke[6];
				} else if (stroke[0] === 2) {
					lpx = stroke[7];
					lpy = stroke[8];
				} else {
					lpx = stroke[9];
					lpy = stroke[10];
				}
				let mn = Infinity; // mostNear
				if (lpx + 18 < 100) {
					mn = lpx + 18;
				}
				strokesArray.forEach((stroke2, j) => {
					if (i !== j
						&& stroke2[0] === 1
						&& stroke2[3] === stroke2[5] && stroke2[3] < lpx
						&& stroke2[4] <= lpy && stroke2[6] >= lpy) {
						if (lpx - stroke2[3] < 100) {
							mn = Math.min(mn, lpx - stroke2[3]);
						}
					}
				});
				if (mn !== Infinity) {
					stroke[2] += 700 - Math.floor(mn / 15) * 100; // 0-99 -> 0-700
				}
			}
		});
		return strokesArray;
	}

	private adjustUroko(strokesArray: number[][]) {
		strokesArray.forEach((stroke, i) => {
			if (stroke[0] === 1 && stroke[2] === 0) { // no operation for TATE
				for (let k = 0; k < this.kAdjustUrokoLengthStep; k++) {
					let tx;
					let ty;
					let tlen;
					if (stroke[4] === stroke[6]) { // YOKO
						tx = stroke[5] - this.kAdjustUrokoLine[k];
						ty = stroke[6] - 0.5;
						tlen = stroke[5] - stroke[3];
					} else {
						const rad = Math.atan((stroke[6] - stroke[4]) / (stroke[5] - stroke[3]));
						tx = stroke[5] - this.kAdjustUrokoLine[k] * Math.cos(rad) - 0.5 * Math.sin(rad);
						ty = stroke[6] - this.kAdjustUrokoLine[k] * Math.sin(rad) - 0.5 * Math.cos(rad);
						tlen = hypot(stroke[6] - stroke[4], stroke[5] - stroke[3]);
					}
					if (tlen < this.kAdjustUrokoLength[k]
						|| isCrossWithOthers(strokesArray, i, tx, ty, stroke[5], stroke[6])) {
						stroke[2] += (this.kAdjustUrokoLengthStep - k) * 100;
						break;
					}
				}
			}
		});
		return strokesArray;
	}

	private adjustUroko2(strokesArray: number[][]) {
		strokesArray.forEach((stroke, i) => {
			if (stroke[0] === 1 && stroke[2] === 0 && stroke[4] === stroke[6]) {
				let pressure = 0;
				strokesArray.forEach((stroke2, j) => {
					if (i !== j && (
						(
							stroke2[0] === 1
							&& stroke2[4] === stroke2[6]
							&& !(stroke[3] + 1 > stroke2[5] || stroke[5] - 1 < stroke2[3])
							&& Math.abs(stroke[4] - stroke2[4]) < this.kAdjustUroko2Length
						) || (
							stroke2[0] === 3
							&& stroke2[6] === stroke2[8]
							&& !(stroke[3] + 1 > stroke2[7] || stroke[5] - 1 < stroke2[5])
							&& Math.abs(stroke[4] - stroke2[6]) < this.kAdjustUroko2Length
						))) {
						pressure += (this.kAdjustUroko2Length - Math.abs(stroke[4] - stroke2[6])) ** 1.1;
					}
				});
				const result = Math.min(Math.floor(pressure / this.kAdjustUroko2Length), this.kAdjustUroko2Step) * 100;
				if (stroke[2] < result) {
					stroke[2] = stroke[2] % 100
						+ Math.min(Math.floor(pressure / this.kAdjustUroko2Length), this.kAdjustUroko2Step) * 100;
				}
			}
		});
		return strokesArray;
	}

	private adjustTate(strokesArray: number[][]) {
		strokesArray.forEach((stroke, i) => {
			if ((stroke[0] === 1 || stroke[0] === 3 || stroke[0] === 7)
				&& stroke[3] === stroke[5]) {
					strokesArray.forEach((stroke2, j) => {
					if (i !== j
						&& (stroke2[0] === 1 || stroke2[0] === 3 || stroke2[0] === 7)
						&& stroke2[3] === stroke2[5]
						&& !(stroke[4] + 1 > stroke2[6] || stroke[6] - 1 < stroke2[4])
						&& Math.abs(stroke[3] - stroke2[3]) < this.kMinWidthT * this.kAdjustTateStep) {
						stroke[1] += (
							this.kAdjustTateStep - Math.floor(Math.abs(stroke[3] - stroke2[3]) / this.kMinWidthT)
						) * 1000;
						if (stroke[1] > this.kAdjustTateStep * 1000) {
							stroke[1] = stroke[1] % 1000 + this.kAdjustTateStep * 1000;
						}
					}
				});
			}
		});
		return strokesArray;
	}

	private adjustMage(strokesArray: number[][]) {
		strokesArray.forEach((stroke, i) => {
			if (stroke[0] === 3 && stroke[6] === stroke[8]) {
				strokesArray.forEach((stroke2, j) => {
					if (i !== j && (
						(
							stroke2[0] === 1
							&& stroke2[4] === stroke2[6]
							&& !(stroke[5] + 1 > stroke2[5] || stroke[7] - 1 < stroke2[3])
							&& Math.abs(stroke[6] - stroke2[4]) < this.kMinWidthT * this.kAdjustMageStep
						) || (
							stroke2[0] === 3
							&& stroke2[6] === stroke2[8]
							&& !(stroke[5] + 1 > stroke2[7] || stroke[7] - 1 < stroke2[5])
							&& Math.abs(stroke[6] - stroke2[6]) < this.kMinWidthT * this.kAdjustMageStep
						))) {
						stroke[2] += (
							this.kAdjustMageStep - Math.floor(Math.abs(stroke[6] - stroke2[6]) / this.kMinWidthT)
						) * 1000;
						if (stroke[2] > this.kAdjustMageStep * 1000) {
							stroke[2] = stroke[2] % 1000 + this.kAdjustMageStep * 1000;
						}
					}
				});
			}
		});
		return strokesArray;
	}

	private adjustKirikuchi(strokesArray: number[][]) {
		strokesArray.forEach((stroke) => {
			if (stroke[0] === 2 && stroke[1] === 32
				&& stroke[3] > stroke[5] && stroke[4] < stroke[6]) {
				for (const stroke2 of strokesArray) { // no need to skip when i == j
					if (stroke2[0] === 1
						&& stroke2[3] < stroke[3] && stroke2[5] > stroke[3]
						&& stroke2[4] === stroke[4] && stroke2[4] === stroke2[6]) {
						stroke[1] = 132;
						break;
					}
				}
			}
		});
		return strokesArray;
	}

	private adjustKakato(strokesArray: number[][]) {
		strokesArray.forEach((stroke, i) => {
			if (stroke[0] === 1
				&& (stroke[2] === 13 || stroke[2] === 23)) {
				for (let k = 0; k < this.kAdjustKakatoStep; k++) {
					if (isCrossBoxWithOthers(
						strokesArray, i,
						stroke[5] - this.kAdjustKakatoRangeX / 2,
						stroke[6] + this.kAdjustKakatoRangeY[k],
						stroke[5] + this.kAdjustKakatoRangeX / 2,
						stroke[6] + this.kAdjustKakatoRangeY[k + 1])
						|| stroke[6] + this.kAdjustKakatoRangeY[k + 1] > 200 // adjust for baseline
						|| stroke[6] - stroke[4] < this.kAdjustKakatoRangeY[k + 1] // for thin box
					) {
						stroke[2] += (3 - k) * 100;
						break;
					}
				}
			}
		});
		return strokesArray;
	}
}
