import { Polygon } from "../../polygon";
import { Polygons } from "../../polygons";
import { Stroke } from "../../stroke";
import { hypot, normalize, round } from "../../util";
import { isCrossBoxWithOthers, isCrossWithOthers } from "../../2d";
import { Font, StrokeDrawer } from "..";
import { KShotai } from "../shotai";

import { cdDrawBezier, cdDrawCurve, cdDrawLine } from "./cd";

interface MinchoAdjustedStroke {
	stroke: Stroke;

	kirikuchiAdjustment: number;
	tateAdjustment: number;
	opt3: number;

	haneAdjustment: number;
	urokoAdjustment: number;
	kakatoAdjustment: number;
	mageAdjustment: number;
}

function selectPolygonsRect(
	polygons: Polygons, x1: number, y1: number, x2: number, y2: number
): Polygon[] {
	return polygons.array.filter((polygon) => (
		polygon.array.every(({ x, y }) => x1 <= x && x <= x2 && y1 <= y && y <= y2)
	));
}

function dfDrawFont(
	font: Mincho, polygons: Polygons,
	{
		stroke: { a1_100, a2_100, a3_100, x1, y1, x2, y2, x3, y3, x4, y4 },
		kirikuchiAdjustment, tateAdjustment, opt3,
		haneAdjustment, urokoAdjustment, kakatoAdjustment, mageAdjustment,
	}: MinchoAdjustedStroke): void {

	switch (a1_100) { // ... no need to divide
		case 0:
			if (a2_100 === 98 && kirikuchiAdjustment === 0 && tateAdjustment === 0 && opt3 === 0) {
				const dx = x1 + x2, dy = 0;
				for (const polygon of selectPolygonsRect(polygons, x1, y1, x2, y2)) {
					polygon.scale(10).floor().reflectX().translate(dx * 10, dy * 10).scale(0.1);
				}
			} else if (a2_100 === 97 && kirikuchiAdjustment === 0 && tateAdjustment === 0 && opt3 === 0) {
				const dx = 0, dy = y1 + y2;
				for (const polygon of selectPolygonsRect(polygons, x1, y1, x2, y2)) {
					polygon.scale(10).floor().reflectY().translate(dx * 10, dy * 10).scale(0.1);
				}
			} else if (a2_100 === 99 && kirikuchiAdjustment === 0 && tateAdjustment === 0 && opt3 === 0) {
				if (a3_100 === 1 && haneAdjustment === 0 && mageAdjustment === 0) {
					const dx = x1 + y2, dy = y1 - x1;
					for (const polygon of selectPolygonsRect(polygons, x1, y1, x2, y2)) {
						// polygon.translate(-x1, -y2).rotate90().translate(x1, y1);
						polygon.scale(10).floor().rotate90().translate(dx * 10, dy * 10).scale(0.1);
					}
				} else if (a3_100 === 2 && haneAdjustment === 0 && mageAdjustment === 0) {
					const dx = x1 + x2, dy = y1 + y2;
					for (const polygon of selectPolygonsRect(polygons, x1, y1, x2, y2)) {
						polygon.scale(10).floor().rotate180().translate(dx * 10, dy * 10).scale(0.1);
					}
				} else if (a3_100 === 3 && haneAdjustment === 0 && mageAdjustment === 0) {
					const dx = x1 - y1, dy = y2 + x1;
					for (const polygon of selectPolygonsRect(polygons, x1, y1, x2, y2)) {
						// polygon.translate(-x1, -y1).rotate270().translate(x1, y2);
						polygon.scale(10).floor().rotate270().translate(dx * 10, dy * 10).scale(0.1);
					}
				}
			}
			break;
		case 1: {
			if (a3_100 === 4) {
				const [dx1, dy1] = (x1 === x2 && y1 === y2)
					? [0, font.kMage] // ?????
					: normalize([x1 - x2, y1 - y2], font.kMage);
				const tx1 = x2 + dx1;
				const ty1 = y2 + dy1;
				cdDrawLine(font, polygons, x1, y1, tx1, ty1, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment + opt3 * 10, 0, 0, 0);
				cdDrawCurve(
					font, polygons,
					tx1, ty1, x2, y2,
					x2 - font.kMage * (((font.kAdjustTateStep + 4) - tateAdjustment - opt3 * 10) / (font.kAdjustTateStep + 4)), y2,
					1, 14, tateAdjustment, haneAdjustment, opt3, mageAdjustment);
			} else {
				cdDrawLine(
					font, polygons, x1, y1, x2, y2,
					a2_100 + kirikuchiAdjustment * 100, a3_100, tateAdjustment + opt3 * 10, urokoAdjustment, kakatoAdjustment, mageAdjustment);
			}
			break;
		}
		case 2: {
			// case 12: // ... no need
			if (a3_100 === 4) {
				const [dx1, dy1] = (x2 === x3)
					? [0, -font.kMage] // ?????
					: (y2 === y3)
						? [-font.kMage, 0] // ?????
						: normalize([x2 - x3, y2 - y3], font.kMage);
				const tx1 = x3 + dx1;
				const ty1 = y3 + dy1;
				cdDrawCurve(
					font, polygons, x1, y1, x2, y2, tx1, ty1,
					a2_100 + kirikuchiAdjustment * 100, 0, tateAdjustment, 0, opt3, 0);
				cdDrawCurve(font, polygons, tx1, ty1, x3, y3, x3 - font.kMage, y3, 2, 14, tateAdjustment, haneAdjustment, 0, mageAdjustment);
			} else {
				cdDrawCurve(
					font, polygons, x1, y1, x2, y2, x3, y3,
					a2_100 + kirikuchiAdjustment * 100, (a3_100 === 5 && haneAdjustment === 0 && mageAdjustment === 0) ? 15 : a3_100,
					tateAdjustment, haneAdjustment, opt3, mageAdjustment);
			}
			break;
		}
		case 3: {
			const [dx1, dy1] = (x1 === x2 && y1 === y2)
				? [0, font.kMage] // ?????
				: normalize([x1 - x2, y1 - y2], font.kMage);
			const tx1 = x2 + dx1;
			const ty1 = y2 + dy1;
			const [dx2, dy2] = (x2 === x3 && y2 === y3)
				? [0, -font.kMage] // ?????
				: normalize([x3 - x2, y3 - y2], font.kMage);
			const tx2 = x2 + dx2;
			const ty2 = y2 + dy2;

			cdDrawLine(font, polygons, x1, y1, tx1, ty1, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment + opt3 * 10, 0, 0, 0);
			cdDrawCurve(font, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1, 0, 0, tateAdjustment + opt3 * 10, mageAdjustment);

			if (!(a3_100 === 5 && haneAdjustment === 0 && !((x2 < x3 && x3 - tx2 > 0) || (x2 > x3 && tx2 - x3 > 0)))) { // for closer position
				cdDrawLine(font, polygons, tx2, ty2, x3, y3,
					6, a3_100, mageAdjustment, urokoAdjustment, kakatoAdjustment, (a3_100 === 5 && haneAdjustment === 0) ? 0 : mageAdjustment); // bolder by force
			}
			break;
		}
		case 12: {
			cdDrawCurve(
				font, polygons, x1, y1, x2, y2, x3, y3,
				a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment, 0, opt3, 0);
			cdDrawLine(font, polygons, x3, y3, x4, y4, 6, a3_100, 0, urokoAdjustment, kakatoAdjustment, mageAdjustment);
			break;
		}
		case 4: {
			let rate = hypot(x3 - x2, y3 - y2) / 120 * 6;
			if (rate > 6) {
				rate = 6;
			}
			const [dx1, dy1] = (x1 === x2 && y1 === y2)
				? [0, font.kMage * rate] // ?????
				: normalize([x1 - x2, y1 - y2], font.kMage * rate);
			const tx1 = x2 + dx1;
			const ty1 = y2 + dy1;
			const [dx2, dy2] = (x2 === x3 && y2 === y3)
				? [0, -font.kMage * rate] // ?????
				: normalize([x3 - x2, y3 - y2], font.kMage * rate);
			const tx2 = x2 + dx2;
			const ty2 = y2 + dy2;

			cdDrawLine(font, polygons, x1, y1, tx1, ty1, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment + opt3 * 10, 0, 0, 0);
			cdDrawCurve(font, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1, 0, 0, 0, 0);

			if (!(a3_100 === 5 && haneAdjustment === 0 && mageAdjustment === 0 && x3 - tx2 <= 0)) { // for closer position
				cdDrawLine(font, polygons, tx2, ty2, x3, y3, 6, a3_100, 0, urokoAdjustment, kakatoAdjustment, mageAdjustment); // bolder by force
			}
			break;
		}
		case 6: {
			if (a3_100 === 4) {
				const [dx1, dy1] = (x3 === x4)
					? [0, -font.kMage] // ?????
					: (y3 === y4)
						? [-font.kMage, 0] // ?????
						: normalize([x3 - x4, y3 - y4], font.kMage);
				const tx1 = x4 + dx1;
				const ty1 = y4 + dy1;
				cdDrawBezier(
					font, polygons, x1, y1, x2, y2, x3, y3, tx1, ty1,
					a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment, 0, opt3, 0);
				cdDrawCurve(font, polygons, tx1, ty1, x4, y4, x4 - font.kMage, y4, 1, 14, 0, haneAdjustment, 0, mageAdjustment);
			} else {
				cdDrawBezier(
					font, polygons, x1, y1, x2, y2, x3, y3, x4, y4,
					a2_100 + kirikuchiAdjustment * 100, (a3_100 === 5 && haneAdjustment === 0 && mageAdjustment === 0) ? 15 : a3_100,
					tateAdjustment, haneAdjustment, opt3, mageAdjustment);
			}
			break;
		}
		case 7: {
			cdDrawLine(font, polygons, x1, y1, x2, y2, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment + opt3 * 10, 0, 0, 0);
			cdDrawCurve(
				font, polygons, x2, y2, x3, y3, x4, y4,
				1, a3_100, tateAdjustment, haneAdjustment, opt3, mageAdjustment);
			break;
		}
		case 9: // may not be exist ... no need
			// kageCanvas[y1][x1] = 0;
			// kageCanvas[y2][x2] = 0;
			break;
		default:
			break;
	}
}

