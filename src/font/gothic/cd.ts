import { Kage } from "../../kage";
import { Polygon } from "../../polygon";
import { Polygons } from "../../polygons";
import { cubicBezier, cubicBezierDeriv, normalize, quadraticBezier, quadraticBezierDeriv, round } from "../../util";

function cdDrawCurveU(
	kage: Kage, polygons: Polygons,
	x1: number, y1: number, sx1: number, sy1: number,
	sx2: number, sy2: number, x2: number, y2: number,
	ta1: number, ta2: number,
	_opt1: number, _opt2: number, _opt3: number, _opt4: number) {

	const a1 = ta1;
	const a2 = ta2;
	if (a1 % 10 === 2) {
		const [dx1, dy1] = (x1 === sx1 && y1 === sy1)
			? [0, kage.kWidth] // ?????
			: normalize([x1 - sx1, y1 - sy1], kage.kWidth);
		x1 += dx1;
		y1 += dy1;
	}

	if (a1 % 10 === 3) {
		const [dx1, dy1] = (x1 === sx1 && y1 === sy1)
			? [0, kage.kWidth * kage.kKakato] // ?????
			: normalize([x1 - sx1, y1 - sy1], kage.kWidth * kage.kKakato);
		x1 += dx1;
		y1 += dy1;
	}

	if (a2 % 10 === 2) {
		const [dx2, dy2] = (sx2 === x2 && sy2 === y2)
			? [0, -kage.kWidth] // ?????
			: normalize([x2 - sx2, y2 - sy2], kage.kWidth);
		x2 += dx2;
		y2 += dy2;
	}

	if (a2 % 10 === 3) {
		const [dx2, dy2] = (sx2 === x2 && sy2 === y2)
			? [0, -kage.kWidth * kage.kKakato] // ?????
			: normalize([x2 - sx2, y2 - sy2], kage.kWidth * kage.kKakato);
		x2 += dx2;
		y2 += dy2;
	}

	const poly = new Polygon();
	const poly2 = new Polygon();

	for (let tt = 0; tt <= 1000; tt += kage.kRate) {
		const t = tt / 1000;

		let x;
		let y;
		let ix;
		let iy;
		if (sx1 === sx2 && sy1 === sy2) {
			// calculating each point
			x = quadraticBezier(x1, sx1, x2, t);
			y = quadraticBezier(y1, sy1, y2, t);

			// SESSEN NO KATAMUKI NO KEISAN(BIBUN)
			ix = quadraticBezierDeriv(x1, sx1, x2, t);
			iy = quadraticBezierDeriv(y1, sy1, y2, t);
		} else {
			// calculate a dot
			x = cubicBezier(x1, sx1, sx2, x2, t);
			y = cubicBezier(y1, sy1, sy2, y2, t);
			// KATAMUKI of vector by BIBUN
			ix = cubicBezierDeriv(x1, sx1, sx2, x2, t);
			iy = cubicBezierDeriv(y1, sy1, sy2, y2, t);
		}
		// SESSEN NI SUICHOKU NA CHOKUSEN NO KEISAN
		const [ia, ib] = (round(ix) === 0 && round(iy) === 0)
			? [-kage.kWidth, 0] // ?????
			: normalize([-iy, ix], kage.kWidth);

		// save to polygon
		poly.push(x - ia, y - ib);
		poly2.push(x + ia, y + ib);
	}

	poly2.reverse();
	poly.concat(poly2);
	polygons.push(poly);
}

export function cdDrawBezier(
	kage: Kage, polygons: Polygons,
	x1: number, y1: number, x2: number, y2: number,
	x3: number, y3: number, x4: number, y4: number,
	a1: number, a2: number,
	opt1: number, opt2: number, opt3: number, opt4: number): void {
	cdDrawCurveU(kage, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a1, a2, opt1, opt2, opt3, opt4);
}

export function cdDrawCurve(
	kage: Kage, polygons: Polygons,
	x1: number, y1: number, x2: number, y2: number, x3: number, y3: number,
	a1: number, a2: number,
	opt1: number, opt2: number, opt3: number, opt4: number): void {
	cdDrawCurveU(kage, polygons, x1, y1, x2, y2, x2, y2, x3, y3, a1, a2, opt1, opt2, opt3, opt4);
}

export function cdDrawLine(
	kage: Kage, polygons: Polygons,
	tx1: number, ty1: number, tx2: number, ty2: number,
	ta1: number, ta2: number, _opt1: number, _opt2: number): void {

	let x1;
	let y1;
	let x2;
	let y2;
	let a1;
	let a2;
	if (tx1 === tx2 && ty1 > ty2 || tx1 > tx2) {
		x1 = tx2;
		y1 = ty2;
		x2 = tx1;
		y2 = ty1;
		a1 = ta2;
		a2 = ta1;
	} else {
		x1 = tx1;
		y1 = ty1;
		x2 = tx2;
		y2 = ty2;
		a1 = ta1;
		a2 = ta2;
	}
	const [dx, dy] = (x1 === x2 && y1 === y2) ? [0, kage.kWidth] : normalize([x2 - x1, y2 - y1], kage.kWidth);
	if (a1 % 10 === 2) {
		x1 -= dx;
		y1 -= dy;
	}
	if (a2 % 10 === 2) {
		x2 += dx;
		y2 += dy;
	}
	if (a1 % 10 === 3) {
		x1 -= dx * kage.kKakato;
		y1 -= dy * kage.kKakato;
	}
	if (a2 % 10 === 3) {
		x2 += dx * kage.kKakato;
		y2 += dy * kage.kKakato;
	}

	// SUICHOKU NO ICHI ZURASHI HA Math.sin TO Math.cos NO IREKAE + x-axis MAINASU KA
	const poly = new Polygon([
		{ x: x1 + dy, y: y1 - dx },
		{ x: x2 + dy, y: y2 - dx },
		{ x: x2 - dy, y: y2 + dx },
		{ x: x1 - dy, y: y1 + dx },
	]);
	if (tx1 === tx2) {
		poly.reverse(); // ?????
	}

	polygons.push(poly);
}
