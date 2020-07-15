import { divide_curve, find_offcurve, get_candidate, generateFattenCurve } from "../../curve";
import { Polygon } from "../../polygon";
import { Polygons } from "../../polygons";
import { hypot, normalize, round } from "../../util";
import Mincho from ".";

function cdDrawCurveU(
	font: Mincho, polygons: Polygons,
	x1: number, y1: number, sx1: number, sy1: number,
	sx2: number, sy2: number, x2: number, y2: number,
	ta1: number, ta2: number,
	opt1: number, opt2: number, opt3: number, opt4: number) {

	const a1 = ta1;
	const a2 = ta2;

	const kMinWidthT = font.kMinWidthT - opt1 / 2;
	const kMinWidthT2 = font.kMinWidthT - opt4 / 2;

	let delta;
	switch (a1 % 100) {
		case 0:
		case 7:
			delta = -1 * font.kMinWidthY * 0.5;
			break;
		case 1:
		case 2: // ... must be 32
		case 6:
		case 22:
		case 32: // changed
			delta = 0;
			break;
		case 12:
			// case 32:
			delta = font.kMinWidthY;
			break;
		default:
			return;
	}

	const [dx1, dy1] = (x1 === sx1 && y1 === sy1)
		? [0, delta] // ?????
		: normalize([x1 - sx1, y1 - sy1], delta);
	x1 += dx1;
	y1 += dy1;

	switch (a2 % 100) {
		case 0:
		case 1:
		case 7:
		case 9:
		case 15: // it can change to 15->5
		case 14: // it can change to 14->4
		case 17: // no need
		case 5:
			delta = 0;
			break;
		case 8: // get shorten for tail's circle
			delta = -1 * kMinWidthT * 0.5;
			break;
		default:
			break;
	}

	const [dx2, dy2] = (sx2 === x2 && sy2 === y2)
		? [0, -delta] // ?????
		: normalize([x2 - sx2, y2 - sy2], delta);
	x2 += dx2;
	y2 += dy2;

	const isQuadratic = sx1 === sx2 && sy1 === sy2;

	// ---------------------------------------------------------------

	if (isQuadratic && font.kUseCurve) {
		// Spline
		// generating fatten curve -- begin
		const font2 = new Mincho();
		font2.kMinWidthY = font.kMinWidthY;
		font2.kMinWidthT = kMinWidthT;
		font2.kWidth = font.kWidth;
		font2.kKakato = font.kKakato;
		font2.kRate = 10;

		const { left: curveL, right: curveR } = get_candidate(font2, a1, a2, x1, y1, sx1, sy1, x2, y2, opt3, opt4); // L and R

		const { off: [offL1, offL2], index: indexL } = divide_curve(x1, y1, sx1, sy1, x2, y2, curveL);
		const curveL1 = curveL.slice(0, indexL + 1);
		const curveL2 = curveL.slice(indexL);
		const { off: [offR1, offR2], index: indexR } = divide_curve(x1, y1, sx1, sy1, x2, y2, curveR);

		const ncl1 = find_offcurve(curveL1, offL1[2], offL1[3]);
		const ncl2 = find_offcurve(curveL2, offL2[2], offL2[3]);

		const poly = new Polygon([
			{ x: ncl1[0], y: ncl1[1] },
			{ x: ncl1[2], y: ncl1[3], off: true },
			{ x: ncl1[4], y: ncl1[5] },
			{ x: ncl2[2], y: ncl2[3], off: true },
			{ x: ncl2[4], y: ncl2[5] },
		]);

		const poly2 = new Polygon([
			{ x: curveR[0][0], y: curveR[0][1] },
			{
				x: offR1[2] - (ncl1[2] - offL1[2]),
				y: offL1[3] - (ncl1[3] - offL1[3]), // typo?
				off: true,
			},
			{ x: curveR[indexR][0], y: curveR[indexR][1] },
			{
				x: offR2[2] - (ncl2[2] - offL2[2]),
				y: offL2[3] - (ncl2[3] - offL2[3]), // typo?
				off: true,
			},
			{ x: curveR[curveR.length - 1][0], y: curveR[curveR.length - 1][1] },
		]);

		poly2.reverse();
		poly.concat(poly2);
		polygons.push(poly);
		// generating fatten curve -- end
	} else {
		let hosomi = 0.5;
		if (hypot(x2 - x1, y2 - y1) < 50) {
			hosomi += 0.4 * (1 - hypot(x2 - x1, y2 - y1) / 50);
		}

		const { left, right } = generateFattenCurve(
			x1, y1, sx1, sy1, sx2, sy2, x2, y2,
			font.kRate,
			(t) => {
				let deltad;
				if (isQuadratic) {
					// Spline
					deltad
						= a1 === 7 && a2 === 0 // L2RD: fatten
							? t ** hosomi * font.kL2RDfatten
							: a1 === 7
								? t ** hosomi
								: a2 === 7
									? (1 - t) ** hosomi
									: opt3 > 0 || opt4 > 0
										? ((font.kMinWidthT - opt3 / 2) - (opt4 - opt3) / 2 * t) / font.kMinWidthT
										: 1;
				} else { // Bezier
					deltad
						= a1 === 7 && a2 === 0 // L2RD: fatten
							? t ** hosomi * font.kL2RDfatten
							: a1 === 7
								? (t ** hosomi) ** 0.7 // make fatten
								: a2 === 7
									? (1 - t) ** hosomi
									: 1;
				}

				if (deltad < 0.15) {
					deltad = 0.15;
				}

				return kMinWidthT * deltad;
			},
			([x, y], mag) => (round(x) === 0 && round(y) === 0)
				? [-mag, 0] // ?????
				: normalize([x, y], mag)
		);

		const poly = new Polygon();
		const poly2 = new Polygon();
		// copy to polygon structure
		for (const [x, y] of left) {
			poly.push(x, y);
		}
		for (const [x, y] of right) {
			poly2.push(x, y);
		}

		// suiheisen ni setsuzoku
		if (a1 === 132 || a1 === 22 && (isQuadratic ? (y1 > y2) : (x1 > sx1))) {
			for (let index = 0, length = poly2.length; index + 1 < length; index++) {
				const point1 = poly2.get(index);
				const point2 = poly2.get(index + 1);
				if (point1.y <= y1 && y1 <= point2.y) {
					const newx1 = point2.x + (point1.x - point2.x) * (y1 - point2.y) / (point1.y - point2.y);
					const newy1 = y1;
					const point3 = poly.get(0);
					const point4 = poly.get(1);
					const newx2 =
						(a1 === 132) // ?????
							? point3.x + (point4.x - point3.x) * (y1 - point3.y) / (point4.y - point3.y)
							: point3.x + (point4.x - point3.x + 1) * (y1 - point3.y) / (point4.y - point3.y); // "+ 1"?????
					const newy2 =
						(a1 === 132) // ?????
							? y1
							: y1 + 1; // "+ 1"?????

					for (let i = 0; i < index; i++) {
						poly2.shift();
					}
					poly2.set(0, newx1, newy1);
					poly.unshift(newx2, newy2);
					break;
				}
			}
		}

		poly2.reverse();
		poly.concat(poly2);
		polygons.push(poly);
	}

	// process for head of stroke

	if (a1 === 12) {
		const [dx, dy] = (x1 === x2)
			? [1, 0] // ?????
			: (sx1 === x1)
				? [sy1 < y1 ? 1 : -1, 0] // for backward compatibility...
				: normalize([sy1 - y1, -(sx1 - x1)]);
		const poly = new Polygon([
			{ x: -kMinWidthT, y: 0 },
			{ x: +kMinWidthT, y: 0 },
			{ x: -kMinWidthT, y: -kMinWidthT },
		]).transformMatrix2(dx, dy).translate(x1, y1);
		polygons.push(poly);
	}

	if (a1 === 0) {
		if (y1 <= y2) { // from up to bottom
			let type = Math.atan2(Math.abs(y1 - sy1), Math.abs(x1 - sx1)) / Math.PI * 2 - 0.4;
			if (type > 0) {
				type *= 2;
			} else {
				type *= 16;
			}
			const pm = type < 0 ? -1 : 1;
			const move = type < 0 ? -type * font.kMinWidthY : 0;
			const [XX, XY] = (x1 === sx1)
				? [1, 0] // ?????
				: normalize([sy1 - y1, -(sx1 - x1)]);
			const poly = new Polygon([
				{ x: -kMinWidthT, y: 1 },
				{ x: +kMinWidthT, y: 0 },
				{ x: -kMinWidthT * pm, y: -font.kMinWidthY * type * pm },
			]).transformMatrix2(XX, XY).translate(x1, y1);
			// if(x1 > x2){
			//  poly.reverse();
			// }
			polygons.push(poly);
			// beginning of the stroke
			const poly2 = new Polygon();
			poly2.push(kMinWidthT, -move);
			if (x1 === sx1 && y1 === sy1) { // ?????
				// type === -6.4 && pm === -1 && move === 6.4 * font.kMinWidthY
				poly2.push(kMinWidthT * 1.5, font.kMinWidthY - move);
				poly2.push(kMinWidthT - 2, font.kMinWidthY * 2 + 1);
			} else {
				poly2.push(kMinWidthT * 1.5, font.kMinWidthY - move * 1.2);
				poly2.push(kMinWidthT - 2, font.kMinWidthY * 2 - move * 0.8 + 1);
				// if(x1 < x2){
				//  poly2.reverse();
				// }
			}
			poly2.transformMatrix2(XX, XY).translate(x1, y1);
			polygons.push(poly2);
		} else { // bottom to up
			const [XX, XY] = (x1 === sx1)
				? [1, 0] // ?????
				: normalize([sy1 - y1, -(sx1 - x1)]);
			const poly = new Polygon([
				{ x: -kMinWidthT, y: 0 },
				{ x: +kMinWidthT, y: 0 },
				{ x: +kMinWidthT, y: -font.kMinWidthY },
			]);
			poly.transformMatrix2(XX, XY).translate(x1, y1);
			// if(x1 < x2){
			//  poly.reverse();
			// }
			polygons.push(poly);
			// beginning of the stroke
			const poly2 = new Polygon([
				{ x: -kMinWidthT, y: 0 },
				{ x: -kMinWidthT * 1.5, y: +font.kMinWidthY },
				{ x: -kMinWidthT * 0.5, y: +font.kMinWidthY * 3 },
			]);
			// if(x1 < x2){
			//  poly2.reverse();
			// }
			poly2.transformMatrix2(XX, XY).translate(x1, y1);
			polygons.push(poly2);
		}
	}

	if (a1 === 22) { // box's up-right corner, any time same degree
		const poly = new Polygon([
			{ x: -kMinWidthT, y: -font.kMinWidthY },
			{ x: 0, y: -font.kMinWidthY - font.kWidth },
			{ x: +kMinWidthT + font.kWidth, y: +font.kMinWidthY },
			{ x: +kMinWidthT, y: +kMinWidthT - 1 },
			{ x: -kMinWidthT, y: +kMinWidthT + 4 },
		]);
		poly.translate(x1, y1);
		polygons.push(poly);
	}

	// process for tail

	if (a2 === 1 || a2 === 8 || a2 === 15) { // the last filled circle ... it can change 15->5
		const [dx, dy] = (sx2 === x2)
			? [0, 1] // ?????
			: (sy2 === y2)
				? [1, 0] // ?????
				: normalize([x2 - sx2, y2 - sy2]);
		const poly = new Polygon(
			(font.kUseCurve)
				? // by curve path
				[
					{ x: 0, y: -kMinWidthT2 },
					{ x: +kMinWidthT2 * 0.9, y: -kMinWidthT2 * 0.9, off: true },
					{ x: +kMinWidthT2, y: 0 },
					{ x: +kMinWidthT2 * 0.9, y: +kMinWidthT2 * 0.9, off: true },
					{ x: 0, y: +kMinWidthT2 },
				]
				: // by polygon
				[
					{ x: 0, y: -kMinWidthT2 },
					{ x: +kMinWidthT2 * 0.7, y: -kMinWidthT2 * 0.7 },
					{ x: +kMinWidthT2, y: 0 },
					{ x: +kMinWidthT2 * 0.7, y: +kMinWidthT2 * 0.7 },
					{ x: 0, y: +kMinWidthT2 },
				]);
		if (sx2 === x2) {
			poly.reverse();
		}
		poly.transformMatrix2(dx, dy).translate(x2, y2);
		polygons.push(poly);
	}

	if (a2 === 9 || (a1 === 7 && a2 === 0)) { // Math.sinnyu & L2RD Harai ... no need for a2=9
		let type2 = (Math.atan2(Math.abs(y2 - sy2), Math.abs(x2 - sx2)) / Math.PI * 2 - 0.6);
		if (type2 > 0) {
			type2 *= 8;
		} else {
			type2 *= 3;
		}
		const pm2 = type2 < 0 ? -1 : 1;
		const [dx, dy] = (sy2 === y2)
			? [0, 1] // ?????
			: (sx2 === x2)
				? [y2 > sy2 ? 1 : -1, 0] // for backward compatibility...
				: normalize([-(y2 - sy2), x2 - sx2], 1);
		const poly = new Polygon([
			{ x: +kMinWidthT * font.kL2RDfatten, y: 0 },
			{ x: -kMinWidthT * font.kL2RDfatten, y: 0 },
			{ x: +pm2 * kMinWidthT * font.kL2RDfatten, y: -Math.abs(type2) * kMinWidthT * font.kL2RDfatten },
		]);
		poly.transformMatrix2(dx, dy).translate(x2, y2);
		polygons.push(poly);
	}

	if (a2 === 15) { // jump up ... it can change 15->5
		// anytime same degree
		const poly = new Polygon([
			{ x: 0, y: -kMinWidthT + 1 },
			{ x: +2, y: -kMinWidthT - font.kWidth * 5 },
			{ x: 0, y: -kMinWidthT - font.kWidth * 5 },
			{ x: -kMinWidthT, y: -kMinWidthT + 1 },
		]);
		if (y1 >= y2) {
			poly.rotate180();
		}
		poly.translate(x2, y2);
		polygons.push(poly);
	}

	if (a2 === 14) { // jump to left, allways go left
		const poly = new Polygon([
			{ x: 0, y: 0 },
			{ x: 0, y: -kMinWidthT },
			{ x: -font.kWidth * 4 * Math.min(1 - opt2 / 10, (kMinWidthT / font.kMinWidthT) ** 3), y: -kMinWidthT },
			{ x: -font.kWidth * 4 * Math.min(1 - opt2 / 10, (kMinWidthT / font.kMinWidthT) ** 3), y: -kMinWidthT * 0.5 },
		]);
		// poly.reverse();
		poly.translate(x2, y2);
		polygons.push(poly);
	}
}

