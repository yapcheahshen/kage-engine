import { Kage, KShotai } from "../../kage";
import { Polygons } from "../../polygons";
import { Stroke } from "../../stroke";
import { hypot, normalize } from "../../util";
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
}

export default Mincho;