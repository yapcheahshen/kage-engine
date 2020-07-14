import { Kage, KShotai } from "../../kage";
import { Polygons } from "../../polygons";
import { Stroke } from "../../stroke";
import { hypot, normalize, round } from "../../util";
import { isCrossBoxWithOthers, isCrossWithOthers } from "../../2d";
import { Font } from "..";

import { cdDrawBezier, cdDrawCurve, cdDrawLine } from "./cd";

function dfDrawFont(
	kage: Kage, polygons: Polygons,
	{
		a1, x1, y1, x2, y2, x3, y3, x4, y4,
		a2_100, kirikuchiAdjustment, tateAdjustment, opt3,
		a3_100, opt2, mageAdjustment,
	}: Stroke): void {

	switch (a1 % 100) { // ... no need to divide
		case 0:
			if (a2_100 === 98 && kirikuchiAdjustment === 0 && tateAdjustment === 0 && opt3 === 0) {
				for (const polygon of polygons.array) {
					const inside = polygon.array.every(({ x, y }) => x1 <= x && x <= x2 && y1 <= y && y <= y2);
					if (inside) {
						const dx = x1 + x2, dy = 0;
						polygon.scale(10).floor().reflectX().translate(dx * 10, dy * 10).scale(0.1);
					}
				}
			} else if (a2_100 === 97 && kirikuchiAdjustment === 0 && tateAdjustment === 0 && opt3 === 0) {
				for (const polygon of polygons.array) {
					const inside = polygon.array.every(({ x, y }) => x1 <= x && x <= x2 && y1 <= y && y <= y2);
					if (inside) {
						const dx = 0, dy = y1 + y2;
						polygon.scale(10).floor().reflectY().translate(dx * 10, dy * 10).scale(0.1);
					}
				}
			} else if (a2_100 === 99 && kirikuchiAdjustment === 0 && tateAdjustment === 0 && opt3 === 0 && a3_100 === 1 && opt2 === 0 && mageAdjustment === 0) {
				for (const polygon of polygons.array) {
					const inside = polygon.array.every(({ x, y }) => x1 <= x && x <= x2 && y1 <= y && y <= y2);
					if (inside) {
						// polygon.translate(-x1, -y2).rotate90().translate(x1, y1);
						const dx = x1 + y2, dy = y1 - x1;
						polygon.scale(10).floor().rotate90().translate(dx * 10, dy * 10).scale(0.1);
					}
				}
			} else if (a2_100 === 99 && kirikuchiAdjustment === 0 && tateAdjustment === 0 && opt3 === 0 && a3_100 === 2 && opt2 === 0 && mageAdjustment === 0) {
				for (const polygon of polygons.array) {
					const inside = polygon.array.every(({ x, y }) => x1 <= x && x <= x2 && y1 <= y && y <= y2);
					if (inside) {
						const dx = x1 + x2, dy = y1 + y2;
						polygon.scale(10).floor().rotate180().translate(dx * 10, dy * 10).scale(0.1);
					}
				}
			} else if (a2_100 === 99 && kirikuchiAdjustment === 0 && tateAdjustment === 0 && opt3 === 0 && a3_100 === 3 && opt2 === 0 && mageAdjustment === 0) {
				for (const polygon of polygons.array) {
					const inside = polygon.array.every(({ x, y }) => x1 <= x && x <= x2 && y1 <= y && y <= y2);
					if (inside) {
						// polygon.translate(-x1, -y1).rotate270().translate(x1, y2);
						const dx = x1 - y1, dy = y2 + x1;
						polygon.scale(10).floor().rotate270().translate(dx * 10, dy * 10).scale(0.1);
					}
				}
			}
			break;
		case 1: {
			if (a3_100 === 4) {
				const [dx1, dy1] = (x1 === x2 && y1 === y2)
					? [0, kage.kMage] // ?????
					: normalize([x1 - x2, y1 - y2], kage.kMage);
				const tx1 = x2 + dx1;
				const ty1 = y2 + dy1;
				cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment + opt3 * 10, 0);
				cdDrawCurve(
					kage, polygons,
					tx1, ty1, x2, y2,
					x2 - kage.kMage * (((kage.kAdjustTateStep + 4) - tateAdjustment - opt3 * 10) / (kage.kAdjustTateStep + 4)), y2,
					1, 14, tateAdjustment, opt2, opt3, mageAdjustment);
			} else {
				cdDrawLine(
					kage, polygons, x1, y1, x2, y2,
					a2_100 + kirikuchiAdjustment * 100, a3_100, tateAdjustment + opt3 * 10, opt2 + mageAdjustment * 10);
			}
			break;
		}
		case 2: {
			// case 12: // ... no need
			if (a3_100 === 4) {
				const [dx1, dy1] = (x2 === x3)
					? [0, -kage.kMage] // ?????
					: (y2 === y3)
						? [-kage.kMage, 0] // ?????
						: normalize([x2 - x3, y2 - y3], kage.kMage);
				const tx1 = x3 + dx1;
				const ty1 = y3 + dy1;
				cdDrawCurve(
					kage, polygons, x1, y1, x2, y2, tx1, ty1,
					a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment, 0, opt3, 0);
				cdDrawCurve(kage, polygons, tx1, ty1, x3, y3, x3 - kage.kMage, y3, 1, 14, 0, opt2, 0, mageAdjustment);
			} else if (a3_100 === 5 && opt2 === 0 && mageAdjustment === 0) {
				cdDrawCurve(
					kage, polygons, x1, y1, x2, y2, x3, y3,
					a2_100 + kirikuchiAdjustment * 100, 15, tateAdjustment, 0, opt3, 0);
			} else {
				cdDrawCurve(
					kage, polygons, x1, y1, x2, y2, x3, y3,
					a2_100 + kirikuchiAdjustment * 100, a3_100, tateAdjustment, opt2, opt3, mageAdjustment);
			}
			break;
		}
		case 3: {
			const [dx1, dy1] = (x1 === x2 && y1 === y2)
				? [0, kage.kMage] // ?????
				: normalize([x1 - x2, y1 - y2], kage.kMage);
			const tx1 = x2 + dx1;
			const ty1 = y2 + dy1;
			const [dx2, dy2] = (x2 === x3 && y2 === y3)
				? [0, -kage.kMage] // ?????
				: normalize([x3 - x2, y3 - y2], kage.kMage);
			const tx2 = x2 + dx2;
			const ty2 = y2 + dy2;

			cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment + opt3 * 10, 0);
			cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1, 0, 0, tateAdjustment + opt3 * 10, mageAdjustment);

			if (a3_100 === 5 && opt2 === 0) {
				const tx3 = x3;
				const ty3 = y3;
				if ((x2 < x3 && tx3 - tx2 > 0) || (x2 > x3 && tx2 - tx3 > 0)) { // for closer position
					cdDrawLine(kage, polygons, tx2, ty2, tx3, ty3, 6, 5, mageAdjustment, 0); // bolder by force
				}
			} else {
				cdDrawLine(kage, polygons, tx2, ty2, x3, y3,
					6, a3_100, mageAdjustment, opt2 + mageAdjustment * 10); // bolder by force
			}
			break;
		}
		case 12: {
			cdDrawCurve(
				kage, polygons, x1, y1, x2, y2, x3, y3,
				a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment, 0, opt3, 0);
			cdDrawLine(kage, polygons, x3, y3, x4, y4, 6, a3_100, 0, opt2 + mageAdjustment * 10);
			break;
		}
		case 4: {
			let rate = hypot(x3 - x2, y3 - y2) / 120 * 6;
			if (rate > 6) {
				rate = 6;
			}
			const [dx1, dy1] = (x1 === x2 && y1 === y2)
				? [0, kage.kMage * rate] // ?????
				: normalize([x1 - x2, y1 - y2], kage.kMage * rate);
			const tx1 = x2 + dx1;
			const ty1 = y2 + dy1;
			const [dx2, dy2] = (x2 === x3 && y2 === y3)
				? [0, -kage.kMage * rate] // ?????
				: normalize([x3 - x2, y3 - y2], kage.kMage * rate);
			const tx2 = x2 + dx2;
			const ty2 = y2 + dy2;

			cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment + opt3 * 10, 0);
			cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1, 0, 0, 0, 0);

			if (a3_100 === 5 && opt2 === 0 && mageAdjustment === 0) {
				const tx3 = x3;
				const ty3 = y3;
				if (tx3 - tx2 > 0) { // for closer position
					cdDrawLine(kage, polygons, tx2, ty2, tx3, ty3, 6, 5, 0, 0); // bolder by force
				}
			} else {
				cdDrawLine(kage, polygons, tx2, ty2, x3, y3, 6, a3_100, 0, opt2 + mageAdjustment * 10); // bolder by force
			}
			break;
		}
		case 6: {
			if (a3_100 === 4) {
				const [dx1, dy1] = (x3 === x4)
					? [0, -kage.kMage] // ?????
					: (y3 === y4)
						? [-kage.kMage, 0] // ?????
						: normalize([x3 - x4, y3 - y4], kage.kMage);
				const tx1 = x4 + dx1;
				const ty1 = y4 + dy1;
				cdDrawBezier(
					kage, polygons, x1, y1, x2, y2, x3, y3, tx1, ty1,
					a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment, 0, opt3, 0);
				cdDrawCurve(kage, polygons, tx1, ty1, x4, y4, x4 - kage.kMage, y4, 1, 14, 0, opt2, 0, mageAdjustment);
			} else if (a3_100 === 5 && opt2 === 0 && mageAdjustment === 0) {
				cdDrawBezier(
					kage, polygons, x1, y1, x2, y2, x3, y3, x4, y4,
					a2_100 + kirikuchiAdjustment * 100, 15, tateAdjustment, 0, opt3, 0);
			} else {
				cdDrawBezier(
					kage, polygons, x1, y1, x2, y2, x3, y3, x4, y4,
					a2_100 + kirikuchiAdjustment * 100, a3_100, tateAdjustment, opt2, opt3, mageAdjustment);
			}
			break;
		}
		case 7: {
			cdDrawLine(kage, polygons, x1, y1, x2, y2, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment + opt3 * 10, 0);
			cdDrawCurve(
				kage, polygons, x2, y2, x3, y3, x4, y4,
				1, a3_100, tateAdjustment, opt2, opt3, mageAdjustment);
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

class Mincho implements Font {
	public shotai = KShotai.kMincho;

	public draw(kage: Kage, polygons: Polygons, stroke: Stroke): void {
		dfDrawFont(kage, polygons, stroke);
	}

	public adjustStrokes(kage: Kage, strokesArray: Stroke[]): Stroke[] {
		this.adjustHane(kage, strokesArray);
		this.adjustMage(kage, strokesArray);
		this.adjustTate(kage, strokesArray);
		this.adjustKakato(kage, strokesArray);
		this.adjustUroko(kage, strokesArray);
		this.adjustUroko2(kage, strokesArray);
		this.adjustKirikuchi(kage, strokesArray);
		return strokesArray;
	}

	protected adjustHane(_kage: Kage, strokesArray: Stroke[]): Stroke[] {
		strokesArray.forEach((stroke, i) => {
			if ((stroke.a1 === 1 || stroke.a1 === 2 || stroke.a1 === 6)
				&& stroke.a3_100 === 4 && stroke.opt2 === 0 && stroke.mageAdjustment === 0) {
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
					stroke.opt2 += 7 - Math.floor(mn / 15);
				}
			}
		});
		return strokesArray;
	}

	protected adjustMage(kage: Kage, strokesArray: Stroke[]): Stroke[] {
		strokesArray.forEach((stroke, i) => {
			if (stroke.a1 === 3 && stroke.y2 === stroke.y3) {
				strokesArray.forEach((stroke2, j) => {
					if (i !== j && (
						(
							stroke2.a1 === 1
							&& stroke2.y1 === stroke2.y2
							&& !(stroke.x2 + 1 > stroke2.x2 || stroke.x3 - 1 < stroke2.x1)
							&& round(Math.abs(stroke.y2 - stroke2.y1)) < kage.kMinWidthT * kage.kAdjustMageStep
						) || (
							stroke2.a1 === 3
							&& stroke2.y2 === stroke2.y3
							&& !(stroke.x2 + 1 > stroke2.x3 || stroke.x3 - 1 < stroke2.x2)
							&& round(Math.abs(stroke.y2 - stroke2.y2)) < kage.kMinWidthT * kage.kAdjustMageStep
						))) {
						stroke.mageAdjustment += kage.kAdjustMageStep - Math.floor(Math.abs(stroke.y2 - stroke2.y2) / kage.kMinWidthT);
						if (stroke.mageAdjustment > kage.kAdjustMageStep) {
							stroke.mageAdjustment = kage.kAdjustMageStep;
						}
					}
				});
			}
		});
		return strokesArray;
	}

	protected adjustTate(kage: Kage, strokesArray: Stroke[]): Stroke[] {
		strokesArray.forEach((stroke, i) => {
			if ((stroke.a1 === 1 || stroke.a1 === 3 || stroke.a1 === 7)
				&& stroke.x1 === stroke.x2) {
				strokesArray.forEach((stroke2, j) => {
					if (i !== j
						&& (stroke2.a1 === 1 || stroke2.a1 === 3 || stroke2.a1 === 7)
						&& stroke2.x1 === stroke2.x2
						&& !(stroke.y1 + 1 > stroke2.y2 || stroke.y2 - 1 < stroke2.y1)
						&& round(Math.abs(stroke.x1 - stroke2.x1)) < kage.kMinWidthT * kage.kAdjustTateStep) {
						stroke.tateAdjustment += kage.kAdjustTateStep - Math.floor(Math.abs(stroke.x1 - stroke2.x1) / kage.kMinWidthT);
						if (stroke.tateAdjustment > kage.kAdjustTateStep) {
							stroke.tateAdjustment = kage.kAdjustTateStep;
						}
					}
				});
			}
		});
		return strokesArray;
	}

	protected adjustKakato(kage: Kage, strokesArray: Stroke[]): Stroke[] {
		strokesArray.forEach((stroke, i) => {
			if (stroke.a1 === 1
				&& (stroke.a3_100 === 13 || stroke.a3_100 === 23) && stroke.opt2 === 0 && stroke.mageAdjustment === 0) {
				for (let k = 0; k < kage.kAdjustKakatoStep; k++) {
					if (isCrossBoxWithOthers(
						strokesArray, i,
						stroke.x2 - kage.kAdjustKakatoRangeX / 2,
						stroke.y2 + kage.kAdjustKakatoRangeY[k],
						stroke.x2 + kage.kAdjustKakatoRangeX / 2,
						stroke.y2 + kage.kAdjustKakatoRangeY[k + 1])
						|| round(stroke.y2 + kage.kAdjustKakatoRangeY[k + 1]) > 200 // adjust for baseline
						|| round(stroke.y2 - stroke.y1) < kage.kAdjustKakatoRangeY[k + 1] // for thin box
					) {
						stroke.opt2 += 3 - k;
						break;
					}
				}
			}
		});
		return strokesArray;
	}

	protected adjustUroko(kage: Kage, strokesArray: Stroke[]): Stroke[] {
		strokesArray.forEach((stroke, i) => {
			if (stroke.a1 === 1
				&& stroke.a3_100 === 0 && stroke.opt2 === 0 && stroke.mageAdjustment === 0) { // no operation for TATE
				for (let k = 0; k < kage.kAdjustUrokoLengthStep; k++) {
					let tx;
					let ty;
					let tlen;
					if (stroke.y1 === stroke.y2) { // YOKO
						tx = stroke.x2 - kage.kAdjustUrokoLine[k];
						ty = stroke.y2 - 0.5;
						tlen = stroke.x2 - stroke.x1; // should be Math.abs(...)?
					} else {
						const [cosrad, sinrad] = (stroke.x1 === stroke.x2)
							? [0, (stroke.y2 - stroke.y1) / (stroke.x2 - stroke.x1) > 0 ? 1 : -1] // maybe unnecessary?
							: (stroke.x2 - stroke.x1 < 0)
								? normalize([stroke.x1 - stroke.x2, stroke.y1 - stroke.y2]) // for backward compatibility...
								: normalize([stroke.x2 - stroke.x1, stroke.y2 - stroke.y1]);
						tx = stroke.x2 - kage.kAdjustUrokoLine[k] * cosrad - 0.5 * sinrad;
						ty = stroke.y2 - kage.kAdjustUrokoLine[k] * sinrad - 0.5 * cosrad;
						tlen = hypot(stroke.y2 - stroke.y1, stroke.x2 - stroke.x1);
					}
					if (round(tlen) < kage.kAdjustUrokoLength[k]
						|| isCrossWithOthers(strokesArray, i, tx, ty, stroke.x2, stroke.y2)) {
						stroke.opt2 += kage.kAdjustUrokoLengthStep - k;
						break;
					}
				}
			}
		});
		return strokesArray;
	}

	protected adjustUroko2(kage: Kage, strokesArray: Stroke[]): Stroke[] {
		strokesArray.forEach((stroke, i) => {
			if (stroke.a1 === 1 && stroke.a3_100 === 0 && stroke.opt2 === 0 && stroke.mageAdjustment === 0
				&& stroke.y1 === stroke.y2) {
				let pressure = 0;
				strokesArray.forEach((stroke2, j) => {
					if (i !== j && (
						(
							stroke2.a1 === 1
							&& stroke2.y1 === stroke2.y2
							&& !(stroke.x1 + 1 > stroke2.x2 || stroke.x2 - 1 < stroke2.x1)
							&& round(Math.abs(stroke.y1 - stroke2.y1)) < kage.kAdjustUroko2Length
						) || (
							stroke2.a1 === 3
							&& stroke2.y2 === stroke2.y3
							&& !(stroke.x1 + 1 > stroke2.x3 || stroke.x2 - 1 < stroke2.x2)
							&& round(Math.abs(stroke.y1 - stroke2.y2)) < kage.kAdjustUroko2Length
						))) {
						pressure += (kage.kAdjustUroko2Length - Math.abs(stroke.y1 - stroke2.y2)) ** 1.1;
					}
				});
				// const result = Math.min(Math.floor(pressure / kage.kAdjustUroko2Length), kage.kAdjustUroko2Step) * 100;
				// if (stroke.a3 < result) {
				stroke.opt2 = Math.min(Math.floor(pressure / kage.kAdjustUroko2Length), kage.kAdjustUroko2Step);
				// }
			}
		});
		return strokesArray;
	}

	protected adjustKirikuchi(_kage: Kage, strokesArray: Stroke[]): Stroke[] {
		strokesArray.forEach((stroke) => {
			if (stroke.a1 === 2
				&& stroke.a2_100 === 32 && stroke.kirikuchiAdjustment === 0 && stroke.tateAdjustment === 0 && stroke.opt3 === 0
				&& stroke.x1 > stroke.x2 && stroke.y1 < stroke.y2) {
				for (const stroke2 of strokesArray) { // no need to skip when i == j
					if (stroke2.a1 === 1
						&& stroke2.x1 < stroke.x1 && stroke2.x2 > stroke.x1 && stroke2.y1 === stroke.y1
						&& stroke2.y1 === stroke2.y2) {
						stroke.kirikuchiAdjustment = 1;
						break;
					}
				}
			}
		});
		return strokesArray;
	}
}

export default Mincho;
