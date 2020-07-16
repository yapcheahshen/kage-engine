import { generateFattenCurve } from "../../curve";
import { Polygon } from "../../polygon";
import { Polygons } from "../../polygons";
import { normalize, round } from "../../util";
import Gothic from ".";

function cdDrawCurveU(
	font: Gothic, polygons: Polygons,
	x1: number, y1: number, sx1: number, sy1: number,
	sx2: number, sy2: number, x2: number, y2: number,
	ta1: number, ta2: number) {

	const a1 = ta1;
	const a2 = ta2;
	if (a1 % 10 === 2) {
		const [dx1, dy1] = (x1 === sx1 && y1 === sy1)
			? [0, font.kWidth] // ?????
			: normalize([x1 - sx1, y1 - sy1], font.kWidth);
		x1 += dx1;
		y1 += dy1;
	} else if (a1 % 10 === 3) {
		const [dx1, dy1] = (x1 === sx1 && y1 === sy1)
			? [0, font.kWidth * font.kKakato] // ?????
			: normalize([x1 - sx1, y1 - sy1], font.kWidth * font.kKakato);
		x1 += dx1;
		y1 += dy1;
	}

	if (a2 % 10 === 2) {
		const [dx2, dy2] = (sx2 === x2 && sy2 === y2)
			? [0, -font.kWidth] // ?????
			: normalize([x2 - sx2, y2 - sy2], font.kWidth);
		x2 += dx2;
		y2 += dy2;
	} else if (a2 % 10 === 3) {
		const [dx2, dy2] = (sx2 === x2 && sy2 === y2)
			? [0, -font.kWidth * font.kKakato] // ?????
			: normalize([x2 - sx2, y2 - sy2], font.kWidth * font.kKakato);
		x2 += dx2;
		y2 += dy2;
	}

	const { left, right } = generateFattenCurve(
		x1, y1, sx1, sy1, sx2, sy2, x2, y2,
		font.kRate,
		() => font.kWidth,
		([x, y], mag) => (round(x) === 0 && round(y) === 0)
			? [-mag, 0] // ?????
			: normalize([x, y], mag)
	);

	const poly = new Polygon();
	const poly2 = new Polygon();
	// save to polygon
	for (const [x, y] of left) {
		poly.push(x, y);
	}
	for (const [x, y] of right) {
		poly2.push(x, y);
	}

	poly2.reverse();
	poly.concat(poly2);
	polygons.push(poly);
}

export function cdDrawBezier(
	font: Gothic, polygons: Polygons,
	x1: number, y1: number, x2: number, y2: number,
	x3: number, y3: number, x4: number, y4: number,
	a1: number, a2: number): void {
	cdDrawCurveU(font, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a1, a2);
}

export function cdDrawCurve(
	font: Gothic, polygons: Polygons,
	x1: number, y1: number, x2: number, y2: number, x3: number, y3: number,
	a1: number, a2: number): void {
	cdDrawCurveU(font, polygons, x1, y1, x2, y2, x2, y2, x3, y3, a1, a2);
}

export function cdDrawLine(
	font: Gothic, polygons: Polygons,
	tx1: number, ty1: number, tx2: number, ty2: number,
	ta1: number, ta2: number): void {

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
	const [dx, dy] = (x1 === x2 && y1 === y2)
		? [0, font.kWidth] // ?????
		: normalize([x2 - x1, y2 - y1], font.kWidth);

	if (a1 % 10 === 2) {
		x1 -= dx;
		y1 -= dy;
	} else if (a1 % 10 === 3) {
		x1 -= dx * font.kKakato;
		y1 -= dy * font.kKakato;
	}

	if (a2 % 10 === 2) {
		x2 += dx;
		y2 += dy;
	} else if (a2 % 10 === 3) {
		x2 += dx * font.kKakato;
		y2 += dy * font.kKakato;
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
