export function divide_curve(kage, x1, y1, sx1, sy1, x2, y2, curve) {
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
	const div_curve = [[], []];
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
export function find_offcurve(kage, curve, sx, sy) {
	let minx;
	let miny;
	let mindiff = 100000;
	const area = 8;
	const mesh = 2;
	// area = 10   mesh = 5 -> 281 calcs
	// area = 10   mesh = 4 -> 180 calcs
	// area =  8   mesh = 4 -> 169 calcs
	// area =  7.5 mesh = 3 -> 100 calcs
	// area =  8   mesh = 2 ->  97 calcs
	// area =  7   mesh = 2 ->  80 calcs

	const [nx1, ny1] = curve[0];
	const [nx2, ny2] = curve[curve.length - 1];

	for (let tx = sx - area; tx < sx + area; tx += mesh) {
		for (let ty = sy - area; ty < sy + area; ty += mesh) {
			let count = 0;
			let diff = 0;
			for (let tt = 0; tt < curve.length; tt++) {
				const t = tt / curve.length;

				// calculate a dot
				const x = ((1.0 - t) * (1.0 - t) * nx1 + 2.0 * t * (1.0 - t) * tx + t * t * nx2);
				const y = ((1.0 - t) * (1.0 - t) * ny1 + 2.0 * t * (1.0 - t) * ty + t * t * ny2);

				// KATAMUKI of vector by BIBUN
				// const ix = (nx1 - 2.0 * tx + nx2) * 2.0 * t + (-2.0 * nx1 + 2.0 * tx);
				// const iy = (ny1 - 2.0 * ty + ny2) * 2.0 * t + (-2.0 * ny1 + 2.0 * ty);

				diff += (curve[count][0] - x) * (curve[count][0] - x) + (curve[count][1] - y) * (curve[count][1] - y);
				if (diff > mindiff) {
					tt = curve.length;
				}
				count++;
			}
			if (diff < mindiff) {
				minx = tx;
				miny = ty;
				mindiff = diff;
			}
		}
	}

	for (let tx = minx - mesh + 1; tx <= minx + mesh - 1; tx += 0.5) {
		for (let ty = miny - mesh + 1; ty <= miny + mesh - 1; ty += 0.5) {
			let count = 0;
			let diff = 0;
			for (let tt = 0; tt < curve.length; tt++) {
				const t = tt / curve.length;

				// calculate a dot
				const x = ((1.0 - t) * (1.0 - t) * nx1 + 2.0 * t * (1.0 - t) * tx + t * t * nx2);
				const y = ((1.0 - t) * (1.0 - t) * ny1 + 2.0 * t * (1.0 - t) * ty + t * t * ny2);

				// KATAMUKI of vector by BIBUN
				// const ix = (nx1 - 2.0 * tx + nx2) * 2.0 * t + (-2.0 * nx1 + 2.0 * tx);
				// const iy = (ny1 - 2.0 * ty + ny2) * 2.0 * t + (-2.0 * ny1 + 2.0 * ty);

				diff += (curve[count][0] - x) * (curve[count][0] - x) + (curve[count][1] - y) * (curve[count][1] - y);
				if (diff > mindiff) {
					tt = curve.length;
				}
				count++;
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
export function get_candidate(kage, a1, a2, x1, y1, sx1, sy1, x2, y2, opt3, opt4) {
	const curve = [[], []];

	for (let tt = 0; tt <= 1000; tt += kage.kRate) {
		const t = tt / 1000;

		// calculate a dot
		const x = ((1.0 - t) * (1.0 - t) * x1 + 2.0 * t * (1.0 - t) * sx1 + t * t * x2);
		const y = ((1.0 - t) * (1.0 - t) * y1 + 2.0 * t * (1.0 - t) * sy1 + t * t * y2);

		// KATAMUKI of vector by BIBUN
		const ix = (x1 - 2.0 * sx1 + x2) * 2.0 * t + (-2.0 * x1 + 2.0 * sx1);
		const iy = (y1 - 2.0 * sy1 + y2) * 2.0 * t + (-2.0 * y1 + 2.0 * sy1);
		// line SUICHOKU by vector
		let ia;
		let ib;
		if (ix !== 0 && iy !== 0) {
			const ir = Math.atan(iy / ix * -1);
			ia = Math.sin(ir) * (kage.kMinWidthT);
			ib = Math.cos(ir) * (kage.kMinWidthT);
		} else if (ix === 0) {
			ia = kage.kMinWidthT;
			ib = 0;
		} else {
			ia = 0;
			ib = kage.kMinWidthT;
		}

		const hosomi = 0.5;
		let deltad
		= (a1 == 7 && a2 == 0) // L2RD: fatten
			? Math.pow(t, hosomi) * kage.kL2RDfatten
			: (a1 == 7)
				? Math.pow(t, hosomi)
				: (a2 == 7)
					? Math.pow(1.0 - t, hosomi)
					: (opt3 > 0)
						? (((kage.kMinWidthT - opt4 / 2) - opt3 / 2) / (kage.kMinWidthT - opt4 / 2)) + opt3 / 2 / (kage.kMinWidthT - opt4) * t
						: 1;

		if (deltad < 0.15) {
			deltad = 0.15;
		}
		ia *= deltad;
		ib *= deltad;

		// reverse if vector is going 2nd/3rd quadrants
		if (ix <= 0) {
			ia *= -1;
			ib *= -1;
		}

		curve[0].push([x - ia, y - ib]);
		curve[1].push([x + ia, y + ib]);
	}
	return curve;
}