/** Mincho style font. */
class Mincho implements Font {
	public readonly shotai: KShotai = KShotai.kMincho;

	public kRate: number = 100; // must divide 1000
	public kMinWidthY: number;
	public kMinWidthU: number;
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

	public constructor() {
		this.setSize();
	}

	public setSize(size?: number): void {
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
			this.kMinWidthU = 2;
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
	}

	public getDrawers(strokesArray: Stroke[]): StrokeDrawer[] {
		return this.adjustStrokes(strokesArray).map((adjStroke) => (polygons: Polygons) => {
			dfDrawFont(this, polygons, adjStroke);
		});
	}

	public adjustStrokes(strokesArray: Stroke[]): MinchoAdjustedStroke[] {
		const adjustedStrokes = strokesArray.map((stroke): MinchoAdjustedStroke => {
			const { a2_opt, a3_opt } = stroke;

			// a2:
			// - 100s place: adjustKirikuchi (when 2:X32);
			// - 1000s place: adjustTate (when {1,3,7});
			// - 10000s place: opt3
			const kirikuchiAdjustment = a2_opt % 10;
			const tateAdjustment = Math.floor(a2_opt / 10) % 10;
			const opt3 = Math.floor(a2_opt / 100);

			// a3:
			// - 100s place: adjustHane (when {1,2,6}::X04), adjustUroko/adjustUroko2 (when 1::X00),
			//               adjustKakato (when 1::X{13,23});
			// - 1000s place: adjustMage (when 3)
			const haneAdjustment = a3_opt % 10,
				urokoAdjustment = haneAdjustment,
				kakatoAdjustment = haneAdjustment;
			const mageAdjustment = Math.floor(a3_opt / 10);

			return {
				stroke,
				kirikuchiAdjustment, tateAdjustment, opt3,
				haneAdjustment, urokoAdjustment, kakatoAdjustment, mageAdjustment,
			};
		});
		this.adjustHane(adjustedStrokes);
		this.adjustMage(adjustedStrokes);
		this.adjustTate(adjustedStrokes);
		this.adjustKakato(adjustedStrokes);
		this.adjustUroko(adjustedStrokes);
		this.adjustUroko2(adjustedStrokes);
		this.adjustKirikuchi(adjustedStrokes);
		return adjustedStrokes;
	}

