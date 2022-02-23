export interface Point {
	/** The x-coordinate of the point. */
	x: number;
	/** The y-coordinate of the point. */
	y: number;
	/**
	 * Whether the point is an off-curve point, i.e. a control point in a quadratic
	 * Bézier curve.
	 */
	off: boolean;
}

export type PointOptOff = Omit<Point, "off"> & Partial<Pick<Point, "off">>;

/**
 * Represents a single contour of a rendered glyph.
 *
 * It internally maintains the coordinate values with original precision as
 * set by the constructor, {@link set}, {@link push} or {@link unshift} methods,
 * but the {@link array} getter or {@link get} method returns the values rounded
 * to the first decimal place toward -infinity (for backward compatibility).
 */
export class Polygon {
	/**
	 * A read-only array consisting of the points in this contour.
	 *
	 * Modifications to this array do NOT affect the contour;
	 * call {@link set} method to modify the contour.
	 */
	// resolution : 0.1
	public get array(): ReadonlyArray<Readonly<Point>> {
		return this._array.map((_, i) => this.get(i));
	}
	/** The number of points in this contour. */
	// Added by @kurgm
	public get length(): number {
		return this._array.length;
	}
	protected _array: Point[];
	/**
	 * Construct the `Polygon` object. If the argument `length` is given,
	 * constructed object has contour of size `length` whose members are all
	 * initialized to the origin point (0, 0). Otherwise the contour has
	 * no points.
	 * @param length The initial number of points in the contour.
	 */
	constructor(length?: number);
	/**
	 * Construct the `Polygon` object with the given points as its contour.
	 * @param points The points in the contour.
	 */
	constructor(points: PointOptOff[]);

	constructor(param?: number | PointOptOff[]) {
		// property
		this._array = [];
		// initialize
		if (param) {
			if (typeof param === "number") {
				for (let i = 0; i < param; i++) {
					this.push(0, 0, false);
				}
			} else {
				param.forEach(({ x, y, off }) => {
					this.push(x, y, off);
				});
			}
		}
	}

	// method
	/**
	 * Appends a point at the end of its contour.
	 * @param x The x-coordinate of the appended point.
	 * @param y The y-coordiante of the appended point.
	 * @param off Whether the appended point is an off-curve point. Defaults to `false`.
	 */
	public push(x: number, y: number, off: boolean = false): void {
		this._array.push({ x, y, off });
	}

	/**
	 * Appends a point at the end of its contour.
	 * @param point The appended point.
	 */
	// Added by @kurgm
	public pushPoint(point: PointOptOff): void {
		this.push(point.x, point.y, point.off);
	}

	/**
	 * Mutates a point in its contour.
	 * @param index The index in the contour of the point to be mutated.
	 * @param x The new x-coordinate of the point.
	 * @param y The new y-coordinate of the point.
	 * @param off Whether the new point is an off-curve point. Defaults to `false`.
	 */
	public set(index: number, x: number, y: number, off: boolean = false): void {
		this._array[index].x = x;
		this._array[index].y = y;
		this._array[index].off = off;
	}

	/**
	 * Mutates a point in its contour.
	 * @param index The index in the contour of the point to be mutated.
	 * @param point A point of the new coordinate values. Omitting `off` property makes
	 *     the point an on-curve point (as if `off: false` were specified).
	 */
	// Added by @kurgm
	public setPoint(index: number, point: PointOptOff): void {
		this.set(index, point.x, point.y, point.off);
	}

	/**
	 * Retrieves a point in its contour.
	 * @param index The index in the contour of the point to be retrieved.
	 * @returns A read-only point object. Modifications made to the returned
	 *     object do NOT affect the values of the point in the contour;
	 *     call {@link set} method to modify the contour.
	 */
	public get(index: number): Readonly<Point> {
		const { x, y, off } = this._array[index];
		return {
			x: Math.floor(x * 10) / 10, // should be Math.round?
			y: Math.floor(y * 10) / 10, // should be Math.round?
			off,
		};
	}

	/**
	 * Reverses the points in its contour.
	 */
	public reverse(): void {
		this._array.reverse();
	}

	/**
	 * Appends the points in the contour of another {@link Polygon} at the end of
	 * this contour. The other Polygon is not mutated.
	 * @param poly The other {@link Polygon} to be appended.
	 */
	public concat(poly: Polygon): void {
		this._array = this._array.concat(poly._array);
	}

	/**
	 * Removes the first point in its contour. If there are no points in the contour,
	 * nothing is performed.
	 */
	public shift(): void {
		this._array.shift();
	}

	/**
	 * Inserts a new point at the start of its contour.
	 * @param x The x-coordinate of the inserted point.
	 * @param y The y-coordiante of the inserted point.
	 * @param off Whether the inserted point is an off-curve point. Defaults to `false`.
	 */
	public unshift(x: number, y: number, off: boolean = false): void {
		this._array.unshift({ x, y, off });
	}

