declare var Math: Math & {
	hypot?(...args: number[]): number;
};

export const hypot: (x: number, y: number) => number = Math.hypot || ((x, y) => Math.sqrt(x * x + y * y));

/** Calculates a new vector with the same angle and a new magnitude. */
export const normalize = ([x, y]: [number, number], magnitude: number = 1): [number, number] => {
	if (x === 0 && y === 0) {
		// Angle is the same as Math.atan2(y, x)
		return [1 / x === Infinity ? magnitude : -magnitude, 0];
	}
	const k = magnitude / hypot(x, y);
	return [x * k, y * k];
};
