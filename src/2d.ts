// Reference : http://www.cam.hi-ho.ne.jp/strong_warriors/teacher/chapter0{4,5}.html

/** Cross product of two vectors */
function cross(x1: number, y1: number, x2: number, y2: number) {
	return x1 * y2 - x2 * y1;
}

// class Point {
// 	constructor(public x: number, public y: number) {
// 	}
// }

// function getCrossPoint(
// 	x11: number, y11: number, x12: number, y12: number,
// 	x21: number, y21: number, x22: number, y22: number) {
// 	const a1 = y12 - y11;
// 	const b1 = x11 - x12;
// 	const c1 = -1 * a1 * x11 - b1 * y11;
// 	const a2 = y22 - y21;
// 	const b2 = x21 - x22;
// 	const c2 = -1 * a2 * x21 - b2 * y21;
//
// 	const temp = b1 * a2 - b2 * a1;
// 	if (temp === 0) { // parallel
// 		return null;
// 	}
// 	return new Point((c1 * b2 - c2 * b1) / temp, (a1 * c2 - a2 * c1) / temp);
// }

function isCross(
	x11: number, y11: number, x12: number, y12: number,
	x21: number, y21: number, x22: number, y22: number) {
	const cross_1112_2122 = cross(x12 - x11, y12 - y11, x22 - x21, y22 - y21);
	if (cross_1112_2122 === 0) {
		// parallel
		return false; // XXX should check if segments overlap?
	}

	const cross_1112_1121 = cross(x12 - x11, y12 - y11, x21 - x11, y21 - y11);
	const cross_1112_1122 = cross(x12 - x11, y12 - y11, x22 - x11, y22 - y11);
	const cross_2122_2111 = cross(x22 - x21, y22 - y21, x11 - x21, y11 - y21);
	const cross_2122_2112 = cross(x22 - x21, y22 - y21, x12 - x21, y12 - y21);

	return cross_1112_1121 * cross_1112_1122 <= 0 && cross_2122_2111 * cross_2122_2112 <= 0;
}

function isCrossBox(
	x1: number, y1: number, x2: number, y2: number,
	bx1: number, by1: number, bx2: number, by2: number) {
	if (isCross(x1, y1, x2, y2, bx1, by1, bx2, by1)) {
		return true;
	}
	if (isCross(x1, y1, x2, y2, bx2, by1, bx2, by2)) {
		return true;
	}
	if (isCross(x1, y1, x2, y2, bx1, by2, bx2, by2)) {
		return true;
	}
	if (isCross(x1, y1, x2, y2, bx1, by1, bx1, by2)) {
		return true;
	}
	return false;
}

export function isCrossBoxWithOthers(
	strokesArray: number[][], i: number,
	bx1: number, by1: number, bx2: number, by2: number) {
	for (let j = 0; j < strokesArray.length; j++) {
		if (i === j) {
			continue;
		}
		switch (strokesArray[j][0]) {
			case 0:
			case 8:
			case 9:
				break;
			case 6:
			case 7:
				if (isCrossBox(
					strokesArray[j][7], strokesArray[j][8], strokesArray[j][9], strokesArray[j][10],
					bx1, by1, bx2, by2)) {
					return true;
				}
			// falls through
			case 2:
			case 12:
			case 3:
				if (isCrossBox(
					strokesArray[j][5], strokesArray[j][6], strokesArray[j][7], strokesArray[j][8],
					bx1, by1, bx2, by2)) {
					return true;
				}
			// falls through
			default:
				if (isCrossBox(
					strokesArray[j][3], strokesArray[j][4], strokesArray[j][5], strokesArray[j][6],
					bx1, by1, bx2, by2)) {
					return true;
				}
		}
	}
	return false;
}

export function isCrossWithOthers(
	strokesArray: number[][], i: number,
	bx1: number, by1: number, bx2: number, by2: number) {
	for (let j = 0; j < strokesArray.length; j++) {
		if (i === j) {
			continue;
		}
		switch (strokesArray[j][0]) {
			case 0:
			case 8:
			case 9:
				break;
			case 6:
			case 7:
				if (isCross(strokesArray[j][7], strokesArray[j][8], strokesArray[j][9], strokesArray[j][10], bx1, by1, bx2, by2)) {
					return true;
				}
			// falls through
			case 2:
			case 12:
			case 3:
				if (isCross(strokesArray[j][5], strokesArray[j][6], strokesArray[j][7], strokesArray[j][8], bx1, by1, bx2, by2)) {
					return true;
				}
			// falls through
			default:
				if (isCross(strokesArray[j][3], strokesArray[j][4], strokesArray[j][5], strokesArray[j][6], bx1, by1, bx2, by2)) {
					return true;
				}
		}
	}
	return false;
}