	/**
	 * Creates a deep copy of this Polygon.
	 * @returns A new {@link Polygon} instance.
	 */
	// Added by @kurgm
	public clone(): Polygon {
		const newpolygon = new Polygon();
		this._array.forEach(({ x, y, off }) => {
			newpolygon.push(x, y, off);
		});
		return newpolygon;
	}

	/**
	 * Translates the whole polygon by the given amount.
	 * @param dx The x-amount of translation.
	 * @param dy The y-amount of translation.
	 * @returns This object (for chaining).
	 * @internal
	 */
	// Added by @kurgm
	public translate(dx: number, dy: number): this {
		this._array.forEach((point) => {
			point.x += dx;
			point.y += dy;
		});
		return this; // for chaining
	}

	/**
	 * Transforms the whole polygon by applying a transform matrix. The coordinates of
	 * transformed points are defined by:
	 * ```math
	 * x' = a x + b y, y' = c x + d y
	 * ```
	 * where `x` and `y` are old coordinates and `x'` and `y'` are new coordinates.
	 * @returns This object (for chaining).
	 * @internal
	 */
	// Added by @kurgm
	public transformMatrix(a: number, b: number, c: number, d: number): this {
		this._array.forEach((point) => {
			const { x, y } = point;
			point.x = a * x + b * y;
			point.y = c * x + d * y;
		});
		return this; // for chaining
	}

	/**
	 * Transforms the whole polygon by a uniform scaling and a rotation.
	 * The transformation is such that it maps the origin point (0, 0) to the origin
	 * point (0, 0) and the point (0, 1) to the point (x, y). Equivalent to calling
	 * {@link transformMatrix}(x, -y, y, x). Mathematically equivalent to
	 * applying uniform scaling by the factor hypot(x, y) and rotating by the angle
	 * atan2(y, x), or multiplying (x+yi) on the complex plane.
	 * @returns This object (for chaining).
	 * @internal
	 */
	// Added by @kurgm
	public transformMatrix2(x: number, y: number): this {
		return this.transformMatrix(x, -y, y, x);
	}

	/**
	 * Applies uniform scaling to the whole polygon.
	 * Equivalent to calling {@link transformMatrix}(factor, 0, 0, factor).
	 * @param factor The scaling factor.
	 * @returns This object (for chaining).
	 * @internal
	 */
	// Added by @kurgm
	public scale(factor: number): this {
		this._array.forEach((point) => {
			point.x *= factor;
			point.y *= factor;
		});
		return this; // for chaining
	}

	/**
	 * Flips the sign of the x-coordinate of each point in the contour.
	 * Equivalent to calling {@link transformMatrix}(-1, 0, 0, 1).
	 * @returns This object (for chaining).
	 * @internal
	 */
	// Added by @kurgm
	public reflectX(): this {
		this._array.forEach((point) => {
			point.x *= -1;
		});
		return this; // for chaining
	}

	/**
	 * Flips the sign of the y-coordinate of each point in the contour.
	 * Equivalent to calling {@link transformMatrix}(1, 0, 0, -1).
	 * @returns This object (for chaining).
	 * @internal
	 */
	// Added by @kurgm
	public reflectY(): this {
		this._array.forEach((point) => {
			point.y *= -1;
		});
		return this; // for chaining
	}

	/**
	 * Rotates the whole polygon by 90 degrees clockwise.
	 * Equivalent to calling {@link transformMatrix}(0, -1, 1, 0).
	 * @returns This object (for chaining).
	 * @internal
	 */
	// Added by @kurgm
	public rotate90(): this {
		this._array.forEach((point) => {
			const { x, y } = point;
			point.x = -y;
			point.y = x;
		});
		return this;
	}

	/**
	 * Rotates the whole polygon by 180 degrees.
	 * Equivalent to calling {@link transformMatrix}(-1, 0, 0, -1), or
	 * {@link scale}(-1).
	 * @returns This object (for chaining).
	 * @internal
	 */
	// Added by @kurgm
	public rotate180(): this {
		return this.scale(-1); // for chaining
	}

	/**
	 * Rotates the whole polygon by 270 degrees clockwise.
	 * Equivalent to calling {@link transformMatrix}(0, 1, -1, 0).
	 * @returns This object (for chaining).
	 * @internal
	 */
	// Added by @kurgm
	public rotate270(): this {
		this._array.forEach((point) => {
			const { x, y } = point;
			point.x = y;
			point.y = -x;
		});
		return this;
	}

	/**
	 * Applies the floor function to all the coordinate values in the contour.
	 * @returns This object (for chaining).
	 * @internal
	 */
	// for backward compatibility...
	public floor(): this {
		this._array.forEach((point) => {
			const { x, y } = point;
			point.x = Math.floor(x);
			point.y = Math.floor(y);
		});
		return this;
	}
}
