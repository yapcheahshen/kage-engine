import { Kage } from "./kage";
import { normalize, quadraticBezier, quadraticBezierDeriv, ternarySearchMin } from "./util";

export function divide_curve(
	_kage: Kage,
	x1: number, y1: number,
	sx1: number, sy1: number,
	x2: number, y2: number, curve: Array<[number, number]>): { index: number, off: [number[], number[]] } {
	const rate = 0.5;
	const cut = Math.floor(curve.length * rate);
	const cut_rate = cut / curve.length;
	const tx1 = x1 + (sx1 - x1) * cut_rate;
	const ty1 = y1 + (sy1 - y1) * cut_rate;
	const tx2 = sx1 + (x2 - sx1) * cut_rate;
	const ty2 = sy1 + (y2 - sy1) * cut_rate;
	const tx3 = tx1 + (tx2 - tx1) * cut_rate;
	const ty3 = ty1 + (ty2 - ty1) * cut_rate;

	// must think about 0 : <0
	return {
		index: cut,
		off: [[x1, y1, tx1, ty1, tx3, ty3], [tx3, ty3, tx2, ty2, x2, y2]],
	};
}

// ------------------------------------------------------------------
export function find_offcurve(
	_kage: Kage,
	curve: Array<[number, number]>, sx: number, sy: number) {
	const [nx1, ny1] = curve[0];
	const [nx2, ny2] = curve[curve.length - 1];

	const area = 8;

	const minx = ternarySearchMin((tx) => {
		let diff = 0;
		for (let tt = 0; tt < curve.length; tt++) {
			const t = tt / curve.length;

			// calculate a dot
			const x = quadraticBezier(nx1, tx, nx2, t);

			diff += (curve[tt][0] - x) ** 2;
		}
		return diff;
	}, sx - area, sx + area);

	const miny = ternarySearchMin((ty) => {
		let diff = 0;
		for (let tt = 0; tt < curve.length; tt++) {
			const t = tt / curve.length;

			// calculate a dot
			const y = quadraticBezier(ny1, ty, ny2, t);

			diff += (curve[tt][1] - y) ** 2;
		}
		return diff;
	}, sy - area, sy + area);

	return [nx1, ny1, minx, miny, nx2, ny2];
}

// ------------------------------------------------------------------
export function get_candidate(
	kage: Kage,
	a1: number, a2: number,
	x1: number, y1: number, sx1: number, sy1: number, x2: number, y2: number,
	opt3: number, opt4: number) {
	const curve: [Array<[number, number]>, Array<[number, number]>] = [[], []];

	for (let tt = 0; tt <= 1000; tt += kage.kRate) {
		const t = tt / 1000;

		// calculate a dot
		const x = quadraticBezier(x1, sx1, x2, t);
		const y = quadraticBezier(y1, sy1, y2, t);

		// KATAMUKI of vector by BIBUN
		const ix = quadraticBezierDeriv(x1, sx1, x2, t);
		const iy = quadraticBezierDeriv(y1, sy1, y2, t);

		const hosomi = 0.5;
		let deltad
			= (a1 === 7 && a2 === 0) // L2RD: fatten
				? t ** hosomi * kage.kL2RDfatten
				: (a1 === 7)
					? t ** hosomi
					: (a2 === 7)
						? (1 - t) ** hosomi
						: (opt3 > 0)
							? 1 - opt3 / 2 / (kage.kMinWidthT - opt4 / 2) + opt3 / 2 / (kage.kMinWidthT - opt4) * t
							: 1;

		if (deltad < 0.15) {
			deltad = 0.15;
		}

		// line SUICHOKU by vector
		const [ia, ib] = (ix === 0)
			? [-kage.kMinWidthT * deltad, 0] // ?????
			: normalize([-iy, ix], kage.kMinWidthT * deltad);

		curve[0].push([x - ia, y - ib]);
		curve[1].push([x + ia, y + ib]);
	}
	return curve;
}