	protected adjustHane(adjStrokes: MinchoAdjustedStroke[]): MinchoAdjustedStroke[] {
		adjStrokes.forEach((adjStroke, i) => {
			const { stroke } = adjStroke;
			if ((stroke.a1_100 === 1 || stroke.a1_100 === 2 || stroke.a1_100 === 6) && stroke.a1_opt === 0
				&& stroke.a3_100 === 4 && stroke.a3_opt === 0) {
				let lpx: number; // lastPointX
				let lpy: number; // lastPointY
				if (stroke.a1_100 === 1) {
					lpx = stroke.x2;
					lpy = stroke.y2;
				} else if (stroke.a1_100 === 2) {
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
				adjStrokes.forEach(({ stroke: stroke2 }, j) => {
					if (i !== j
						&& stroke2.a1_100 === 1 && stroke2.a1_opt === 0
						&& stroke2.x1 === stroke2.x2 && stroke2.x1 < lpx
						&& stroke2.y1 <= lpy && stroke2.y2 >= lpy) {
						if (lpx - stroke2.x1 < 100) {
							mn = Math.min(mn, lpx - stroke2.x1);
						}
					}
				});
				if (mn !== Infinity) {
					adjStroke.haneAdjustment += 7 - Math.floor(mn / 15);
				}
			}
		});
		return adjStrokes;
	}

	protected adjustMage(adjStrokes: MinchoAdjustedStroke[]): MinchoAdjustedStroke[] {
		adjStrokes.forEach((adjStroke, i) => {
			const { stroke } = adjStroke;
			if (stroke.a1_100 === 3 && stroke.a1_opt === 0 && stroke.y2 === stroke.y3) {
				adjStrokes.forEach(({ stroke: stroke2 }, j) => {
					if (i !== j && (
						(
							stroke2.a1_100 === 1 && stroke2.a1_opt === 0
							&& stroke2.y1 === stroke2.y2
							&& !(stroke.x2 + 1 > stroke2.x2 || stroke.x3 - 1 < stroke2.x1)
							&& round(Math.abs(stroke.y2 - stroke2.y1)) < this.kMinWidthT * this.kAdjustMageStep
						) || (
							stroke2.a1_100 === 3 && stroke2.a1_opt === 0
							&& stroke2.y2 === stroke2.y3
							&& !(stroke.x2 + 1 > stroke2.x3 || stroke.x3 - 1 < stroke2.x2)
							&& round(Math.abs(stroke.y2 - stroke2.y2)) < this.kMinWidthT * this.kAdjustMageStep
						))) {
						adjStroke.mageAdjustment += this.kAdjustMageStep - Math.floor(Math.abs(stroke.y2 - stroke2.y2) / this.kMinWidthT);
						if (adjStroke.mageAdjustment > this.kAdjustMageStep) {
							adjStroke.mageAdjustment = this.kAdjustMageStep;
						}
					}
				});
			}
		});
		return adjStrokes;
	}

	protected adjustTate(adjStrokes: MinchoAdjustedStroke[]): MinchoAdjustedStroke[] {
		adjStrokes.forEach((adjStroke, i) => {
			const { stroke } = adjStroke;
			if ((stroke.a1_100 === 1 || stroke.a1_100 === 3 || stroke.a1_100 === 7) && stroke.a1_opt === 0
				&& stroke.x1 === stroke.x2) {
				adjStrokes.forEach(({ stroke: stroke2 }, j) => {
					if (i !== j
						&& (stroke2.a1_100 === 1 || stroke2.a1_100 === 3 || stroke2.a1_100 === 7) && stroke2.a1_opt === 0
						&& stroke2.x1 === stroke2.x2
						&& !(stroke.y1 + 1 > stroke2.y2 || stroke.y2 - 1 < stroke2.y1)
						&& round(Math.abs(stroke.x1 - stroke2.x1)) < this.kMinWidthT * this.kAdjustTateStep) {
						adjStroke.tateAdjustment += this.kAdjustTateStep - Math.floor(Math.abs(stroke.x1 - stroke2.x1) / this.kMinWidthT);
						if (adjStroke.tateAdjustment > this.kAdjustTateStep
							|| adjStroke.tateAdjustment === this.kAdjustTateStep && (stroke.a2_opt % 10 !== 0 || stroke.a2_100 !== 0)
							|| Math.floor(stroke.a2_opt / 100) !== 0) {
							adjStroke.tateAdjustment = this.kAdjustTateStep;
							adjStroke.opt3 = 0;
						}
					}
				});
			}
		});
		return adjStrokes;
	}

	protected adjustKakato(adjStrokes: MinchoAdjustedStroke[]): MinchoAdjustedStroke[] {
		const strokesArray = adjStrokes.map(({ stroke }) => stroke);
		adjStrokes.forEach((adjStroke, i) => {
			const { stroke } = adjStroke;
			if (stroke.a1_100 === 1 && stroke.a1_opt === 0
				&& (stroke.a3_100 === 13 || stroke.a3_100 === 23) && stroke.a3_opt === 0) {
				for (let k = 0; k < this.kAdjustKakatoStep; k++) {
					if (isCrossBoxWithOthers(
						strokesArray, i,
						stroke.x2 - this.kAdjustKakatoRangeX / 2,
						stroke.y2 + this.kAdjustKakatoRangeY[k],
						stroke.x2 + this.kAdjustKakatoRangeX / 2,
						stroke.y2 + this.kAdjustKakatoRangeY[k + 1])
						|| round(stroke.y2 + this.kAdjustKakatoRangeY[k + 1]) > 200 // adjust for baseline
						|| round(stroke.y2 - stroke.y1) < this.kAdjustKakatoRangeY[k + 1] // for thin box
					) {
						adjStroke.kakatoAdjustment = 3 - k;
						break;
					}
				}
			}
		});
		return adjStrokes;
	}

	protected adjustUroko(adjStrokes: MinchoAdjustedStroke[]): MinchoAdjustedStroke[] {
		const strokesArray = adjStrokes.map(({ stroke }) => stroke);
		adjStrokes.forEach((adjStroke, i) => {
			const { stroke } = adjStroke;
			if (stroke.a1_100 === 1 && stroke.a1_opt === 0
				&& stroke.a3_100 === 0 && stroke.a3_opt === 0) { // no operation for TATE
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
					if (round(tlen) < this.kAdjustUrokoLength[k]
						|| isCrossWithOthers(strokesArray, i, tx, ty, stroke.x2, stroke.y2)) {
						adjStroke.urokoAdjustment = this.kAdjustUrokoLengthStep - k;
						break;
					}
				}
			}
		});
		return adjStrokes;
	}

