declare var Math: Math & {
	hypot?(...args: number[]): number;
};

export const hypot: (x: number, y: number) => number = Math.hypot || ((x, y) => Math.sqrt(x * x + y * y));
