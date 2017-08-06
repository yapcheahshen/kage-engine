import { isCrossBoxWithOthers, isCrossWithOthers } from "./2d";
import { Buhin } from "./buhin";
import { dfDrawFont } from "./kagedf";
import { Polygons } from "./polygons";

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
	public kRate: number;
	public kMinWidthY: number;
	public kMinWidthT: number;
	public kWidth: number;
	public kKakato: number;
	public kL2RDfatten: number;
	public kMage: number;
	public kUseCurve: number;

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
			this.kUseCurve = 0;

			this.kAdjustKakatoL = ([8, 5, 3, 1, 0]); // for KAKATO adjustment 000,100,200,300,400
			this.kAdjustKakatoR = ([4, 3, 2, 1]); // for KAKATO adjustment 000,100,200,300
			this.kAdjustKakatoRangeX = 12; // check area width
			this.kAdjustKakatoRangeY = ([1, 11, 14, 18]); // 3 steps of checking
			this.kAdjustKakatoStep = 3; // number of steps

			this.kAdjustUrokoX = ([14, 12, 9, 7]); // for UROKO adjustment 000,100,200,300
			this.kAdjustUrokoY = ([7, 6, 5, 4]); // for UROKO adjustment 000,100,200,300
			this.kAdjustUrokoLength = ([13, 21, 30]); // length for checking
			this.kAdjustUrokoLengthStep = 3; // number of steps
			this.kAdjustUrokoLine = ([13, 15, 18]); // check for crossing. corresponds to length
		} else {
			this.kMinWidthY = 2;
			this.kMinWidthT = 6;
			this.kWidth = 5;
			this.kKakato = 3;
			this.kL2RDfatten = 1.1;
			this.kMage = 10;
			this.kUseCurve = 0;

			this.kAdjustKakatoL = ([14, 9, 5, 2, 0]); // for KAKATO adjustment 000,100,200,300,400
			this.kAdjustKakatoR = ([8, 6, 4, 2]); // for KAKATO adjustment 000,100,200,300
			this.kAdjustKakatoRangeX = 20; // check area width
			this.kAdjustKakatoRangeY = ([1, 19, 24, 30]); // 3 steps of checking
			this.kAdjustKakatoStep = 3; // number of steps

			this.kAdjustUrokoX = ([24, 20, 16, 12]); // for UROKO adjustment 000,100,200,300
			this.kAdjustUrokoY = ([12, 11, 9, 8]); // for UROKO adjustment 000,100,200,300
			this.kAdjustUrokoLength = ([22, 36, 50]); // length for checking
			this.kAdjustUrokoLengthStep = 3; // number of steps
			this.kAdjustUrokoLine = ([22, 26, 30]); // check for crossing. corresponds to length

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
			for (let i = 0; i < strokesArray.length; i++) {
				dfDrawFont(
					this, polygons,
					strokesArray[i][0],
					strokesArray[i][1], strokesArray[i][2],
					strokesArray[i][3], strokesArray[i][4],
					strokesArray[i][5], strokesArray[i][6],
					strokesArray[i][7], strokesArray[i][8],
					strokesArray[i][9], strokesArray[i][10]);
			}
		}
	}

	public makeGlyph3(data: string) {
		const result = [];
		if (data !== "") {
			const strokesArray = this.adjustKirikuchi(
				this.adjustUroko2(
					this.adjustUroko(
						this.adjustKakato(
							this.adjustTate(
								this.adjustMage(
									this.adjustHane(
										this.getEachStrokes(data))))))));
			for (let i = 0; i < strokesArray.length; i++) {
				const polygons = new Polygons();
				dfDrawFont(
					this, polygons,
					strokesArray[i][0],
					strokesArray[i][1], strokesArray[i][2],
					strokesArray[i][3], strokesArray[i][4],
					strokesArray[i][5], strokesArray[i][6],
					strokesArray[i][7], strokesArray[i][8],
					strokesArray[i][9], strokesArray[i][10]);
				result.push(polygons);
			}
		}
		return result;
	}

	public getEachStrokes(glyphData: string) {
		let strokesArray: number[][] = [];
		const strokes = glyphData.split("$");
		for (let i = 0; i < strokes.length; i++) {
			const columns = strokes[i].split(":");
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
		}
		return strokesArray;
	}

	public getEachStrokesOfBuhin(
		buhin: string,
		x1: number, y1: number,
		x2: number, y2: number,
		sx: number, sy: number,
		sx2: number, sy2: number) {
		const temp = this.getEachStrokes(buhin);
		const result = [];
		const box = this.getBox(buhin);
		if (sx !== 0 || sy !== 0) {
			if (sx > 100) {
				sx -= 200;
			} else {
				sx2 = 0;
				sy2 = 0;
			}
		}
		for (let i = 0; i < temp.length; i++) {
			if (sx !== 0 || sy !== 0) {
				temp[i][3] = this.stretch(sx, sx2, temp[i][3], box.minX, box.maxX);
				temp[i][4] = this.stretch(sy, sy2, temp[i][4], box.minY, box.maxY);
				temp[i][5] = this.stretch(sx, sx2, temp[i][5], box.minX, box.maxX);
				temp[i][6] = this.stretch(sy, sy2, temp[i][6], box.minY, box.maxY);
				if (temp[i][0] !== 99) {
					temp[i][7] = this.stretch(sx, sx2, temp[i][7], box.minX, box.maxX);
					temp[i][8] = this.stretch(sy, sy2, temp[i][8], box.minY, box.maxY);
					temp[i][9] = this.stretch(sx, sx2, temp[i][9], box.minX, box.maxX);
					temp[i][10] = this.stretch(sy, sy2, temp[i][10], box.minY, box.maxY);
				}
			}
			result.push([
				temp[i][0], temp[i][1], temp[i][2],
				x1 + temp[i][3] * (x2 - x1) / 200,
				y1 + temp[i][4] * (y2 - y1) / 200,
				x1 + temp[i][5] * (x2 - x1) / 200,
				y1 + temp[i][6] * (y2 - y1) / 200,
				x1 + temp[i][7] * (x2 - x1) / 200,
				y1 + temp[i][8] * (y2 - y1) / 200,
				x1 + temp[i][9] * (x2 - x1) / 200,
				y1 + temp[i][10] * (y2 - y1) / 200,
			]);
		}
		return result;
	}

	public getBox(glyph: string) {
		let minX = 200;
		let minY = 200;
		let maxX = 0;
		let maxY = 0;

		const strokes = this.getEachStrokes(glyph);
		for (let i = 0; i < strokes.length; i++) {
			if (strokes[i][0] === 0) {
				continue;
			}
			minX = Math.min(minX, strokes[i][3], strokes[i][5]);
			maxX = Math.max(maxX, strokes[i][3], strokes[i][5]);
			minY = Math.min(minY, strokes[i][4], strokes[i][6]);
			maxY = Math.max(maxY, strokes[i][4], strokes[i][6]);
			if (strokes[i][0] === 1) {
				continue;
			}
			if (strokes[i][0] === 99) {
				continue;
			}
			minX = Math.min(minX, strokes[i][7]);
			maxX = Math.max(maxX, strokes[i][7]);
			minY = Math.min(minY, strokes[i][8]);
			maxY = Math.max(maxY, strokes[i][8]);
			if (strokes[i][0] === 2) {
				continue;
			}
			if (strokes[i][0] === 3) {
				continue;
			}
			if (strokes[i][0] === 4) {
				continue;
			}
			minX = Math.min(minX, strokes[i][9]);
			maxX = Math.max(maxX, strokes[i][9]);
			minY = Math.min(minY, strokes[i][10]);
			maxY = Math.max(maxY, strokes[i][10]);
		}
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

	private adjustHane(sa: number[][]) {
		for (let i = 0; i < sa.length; i++) {
			if ((sa[i][0] === 1 || sa[i][0] === 2 || sa[i][0] === 6) && sa[i][2] === 4) {
				let lpx; // lastPointX
				let lpy; // lastPointY
				if (sa[i][0] === 1) {
					lpx = sa[i][5];
					lpy = sa[i][6];
				} else if (sa[i][0] === 2) {
					lpx = sa[i][7];
					lpy = sa[i][8];
				} else {
					lpx = sa[i][9];
					lpy = sa[i][10];
				}
				let mn = Infinity; // mostNear
				if (lpx + 18 < 100) {
					mn = lpx + 18;
				}
				for (let j = 0; j < sa.length; j++) {
					if (i !== j && sa[j][0] === 1 && sa[j][3] === sa[j][5] && sa[j][3] < lpx && sa[j][4] <= lpy && sa[j][6] >= lpy) {
						if (lpx - sa[j][3] < 100) {
							mn = Math.min(mn, lpx - sa[j][3]);
						}
					}
				}
				if (mn !== Infinity) {
					sa[i][2] += 700 - Math.floor(mn / 15) * 100; // 0-99 -> 0-700
				}
			}
		}
		return sa;
	}

	private adjustUroko(strokesArray: number[][]) {
		for (let i = 0; i < strokesArray.length; i++) {
			if (strokesArray[i][0] === 1 && strokesArray[i][2] === 0) { // no operation for TATE
				for (let k = 0; k < this.kAdjustUrokoLengthStep; k++) {
					let tx;
					let ty;
					let tlen;
					if (strokesArray[i][4] === strokesArray[i][6]) { // YOKO
						tx = strokesArray[i][5] - this.kAdjustUrokoLine[k];
						ty = strokesArray[i][6] - 0.5;
						tlen = strokesArray[i][5] - strokesArray[i][3];
					} else {
						const rad = Math.atan((strokesArray[i][6] - strokesArray[i][4]) / (strokesArray[i][5] - strokesArray[i][3]));
						tx = strokesArray[i][5] - this.kAdjustUrokoLine[k] * Math.cos(rad) - 0.5 * Math.sin(rad);
						ty = strokesArray[i][6] - this.kAdjustUrokoLine[k] * Math.sin(rad) - 0.5 * Math.cos(rad);
						tlen = Math.sqrt((strokesArray[i][6] - strokesArray[i][4]) ** 2 + (strokesArray[i][5] - strokesArray[i][3]) ** 2);
					}
					if (tlen < this.kAdjustUrokoLength[k]
						|| isCrossWithOthers(strokesArray, i, tx, ty, strokesArray[i][5], strokesArray[i][6])) {
						strokesArray[i][2] += (this.kAdjustUrokoLengthStep - k) * 100;
						k = Infinity;
					}
				}
			}
		}
		return strokesArray;
	}

	private adjustUroko2(strokesArray: number[][]) {
		for (let i = 0; i < strokesArray.length; i++) {
			if (strokesArray[i][0] === 1 && strokesArray[i][2] === 0 && strokesArray[i][4] === strokesArray[i][6]) {
				let pressure = 0;
				for (let j = 0; j < strokesArray.length; j++) {
					if (i !== j && (
						(
							strokesArray[j][0] === 1
							&& strokesArray[j][4] === strokesArray[j][6]
							&& !(strokesArray[i][3] + 1 > strokesArray[j][5] || strokesArray[i][5] - 1 < strokesArray[j][3])
							&& Math.abs(strokesArray[i][4] - strokesArray[j][4]) < this.kAdjustUroko2Length
						) || (
							strokesArray[j][0] === 3
							&& strokesArray[j][6] === strokesArray[j][8]
							&& !(strokesArray[i][3] + 1 > strokesArray[j][7] || strokesArray[i][5] - 1 < strokesArray[j][5])
							&& Math.abs(strokesArray[i][4] - strokesArray[j][6]) < this.kAdjustUroko2Length
						))) {
						pressure += Math.pow(this.kAdjustUroko2Length - Math.abs(strokesArray[i][4] - strokesArray[j][6]), 1.1);
					}
				}
				const result = Math.min(Math.floor(pressure / this.kAdjustUroko2Length), this.kAdjustUroko2Step) * 100;
				if (strokesArray[i][2] < result) {
					strokesArray[i][2] = strokesArray[i][2] % 100
						+ Math.min(Math.floor(pressure / this.kAdjustUroko2Length), this.kAdjustUroko2Step) * 100;
				}
			}
		}
		return strokesArray;
	}

	private adjustTate(strokesArray: number[][]) {
		for (let i = 0; i < strokesArray.length; i++) {
			if ((strokesArray[i][0] === 1 || strokesArray[i][0] === 3 || strokesArray[i][0] === 7)
				&& strokesArray[i][3] === strokesArray[i][5]) {
				for (let j = 0; j < strokesArray.length; j++) {
					if (i !== j
						&& (strokesArray[j][0] === 1 || strokesArray[j][0] === 3 || strokesArray[j][0] === 7)
						&& strokesArray[j][3] === strokesArray[j][5]
						&& !(strokesArray[i][4] + 1 > strokesArray[j][6] || strokesArray[i][6] - 1 < strokesArray[j][4])
						&& Math.abs(strokesArray[i][3] - strokesArray[j][3]) < this.kMinWidthT * this.kAdjustTateStep) {
						strokesArray[i][1] += (
							this.kAdjustTateStep - Math.floor(Math.abs(strokesArray[i][3] - strokesArray[j][3]) / this.kMinWidthT)
						) * 1000;
						if (strokesArray[i][1] > this.kAdjustTateStep * 1000) {
							strokesArray[i][1] = strokesArray[i][1] % 1000 + this.kAdjustTateStep * 1000;
						}
					}
				}
			}
		}
		return strokesArray;
	}

	private adjustMage(strokesArray: number[][]) {
		for (let i = 0; i < strokesArray.length; i++) {
			if (strokesArray[i][0] === 3 && strokesArray[i][6] === strokesArray[i][8]) {
				for (let j = 0; j < strokesArray.length; j++) {
					if (i !== j && (
						(
							strokesArray[j][0] === 1
							&& strokesArray[j][4] === strokesArray[j][6]
							&& !(strokesArray[i][5] + 1 > strokesArray[j][5] || strokesArray[i][7] - 1 < strokesArray[j][3])
							&& Math.abs(strokesArray[i][6] - strokesArray[j][4]) < this.kMinWidthT * this.kAdjustMageStep
						) || (
							strokesArray[j][0] === 3
							&& strokesArray[j][6] === strokesArray[j][8]
							&& !(strokesArray[i][5] + 1 > strokesArray[j][7] || strokesArray[i][7] - 1 < strokesArray[j][5])
							&& Math.abs(strokesArray[i][6] - strokesArray[j][6]) < this.kMinWidthT * this.kAdjustMageStep
						))) {
						strokesArray[i][2] += (
							this.kAdjustMageStep - Math.floor(Math.abs(strokesArray[i][6] - strokesArray[j][6]) / this.kMinWidthT)
						) * 1000;
						if (strokesArray[i][2] > this.kAdjustMageStep * 1000) {
							strokesArray[i][2] = strokesArray[i][2] % 1000 + this.kAdjustMageStep * 1000;
						}
					}
				}
			}
		}
		return strokesArray;
	}

	private adjustKirikuchi(strokesArray: number[][]) {
		for (let i = 0; i < strokesArray.length; i++) {
			if (strokesArray[i][0] === 2
				&& strokesArray[i][1] === 32
				&& strokesArray[i][3] > strokesArray[i][5]
				&& strokesArray[i][4] < strokesArray[i][6]) {
				for (let j = 0; j < strokesArray.length; j++) { // no need to skip when i == j
					if (strokesArray[j][0] === 1
						&& strokesArray[j][3] < strokesArray[i][3]
						&& strokesArray[j][5] > strokesArray[i][3]
						&& strokesArray[j][4] === strokesArray[i][4]
						&& strokesArray[j][4] === strokesArray[j][6]) {
						strokesArray[i][1] = 132;
						j = strokesArray.length;
					}
				}
			}
		}
		return strokesArray;
	}

	private adjustKakato(strokesArray: number[][]) { // strokesArray
		for (let i = 0; i < strokesArray.length; i++) {
			if (strokesArray[i][0] === 1
				&& (strokesArray[i][2] === 13 || strokesArray[i][2] === 23)) {
				for (let k = 0; k < this.kAdjustKakatoStep; k++) {
					if (isCrossBoxWithOthers(
						strokesArray, i,
						strokesArray[i][5] - this.kAdjustKakatoRangeX / 2,
						strokesArray[i][6] + this.kAdjustKakatoRangeY[k],
						strokesArray[i][5] + this.kAdjustKakatoRangeX / 2,
						strokesArray[i][6] + this.kAdjustKakatoRangeY[k + 1])
						|| strokesArray[i][6] + this.kAdjustKakatoRangeY[k + 1] > 200 // adjust for baseline
						|| strokesArray[i][6] - strokesArray[i][4] < this.kAdjustKakatoRangeY[k + 1] // for thin box
					) {
						strokesArray[i][2] += (3 - k) * 100;
						k = Infinity;
					}
				}
			}
		}
		return strokesArray;
	}
}