	protected adjustUroko2(adjStrokes: MinchoAdjustedStroke[]): MinchoAdjustedStroke[] {
		adjStrokes.forEach((adjStroke, i) => {
			const { stroke } = adjStroke;
			if (stroke.a1_100 === 1 && stroke.a1_opt === 0
				&& stroke.a3_100 === 0 && stroke.a3_opt === 0
				&& adjStroke.urokoAdjustment === 0
				&& stroke.y1 === stroke.y2) {
				let pressure = 0;
				adjStrokes.forEach(({ stroke: stroke2 }, j) => {
					if (i !== j && (
						(
							stroke2.a1_100 === 1 && stroke2.a1_opt === 0
							&& stroke2.y1 === stroke2.y2
							&& !(stroke.x1 + 1 > stroke2.x2 || stroke.x2 - 1 < stroke2.x1)
							&& round(Math.abs(stroke.y1 - stroke2.y1)) < this.kAdjustUroko2Length
						) || (
							stroke2.a1_100 === 3 && stroke2.a1_opt === 0
							&& stroke2.y2 === stroke2.y3
							&& !(stroke.x1 + 1 > stroke2.x3 || stroke.x2 - 1 < stroke2.x2)
							&& round(Math.abs(stroke.y1 - stroke2.y2)) < this.kAdjustUroko2Length
						))) {
						pressure += (this.kAdjustUroko2Length - Math.abs(stroke.y1 - stroke2.y2)) ** 1.1;
					}
				});
				// const result = Math.min(Math.floor(pressure / this.kAdjustUroko2Length), this.kAdjustUroko2Step) * 100;
				// if (stroke.a3 < result) {
				adjStroke.urokoAdjustment = Math.min(Math.floor(pressure / this.kAdjustUroko2Length), this.kAdjustUroko2Step);
				// }
			}
		});
		return adjStrokes;
	}

	protected adjustKirikuchi(adjStrokes: MinchoAdjustedStroke[]): MinchoAdjustedStroke[] {
		adjStrokes.forEach((adjStroke) => {
			const { stroke } = adjStroke;
			if (stroke.a1_100 === 2 && stroke.a1_opt === 0
				&& stroke.a2_100 === 32 && stroke.a2_opt === 0
				&& stroke.x1 > stroke.x2 && stroke.y1 < stroke.y2) {
				for (const { stroke: stroke2 } of adjStrokes) { // no need to skip when i == j
					if (stroke2.a1_100 === 1 && stroke2.a1_opt === 0
						&& stroke2.x1 < stroke.x1 && stroke2.x2 > stroke.x1 && stroke2.y1 === stroke.y1
						&& stroke2.y1 === stroke2.y2) {
						adjStroke.kirikuchiAdjustment = 1;
						break;
					}
				}
			}
		});
		return adjStrokes;
	}
}

export default Mincho;
