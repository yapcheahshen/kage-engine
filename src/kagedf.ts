import { Kage } from "./kage";
import { cdDrawBezier, cdDrawCurve, cdDrawLine } from "./kagecd";
import { Polygons } from "./polygons";
import { Stroke } from "./stroke";
import { hypot, normalize } from "./util";

export function dfDrawFont(
	kage: Kage, polygons: Polygons,
	{ a1, a2, a3, x1, y1, x2, y2, x3, y3, x4, y4, tateAdjustment, opt3, mageAdjustment }: Stroke) {

	if (kage.kShotai === kage.kMincho) {
		switch (a1 % 100) { // ... no need to divide
			case 0:
				break;
			case 1: {
				if (a3 % 100 === 4) {
					const [dx1, dy1] = (x1 === x2 && y1 === y2)
						? [0, kage.kMage] // ?????
						: normalize([x1 - x2, y1 - y2], kage.kMage);
					const tx1 = x2 + dx1;
					const ty1 = y2 + dy1;
					cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2 % 1000, 1, tateAdjustment, 0);
					cdDrawCurve(
						kage, polygons,
						tx1, ty1, x2, y2,
						x2 - kage.kMage * (((kage.kAdjustTateStep + 4) - tateAdjustment) / (kage.kAdjustTateStep + 4)), y2,
						1 + tateAdjustment * 1000, a3 + 10);
				} else {
					cdDrawLine(kage, polygons, x1, y1, x2, y2, a2 % 1000, a3 % 100, tateAdjustment, opt3 + mageAdjustment * 10);
				}
				break;
			}
			case 2: {
				// case 12: // ... no need
				if (a3 % 100 === 4) {
					const [dx1, dy1] = (x2 === x3)
						? [0, -kage.kMage] // ?????
						: (y2 === y3)
							? [-kage.kMage, 0] // ?????
							: normalize([x2 - x3, y2 - y3], kage.kMage);
					const tx1 = x3 + dx1;
					const ty1 = y3 + dy1;
					cdDrawCurve(kage, polygons, x1, y1, x2, y2, tx1, ty1, a2, 1);
					cdDrawCurve(kage, polygons, tx1, ty1, x3, y3, x3 - kage.kMage, y3, 1, a3 + 10);
				} else if (a3 === 5) {
					cdDrawCurve(kage, polygons, x1, y1, x2, y2, x3, y3, a2, 15);
				} else {
					cdDrawCurve(kage, polygons, x1, y1, x2, y2, x3, y3, a2, a3);
				}
				break;
			}
			case 3: {
				if (a3 % 1000 === 5) {
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
					const tx3 = x3;
					const ty3 = y3;

					cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2 % 1000, 1, tateAdjustment, 0);
					cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, tx2, ty2, 1 + tateAdjustment * 10000, 1 + mageAdjustment * 1000);
					if ((x2 < x3 && tx3 - tx2 > 0) || (x2 > x3 && tx2 - tx3 > 0)) { // for closer position
						cdDrawLine(kage, polygons, tx2, ty2, tx3, ty3, 6, 5, mageAdjustment, 0); // bolder by force
					}
				} else {
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
					cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2 % 1000, 1, tateAdjustment, 0);
					cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, tx2, ty2, 1 + tateAdjustment * 10000, 1 + mageAdjustment * 1000);
					cdDrawLine(kage, polygons, tx2, ty2, x3, y3, 6, a3 % 100, mageAdjustment, opt3 + mageAdjustment * 10); // bolder by force
				}
				break;
			}
			case 12: {
				cdDrawCurve(kage, polygons, x1, y1, x2, y2, x3, y3, a2, 1);
				cdDrawLine(kage, polygons, x3, y3, x4, y4, 6, a3 % 100, 0, opt3 + mageAdjustment * 10);
				break;
			}
			case 4: {
				let rate = 6;
				if ((x3 - x2) ** 2 + (y3 - y2) ** 2 < 14400) { // smaller than 120 x 120
					rate = hypot(x3 - x2, y3 - y2) / 120 * 6;
				}
				if (a3 === 5) {
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
					const tx3 = x3;
					const ty3 = y3;

					cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2 % 1000, 1, tateAdjustment, 0);
					cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1);
					if (tx3 - tx2 > 0) { // for closer position
						cdDrawLine(kage, polygons, tx2, ty2, tx3, ty3, 6, 5, 0, 0); // bolder by force
					}
				} else {
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
					cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2 % 1000, 1, tateAdjustment, 0);
					cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1);
					cdDrawLine(kage, polygons, tx2, ty2, x3, y3, 6, a3 % 100, 0, opt3 + mageAdjustment * 10); // bolder by force
				}
				break;
			}
			case 6: {
				if (a3 % 100 === 4) {
					const [dx1, dy1] = (x3 === x4)
						? [0, -kage.kMage] // ?????
						: (y3 === y4)
							? [-kage.kMage, 0] // ?????
							: normalize([x3 - x4, y3 - y4], kage.kMage);
					const tx1 = x4 + dx1;
					const ty1 = y4 + dy1;
					cdDrawBezier(kage, polygons, x1, y1, x2, y2, x3, y3, tx1, ty1, a2, 1);
					cdDrawCurve(kage, polygons, tx1, ty1, x4, y4, x4 - kage.kMage, y4, 1, a3 + 10);
				} else if (a3 === 5) {
					cdDrawBezier(kage, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a2, 15);
				} else {
					cdDrawBezier(kage, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a2, a3);
				}
				break;
			}
			case 7: {
				cdDrawLine(kage, polygons, x1, y1, x2, y2, a2 % 1000, 1, tateAdjustment, 0);
				cdDrawCurve(kage, polygons, x2, y2, x3, y3, x4, y4, 1 + tateAdjustment * 1000, a3);
				break;
			}
			case 9: // may not be exist ... no need
				// kageCanvas[y1][x1] = 0;
				// kageCanvas[y2][x2] = 0;
				break;
			default:
				break;
		}
	} else { // gothic
		switch (a1 % 100) {
			case 0:
				break;
			case 1: {
				if (a3 === 4) {
					const [dx1, dy1] = (x1 === x2 && y1 === y2)
						? [0, kage.kMage] // ?????
						: normalize([x1 - x2, y1 - y2], kage.kMage);
					const tx1 = x2 + dx1;
					const ty1 = y2 + dy1;
					cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2 % 1000, 1, tateAdjustment, 0);
					cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, x2 - kage.kMage * 2, y2 - kage.kMage * 0.5, 1, 0);
				} else {
					cdDrawLine(kage, polygons, x1, y1, x2, y2, a2 % 1000, a3 % 100, tateAdjustment, opt3 + mageAdjustment * 10);
				}
				break;
			}
			case 2:
			case 12: {
				if (a3 === 4) {
					const [dx1, dy1] = (x2 === x3)
						? [0, -kage.kMage] // ?????
						: (y2 === y3)
							? [-kage.kMage, 0] // ?????
							: normalize([x2 - x3, y2 - y3], kage.kMage);
					const tx1 = x3 + dx1;
					const ty1 = y3 + dy1;
					cdDrawCurve(kage, polygons, x1, y1, x2, y2, tx1, ty1, a2, 1);
					cdDrawCurve(kage, polygons, tx1, ty1, x3, y3, x3 - kage.kMage * 2, y3 - kage.kMage * 0.5, 1, 0);
				} else if (a3 === 5) {
					const tx1 = x3 + kage.kMage;
					const ty1 = y3;
					const tx2 = tx1 + kage.kMage * 0.5;
					const ty2 = y3 - kage.kMage * 2;
					cdDrawCurve(kage, polygons, x1, y1, x2, y2, x3, y3, a2, 1);
					cdDrawCurve(kage, polygons, x3, y3, tx1, ty1, tx2, ty2, 1, 0);
				} else {
					cdDrawCurve(kage, polygons, x1, y1, x2, y2, x3, y3, a2, a3);
				}
				break;
			}
			case 3: {
				if (a3 === 5) {
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
					const tx3 = x3 - kage.kMage;
					const ty3 = y3;
					const tx4 = x3 + kage.kMage * 0.5;
					const ty4 = y3 - kage.kMage * 2;

					cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2 % 1000, 1, tateAdjustment, 0);
					cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1);
					cdDrawLine(kage, polygons, tx2, ty2, tx3, ty3, 1, 1, 0, 0);
					cdDrawCurve(kage, polygons, tx3, ty3, x3, y3, tx4, ty4, 1, 0);
				} else {
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

					cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2 % 1000, 1, tateAdjustment, 0);
					cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1);
					cdDrawLine(kage, polygons, tx2, ty2, x3, y3, 1, a3 % 100, 0, opt3 + mageAdjustment * 10);
				}
				break;
			}
			case 6: {
				if (a3 === 5) {
					const tx1 = x4 - kage.kMage;
					const ty1 = y4;
					const tx2 = x4 + kage.kMage * 0.5;
					const ty2 = y4 - kage.kMage * 2;
					/*
					cdDrawCurve(x1, y1, x2, y2, (x2 + x3) / 2, (y2 + y3) / 2, a2, 1);
					cdDrawCurve((x2 + x3) / 2, (y2 + y3) / 2, x3, y3, tx1, ty1, 1, 1);
					 */
					cdDrawBezier(kage, polygons, x1, y1, x2, y2, x3, y3, tx1, ty1, a2, 1);
					cdDrawCurve(kage, polygons, tx1, ty1, x4, y4, tx2, ty2, 1, 0);
				} else {
					/*
					cdDrawCurve(x1, y1, x2, y2, (x2 + x3) / 2, (y2 + y3) / 2, a2, 1);
					cdDrawCurve((x2 + x3) / 2, (y2 + y3) / 2, x3, y3, x4, y4, 1, a3);
					 */
					cdDrawBezier(kage, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a2, a3);
				}
				break;
			}
			case 7: {
				cdDrawLine(kage, polygons, x1, y1, x2, y2, a2 % 1000, 1, tateAdjustment, 0);
				cdDrawCurve(kage, polygons, x2, y2, x3, y3, x4, y4, 1, a3);
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
}
