import { Kage, KShotai } from "../../kage";
import { Polygons } from "../../polygons";
import { Stroke } from "../../stroke";
import { normalize } from "../../util";
import { Font } from "..";

import { cdDrawBezier, cdDrawCurve, cdDrawLine } from "./cd";

function dfDrawFont(
	kage: Kage, polygons: Polygons,
	{
		a1, x1, y1, x2, y2, x3, y3, x4, y4,
		a2_100, kirikuchiAdjustment, tateAdjustment, opt3,
		a3_100, opt2, mageAdjustment,
	}: Stroke): void {

	switch (a1 % 100) {
		case 0:
			break;
		case 1: {
			if (a3_100 === 4 && opt2 === 0 && mageAdjustment === 0) {
				const [dx1, dy1] = (x1 === x2 && y1 === y2)
					? [0, kage.kMage] // ?????
					: normalize([x1 - x2, y1 - y2], kage.kMage);
				const tx1 = x2 + dx1;
				const ty1 = y2 + dy1;
				cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment + opt3 * 10, 0);
				cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, x2 - kage.kMage * 2, y2 - kage.kMage * 0.5, 1, 0, 0, 0, 0, 0);
			} else {
				cdDrawLine(
					kage, polygons, x1, y1, x2, y2,
					a2_100 + kirikuchiAdjustment * 100, a3_100, tateAdjustment + opt3 * 10, opt2 + mageAdjustment * 10);
			}
			break;
		}
		case 2:
		case 12: {
			if (a3_100 === 4 && opt2 === 0 && mageAdjustment === 0) {
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
				cdDrawCurve(kage, polygons, tx1, ty1, x3, y3, x3 - kage.kMage * 2, y3 - kage.kMage * 0.5, 1, 0, 0, 0, 0, 0);
			} else if (a3_100 === 5 && opt2 === 0 && mageAdjustment === 0) {
				const tx1 = x3 + kage.kMage;
				const ty1 = y3;
				const tx2 = tx1 + kage.kMage * 0.5;
				const ty2 = y3 - kage.kMage * 2;
				cdDrawCurve(
					kage, polygons, x1, y1, x2, y2, x3, y3,
					a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment, 0, opt3, 0);
				cdDrawCurve(kage, polygons, x3, y3, tx1, ty1, tx2, ty2, 1, 0, 0, 0, 0, 0);
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
			cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1, 0, 0, 0, 0);

			if (a3_100 === 5 && opt2 === 0 && mageAdjustment === 0) {
				const tx3 = x3 - kage.kMage;
				const ty3 = y3;
				const tx4 = x3 + kage.kMage * 0.5;
				const ty4 = y3 - kage.kMage * 2;

				cdDrawLine(kage, polygons, tx2, ty2, tx3, ty3, 1, 1, 0, 0);
				cdDrawCurve(kage, polygons, tx3, ty3, x3, y3, tx4, ty4, 1, 0, 0, 0, 0, 0);
			} else {
				cdDrawLine(kage, polygons, tx2, ty2, x3, y3, 1, a3_100, 0, opt2 + mageAdjustment * 10);
			}
			break;
		}
		case 6: {
			if (a3_100 === 5 && opt2 === 0 && mageAdjustment === 0) {
				const tx1 = x4 - kage.kMage;
				const ty1 = y4;
				const tx2 = x4 + kage.kMage * 0.5;
				const ty2 = y4 - kage.kMage * 2;
				/*
				cdDrawCurve(x1, y1, x2, y2, (x2 + x3) / 2, (y2 + y3) / 2, a2, 1);
				cdDrawCurve((x2 + x3) / 2, (y2 + y3) / 2, x3, y3, tx1, ty1, 1, 1);
				 */
				cdDrawBezier(
					kage, polygons, x1, y1, x2, y2, x3, y3, tx1, ty1,
					a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment, 0, opt3, 0);
				cdDrawCurve(kage, polygons, tx1, ty1, x4, y4, tx2, ty2, 1, 0, 0, 0, 0, 0);
			} else {
				/*
				cdDrawCurve(x1, y1, x2, y2, (x2 + x3) / 2, (y2 + y3) / 2, a2, 1);
				cdDrawCurve((x2 + x3) / 2, (y2 + y3) / 2, x3, y3, x4, y4, 1, a3);
				 */
				cdDrawBezier(
					kage, polygons, x1, y1, x2, y2, x3, y3, x4, y4,
					a2_100 + kirikuchiAdjustment * 100, a3_100, tateAdjustment, opt2, opt3, mageAdjustment);
			}
			break;
		}
		case 7: {
			cdDrawLine(kage, polygons, x1, y1, x2, y2, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment + opt3 * 10, 0);
			cdDrawCurve(kage, polygons, x2, y2, x3, y3, x4, y4, 1, a3_100, 0, opt2, 0, mageAdjustment);
			break;
		}
		case 9: // may not be exist
			// kageCanvas[y1][x1] = 0;
			// kageCanvas[y2][x2] = 0;
			break;
		default:
			break;
	}
}

class Gothic implements Font {
	public shotai = KShotai.kGothic;
	public draw(kage: Kage, polygons: Polygons, stroke: Stroke): void {
		dfDrawFont(kage, polygons, stroke);
	}
}

export default Gothic;
