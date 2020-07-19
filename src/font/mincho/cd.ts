import { divide_curve, find_offcurve, generateFattenCurve } from "../../curve";
import { Polygon } from "../../polygon";
import { Polygons } from "../../polygons";
import { hypot, normalize, round } from "../../util";
import Mincho from ".";

function cdDrawCurveU(
	font: Mincho, polygons: Polygons,
	x1: number, y1: number, sx1: number, sy1: number,
	sx2: number, sy2: number, x2: number, y2: number,
	ta1: number, ta2: number,
	opt1: number, haneAdjustment: number, opt3: number, opt4: number) {

	const a1 = ta1;
	const a2 = ta2;

	const kMinWidthT = font.kMinWidthT - opt1 / 2;

	let delta1;
	switch (a1 % 100) {
		case 0:
		case 7:
		case 27:
			delta1 = -1 * font.kMinWidthY * 0.5;
			break;
		case 1:
		case 2: // ... must be 32
		case 6:
		case 22:
		case 32: // changed
			delta1 = 0;
			break;
		case 12:
			// case 32:
			delta1 = font.kMinWidthY;
			break;
		default:
			return;
	}

	if (delta1 !== 0) {
		const [dx1, dy1] = (x1 === sx1 && y1 === sy1)
			? [0, delta1] // ?????
			: normalize([x1 - sx1, y1 - sy1], delta1);
		x1 += dx1;
		y1 += dy1;
	}
	let cornerOffset = 0;
	const contourLength = hypot(sx1 - x1, sy1 - y1) + hypot(sx2 - sx1, sy2 - sy1) + hypot(x2 - sx2, y2 - sy2);
	if ((a1 === 22 || a1 === 27) && a2 === 7 && contourLength < 100) {
		cornerOffset = (kMinWidthT > 6) ? (kMinWidthT - 6) * ((100 - contourLength) / 100) : 0;
		x1 += cornerOffset;
	}

	let delta2;
	switch (a2 % 100) {
		case 0:
		case 1:
		case 7:
		case 9:
		case 15: // it can change to 15->5
		case 14: // it can change to 14->4
		case 17: // no need
		case 5:
			delta2 = 0;
			break;
		case 8: // get shorten for tail's circle
			delta2 = -1 * kMinWidthT * 0.5;
			break;
		default:
			delta2 = delta1; // ?????
			break;
	}

	if (delta2 !== 0) {
		const [dx2, dy2] = (sx2 === x2 && sy2 === y2)
			? [0, -delta2] // ?????
			: normalize([x2 - sx2, y2 - sy2], delta2);
		x2 += dx2;
		y2 += dy2;
	}

	const isQuadratic = sx1 === sx2 && sy1 === sy2;

	// ---------------------------------------------------------------

	if (isQuadratic && font.kUseCurve) {
		// Spline
		// generating fatten curve -- begin

		const hosomi = 0.5;
		const deltadFunc: (t: number) => number
			= (a1 === 7 && a2 === 0) // L2RD: fatten
				? (t) => t ** hosomi * 1.1 // should be font.kL2RDfatten ?
				: (a1 === 7)
					? (t) => t ** hosomi
					: (a2 === 7)
						? (t) => (1 - t) ** hosomi
						: (opt3 > 0) // should be (opt3 > 0 || opt4 > 0) ?
							? (t) => 1 - opt3 / 2 / (kMinWidthT - opt4 / 2) + opt3 / 2 / (kMinWidthT - opt4) * t // ??????
							: () => 1;

		const { left: curveL, right: curveR } = generateFattenCurve(
			x1, y1, sx1, sy1, sx1, sy1, x2, y2,
			10,
			(t) => {
				let deltad = deltadFunc(t);

				if (deltad < 0.15) {
					deltad = 0.15;
				}
				return kMinWidthT * deltad;
			},
			([x, y], mag) => (y === 0)
				? [-mag, 0] // ?????
				: normalize([x, y], mag)
		); // L and R

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
				y: offR1[3] - (ncl1[3] - offL1[3]),
				off: true,
			},
			{ x: curveR[indexR][0], y: curveR[indexR][1] },
			{
				x: offR2[2] - (ncl2[2] - offL2[2]),
				y: offR2[3] - (ncl2[3] - offL2[3]),
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

		const deltadFunc: (t: number) => number
			= (a1 === 7 || a1 === 27) && a2 === 0 // L2RD: fatten
				? (t) => t ** hosomi * font.kL2RDfatten
				: (a1 === 7 || a1 === 27)
					? (isQuadratic) // ?????
						? (t) => t ** hosomi
						: (t) => (t ** hosomi) ** 0.7 // make fatten
					: a2 === 7
						? (t) => (1 - t) ** hosomi
						: isQuadratic && (opt3 > 0 || opt4 > 0) // ?????
							? (t) => ((font.kMinWidthT - opt3 / 2) - (opt4 - opt3) / 2 * t) / font.kMinWidthT
							: () => 1;

		const { left, right } = generateFattenCurve(
			x1, y1, sx1, sy1, sx2, sy2, x2, y2,
			font.kRate,
			(t) => {
				let deltad = deltadFunc(t);

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
		if (a1 === 132 || a1 === 22 && (isQuadratic ? (y1 > y2) : (x1 > sx1))) { // ?????
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

	switch (a1) {
		case 12: {
			const [dx, dy] = (x1 === sx1)
				? [0, 1] // ?????
				: normalize([sx1 - x1, sy1 - y1]);
			const poly = new Polygon([
				{ x: -kMinWidthT, y: 0 },
				{ x: +kMinWidthT, y: 0 },
				{ x: -kMinWidthT, y: -kMinWidthT },
			]).rotate270().transformMatrix2(dx, dy).translate(x1, y1);
			polygons.push(poly);
			break;
		}
		case 0: {
			const [XX, XY] = (x1 === sx1)
				? [0, 1] // ?????
				: normalize([sx1 - x1, sy1 - y1]);
			if (y1 <= y2) { // from up to bottom
				let type = Math.atan2(Math.abs(y1 - sy1), Math.abs(x1 - sx1)) / Math.PI * 2 - 0.4;
				if (type > 0) {
					type *= 2;
				} else {
					type *= 16;
				}
				const pm = type < 0 ? -1 : 1;
				const poly = new Polygon([
					{ x: -kMinWidthT, y: 1 }, // 1 ???
					{ x: +kMinWidthT, y: 0 },
					{ x: -pm * kMinWidthT, y: -font.kMinWidthY * Math.abs(type) },
				]).rotate270().transformMatrix2(XX, XY).translate(x1, y1);
				// if(x1 > x2){
				//  poly.reverse();
				// }
				polygons.push(poly);
				// beginning of the stroke
				const move = type < 0 ? -type * font.kMinWidthY : 0;
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
				poly2.rotate270().transformMatrix2(XX, XY).translate(x1, y1);
				polygons.push(poly2);
			} else { // bottom to up
				const poly = new Polygon([
					{ x: 0, y: +kMinWidthT },
					{ x: 0, y: -kMinWidthT },
					{ x: -font.kMinWidthY, y: -kMinWidthT },
				]);
				poly.transformMatrix2(XX, XY).translate(x1, y1);
				// if(x1 < x2){
				//  poly.reverse();
				// }
				polygons.push(poly);
				// beginning of the stroke
				const poly2 = new Polygon([
					{ x: 0, y: +kMinWidthT },
					{ x: +font.kMinWidthY, y: +kMinWidthT * 1.5 },
					{ x: +font.kMinWidthY * 3, y: +kMinWidthT * 0.5 },
				]);
				// if(x1 < x2){
				//  poly2.reverse();
				// }
				poly2.transformMatrix2(XX, XY).translate(x1, y1);
				polygons.push(poly2);
			}
			break;
		}
		case 22:
		case 27: { // box's up-right corner, any time same degree
			const poly = new Polygon([
				{ x: -kMinWidthT, y: -font.kMinWidthY },
				{ x: 0, y: -font.kMinWidthY - font.kWidth },
				{ x: +kMinWidthT + font.kWidth, y: +font.kMinWidthY },
				{ x: +kMinWidthT, y: +kMinWidthT - 1 },
			].concat((a1 === 27)
				? [
					{ x: 0, y: +kMinWidthT + 2 },
					{ x: 0, y: 0 },
				]
				: [
					{ x: -kMinWidthT, y: +kMinWidthT + 4 },
				]));
			poly.translate(x1 - cornerOffset, y1);
			polygons.push(poly);
			break;
		}
	}

	// process for tail

	switch (a2) {
		case 1:
		case 8:
		case 15: { // the last filled circle ... it can change 15->5
			const kMinWidthT2 = font.kMinWidthT - opt4 / 2;
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
			break;
		}
		case 0:
			if (!(a1 === 7 || a1 === 27)) {
				break;
			}
		// fall through
		case 9: { // Math.sinnyu & L2RD Harai ... no need for a2=9
			let type = Math.atan2(Math.abs(y2 - sy2), Math.abs(x2 - sx2)) / Math.PI * 2 - 0.6;
			if (type > 0) {
				type *= 8;
			} else {
				type *= 3;
			}
			const pm = type < 0 ? -1 : 1;
			const [dx, dy] = (sy2 === y2)
				? [1, 0] // ?????
				: (sx2 === x2)
					? [0, y2 > sy2 ? -1 : 1] // for backward compatibility...
					: normalize([x2 - sx2, y2 - sy2]);
			const poly = new Polygon([
				{ x: 0, y: +kMinWidthT * font.kL2RDfatten },
				{ x: 0, y: -kMinWidthT * font.kL2RDfatten },
				{ x: Math.abs(type) * kMinWidthT * font.kL2RDfatten, y: pm * kMinWidthT * font.kL2RDfatten },
			]);
			poly.transformMatrix2(dx, dy).translate(x2, y2);
			polygons.push(poly);
			break;
		}

		case 14: { // jump to left, allways go left
			const jumpFactor = kMinWidthT > 6 ? 6.0 / kMinWidthT : 1.0;
			const haneLength = font.kWidth * 4 * Math.min(1 - haneAdjustment / 10, (kMinWidthT / font.kMinWidthT) ** 3) * jumpFactor;
			const poly = new Polygon([
				{ x: 0, y: 0 },
				{ x: 0, y: -kMinWidthT },
				{ x: -haneLength, y: -kMinWidthT },
				{ x: -haneLength, y: -kMinWidthT * 0.5 },
			]);
			// poly.reverse();
			poly.translate(x2, y2);
			polygons.push(poly);
			break;
		}
	}
}

export function cdDrawBezier(
	font: Mincho, polygons: Polygons,
	x1: number, y1: number, x2: number, y2: number,
	x3: number, y3: number, x4: number, y4: number,
	a1: number, a2: number,
	opt1: number, haneAdjustment: number, opt3: number, opt4: number): void {
	cdDrawCurveU(font, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a1, a2, opt1, haneAdjustment, opt3, opt4);
}

export function cdDrawCurve(
	font: Mincho, polygons: Polygons,
	x1: number, y1: number, x2: number, y2: number, x3: number, y3: number,
	a1: number, a2: number,
	opt1: number, haneAdjustment: number, opt3: number, opt4: number): void {
	cdDrawCurveU(font, polygons, x1, y1, x2, y2, x2, y2, x3, y3, a1, a2, opt1, haneAdjustment, opt3, opt4);
}

export function cdDrawLine(
	font: Mincho, polygons: Polygons,
	tx1: number, ty1: number, tx2: number, ty2: number,
	ta1: number, ta2: number, opt1: number, _urokoAdjustment: number, kakatoAdjustment: number, mageAdjustment: number): void {

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
		if (!((a2 === 13 || a2 === 23) && mageAdjustment !== 0)) { // for backward compatibility...
			const poly = new Polygon(4);
			switch (a1) {
				case 0:
					poly.set(0,
						x1 + sinrad * kMinWidthT + cosrad * font.kMinWidthY / 2,
						y1 - cosrad * kMinWidthT + sinrad * font.kMinWidthY / 2);
					poly.set(3,
						x1 - sinrad * kMinWidthT - cosrad * font.kMinWidthY / 2,
						y1 + cosrad * kMinWidthT - sinrad * font.kMinWidthY / 2);
					break;
				case 1:
				case 6: // ... no need
					poly.set(0, x1 + sinrad * kMinWidthT, y1 - cosrad * kMinWidthT);
					poly.set(3, x1 - sinrad * kMinWidthT, y1 + cosrad * kMinWidthT);
					break;
				case 12:
					poly.set(0,
						x1 + sinrad * kMinWidthT - cosrad * font.kMinWidthY,
						y1 - cosrad * kMinWidthT - sinrad * font.kMinWidthY);
					poly.set(3,
						x1 - sinrad * kMinWidthT - cosrad * (kMinWidthT + font.kMinWidthY),
						y1 + cosrad * kMinWidthT - sinrad * (kMinWidthT + font.kMinWidthY));
					break;
				case 22:
					if (x1 === x2) {
						poly.set(0, x1 + kMinWidthT, y1);
						poly.set(3, x1 - kMinWidthT, y1);
					} else {
						const rad = Math.atan((y2 - y1) / (x2 - x1));
						const v = x1 > x2 ? -1 : 1;
						// TODO: why " + 1" ???
						poly.set(0, x1 + (kMinWidthT * v + 1) / Math.sin(rad), y1 + 1);
						poly.set(3, x1 - (kMinWidthT * v) / Math.sin(rad), y1);
					}
					break;
				case 32:
					if (x1 === x2) {
						poly.set(0, x1 + kMinWidthT, y1 - font.kMinWidthY);
						poly.set(3, x1 - kMinWidthT, y1 - font.kMinWidthY);
					} else {
						poly.set(0, x1 + kMinWidthT / sinrad, y1);
						poly.set(3, x1 - kMinWidthT / sinrad, y1);
					}
					break;
			}

			switch (a2) {
				case 0:
					if (a1 === 6) { // KAGI's tail ... no need
						poly.set(1, x2 + sinrad * kMinWidthT, y2 - cosrad * kMinWidthT);
						poly.set(2, x2 - sinrad * kMinWidthT, y2 + cosrad * kMinWidthT);
					} else {
						poly.set(1,
							x2 + sinrad * kMinWidthT - cosrad * kMinWidthT / 2,
							y2 - cosrad * kMinWidthT - sinrad * kMinWidthT / 2);
						poly.set(2,
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
					poly.set(1, x2 + sinrad * kMinWidthT, y2 - cosrad * kMinWidthT);
					poly.set(2, x2 - sinrad * kMinWidthT, y2 + cosrad * kMinWidthT);
					break;
				case 13:
					poly.set(1,
						x2 + sinrad * kMinWidthT + cosrad * font.kAdjustKakatoL[kakatoAdjustment],
						y2 - cosrad * kMinWidthT + sinrad * font.kAdjustKakatoL[kakatoAdjustment]);
					poly.set(2,
						x2 - sinrad * kMinWidthT + cosrad * (font.kAdjustKakatoL[kakatoAdjustment] + kMinWidthT),
						y2 + cosrad * kMinWidthT + sinrad * (font.kAdjustKakatoL[kakatoAdjustment] + kMinWidthT));
					break;
				case 23:
					poly.set(1,
						x2 + sinrad * kMinWidthT + cosrad * font.kAdjustKakatoR[kakatoAdjustment],
						y2 - cosrad * kMinWidthT + sinrad * font.kAdjustKakatoR[kakatoAdjustment]);
					poly.set(2,
						x2 - sinrad * kMinWidthT + cosrad * (font.kAdjustKakatoR[kakatoAdjustment] + kMinWidthT),
						y2 + cosrad * kMinWidthT + sinrad * (font.kAdjustKakatoR[kakatoAdjustment] + kMinWidthT));
					break;
				case 24: // for T/H design
				case 32:
					if (x1 === x2) {
						poly.set(1, x2 + kMinWidthT, y2 + font.kMinWidthY);
						poly.set(2, x2 - kMinWidthT, y2 + font.kMinWidthY);
					} else {
						poly.set(1, x2 + kMinWidthT / sinrad, y2);
						poly.set(2, x2 - kMinWidthT / sinrad, y2);
					}
					break;
			}

			polygons.push(poly);
		}

		switch (a2) {
			case 24: { // for T design
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
				break;
			}
			case 13:
				if (kakatoAdjustment === 4 && mageAdjustment === 0) { // for new GTH box's left bottom corner
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
				break;
		}

		switch (a1) {
			case 22:
			case 27: {
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
					if (a1 === 27) {
						poly.push(0, +kMinWidthT + 2);
						poly.push(0, 0);
					} else {
						poly.push(-kMinWidthT, +kMinWidthT + 4);
					}
				}
				poly.translate(x1, y1);
				polygons.push(poly);
				break;
			}
			case 0: { // beginning of the stroke
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
				break;
			}
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
			if (x1 !== x2 && a1 === 6 && a2 === 5) {
				// KAGI NO YOKO BOU NO HANE
				const haneLength = font.kWidth * 5;
				const rv = x1 < x2 ? 1 : -1;
				const poly = new Polygon([
					{ x: 0, y: +rv * (-kMinWidthT + 1) },
					{ x: +2, y: +rv * (-kMinWidthT - haneLength) },
					{ x: 0, y: +rv * (-kMinWidthT - haneLength) },
					{ x: -kMinWidthT, y: -kMinWidthT + 1 }, // rv ?????
				]);
				poly.transformMatrix2(cosrad, sinrad).translate(x2, y2);
				polygons.push(poly);
			}
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

		switch (a2) {
			case 1:
			case 0:
			case 5: { // no need a2=1
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

				if (a2 === 5) {
					const haneLength = font.kWidth * (4 * (1 - opt1 / font.kAdjustMageStep) + 1);
					// KAGI NO YOKO BOU NO HANE
					const poly = new Polygon([
						// { x: 0, y: -kMinWidthT + 1 },
						{ x: 0, y: -kMinWidthT },
						{ x: +2, y: -kMinWidthT - haneLength },
						{ x: 0, y: -kMinWidthT - haneLength },
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
				break;
			}
		}
	} else {
		// for others, use x-axis
		// ASAI KAUDO
		const [cosrad, sinrad] = (y1 === y2)
			? [1, 0] // ?????
			: normalize([x2 - x1, y2 - y1]);
		// always same
		const poly = new Polygon([
			{ x: x1 + sinrad * font.kMinWidthY, y: y1 - cosrad * font.kMinWidthY },
			{ x: x2 + sinrad * font.kMinWidthY, y: y2 - cosrad * font.kMinWidthY },
			{ x: x2 - sinrad * font.kMinWidthY, y: y2 + cosrad * font.kMinWidthY },
			{ x: x1 - sinrad * font.kMinWidthY, y: y1 + cosrad * font.kMinWidthY },
		]);
		polygons.push(poly);

		// switch (a2) {
		// 	// UROKO
		// 	case 0:
		// 		if (mageAdjustment === 0) {
		// 			const urokoScale = (kage.kMinWidthU / font.kMinWidthY - 1.0) / 4.0 + 1.0;
		// 			const poly2 = new Polygon([
		// 				{ x: +sinrad * font.kMinWidthY, y: -cosrad * font.kMinWidthY },
		// 				{ x: -cosrad * font.kAdjustUrokoX[urokoAdjustment] * urokoScale, y: -sinrad * font.kAdjustUrokoX[urokoAdjustment] * urokoScale },
		// 				{ x: -(cosrad - sinrad) * font.kAdjustUrokoX[urokoAdjustment] * urokoScale / 2, y: -(sinrad + cosrad) * font.kAdjustUrokoY[urokoAdjustment] * urokoScale }, // ?????
		// 			]);
		// 			poly2.translate(x2, y2);
		// 			polygons.push(poly2);
		// 		}
		// 		break;
		// }
	}
}