export function cdDrawBezier(
	font: Mincho, polygons: Polygons,
	x1: number, y1: number, x2: number, y2: number,
	x3: number, y3: number, x4: number, y4: number,
	a1: number, a2: number,
	opt1: number, opt2: number, opt3: number, opt4: number): void {
	cdDrawCurveU(font, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a1, a2, opt1, opt2, opt3, opt4);
}

export function cdDrawCurve(
	font: Mincho, polygons: Polygons,
	x1: number, y1: number, x2: number, y2: number, x3: number, y3: number,
	a1: number, a2: number,
	opt1: number, opt2: number, opt3: number, opt4: number): void {
	cdDrawCurveU(font, polygons, x1, y1, x2, y2, x2, y2, x3, y3, a1, a2, opt1, opt2, opt3, opt4);
}

export function cdDrawLine(
	font: Mincho, polygons: Polygons,
	tx1: number, ty1: number, tx2: number, ty2: number,
	ta1: number, ta2: number, opt1: number, opt2: number): void {

	const x1 = tx1;
	const y1 = ty1;
	const x2 = tx2;
	const y2 = ty2;
	const a1 = ta1;
	const a2 = ta2;

	const kMinWidthT = font.kMinWidthT - opt1 / 2;

	if (x1 === x2 || y1 !== y2 && (x1 > x2 || Math.abs(y2 - y1) >= Math.abs(x2 - x1) || a1 === 6 || a2 === 6)) {
		// if TATE stroke, use y-axis
		// for others, use x-axis
		// KAKUDO GA FUKAI or KAGI NO YOKO BOU
		const [cosrad, sinrad] = (x1 === x2)
			? [0, 1] // ?????
			: normalize([x2 - x1, y2 - y1]);
		const poly0 = new Polygon(4);
		switch (a1) {
			case 0:
				poly0.set(0,
					x1 + sinrad * kMinWidthT + cosrad * font.kMinWidthY / 2,
					y1 - cosrad * kMinWidthT + sinrad * font.kMinWidthY / 2);
				poly0.set(3,
					x1 - sinrad * kMinWidthT - cosrad * font.kMinWidthY / 2,
					y1 + cosrad * kMinWidthT - sinrad * font.kMinWidthY / 2);
				break;
			case 1:
			case 6: // ... no need
				poly0.set(0, x1 + sinrad * kMinWidthT, y1 - cosrad * kMinWidthT);
				poly0.set(3, x1 - sinrad * kMinWidthT, y1 + cosrad * kMinWidthT);
				break;
			case 12:
				poly0.set(0,
					x1 + sinrad * kMinWidthT - cosrad * font.kMinWidthY,
					y1 - cosrad * kMinWidthT - sinrad * font.kMinWidthY);
				poly0.set(3,
					x1 - sinrad * kMinWidthT - cosrad * (kMinWidthT + font.kMinWidthY),
					y1 + cosrad * kMinWidthT - sinrad * (kMinWidthT + font.kMinWidthY));
				break;
			case 22:
				if (x1 === x2) {
					poly0.set(0, x1 + kMinWidthT, y1);
					poly0.set(3, x1 - kMinWidthT, y1);
				} else {
					const rad = Math.atan((y2 - y1) / (x2 - x1));
					const v = x1 > x2 ? -1 : 1;
					// TODO: why " + 1" ???
					poly0.set(0, x1 + (kMinWidthT * v + 1) / Math.sin(rad), y1 + 1);
					poly0.set(3, x1 - (kMinWidthT * v) / Math.sin(rad), y1);
				}
				break;
			case 32:
				if (x1 === x2) {
					poly0.set(0, x1 + kMinWidthT, y1 - font.kMinWidthY);
					poly0.set(3, x1 - kMinWidthT, y1 - font.kMinWidthY);
				} else {
					poly0.set(0, x1 + kMinWidthT / sinrad, y1);
					poly0.set(3, x1 - kMinWidthT / sinrad, y1);
				}
				break;
		}

		switch (a2) {
			case 0:
				if (a1 === 6) { // KAGI's tail ... no need
					poly0.set(1, x2 + sinrad * kMinWidthT, y2 - cosrad * kMinWidthT);
					poly0.set(2, x2 - sinrad * kMinWidthT, y2 + cosrad * kMinWidthT);
				} else {
					poly0.set(1,
						x2 + sinrad * kMinWidthT - cosrad * kMinWidthT / 2,
						y2 - cosrad * kMinWidthT - sinrad * kMinWidthT / 2);
					poly0.set(2,
						x2 - sinrad * kMinWidthT + cosrad * kMinWidthT / 2,
						y2 + cosrad * kMinWidthT + sinrad * kMinWidthT / 2);
				}
				break;
			case 5:
				if (x1 === x2) {
					break;
				}
			// falls through
			case 1: // is needed?
				poly0.set(1, x2 + sinrad * kMinWidthT, y2 - cosrad * kMinWidthT);
				poly0.set(2, x2 - sinrad * kMinWidthT, y2 + cosrad * kMinWidthT);
				break;
			case 13:
				poly0.set(1,
					x2 + sinrad * kMinWidthT + cosrad * font.kAdjustKakatoL[opt2],
					y2 - cosrad * kMinWidthT + sinrad * font.kAdjustKakatoL[opt2]);
				poly0.set(2,
					x2 - sinrad * kMinWidthT + cosrad * (font.kAdjustKakatoL[opt2] + kMinWidthT),
					y2 + cosrad * kMinWidthT + sinrad * (font.kAdjustKakatoL[opt2] + kMinWidthT));
				break;
			case 23:
				poly0.set(1,
					x2 + sinrad * kMinWidthT + cosrad * font.kAdjustKakatoR[opt2],
					y2 - cosrad * kMinWidthT + sinrad * font.kAdjustKakatoR[opt2]);
				poly0.set(2,
					x2 - sinrad * kMinWidthT + cosrad * (font.kAdjustKakatoR[opt2] + kMinWidthT),
					y2 + cosrad * kMinWidthT + sinrad * (font.kAdjustKakatoR[opt2] + kMinWidthT));
				break;
			case 24: // for T/H design
			case 32:
				if (x1 === x2) {
					poly0.set(1, x2 + kMinWidthT, y2 + font.kMinWidthY);
					poly0.set(2, x2 - kMinWidthT, y2 + font.kMinWidthY);
				} else {
					poly0.set(1, x2 + kMinWidthT / sinrad, y2);
					poly0.set(2, x2 - kMinWidthT / sinrad, y2);
				}
				break;
		}

		polygons.push(poly0);

		if (a2 === 24) { // for T design
			const poly = new Polygon([
				{ x: 0, y: +font.kMinWidthY },
				(x1 === x2) // ?????
					? { x: +kMinWidthT, y: -font.kMinWidthY * 3 }
					: { x: +kMinWidthT * 0.5, y: -font.kMinWidthY * 4 },
				{ x: +kMinWidthT * 2, y: -font.kMinWidthY },
				{ x: +kMinWidthT * 2, y: +font.kMinWidthY },
			]);
			poly.translate(x2, y2);
			polygons.push(poly);
		}

		if (a2 === 13 && opt2 === 4) { // for new GTH box's left bottom corner
			if (x1 === x2) {
				const poly = new Polygon([
					{ x: -kMinWidthT, y: -font.kMinWidthY * 3 },
					{ x: -kMinWidthT * 2, y: 0 },
					{ x: -font.kMinWidthY, y: +font.kMinWidthY * 5 },
					{ x: +kMinWidthT, y: +font.kMinWidthY },
				]);
				poly.translate(x2, y2);
				polygons.push(poly);
			} else { // MUKI KANKEINASHI
				const m = (x1 > x2 && y1 !== y2)
					? Math.floor((x1 - x2) / (y2 - y1) * 3)
					: 0;
				const poly = new Polygon([
					{ x: 0, y: -font.kMinWidthY * 5 },
					{ x: -kMinWidthT * 2, y: 0 },
					{ x: -font.kMinWidthY, y: +font.kMinWidthY * 5 },
					{ x: +kMinWidthT, y: +font.kMinWidthY },
					{ x: 0, y: 0 },
				]);
				poly.translate(x2 + m, y2);
				polygons.push(poly);
			}
		}

		if (a1 === 22) {
			// box's right top corner
			// SHIKAKU MIGIUE UROKO NANAME DEMO MASSUGU MUKI
			const poly = new Polygon();
			poly.push(-kMinWidthT, -font.kMinWidthY);
			poly.push(0, -font.kMinWidthY - font.kWidth);
			poly.push(+kMinWidthT + font.kWidth, +font.kMinWidthY);
			if (x1 === x2) {
				poly.push(+kMinWidthT, +kMinWidthT);
				poly.push(-kMinWidthT, 0);
			} else {
				poly.push(+kMinWidthT, +kMinWidthT - 1);
				poly.push(-kMinWidthT, +kMinWidthT + 4);
			}
			poly.translate(x1, y1);
			polygons.push(poly);
		}

		if (a1 === 0) { // beginning of the stroke
			const poly = new Polygon([
				{
					x: +kMinWidthT * sinrad + font.kMinWidthY * 0.5 * cosrad,
					y: +kMinWidthT * -cosrad + font.kMinWidthY * 0.5 * sinrad,
				},
				{
					x: +(kMinWidthT + kMinWidthT * 0.5) * sinrad + (font.kMinWidthY * 0.5 + font.kMinWidthY) * cosrad,
					y: +(kMinWidthT + kMinWidthT * 0.5) * -cosrad + (font.kMinWidthY * 0.5 + font.kMinWidthY) * sinrad,
				},
				(x1 === x2) // ?????
					? {
						x: +(kMinWidthT - 2) * sinrad + (font.kMinWidthY * 0.5 + font.kMinWidthY * 2 + 1) * cosrad,
						y: +(kMinWidthT - 2) * -cosrad + (font.kMinWidthY * 0.5 + font.kMinWidthY * 2 + 1) * sinrad,
					}
					: {
						x: +(kMinWidthT - 2) * sinrad + (font.kMinWidthY * 0.5 + font.kMinWidthY * 2) * cosrad,
						y: +(kMinWidthT + 1) * -cosrad + (font.kMinWidthY * 0.5 + font.kMinWidthY * 2) * sinrad, // ?????
					},
			]);
			poly.translate(x1, y1);
			polygons.push(poly);
		}

		if (x1 === x2 && a2 === 1 || a1 === 6 && (a2 === 0 || x1 !== x2 && a2 === 5)) {
			// KAGI NO YOKO BOU NO SAIGO NO MARU ... no need only used at 1st=yoko
			const poly = new Polygon();
			if (font.kUseCurve) {
				poly.push(-sinrad * -kMinWidthT, +cosrad * -kMinWidthT);
				poly.push(
					-cosrad * kMinWidthT * 0.9 + -sinrad * -kMinWidthT * 0.9, // typo?
					+sinrad * kMinWidthT * 0.9 + cosrad * -kMinWidthT * 0.9, true);
				poly.push(+cosrad * kMinWidthT, +sinrad * kMinWidthT);
				poly.push(
					+cosrad * kMinWidthT * 0.9 + -sinrad * kMinWidthT * 0.9,
					+sinrad * kMinWidthT * 0.9 + cosrad * kMinWidthT * 0.9, true);
				poly.push(-sinrad * kMinWidthT, +cosrad * kMinWidthT);
			} else {
				const r = (x1 === x2 && (a1 === 6 && a2 === 0 || a2 === 1))
					? 0.6
					: 0.8; // ?????
				poly.push(0, -kMinWidthT);
				poly.push(+kMinWidthT * r, -kMinWidthT * 0.6);
				poly.push(+kMinWidthT, 0);
				poly.push(+kMinWidthT * r, +kMinWidthT * 0.6);
				poly.push(0, +kMinWidthT);
				poly.transformMatrix2(cosrad, sinrad);
			}
			if (x1 === x2 && (a1 === 6 && a2 === 0 || a2 === 1)) {
				// for backward compatibility
				poly.reverse();
			}
			poly.translate(x2, y2);
			// poly.reverse(); // for fill-rule
			polygons.push(poly);
		}
		if (x1 !== x2 && a1 === 6 && a2 === 5) {
			// KAGI NO YOKO BOU NO HANE
			const rv = x1 < x2 ? 1 : -1;
			const poly = new Polygon([
				{ x: 0, y: +rv * (-kMinWidthT + 1) },
				{ x: +2, y: +rv * (-kMinWidthT - font.kWidth * 5) },
				{ x: 0, y: +rv * (-kMinWidthT - font.kWidth * 5) },
				{ x: -kMinWidthT, y: -kMinWidthT + 1 }, // rv ?????
			]);
			poly.transformMatrix2(cosrad, sinrad).translate(x2, y2);
			polygons.push(poly);
		}
	} else if (y1 === y2 && a1 === 6) {
		// if it is YOKO stroke, use x-axis
		// if it is KAGI's YOKO stroke, get bold
		// x1 !== x2 && y1 === y2 && a1 === 6
		const poly0 = new Polygon([
			{ x: x1, y: y1 - kMinWidthT },
			{ x: x2, y: y2 - kMinWidthT },
			{ x: x2, y: y2 + kMinWidthT },
			{ x: x1, y: y1 + kMinWidthT },
		]);
		polygons.push(poly0);

		if (a2 === 1 || a2 === 0 || a2 === 5) { // no need a2=1
			// KAGI NO YOKO BOU NO SAIGO NO MARU
			const [cosrad, sinrad] = (x1 < x2) ? [1, 0] : [-1, 0];
			const r = 0.6;
			const poly = new Polygon(
				(font.kUseCurve)
					? [
						{ x: 0, y: -kMinWidthT },
						{ x: +kMinWidthT * 0.9, y: -kMinWidthT * 0.9, off: true },
						{ x: +kMinWidthT, y: 0 },
						{ x: +kMinWidthT * 0.9, y: +kMinWidthT * 0.9, off: true },
						{ x: 0, y: +kMinWidthT },
					]
					: [
						{ x: 0, y: -kMinWidthT },
						{ x: +kMinWidthT * r, y: -kMinWidthT * 0.6 },
						{ x: +kMinWidthT, y: 0 },
						{ x: +kMinWidthT * r, y: +kMinWidthT * 0.6 },
						{ x: 0, y: +kMinWidthT },
					]);
			if (x1 >= x2) {
				poly.reverse();
			}
			poly.transformMatrix2(cosrad, sinrad).translate(x2, y2);
			polygons.push(poly);
		}

		if (a2 === 5) {
			// KAGI NO YOKO BOU NO HANE
			const poly = new Polygon([
				// { x: 0, y: -kMinWidthT + 1 },
				{ x: 0, y: -kMinWidthT },
				{ x: +2, y: -kMinWidthT - font.kWidth * (4 * (1 - opt1 / font.kAdjustMageStep) + 1) },
				{ x: 0, y: -kMinWidthT - font.kWidth * (4 * (1 - opt1 / font.kAdjustMageStep) + 1) },
				// { x: -kMinWidthT, y: -kMinWidthT + 1 },
				{ x: -kMinWidthT, y: -kMinWidthT },
			]);
			// poly2.reverse(); // for fill-rule
			if (x1 >= x2) {
				poly.reflectX();
			}
			poly.translate(x2, y2);
			polygons.push(poly);
		}
	} else {
		// for others, use x-axis
		// ASAI KAUDO
		const [cosrad, sinrad] = (y1 === y2) ? [1, 0] : normalize([x2 - x1, y2 - y1]);
		// always same
		const poly = new Polygon([
			{ x: x1 + sinrad * font.kMinWidthY, y: y1 - cosrad * font.kMinWidthY },
			{ x: x2 + sinrad * font.kMinWidthY, y: y2 - cosrad * font.kMinWidthY },
			{ x: x2 - sinrad * font.kMinWidthY, y: y2 + cosrad * font.kMinWidthY },
			{ x: x1 - sinrad * font.kMinWidthY, y: y1 + cosrad * font.kMinWidthY },
		]);
		polygons.push(poly);

		// UROKO
		if (a2 === 0) {
			const poly2 = new Polygon([
				{ x: +sinrad * font.kMinWidthY, y: -cosrad * font.kMinWidthY },
				{ x: -cosrad * font.kAdjustUrokoX[opt2], y: -sinrad * font.kAdjustUrokoX[opt2] },
				{ x: -(cosrad - sinrad) * font.kAdjustUrokoX[opt2] / 2, y: -(sinrad + cosrad) * font.kAdjustUrokoY[opt2] },
			]);
			poly2.translate(x2, y2);
			polygons.push(poly2);
		}
	}
}
