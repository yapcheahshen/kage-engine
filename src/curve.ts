import { Kage } from "./kage";
import { normalize } from "./util";

export function divide_curve(
	_kage: Kage,
	x1: number, y1: number,
	sx1: number, sy1: number,
	x2: number, y2: number, curve: Array<[number, number]>) {
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
	const div_curve: [Array<[number, number]>, Array<[number, number]>] = [[], []];
	for (let i = 0; i <= cut; i++) {
		div_curve[0].push(curve[i]);
	}
	for (let i = cut; i < curve.length; i++) {
		div_curve[1].push(curve[i]);
	}
	const off_curve = [
		[x1, y1, tx1, ty1, tx3, ty3],
		[tx3, ty3, tx2, ty2, x2, y2],
	];
	return {
		div_curve,
		off_curve,
	};
}

// ------------------------------------------------------------------
export function find_offcurve(
	_kage: Kage,
	curve: Array<[number, number]>, sx: number, sy: number) {
	const [nx1, ny1] = curve[0];
	const [nx2, ny2] = curve[curve.length - 1];

	let minx: number;
	let miny: number;
	let mindiff = Infinity;
	const area = 8;
	const mesh = 2;
	// area = 10   mesh = 5 -> 281 calcs
	// area = 10   mesh = 4 -> 180 calcs
	// area =  8   mesh = 4 -> 169 calcs
	// area =  7.5 mesh = 3 -> 100 calcs
	// area =  8   mesh = 2 ->  97 calcs
	// area =  7   mesh = 2 ->  80 calcs

	for (let tx = sx - area; tx < sx + area; tx += mesh) {
		for (let ty = sy - area; ty < sy + area; ty += mesh) {
			let diff = 0;
			for (let tt = 0; tt < curve.length; tt++) {
				const t = tt / curve.length;

				// calculate a dot
				const x = ((1 - t) ** 2 * nx1 + 2 * t * (1 - t) * tx + t ** 2 * nx2);
				const y = ((1 - t) ** 2 * ny1 + 2 * t * (1 - t) * ty + t ** 2 * ny2);

				// KATAMUKI of vector by BIBUN
				// const ix = (nx1 - 2 * tx + nx2) * 2 * t + (-2 * nx1 + 2 * tx);
				// const iy = (ny1 - 2 * ty + ny2) * 2 * t + (-2 * ny1 + 2 * ty);

				diff += (curve[tt][0] - x) ** 2 + (curve[tt][1] - y) ** 2;
				if (diff > mindiff) {
					break;
				}
			}
			if (diff < mindiff) {
				minx = tx;
				miny = ty;
				mindiff = diff;
			}
		}
	}

	for (let tx = minx! - mesh + 1; tx <= minx + mesh - 1; tx += 0.5) {
		for (let ty = miny! - mesh + 1; ty <= miny + mesh - 1; ty += 0.5) {
			let diff = 0;
			for (let tt = 0; tt < curve.length; tt++) {
				const t = tt / curve.length;

				// calculate a dot
				const x = ((1 - t) ** 2 * nx1 + 2 * t * (1 - t) * tx + t ** 2 * nx2);
				const y = ((1 - t) ** 2 * ny1 + 2 * t * (1 - t) * ty + t ** 2 * ny2);

				// KATAMUKI of vector by BIBUN
				// const ix = (nx1 - 2 * tx + nx2) * 2 * t + (-2 * nx1 + 2 * tx);
				// const iy = (ny1 - 2 * ty + ny2) * 2 * t + (-2 * ny1 + 2 * ty);

				diff += (curve[tt][0] - x) ** 2 + (curve[tt][1] - y) ** 2;
				if (diff > mindiff) {
					break;
				}
			}
			if (diff < mindiff) {
				minx = tx;
				miny = ty;
				mindiff = diff;
			}
		}
	}

	return [nx1, ny1, minx, miny, nx2, ny2, mindiff];
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
		const x = ((1 - t) ** 2 * x1 + 2 * t * (1 - t) * sx1 + t ** 2 * x2);
		const y = ((1 - t) ** 2 * y1 + 2 * t * (1 - t) * sy1 + t ** 2 * y2);

		// KATAMUKI of vector by BIBUN
		const ix = (x1 - 2 * sx1 + x2) * 2 * t + (-2 * x1 + 2 * sx1);
		const iy = (y1 - 2 * sy1 + y2) * 2 * t + (-2 * y1 + 2 * sy1);

		const hosomi = 0.5;
		let deltad
			= (a1 === 7 && a2 === 0) // L2RD: fatten
				? Math.pow(t, hosomi) * kage.kL2RDfatten
				: (a1 === 7)
					? Math.pow(t, hosomi)
					: (a2 === 7)
						? Math.pow(1 - t, hosomi)
						: (opt3 > 0)
							? (
								((kage.kMinWidthT - opt4 / 2) - opt3 / 2) / (kage.kMinWidthT - opt4 / 2)
								+ opt3 / 2 / (kage.kMinWidthT - opt4) * t
							)
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
