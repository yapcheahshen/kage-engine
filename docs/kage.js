(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.isCrossBoxWithOthers = isCrossBoxWithOthers;
exports.isCrossWithOthers = isCrossWithOthers;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Reference : http://www.cam.hi-ho.ne.jp/strong_warriors/teacher/chapter0{4,5}.html

var point = function point(x, y) {
	_classCallCheck(this, point);

	this.x = x;
	this.y = y;
};

function getCrossPoint(x11, y11, x12, y12, x21, y21, x22, y22) {
	// point
	var a1 = y12 - y11;
	var b1 = x11 - x12;
	var c1 = -1 * a1 * x11 - b1 * y11;
	var a2 = y22 - y21;
	var b2 = x21 - x22;
	var c2 = -1 * a2 * x21 - b2 * y21;

	var temp = b1 * a2 - b2 * a1;
	if (temp === 0) {
		// parallel
		return false;
	}
	return new point((c1 * b2 - c2 * b1) / temp, (a1 * c2 - a2 * c1) / temp);
}

function isCross(x11, y11, x12, y12, x21, y21, x22, y22) {
	// boolean
	var temp = getCrossPoint(x11, y11, x12, y12, x21, y21, x22, y22);
	if (!temp) {
		return false;
	}
	if (x11 < x12 && (temp.x < x11 || x12 < temp.x) || x11 > x12 && (temp.x < x12 || x11 < temp.x) || y11 < y12 && (temp.y < y11 || y12 < temp.y) || y11 > y12 && (temp.y < y12 || y11 < temp.y)) {
		return false;
	}
	if (x21 < x22 && (temp.x < x21 || x22 < temp.x) || x21 > x22 && (temp.x < x22 || x21 < temp.x) || y21 < y22 && (temp.y < y21 || y22 < temp.y) || y21 > y22 && (temp.y < y22 || y21 < temp.y)) {
		return false;
	}
	return true;
}

function isCrossBox(x1, y1, x2, y2, bx1, by1, bx2, by2) {
	// boolean
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

function isCrossBoxWithOthers(strokesArray, i, bx1, by1, bx2, by2) {
	// boolean
	for (var j = 0; j < strokesArray.length; j++) {
		if (i == j) {
			continue;
		}
		switch (strokesArray[j][0]) {
			case 0:
			case 8:
			case 9:
				break;
			case 6:
			case 7:
				if (isCrossBox(strokesArray[j][7], strokesArray[j][8], strokesArray[j][9], strokesArray[j][10], bx1, by1, bx2, by2)) {
					return true;
				}
			// FALLTHROUGH
			case 2:
			case 12:
			case 3:
				if (isCrossBox(strokesArray[j][5], strokesArray[j][6], strokesArray[j][7], strokesArray[j][8], bx1, by1, bx2, by2)) {
					return true;
				}
			// FALLTHROUGH
			default:
				if (isCrossBox(strokesArray[j][3], strokesArray[j][4], strokesArray[j][5], strokesArray[j][6], bx1, by1, bx2, by2)) {
					return true;
				}
		}
	}
	return false;
}

function isCrossWithOthers(strokesArray, i, bx1, by1, bx2, by2) {
	// boolean
	for (var j = 0; j < strokesArray.length; j++) {
		if (i == j) {
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
			// FALLTHROUGH
			case 2:
			case 12:
			case 3:
				if (isCross(strokesArray[j][5], strokesArray[j][6], strokesArray[j][7], strokesArray[j][8], bx1, by1, bx2, by2)) {
					return true;
				}
			// FALLTHROUGH
			default:
				if (isCross(strokesArray[j][3], strokesArray[j][4], strokesArray[j][5], strokesArray[j][6], bx1, by1, bx2, by2)) {
					return true;
				}
		}
	}
	return false;
}

},{}],2:[function(require,module,exports){
"use strict";

var _ = require("./");

window.Kage = _.Kage;
window.Polygons = _.Polygons;

},{"./":5}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Buhin = exports.Buhin = function () {
	_createClass(Buhin, [{
		key: "set",

		// method
		value: function set(name, data) {
			// void
			this.hash[name] = data;
		}
	}, {
		key: "search",
		value: function search(name) {
			// string
			if (this.hash[name]) {
				return this.hash[name];
			}
			return ""; // no data
		}
	}]);

	function Buhin() {
		_classCallCheck(this, Buhin);

		// initialize
		// no operation
		this.hash = {};
	}

	return Buhin;
}();

Buhin.prototype.push = Buhin.prototype.set;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.divide_curve = divide_curve;
exports.find_offcurve = find_offcurve;
exports.get_candidate = get_candidate;
function divide_curve(kage, x1, y1, sx1, sy1, x2, y2, curve) {
	var rate = 0.5;
	var cut = Math.floor(curve.length * rate);
	var cut_rate = cut / curve.length;
	var tx1 = x1 + (sx1 - x1) * cut_rate;
	var ty1 = y1 + (sy1 - y1) * cut_rate;
	var tx2 = sx1 + (x2 - sx1) * cut_rate;
	var ty2 = sy1 + (y2 - sy1) * cut_rate;
	var tx3 = tx1 + (tx2 - tx1) * cut_rate;
	var ty3 = ty1 + (ty2 - ty1) * cut_rate;

	// must think about 0 : <0
	var div_curve = [[], []];
	for (var i = 0; i <= cut; i++) {
		div_curve[0].push(curve[i]);
	}
	for (var _i = cut; _i < curve.length; _i++) {
		div_curve[1].push(curve[_i]);
	}
	var off_curve = [[x1, y1, tx1, ty1, tx3, ty3], [tx3, ty3, tx2, ty2, x2, y2]];
	return {
		div_curve: div_curve,
		off_curve: off_curve
	};
}

// ------------------------------------------------------------------
function find_offcurve(kage, curve, sx, sy) {
	var minx = void 0;
	var miny = void 0;
	var mindiff = 100000;
	var area = 8;
	var mesh = 2;
	// area = 10   mesh = 5 -> 281 calcs
	// area = 10   mesh = 4 -> 180 calcs
	// area =  8   mesh = 4 -> 169 calcs
	// area =  7.5 mesh = 3 -> 100 calcs
	// area =  8   mesh = 2 ->  97 calcs
	// area =  7   mesh = 2 ->  80 calcs

	var _curve$ = _slicedToArray(curve[0], 2),
	    nx1 = _curve$[0],
	    ny1 = _curve$[1];

	var _curve = _slicedToArray(curve[curve.length - 1], 2),
	    nx2 = _curve[0],
	    ny2 = _curve[1];

	for (var tx = sx - area; tx < sx + area; tx += mesh) {
		for (var ty = sy - area; ty < sy + area; ty += mesh) {
			var count = 0;
			var diff = 0;
			for (var tt = 0; tt < curve.length; tt++) {
				var t = tt / curve.length;

				// calculate a dot
				var x = (1.0 - t) * (1.0 - t) * nx1 + 2.0 * t * (1.0 - t) * tx + t * t * nx2;
				var y = (1.0 - t) * (1.0 - t) * ny1 + 2.0 * t * (1.0 - t) * ty + t * t * ny2;

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

	for (var _tx = minx - mesh + 1; _tx <= minx + mesh - 1; _tx += 0.5) {
		for (var _ty = miny - mesh + 1; _ty <= miny + mesh - 1; _ty += 0.5) {
			var _count = 0;
			var _diff = 0;
			for (var _tt = 0; _tt < curve.length; _tt++) {
				var _t = _tt / curve.length;

				// calculate a dot
				var _x = (1.0 - _t) * (1.0 - _t) * nx1 + 2.0 * _t * (1.0 - _t) * _tx + _t * _t * nx2;
				var _y = (1.0 - _t) * (1.0 - _t) * ny1 + 2.0 * _t * (1.0 - _t) * _ty + _t * _t * ny2;

				// KATAMUKI of vector by BIBUN
				// const ix = (nx1 - 2.0 * tx + nx2) * 2.0 * t + (-2.0 * nx1 + 2.0 * tx);
				// const iy = (ny1 - 2.0 * ty + ny2) * 2.0 * t + (-2.0 * ny1 + 2.0 * ty);

				_diff += (curve[_count][0] - _x) * (curve[_count][0] - _x) + (curve[_count][1] - _y) * (curve[_count][1] - _y);
				if (_diff > mindiff) {
					_tt = curve.length;
				}
				_count++;
			}
			if (_diff < mindiff) {
				minx = _tx;
				miny = _ty;
				mindiff = _diff;
			}
		}
	}

	return [nx1, ny1, minx, miny, nx2, ny2, mindiff];
}

// ------------------------------------------------------------------
function get_candidate(kage, a1, a2, x1, y1, sx1, sy1, x2, y2, opt3, opt4) {
	var curve = [[], []];

	for (var tt = 0; tt <= 1000; tt += kage.kRate) {
		var t = tt / 1000;

		// calculate a dot
		var x = (1.0 - t) * (1.0 - t) * x1 + 2.0 * t * (1.0 - t) * sx1 + t * t * x2;
		var y = (1.0 - t) * (1.0 - t) * y1 + 2.0 * t * (1.0 - t) * sy1 + t * t * y2;

		// KATAMUKI of vector by BIBUN
		var ix = (x1 - 2.0 * sx1 + x2) * 2.0 * t + (-2.0 * x1 + 2.0 * sx1);
		var iy = (y1 - 2.0 * sy1 + y2) * 2.0 * t + (-2.0 * y1 + 2.0 * sy1);
		// line SUICHOKU by vector
		var ia = void 0;
		var ib = void 0;
		if (ix !== 0 && iy !== 0) {
			var ir = Math.atan(iy / ix * -1);
			ia = Math.sin(ir) * kage.kMinWidthT;
			ib = Math.cos(ir) * kage.kMinWidthT;
		} else if (ix === 0) {
			ia = kage.kMinWidthT;
			ib = 0;
		} else {
			ia = 0;
			ib = kage.kMinWidthT;
		}

		var hosomi = 0.5;
		var deltad = a1 == 7 && a2 == 0 ? // L2RD: fatten
		Math.pow(t, hosomi) * kage.kL2RDfatten : a1 == 7 ? Math.pow(t, hosomi) : a2 == 7 ? Math.pow(1.0 - t, hosomi) : opt3 > 0 ? (kage.kMinWidthT - opt4 / 2 - opt3 / 2) / (kage.kMinWidthT - opt4 / 2) + opt3 / 2 / (kage.kMinWidthT - opt4) * t : 1;

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

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Polygons = exports.Kage = undefined;

var _kage = require("./kage");

var _polygons = require("./polygons");

exports.Kage = _kage.Kage;
exports.Polygons = _polygons.Polygons;

},{"./kage":6,"./polygons":10}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Kage = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d = require("./2d");

var _buhin = require("./buhin");

var _polygons = require("./polygons");

var _kagedf = require("./kagedf");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Kage = exports.Kage = function () {
	_createClass(Kage, [{
		key: "makeGlyph",

		// method
		value: function makeGlyph(polygons, buhin) {
			// void
			var glyphData = this.kBuhin.search(buhin);
			this.makeGlyph2(polygons, glyphData);
		}
	}, {
		key: "makeGlyph2",
		value: function makeGlyph2(polygons, data) {
			// void
			if (data != "") {
				var strokesArray = this.adjustKirikuchi(this.adjustUroko2(this.adjustUroko(this.adjustKakato(this.adjustTate(this.adjustMage(this.adjustHane(this.getEachStrokes(data))))))));
				for (var i = 0; i < strokesArray.length; i++) {
					(0, _kagedf.dfDrawFont)(this, polygons, strokesArray[i][0], strokesArray[i][1], strokesArray[i][2], strokesArray[i][3], strokesArray[i][4], strokesArray[i][5], strokesArray[i][6], strokesArray[i][7], strokesArray[i][8], strokesArray[i][9], strokesArray[i][10]);
				}
			}
		}
	}, {
		key: "makeGlyph3",
		value: function makeGlyph3(data) {
			// void
			var result = [];
			if (data != "") {
				var strokesArray = this.adjustKirikuchi(this.adjustUroko2(this.adjustUroko(this.adjustKakato(this.adjustTate(this.adjustMage(this.adjustHane(this.getEachStrokes(data))))))));
				for (var i = 0; i < strokesArray.length; i++) {
					var polygons = new _polygons.Polygons();
					(0, _kagedf.dfDrawFont)(this, polygons, strokesArray[i][0], strokesArray[i][1], strokesArray[i][2], strokesArray[i][3], strokesArray[i][4], strokesArray[i][5], strokesArray[i][6], strokesArray[i][7], strokesArray[i][8], strokesArray[i][9], strokesArray[i][10]);
					result.push(polygons);
				}
			}
			return result;
		}
	}, {
		key: "getEachStrokes",
		value: function getEachStrokes(glyphData) {
			// strokes array
			var strokesArray = [];
			var strokes = glyphData.split("$");
			for (var i = 0; i < strokes.length; i++) {
				var columns = strokes[i].split(":");
				if (Math.floor(columns[0]) !== 99) {
					strokesArray.push([Math.floor(columns[0]), Math.floor(columns[1]), Math.floor(columns[2]), Math.floor(columns[3]), Math.floor(columns[4]), Math.floor(columns[5]), Math.floor(columns[6]), Math.floor(columns[7]), Math.floor(columns[8]), Math.floor(columns[9]), Math.floor(columns[10])]);
				} else {
					var buhin = this.kBuhin.search(columns[7]);
					if (buhin != "") {
						strokesArray = strokesArray.concat(this.getEachStrokesOfBuhin(buhin, Math.floor(columns[3]), Math.floor(columns[4]), Math.floor(columns[5]), Math.floor(columns[6]), Math.floor(columns[1]), Math.floor(columns[2]), Math.floor(columns[9]), Math.floor(columns[10])));
					}
				}
			}
			return strokesArray;
		}
	}, {
		key: "getEachStrokesOfBuhin",
		value: function getEachStrokesOfBuhin(buhin, x1, y1, x2, y2, sx, sy, sx2, sy2) {
			var temp = this.getEachStrokes(buhin);
			var result = [];
			var box = this.getBox(buhin);
			if (sx != 0 || sy != 0) {
				if (sx > 100) {
					sx -= 200;
				} else {
					sx2 = 0;
					sy2 = 0;
				}
			}
			for (var i = 0; i < temp.length; i++) {
				if (sx != 0 || sy != 0) {
					temp[i][3] = this.stretch(sx, sx2, temp[i][3], box.minX, box.maxX);
					temp[i][4] = this.stretch(sy, sy2, temp[i][4], box.minY, box.maxY);
					temp[i][5] = this.stretch(sx, sx2, temp[i][5], box.minX, box.maxX);
					temp[i][6] = this.stretch(sy, sy2, temp[i][6], box.minY, box.maxY);
					if (temp[i][0] != 99) {
						temp[i][7] = this.stretch(sx, sx2, temp[i][7], box.minX, box.maxX);
						temp[i][8] = this.stretch(sy, sy2, temp[i][8], box.minY, box.maxY);
						temp[i][9] = this.stretch(sx, sx2, temp[i][9], box.minX, box.maxX);
						temp[i][10] = this.stretch(sy, sy2, temp[i][10], box.minY, box.maxY);
					}
				}
				result.push([temp[i][0], temp[i][1], temp[i][2], x1 + temp[i][3] * (x2 - x1) / 200, y1 + temp[i][4] * (y2 - y1) / 200, x1 + temp[i][5] * (x2 - x1) / 200, y1 + temp[i][6] * (y2 - y1) / 200, x1 + temp[i][7] * (x2 - x1) / 200, y1 + temp[i][8] * (y2 - y1) / 200, x1 + temp[i][9] * (x2 - x1) / 200, y1 + temp[i][10] * (y2 - y1) / 200]);
			}
			return result;
		}
	}, {
		key: "adjustHane",
		value: function adjustHane(sa) {
			// strokesArray
			for (var i = 0; i < sa.length; i++) {
				if ((sa[i][0] == 1 || sa[i][0] == 2 || sa[i][0] == 6) && sa[i][2] == 4) {
					var lpx = void 0; // lastPointX
					var lpy = void 0; // lastPointY
					if (sa[i][0] == 1) {
						lpx = sa[i][5];
						lpy = sa[i][6];
					} else if (sa[i][0] == 2) {
						lpx = sa[i][7];
						lpy = sa[i][8];
					} else {
						lpx = sa[i][9];
						lpy = sa[i][10];
					}
					var mn = Infinity; // mostNear
					if (lpx + 18 < 100) {
						mn = lpx + 18;
					}
					for (var j = 0; j < sa.length; j++) {
						if (i !== j && sa[j][0] == 1 && sa[j][3] == sa[j][5] && sa[j][3] < lpx && sa[j][4] <= lpy && sa[j][6] >= lpy) {
							if (lpx - sa[j][3] < 100) {
								mn = Math.min(mn, lpx - sa[j][3]);
							}
						}
					}
					if (mn != Infinity) {
						sa[i][2] += 700 - Math.floor(mn / 15) * 100; // 0-99 -> 0-700
					}
				}
			}
			return sa;
		}
	}, {
		key: "adjustUroko",
		value: function adjustUroko(strokesArray) {
			// strokesArray
			for (var i = 0; i < strokesArray.length; i++) {
				if (strokesArray[i][0] == 1 && strokesArray[i][2] == 0) {
					// no operation for TATE
					for (var k = 0; k < this.kAdjustUrokoLengthStep; k++) {
						var tx = void 0;
						var ty = void 0;
						var tlen = void 0;
						if (strokesArray[i][4] == strokesArray[i][6]) {
							// YOKO
							tx = strokesArray[i][5] - this.kAdjustUrokoLine[k];
							ty = strokesArray[i][6] - 0.5;
							tlen = strokesArray[i][5] - strokesArray[i][3];
						} else {
							var rad = Math.atan((strokesArray[i][6] - strokesArray[i][4]) / (strokesArray[i][5] - strokesArray[i][3]));
							tx = strokesArray[i][5] - this.kAdjustUrokoLine[k] * Math.cos(rad) - 0.5 * Math.sin(rad);
							ty = strokesArray[i][6] - this.kAdjustUrokoLine[k] * Math.sin(rad) - 0.5 * Math.cos(rad);
							tlen = Math.sqrt((strokesArray[i][6] - strokesArray[i][4]) * (strokesArray[i][6] - strokesArray[i][4]) + (strokesArray[i][5] - strokesArray[i][3]) * (strokesArray[i][5] - strokesArray[i][3]));
						}
						if (tlen < this.kAdjustUrokoLength[k] || (0, _d.isCrossWithOthers)(strokesArray, i, tx, ty, strokesArray[i][5], strokesArray[i][6])) {
							strokesArray[i][2] += (this.kAdjustUrokoLengthStep - k) * 100;
							k = Infinity;
						}
					}
				}
			}
			return strokesArray;
		}
	}, {
		key: "adjustUroko2",
		value: function adjustUroko2(strokesArray) {
			// strokesArray
			for (var i = 0; i < strokesArray.length; i++) {
				if (strokesArray[i][0] == 1 && strokesArray[i][2] == 0 && strokesArray[i][4] == strokesArray[i][6]) {
					var pressure = 0;
					for (var j = 0; j < strokesArray.length; j++) {
						if (i !== j && (strokesArray[j][0] == 1 && strokesArray[j][4] == strokesArray[j][6] && !(strokesArray[i][3] + 1 > strokesArray[j][5] || strokesArray[i][5] - 1 < strokesArray[j][3]) && Math.abs(strokesArray[i][4] - strokesArray[j][4]) < this.kAdjustUroko2Length || strokesArray[j][0] == 3 && strokesArray[j][6] == strokesArray[j][8] && !(strokesArray[i][3] + 1 > strokesArray[j][7] || strokesArray[i][5] - 1 < strokesArray[j][5]) && Math.abs(strokesArray[i][4] - strokesArray[j][6]) < this.kAdjustUroko2Length)) {
							pressure += Math.pow(this.kAdjustUroko2Length - Math.abs(strokesArray[i][4] - strokesArray[j][6]), 1.1);
						}
					}
					var result = Math.min(Math.floor(pressure / this.kAdjustUroko2Length), this.kAdjustUroko2Step) * 100;
					if (strokesArray[i][2] < result) {
						strokesArray[i][2] = strokesArray[i][2] % 100 + Math.min(Math.floor(pressure / this.kAdjustUroko2Length), this.kAdjustUroko2Step) * 100;
					}
				}
			}
			return strokesArray;
		}
	}, {
		key: "adjustTate",
		value: function adjustTate(strokesArray) {
			// strokesArray
			for (var i = 0; i < strokesArray.length; i++) {
				if ((strokesArray[i][0] == 1 || strokesArray[i][0] == 3 || strokesArray[i][0] == 7) && strokesArray[i][3] == strokesArray[i][5]) {
					for (var j = 0; j < strokesArray.length; j++) {
						if (i != j && (strokesArray[j][0] == 1 || strokesArray[j][0] == 3 || strokesArray[j][0] == 7) && strokesArray[j][3] == strokesArray[j][5] && !(strokesArray[i][4] + 1 > strokesArray[j][6] || strokesArray[i][6] - 1 < strokesArray[j][4]) && Math.abs(strokesArray[i][3] - strokesArray[j][3]) < this.kMinWidthT * this.kAdjustTateStep) {
							strokesArray[i][1] += (this.kAdjustTateStep - Math.floor(Math.abs(strokesArray[i][3] - strokesArray[j][3]) / this.kMinWidthT)) * 1000;
							if (strokesArray[i][1] > this.kAdjustTateStep * 1000) {
								strokesArray[i][1] = strokesArray[i][1] % 1000 + this.kAdjustTateStep * 1000;
							}
						}
					}
				}
			}
			return strokesArray;
		}
	}, {
		key: "adjustMage",
		value: function adjustMage(strokesArray) {
			// strokesArray
			for (var i = 0; i < strokesArray.length; i++) {
				if (strokesArray[i][0] == 3 && strokesArray[i][6] == strokesArray[i][8]) {
					for (var j = 0; j < strokesArray.length; j++) {
						if (i !== j && (strokesArray[j][0] == 1 && strokesArray[j][4] == strokesArray[j][6] && !(strokesArray[i][5] + 1 > strokesArray[j][5] || strokesArray[i][7] - 1 < strokesArray[j][3]) && Math.abs(strokesArray[i][6] - strokesArray[j][4]) < this.kMinWidthT * this.kAdjustMageStep || strokesArray[j][0] == 3 && strokesArray[j][6] == strokesArray[j][8] && !(strokesArray[i][5] + 1 > strokesArray[j][7] || strokesArray[i][7] - 1 < strokesArray[j][5]) && Math.abs(strokesArray[i][6] - strokesArray[j][6]) < this.kMinWidthT * this.kAdjustMageStep)) {
							strokesArray[i][2] += (this.kAdjustMageStep - Math.floor(Math.abs(strokesArray[i][6] - strokesArray[j][6]) / this.kMinWidthT)) * 1000;
							if (strokesArray[i][2] > this.kAdjustMageStep * 1000) {
								strokesArray[i][2] = strokesArray[i][2] % 1000 + this.kAdjustMageStep * 1000;
							}
						}
					}
				}
			}
			return strokesArray;
		}
	}, {
		key: "adjustKirikuchi",
		value: function adjustKirikuchi(strokesArray) {
			// strokesArray
			for (var i = 0; i < strokesArray.length; i++) {
				if (strokesArray[i][0] == 2 && strokesArray[i][1] == 32 && strokesArray[i][3] > strokesArray[i][5] && strokesArray[i][4] < strokesArray[i][6]) {
					for (var j = 0; j < strokesArray.length; j++) {
						// no need to skip when i == j
						if (strokesArray[j][0] == 1 && strokesArray[j][3] < strokesArray[i][3] && strokesArray[j][5] > strokesArray[i][3] && strokesArray[j][4] == strokesArray[i][4] && strokesArray[j][4] == strokesArray[j][6]) {
							strokesArray[i][1] = 132;
							j = strokesArray.length;
						}
					}
				}
			}
			return strokesArray;
		}
	}, {
		key: "adjustKakato",
		value: function adjustKakato(strokesArray) {
			// strokesArray
			for (var i = 0; i < strokesArray.length; i++) {
				if (strokesArray[i][0] == 1 && (strokesArray[i][2] == 13 || strokesArray[i][2] == 23)) {
					for (var k = 0; k < this.kAdjustKakatoStep; k++) {
						if ((0, _d.isCrossBoxWithOthers)(strokesArray, i, strokesArray[i][5] - this.kAdjustKakatoRangeX / 2, strokesArray[i][6] + this.kAdjustKakatoRangeY[k], strokesArray[i][5] + this.kAdjustKakatoRangeX / 2, strokesArray[i][6] + this.kAdjustKakatoRangeY[k + 1]) | strokesArray[i][6] + this.kAdjustKakatoRangeY[k + 1] > 200 // adjust for baseline | strokesArray[i][6] - strokesArray[i][4] < this.kAdjustKakatoRangeY[k + 1] // for thin box
						) {
								strokesArray[i][2] += (3 - k) * 100;
								k = Infinity;
							}
					}
				}
			}
			return strokesArray;
		}
	}, {
		key: "getBox",
		value: function getBox(glyph) {
			// minX, minY, maxX, maxY
			var minX = 200;
			var minY = 200;
			var maxX = 0;
			var maxY = 0;

			var strokes = this.getEachStrokes(glyph);
			for (var i = 0; i < strokes.length; i++) {
				if (strokes[i][0] == 0) {
					continue;
				}
				minX = Math.min(minX, strokes[i][3], strokes[i][5]);
				maxX = Math.max(maxX, strokes[i][3], strokes[i][5]);
				minY = Math.min(minY, strokes[i][4], strokes[i][6]);
				maxY = Math.max(maxY, strokes[i][4], strokes[i][6]);
				if (strokes[i][0] == 1) {
					continue;
				}
				if (strokes[i][0] == 99) {
					continue;
				}
				minX = Math.min(minX, strokes[i][7]);
				maxX = Math.max(maxX, strokes[i][7]);
				minY = Math.min(minY, strokes[i][8]);
				maxY = Math.max(maxY, strokes[i][8]);
				if (strokes[i][0] == 2) {
					continue;
				}
				if (strokes[i][0] == 3) {
					continue;
				}
				if (strokes[i][0] == 4) {
					continue;
				}
				minX = Math.min(minX, strokes[i][9]);
				maxX = Math.max(maxX, strokes[i][9]);
				minY = Math.min(minY, strokes[i][10]);
				maxY = Math.max(maxY, strokes[i][10]);
			}
			return {
				minX: minX,
				maxX: maxX,
				minY: minY,
				maxY: maxY
			};
		}
	}, {
		key: "stretch",
		value: function stretch(dp, sp, p, min, max) {
			// interger
			var p1 = void 0;
			var p2 = void 0;
			var p3 = void 0;
			var p4 = void 0;
			if (p < sp + 100) {
				p1 = min;
				p3 = min;
				p2 = sp + 100;
				p4 = dp + 100;
			} else {
				p1 = sp + 100;
				p3 = dp + 100;
				p2 = max;
				p4 = max;
			}
			return Math.floor((p - p1) / (p2 - p1) * (p4 - p3) + p3);
		}
	}]);

	function Kage(size) {
		_classCallCheck(this, Kage);

		// properties
		this.kShotai = this.kMincho;

		this.kRate = 100;

		if (size == 1) {
			this.kMinWidthY = 1.2;
			this.kMinWidthT = 3.6;
			this.kWidth = 3;
			this.kKakato = 1.8;
			this.kL2RDfatten = 1.1;
			this.kMage = 6;
			this.kUseCurve = 0;

			this.kAdjustKakatoL = [8, 5, 3, 1, 0]; // for KAKATO adjustment 000,100,200,300,400
			this.kAdjustKakatoR = [4, 3, 2, 1]; // for KAKATO adjustment 000,100,200,300
			this.kAdjustKakatoRangeX = 12; // check area width
			this.kAdjustKakatoRangeY = [1, 11, 14, 18]; // 3 steps of checking
			this.kAdjustKakatoStep = 3; // number of steps

			this.kAdjustUrokoX = [14, 12, 9, 7]; // for UROKO adjustment 000,100,200,300
			this.kAdjustUrokoY = [7, 6, 5, 4]; // for UROKO adjustment 000,100,200,300
			this.kAdjustUrokoLength = [13, 21, 30]; // length for checking
			this.kAdjustUrokoLengthStep = 3; // number of steps
			this.kAdjustUrokoLine = [13, 15, 18]; // check for crossing. corresponds to length
		} else {
			this.kMinWidthY = 2;
			this.kMinWidthT = 6;
			this.kWidth = 5;
			this.kKakato = 3;
			this.kL2RDfatten = 1.1;
			this.kMage = 10;
			this.kUseCurve = 0;

			this.kAdjustKakatoL = [14, 9, 5, 2, 0]; // for KAKATO adjustment 000,100,200,300,400
			this.kAdjustKakatoR = [8, 6, 4, 2]; // for KAKATO adjustment 000,100,200,300
			this.kAdjustKakatoRangeX = 20; // check area width
			this.kAdjustKakatoRangeY = [1, 19, 24, 30]; // 3 steps of checking
			this.kAdjustKakatoStep = 3; // number of steps

			this.kAdjustUrokoX = [24, 20, 16, 12]; // for UROKO adjustment 000,100,200,300
			this.kAdjustUrokoY = [12, 11, 9, 8]; // for UROKO adjustment 000,100,200,300
			this.kAdjustUrokoLength = [22, 36, 50]; // length for checking
			this.kAdjustUrokoLengthStep = 3; // number of steps
			this.kAdjustUrokoLine = [22, 26, 30]; // check for crossing. corresponds to length

			this.kAdjustUroko2Step = 3;
			this.kAdjustUroko2Length = 40;

			this.kAdjustTateStep = 4;

			this.kAdjustMageStep = 5;
		}

		this.kBuhin = new _buhin.Buhin();
	}

	return Kage;
}();

Kage.prototype.kMincho = 0;
Kage.prototype.kGothic = 1;

},{"./2d":1,"./buhin":3,"./kagedf":8,"./polygons":10}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.cdDrawBezier = cdDrawBezier;
exports.cdDrawCurve = cdDrawCurve;
exports.cdDrawLine = cdDrawLine;

var _curve = require("./curve");

var _kage = require("./kage");

var _polygon = require("./polygon");

function cdDrawCurveU(kage, polygons, x1, y1, sx1, sy1, sx2, sy2, x2, y2, ta1, ta2) {

	if (kage.kShotai == kage.kMincho) {
		// mincho
		var a1 = ta1 % 1000;
		var a2 = ta2 % 100;
		var opt1 = Math.floor(ta1 % 10000 / 1000);
		var opt2 = Math.floor(ta2 % 1000 / 100);
		var opt3 = Math.floor(ta1 / 10000);
		var opt4 = Math.floor(ta2 / 1000);

		var kMinWidthT = kage.kMinWidthT - opt1 / 2;
		var kMinWidthT2 = kage.kMinWidthT - opt4 / 2;

		var delta = void 0;
		switch (a1 % 100) {
			case 0:
			case 7:
				delta = -1 * kage.kMinWidthY * 0.5;
				break;
			case 1:
			case 2: // ... must be 32
			case 6:
			case 22:
			case 32:
				// changed
				delta = 0;
				break;
			case 12:
				// case 32:
				delta = kage.kMinWidthY;
				break;
			default:
				break;
		}

		if (x1 == sx1) {
			if (y1 < sy1) {
				y1 -= delta;
			} else {
				y1 += delta;
			}
		} else if (y1 == sy1) {
			if (x1 < sx1) {
				x1 -= delta;
			} else {
				x1 += delta;
			}
		} else {
			var rad = Math.atan2(sy1 - y1, sx1 - x1);
			x1 -= delta * Math.cos(rad);
			y1 -= delta * Math.sin(rad);
		}

		switch (a2 % 100) {
			case 0:
			case 1:
			case 7:
			case 9:
			case 15: // it can change to 15->5
			case 14: // it can change to 14->4
			case 17: // no need
			case 5:
				delta = 0;
				break;
			case 8:
				// get shorten for tail's circle
				delta = -1 * kMinWidthT * 0.5;
				break;
			default:
				break;
		}

		if (sx2 == x2) {
			if (sy2 < y2) {
				y2 += delta;
			} else {
				y2 -= delta;
			}
		} else if (sy2 == y2) {
			if (sx2 < x2) {
				x2 += delta;
			} else {
				x2 -= delta;
			}
		} else {
			var _rad = Math.atan2(y2 - sy2, x2 - sx2);
			x2 += delta * Math.cos(_rad);
			y2 += delta * Math.sin(_rad);
		}

		var hosomi = 0.5;
		if (Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) < 50) {
			hosomi += 0.4 * (1 - Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) / 50);
		}

		// ---------------------------------------------------------------

		if (sx1 == sx2 && sy1 == sy2) {
			// Spline
			var poly = new _polygon.Polygon();
			var poly2 = new _polygon.Polygon();
			if (kage.kUseCurve) {
				// generating fatten curve -- begin
				var kage2 = new _kage.Kage();
				kage2.kMinWidthY = kage.kMinWidthY;
				kage2.kMinWidthT = kMinWidthT;
				kage2.kWidth = kage.kWidth;
				kage2.kKakato = kage.kKakato;
				kage2.kRate = 10;

				var curve = (0, _curve.get_candidate)(kage2, a1, a2, x1, y1, sx1, sy1, x2, y2, opt3, opt4); // L and R

				var _divide_curve = (0, _curve.divide_curve)(kage2, x1, y1, sx1, sy1, x2, y2, curve[0]),
				    dcl12_34 = _divide_curve.div_curve,
				    dpl12_34 = _divide_curve.off_curve;

				var _divide_curve2 = (0, _curve.divide_curve)(kage2, x1, y1, sx1, sy1, x2, y2, curve[1]),
				    dcr12_34 = _divide_curve2.div_curve,
				    dpr12_34 = _divide_curve2.off_curve;

				var ncl1 = (0, _curve.find_offcurve)(kage2, dcl12_34[0], dpl12_34[0][2], dpl12_34[0][3]);
				var ncl2 = (0, _curve.find_offcurve)(kage2, dcl12_34[1], dpl12_34[1][2], dpl12_34[1][3]);

				poly.push(ncl1[0], ncl1[1]);
				poly.push(ncl1[2], ncl1[3], 1);
				poly.push(ncl1[4], ncl1[5]);
				poly.push(ncl2[2], ncl2[3], 1);
				poly.push(ncl2[4], ncl2[5]);

				poly2.push(dcr12_34[0][0][0], dcr12_34[0][0][1]);
				poly2.push(dpr12_34[0][2] - (ncl1[2] - dpl12_34[0][2]), dpl12_34[0][3] - (ncl1[3] - dpl12_34[0][3]), 1);
				poly2.push(dcr12_34[0][dcr12_34[0].length - 1][0], dcr12_34[0][dcr12_34[0].length - 1][1]);
				poly2.push(dpr12_34[1][2] - (ncl2[2] - dpl12_34[1][2]), dpl12_34[1][3] - (ncl2[3] - dpl12_34[1][3]), 1);
				poly2.push(dcr12_34[1][dcr12_34[1].length - 1][0], dcr12_34[1][dcr12_34[1].length - 1][1]);

				poly2.reverse();
				poly.concat(poly2);
				polygons.push(poly);
				// generating fatten curve -- end
			} else {
				for (var tt = 0; tt <= 1000; tt += kage.kRate) {
					var t = tt / 1000;

					// calculate a dot
					var x = (1.0 - t) * (1.0 - t) * x1 + 2.0 * t * (1.0 - t) * sx1 + t * t * x2;
					var y = (1.0 - t) * (1.0 - t) * y1 + 2.0 * t * (1.0 - t) * sy1 + t * t * y2;

					// KATAMUKI of vector by BIBUN
					var ix = (x1 - 2.0 * sx1 + x2) * 2.0 * t + (-2.0 * x1 + 2.0 * sx1);
					var iy = (y1 - 2.0 * sy1 + y2) * 2.0 * t + (-2.0 * y1 + 2.0 * sy1);

					// line SUICHOKU by vector
					var ia = void 0;
					var ib = void 0;
					if (ix !== 0 && iy !== 0) {
						var ir = Math.atan(iy / ix * -1);
						ia = Math.sin(ir) * kMinWidthT;
						ib = Math.cos(ir) * kMinWidthT;
					} else if (ix === 0) {
						ia = kMinWidthT;
						ib = 0;
					} else {
						ia = 0;
						ib = kMinWidthT;
					}

					var deltad = a1 == 7 && a2 == 0 // L2RD: fatten
					? Math.pow(t, hosomi) * kage.kL2RDfatten : a1 == 7 ? Math.pow(t, hosomi) : a2 == 7 ? Math.pow(1.0 - t, hosomi) : opt3 > 0 || opt4 > 0 ? (kage.kMinWidthT - opt3 / 2 - (opt4 - opt3) / 2 * t) / kage.kMinWidthT : 1;

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

					// copy to polygon structure
					poly.push(x - ia, y - ib);
					poly2.push(x + ia, y + ib);
				}

				// suiheisen ni setsuzoku
				if (a1 == 132) {
					var index = 0;
					while (true) {
						if (poly2.array[index].y <= y1 && y1 <= poly2.array[index + 1].y) {
							break;
						}
						index++;
					}
					var newx1 = poly2.array[index + 1].x + (poly2.array[index].x - poly2.array[index + 1].x) * (poly2.array[index + 1].y - y1) / (poly2.array[index + 1].y - poly2.array[index].y);
					var newy1 = y1;
					var newx2 = poly.array[0].x + (poly.array[0].x - poly.array[1].x) * (poly.array[0].y - y1) / (poly.array[1].y - poly.array[0].y);
					var newy2 = y1;

					for (var i = 0; i < index; i++) {
						poly2.shift();
					}
					poly2.set(0, newx1, newy1);
					poly.unshift(newx2, newy2);
				}

				// suiheisen ni setsuzoku 2
				if (a1 == 22 && y1 > y2) {
					var _index = 0;
					while (true) {
						if (poly2.array[_index].y <= y1 && y1 <= poly2.array[_index + 1].y) {
							break;
						}
						_index++;
					}
					var _newx = poly2.array[_index + 1].x + (poly2.array[_index].x - poly2.array[_index + 1].x) * (poly2.array[_index + 1].y - y1) / (poly2.array[_index + 1].y - poly2.array[_index].y);
					var _newy = y1;
					var _newx2 = poly.array[0].x + (poly.array[0].x - poly.array[1].x - 1) * (poly.array[0].y - y1) / (poly.array[1].y - poly.array[0].y);
					var _newy2 = y1 + 1;

					for (var _i = 0; _i < _index; _i++) {
						poly2.shift();
					}
					poly2.set(0, _newx, _newy);
					poly.unshift(_newx2, _newy2);
				}

				poly2.reverse();
				poly.concat(poly2);
				polygons.push(poly);
			}
		} else {
			// Bezier
			var _poly = new _polygon.Polygon();
			var _poly2 = new _polygon.Polygon();
			for (var _tt = 0; _tt <= 1000; _tt += kage.kRate) {
				var _t = _tt / 1000;

				// calculate a dot
				var _x = (1.0 - _t) * (1.0 - _t) * (1.0 - _t) * x1 + 3.0 * _t * (1.0 - _t) * (1.0 - _t) * sx1 + 3 * _t * _t * (1.0 - _t) * sx2 + _t * _t * _t * x2;
				var _y = (1.0 - _t) * (1.0 - _t) * (1.0 - _t) * y1 + 3.0 * _t * (1.0 - _t) * (1.0 - _t) * sy1 + 3 * _t * _t * (1.0 - _t) * sy2 + _t * _t * _t * y2;
				// KATAMUKI of vector by BIBUN
				var _ix = _t * _t * (-3 * x1 + 9 * sx1 + -9 * sx2 + 3 * x2) + _t * (6 * x1 + -12 * sx1 + 6 * sx2) + -3 * x1 + 3 * sx1;
				var _iy = _t * _t * (-3 * y1 + 9 * sy1 + -9 * sy2 + 3 * y2) + _t * (6 * y1 + -12 * sy1 + 6 * sy2) + -3 * y1 + 3 * sy1;

				// line SUICHOKU by vector
				var _ia = void 0;
				var _ib = void 0;
				if (_ix !== 0 && _iy !== 0) {
					var _ir = Math.atan(_iy / _ix * -1);
					_ia = Math.sin(_ir) * kMinWidthT;
					_ib = Math.cos(_ir) * kMinWidthT;
				} else if (_ix === 0) {
					_ia = kMinWidthT;
					_ib = 0;
				} else {
					_ia = 0;
					_ib = kMinWidthT;
				}

				var _deltad = a1 == 7 && a2 == 0 // L2RD: fatten
				? Math.pow(_t, hosomi) * kage.kL2RDfatten : a1 == 7 ? Math.pow(Math.pow(_t, hosomi), 0.7) // make fatten
				: a2 == 7 ? Math.pow(1.0 - _t, hosomi) : 1;

				if (_deltad < 0.15) {
					_deltad = 0.15;
				}
				_ia *= _deltad;
				_ib *= _deltad;

				// reverse if vector is going 2nd/3rd quadrants
				if (_ix <= 0) {
					_ia *= -1;
					_ib *= -1;
				}

				// copy to polygon structure
				_poly.push(_x - _ia, _y - _ib);
				_poly2.push(_x + _ia, _y + _ib);
			}

			// suiheisen ni setsuzoku
			if (a1 == 132) {
				var _index2 = 0;
				while (true) {
					if (_poly2.array[_index2].y <= y1 && y1 <= _poly2.array[_index2 + 1].y) {
						break;
					}
					_index2++;
				}
				var _newx3 = _poly2.array[_index2 + 1].x + (_poly2.array[_index2].x - _poly2.array[_index2 + 1].x) * (_poly2.array[_index2 + 1].y - y1) / (_poly2.array[_index2 + 1].y - _poly2.array[_index2].y);
				var _newy3 = y1;
				var _newx4 = _poly.array[0].x + (_poly.array[0].x - _poly.array[1].x) * (_poly.array[0].y - y1) / (_poly.array[1].y - _poly.array[0].y);
				var _newy4 = y1;

				for (var _i2 = 0; _i2 < _index2; _i2++) {
					_poly2.shift();
				}
				_poly2.set(0, _newx3, _newy3);
				_poly.unshift(_newx4, _newy4);
			}

			// suiheisen ni setsuzoku 2
			if (a1 == 22) {
				if (x1 > sx1) {
					var _index3 = 0;
					while (true) {
						if (_poly2.array[_index3].y <= y1 && y1 <= _poly2.array[_index3 + 1].y) {
							break;
						}
						_index3++;
					}
					var _newx5 = _poly2.array[_index3 + 1].x + (_poly2.array[_index3].x - _poly2.array[_index3 + 1].x) * (_poly2.array[_index3 + 1].y - y1) / (_poly2.array[_index3 + 1].y - _poly2.array[_index3].y);
					var _newy5 = y1;
					var _newx6 = _poly.array[0].x + (_poly.array[0].x - _poly.array[1].x - 1) * (_poly.array[0].y - y1) / (_poly.array[1].y - _poly.array[0].y);
					var _newy6 = y1 + 1;

					for (var _i3 = 0; _i3 < _index3; _i3++) {
						_poly2.shift();
					}
					_poly2.set(0, _newx5, _newy5);
					_poly.unshift(_newx6, _newy6);
				}
			}

			_poly2.reverse();
			_poly.concat(_poly2);
			polygons.push(_poly);
		}

		// process for head of stroke
		var rad1 = Math.atan2(sy1 - y1, sx1 - x1);
		var XX = Math.sin(rad1);
		var XY = -Math.cos(rad1);
		var YX = Math.cos(rad1);
		var YY = Math.sin(rad1);

		if (a1 == 12) {
			if (x1 == x2) {
				var _poly3 = new _polygon.Polygon();
				_poly3.push(x1 - kMinWidthT, y1);
				_poly3.push(x1 + kMinWidthT, y1);
				_poly3.push(x1 - kMinWidthT, y1 - kMinWidthT);
				polygons.push(_poly3);
			} else {
				var _poly4 = new _polygon.Polygon();
				_poly4.push(x1 - kMinWidthT * XX, y1 - kMinWidthT * XY);
				_poly4.push(x1 + kMinWidthT * XX, y1 + kMinWidthT * XY);
				_poly4.push(x1 - kMinWidthT * XX - kMinWidthT * YX, y1 - kMinWidthT * XY - kMinWidthT * YY);
				polygons.push(_poly4);
			}
		}

		var type = void 0;
		var pm = 0;
		if (a1 == 0) {
			if (y1 <= y2) {
				// from up to bottom
				type = Math.atan2(Math.abs(y1 - sy1), Math.abs(x1 - sx1)) / Math.PI * 2 - 0.4;
				if (type > 0) {
					type *= 2;
				} else {
					type *= 16;
				}
				pm = type < 0 ? -1 : 1;
				if (x1 == sx1) {
					var _poly5 = new _polygon.Polygon();
					_poly5.push(x1 - kMinWidthT, y1 + 1);
					_poly5.push(x1 + kMinWidthT, y1);
					_poly5.push(x1 - kMinWidthT * pm, y1 - kage.kMinWidthY * type * pm);
					// if(x1 > x2){
					//  poly.reverse();
					// }
					polygons.push(_poly5);
				} else {
					var _poly6 = new _polygon.Polygon();
					_poly6.push(x1 - kMinWidthT * XX + 1 * YX, y1 - kMinWidthT * XY + 1 * YY);
					_poly6.push(x1 + kMinWidthT * XX, y1 + kMinWidthT * XY);
					_poly6.push(x1 - kMinWidthT * pm * XX - kage.kMinWidthY * type * pm * YX, y1 - kMinWidthT * pm * XY - kage.kMinWidthY * type * pm * YY);
					// if(x1 > x2){
					//  poly.reverse();
					// }
					polygons.push(_poly6);
				}
			} else {
				// bottom to up
				if (x1 == sx1) {
					var _poly7 = new _polygon.Polygon();
					_poly7.push(x1 - kMinWidthT, y1);
					_poly7.push(x1 + kMinWidthT, y1);
					_poly7.push(x1 + kMinWidthT, y1 - kage.kMinWidthY);
					polygons.push(_poly7);
				} else {
					var _poly8 = new _polygon.Polygon();
					_poly8.push(x1 - kMinWidthT * XX, y1 - kMinWidthT * XY);
					_poly8.push(x1 + kMinWidthT * XX, y1 + kMinWidthT * XY);
					_poly8.push(x1 + kMinWidthT * XX - kage.kMinWidthY * YX, y1 + kMinWidthT * XY - kage.kMinWidthY * YY);
					// if(x1 < x2){
					//  poly.reverse();
					// }
					polygons.push(_poly8);
				}
			}
		}

		if (a1 == 22) {
			// box's up-right corner, any time same degree
			var _poly9 = new _polygon.Polygon();
			_poly9.push(x1 - kMinWidthT, y1 - kage.kMinWidthY);
			_poly9.push(x1, y1 - kage.kMinWidthY - kage.kWidth);
			_poly9.push(x1 + kMinWidthT + kage.kWidth, y1 + kage.kMinWidthY);
			_poly9.push(x1 + kMinWidthT, y1 + kMinWidthT - 1);
			_poly9.push(x1 - kMinWidthT, y1 + kMinWidthT + 4);
			polygons.push(_poly9);
		}

		if (a1 == 0) {
			// beginning of the stroke
			if (y1 <= y2) {
				// from up to bottom
				if (pm > 0) {
					type = 0;
				}
				var move = kage.kMinWidthY * type * pm;
				if (x1 == sx1) {
					var _poly10 = new _polygon.Polygon();
					_poly10.push(x1 + kMinWidthT, y1 - move);
					_poly10.push(x1 + kMinWidthT * 1.5, y1 + kage.kMinWidthY - move);
					_poly10.push(x1 + kMinWidthT - 2, y1 + kage.kMinWidthY * 2 + 1);
					polygons.push(_poly10);
				} else {
					var _poly11 = new _polygon.Polygon();
					_poly11.push(x1 + kMinWidthT * XX - move * YX, y1 + kMinWidthT * XY - move * YY);
					_poly11.push(x1 + kMinWidthT * 1.5 * XX + (kage.kMinWidthY - move * 1.2) * YX, y1 + kMinWidthT * 1.5 * XY + (kage.kMinWidthY - move * 1.2) * YY);
					_poly11.push(x1 + (kMinWidthT - 2) * XX + (kage.kMinWidthY * 2 - move * 0.8 + 1) * YX, y1 + (kMinWidthT - 2) * XY + (kage.kMinWidthY * 2 - move * 0.8 + 1) * YY);
					// if(x1 < x2){
					//  poly.reverse();
					// }
					polygons.push(_poly11);
				}
			} else {
				// from bottom to up
				if (x1 == sx1) {
					var _poly12 = new _polygon.Polygon();
					_poly12.push(x1 - kMinWidthT, y1);
					_poly12.push(x1 - kMinWidthT * 1.5, y1 + kage.kMinWidthY);
					_poly12.push(x1 - kMinWidthT * 0.5, y1 + kage.kMinWidthY * 3);
					polygons.push(_poly12);
				} else {
					var _poly13 = new _polygon.Polygon();
					_poly13.push(x1 - kMinWidthT * XX, y1 - kMinWidthT * XY);
					_poly13.push(x1 - kMinWidthT * 1.5 * XX + kage.kMinWidthY * YX, y1 + kage.kMinWidthY * YY - kMinWidthT * 1.5 * XY);
					_poly13.push(x1 - kMinWidthT * 0.5 * XX + kage.kMinWidthY * 3 * YX, y1 + kage.kMinWidthY * 3 * YY - kMinWidthT * 0.5 * XY);
					// if(x1 < x2){
					//  poly.reverse();
					// }
					polygons.push(_poly13);
				}
			}
		}

		// process for tail
		var rad2 = Math.atan2(y2 - sy2, x2 - sx2);

		if (a2 == 1 || a2 == 8 || a2 == 15) {
			// the last filled circle ... it can change 15->5
			if (sx2 == x2) {
				var _poly14 = new _polygon.Polygon();
				if (kage.kUseCurve) {
					// by curve path
					_poly14.push(x2 - kMinWidthT2, y2);
					_poly14.push(x2 - kMinWidthT2 * 0.9, y2 + kMinWidthT2 * 0.9, 1);
					_poly14.push(x2, y2 + kMinWidthT2);
					_poly14.push(x2 + kMinWidthT2 * 0.9, y2 + kMinWidthT2 * 0.9, 1);
					_poly14.push(x2 + kMinWidthT2, y2);
				} else {
					// by polygon
					_poly14.push(x2 - kMinWidthT2, y2);
					_poly14.push(x2 - kMinWidthT2 * 0.7, y2 + kMinWidthT2 * 0.7);
					_poly14.push(x2, y2 + kMinWidthT2);
					_poly14.push(x2 + kMinWidthT2 * 0.7, y2 + kMinWidthT2 * 0.7);
					_poly14.push(x2 + kMinWidthT2, y2);
				}
				polygons.push(_poly14);
			} else if (sy2 == y2) {
				var _poly15 = new _polygon.Polygon();
				if (kage.kUseCurve) {
					// by curve path
					_poly15.push(x2, y2 - kMinWidthT2);
					_poly15.push(x2 + kMinWidthT2 * 0.9, y2 - kMinWidthT2 * 0.9, 1);
					_poly15.push(x2 + kMinWidthT2, y2);
					_poly15.push(x2 + kMinWidthT2 * 0.9, y2 + kMinWidthT2 * 0.9, 1);
					_poly15.push(x2, y2 + kMinWidthT2);
				} else {
					// by polygon
					_poly15.push(x2, y2 - kMinWidthT2);
					_poly15.push(x2 + kMinWidthT2 * 0.7, y2 - kMinWidthT2 * 0.7);
					_poly15.push(x2 + kMinWidthT2, y2);
					_poly15.push(x2 + kMinWidthT2 * 0.7, y2 + kMinWidthT2 * 0.7);
					_poly15.push(x2, y2 + kMinWidthT2);
				}
				polygons.push(_poly15);
			} else {
				var _poly16 = new _polygon.Polygon();
				if (kage.kUseCurve) {
					_poly16.push(x2 + Math.sin(rad2) * kMinWidthT2, y2 - Math.cos(rad2) * kMinWidthT2);
					_poly16.push(x2 + Math.cos(rad2) * kMinWidthT2 * 0.9 + Math.sin(rad2) * kMinWidthT2 * 0.9, y2 + Math.sin(rad2) * kMinWidthT2 * 0.9 - Math.cos(rad2) * kMinWidthT2 * 0.9, 1);
					_poly16.push(x2 + Math.cos(rad2) * kMinWidthT2, y2 + Math.sin(rad2) * kMinWidthT2);
					_poly16.push(x2 + Math.cos(rad2) * kMinWidthT2 * 0.9 - Math.sin(rad2) * kMinWidthT2 * 0.9, y2 + Math.sin(rad2) * kMinWidthT2 * 0.9 + Math.cos(rad2) * kMinWidthT2 * 0.9, 1);
					_poly16.push(x2 - Math.sin(rad2) * kMinWidthT2, y2 + Math.cos(rad2) * kMinWidthT2);
				} else {
					_poly16.push(x2 + Math.sin(rad2) * kMinWidthT2, y2 - Math.cos(rad2) * kMinWidthT2);
					_poly16.push(x2 + Math.cos(rad2) * kMinWidthT2 * 0.7 + Math.sin(rad2) * kMinWidthT2 * 0.7, y2 + Math.sin(rad2) * kMinWidthT2 * 0.7 - Math.cos(rad2) * kMinWidthT2 * 0.7);
					_poly16.push(x2 + Math.cos(rad2) * kMinWidthT2, y2 + Math.sin(rad2) * kMinWidthT2);
					_poly16.push(x2 + Math.cos(rad2) * kMinWidthT2 * 0.7 - Math.sin(rad2) * kMinWidthT2 * 0.7, y2 + Math.sin(rad2) * kMinWidthT2 * 0.7 + Math.cos(rad2) * kMinWidthT2 * 0.7);
					_poly16.push(x2 - Math.sin(rad2) * kMinWidthT2, y2 + Math.cos(rad2) * kMinWidthT2);
				}
				polygons.push(_poly16);
			}
		}

		if (a2 == 9 || a1 == 7 && a2 == 0) {
			// Math.sinnyu & L2RD Harai ... no need for a2=9
			var type2 = Math.atan2(Math.abs(y2 - sy2), Math.abs(x2 - sx2)) / Math.PI * 2 - 0.6;
			if (type2 > 0) {
				type2 *= 8;
			} else {
				type2 *= 3;
			}
			var pm2 = type2 < 0 ? -1 : 1;
			if (sy2 == y2) {
				var _poly17 = new _polygon.Polygon();
				_poly17.push(x2, y2 + kMinWidthT * kage.kL2RDfatten);
				_poly17.push(x2, y2 - kMinWidthT * kage.kL2RDfatten);
				_poly17.push(x2 + kMinWidthT * kage.kL2RDfatten * Math.abs(type2), y2 + kMinWidthT * kage.kL2RDfatten * pm2);
				polygons.push(_poly17);
			} else {
				var _poly18 = new _polygon.Polygon();
				var YX2 = -Math.sin(rad2);
				var YY2 = Math.cos(rad2);
				var XX2 = Math.cos(rad2);
				var XY2 = Math.sin(rad2);
				_poly18.push(x2 + kMinWidthT * kage.kL2RDfatten * YX2, y2 + kMinWidthT * kage.kL2RDfatten * YY2);
				_poly18.push(x2 - kMinWidthT * kage.kL2RDfatten * YX2, y2 - kMinWidthT * kage.kL2RDfatten * YY2);
				_poly18.push(x2 + kMinWidthT * kage.kL2RDfatten * Math.abs(type2) * XX2 + kMinWidthT * kage.kL2RDfatten * pm2 * YX2, y2 + kMinWidthT * kage.kL2RDfatten * Math.abs(type2) * XY2 + kMinWidthT * kage.kL2RDfatten * pm2 * YY2);
				polygons.push(_poly18);
			}
		}

		if (a2 == 15) {
			// jump up ... it can change 15->5
			// anytime same degree
			var _poly19 = new _polygon.Polygon();
			if (y1 < y2) {
				_poly19.push(x2, y2 - kMinWidthT + 1);
				_poly19.push(x2 + 2, y2 - kMinWidthT - kage.kWidth * 5);
				_poly19.push(x2, y2 - kMinWidthT - kage.kWidth * 5);
				_poly19.push(x2 - kMinWidthT, y2 - kMinWidthT + 1);
			} else {
				_poly19.push(x2, y2 + kMinWidthT - 1);
				_poly19.push(x2 - 2, y2 + kMinWidthT + kage.kWidth * 5);
				_poly19.push(x2, y2 + kMinWidthT + kage.kWidth * 5);
				_poly19.push(x2 + kMinWidthT, y2 + kMinWidthT - 1);
			}
			polygons.push(_poly19);
		}

		if (a2 == 14) {
			// jump to left, allways go left
			var _poly20 = new _polygon.Polygon();
			_poly20.push(x2, y2);
			_poly20.push(x2, y2 - kMinWidthT);
			_poly20.push(x2 - kage.kWidth * 4 * Math.min(1 - opt2 / 10, Math.pow(kMinWidthT / kage.kMinWidthT, 3)), y2 - kMinWidthT);
			_poly20.push(x2 - kage.kWidth * 4 * Math.min(1 - opt2 / 10, Math.pow(kMinWidthT / kage.kMinWidthT, 3)), y2 - kMinWidthT * 0.5);
			// poly.reverse();
			polygons.push(_poly20);
		}
	} else {
		// gothic
		var _a = void 0;
		var _a2 = void 0;
		if (_a % 10 === 2) {
			if (x1 == sx1) {
				if (y1 < sy1) {
					y1 -= kage.kWidth;
				} else {
					y1 += kage.kWidth;
				}
			} else if (y1 == sy1) {
				if (x1 < sx1) {
					x1 -= kage.kWidth;
				} else {
					x1 += kage.kWidth;
				}
			} else {
				var _rad2 = Math.atan2(sy1 - y1, sx1 - x1);
				x1 -= kage.kWidth * Math.cos(_rad2);
				y1 -= kage.kWidth * Math.sin(_rad2);
			}
		}

		if (_a % 10 === 3) {
			if (x1 == sx1) {
				if (y1 < sy1) {
					y1 -= kage.kWidth * kage.kKakato;
				} else {
					y1 += kage.kWidth * kage.kKakato;
				}
			} else if (y1 == sy1) {
				if (x1 < sx1) {
					x1 -= kage.kWidth * kage.kKakato;
				} else {
					x1 += kage.kWidth * kage.kKakato;
				}
			} else {
				var _rad3 = Math.atan2(sy1 - y1, sx1 - x1);
				x1 -= kage.kWidth * Math.cos(_rad3) * kage.kKakato;
				y1 -= kage.kWidth * Math.sin(_rad3) * kage.kKakato;
			}
		}
		if (_a2 % 10 === 2) {
			if (sx2 == x2) {
				if (sy2 < y2) {
					y2 += kage.kWidth;
				} else {
					y2 -= kage.kWidth;
				}
			} else if (sy2 == y2) {
				if (sx2 < x2) {
					x2 += kage.kWidth;
				} else {
					x2 -= kage.kWidth;
				}
			} else {
				var _rad4 = Math.atan2(y2 - sy2, x2 - sx2);
				x2 += kage.kWidth * Math.cos(_rad4);
				y2 += kage.kWidth * Math.sin(_rad4);
			}
		}

		if (_a2 % 10 === 3) {
			if (sx2 == x2) {
				if (sy2 < y2) {
					y2 += kage.kWidth * kage.kKakato;
				} else {
					y2 -= kage.kWidth * kage.kKakato;
				}
			} else if (sy2 == y2) {
				if (sx2 < x2) {
					x2 += kage.kWidth * kage.kKakato;
				} else {
					x2 -= kage.kWidth * kage.kKakato;
				}
			} else {
				var _rad5 = Math.atan2(y2 - sy2, x2 - sx2);
				x2 += kage.kWidth * Math.cos(_rad5) * kage.kKakato;
				y2 += kage.kWidth * Math.sin(_rad5) * kage.kKakato;
			}
		}

		var _poly21 = new _polygon.Polygon();
		var _poly22 = new _polygon.Polygon();

		var _x2 = void 0;
		var _y2 = void 0;
		var _ix2 = void 0;
		var _iy2 = void 0;
		for (var _tt2 = 0; _tt2 <= 1000; _tt2 += kage.kRate) {
			var _t2 = _tt2 / 1000;

			if (sx1 == sx2 && sy1 == sy2) {
				// calculating each point
				_x2 = (1.0 - _t2) * (1.0 - _t2) * x1 + 2.0 * _t2 * (1.0 - _t2) * sx1 + _t2 * _t2 * x2;
				_y2 = (1.0 - _t2) * (1.0 - _t2) * y1 + 2.0 * _t2 * (1.0 - _t2) * sy1 + _t2 * _t2 * y2;

				// SESSEN NO KATAMUKI NO KEISAN(BIBUN)
				_ix2 = (x1 - 2.0 * sx1 + x2) * 2.0 * _t2 + (-2.0 * x1 + 2.0 * sx1);
				_iy2 = (y1 - 2.0 * sy1 + y2) * 2.0 * _t2 + (-2.0 * y1 + 2.0 * sy1);
			} // else {}
			// SESSEN NI SUICHOKU NA CHOKUSEN NO KEISAN
			var _ia2 = void 0;
			var _ib2 = void 0;
			if (kage.kShotai == kage.kMincho) {
				// always false ?
				if (_ix2 != 0 && _iy2 != 0) {
					var _ir2 = Math.atan(_iy2 / _ix2 * -1.0);
					_ia2 = Math.sin(_ir2) * kage.kMinWidthT;
					_ib2 = Math.cos(_ir2) * kage.kMinWidthT;
				} else if (_ix2 == 0) {
					_ia2 = kage.kMinWidthT;
					_ib2 = 0;
				} else {
					_ia2 = 0;
					_ib2 = kage.kMinWidthT;
				}
				_ia2 *= Math.sqrt(1.0 - _t2);
				_ib2 *= Math.sqrt(1.0 - _t2);
			} else {
				if (_ix2 != 0 && _iy2 != 0) {
					var _ir3 = Math.atan(_iy2 / _ix2 * -1.0);
					_ia2 = Math.sin(_ir3) * kage.kWidth;
					_ib2 = Math.cos(_ir3) * kage.kWidth;
				} else if (_ix2 == 0) {
					_ia2 = kage.kWidth;
					_ib2 = 0;
				} else {
					_ia2 = 0;
					_ib2 = kage.kWidth;
				}
			}

			// reverse if vector is going 2nd/3rd quadrants
			if (_ix2 <= 0) {
				_ia2 *= -1;
				_ib2 *= -1;
			}

			// save to polygon
			_poly21.push(_x2 - _ia2, _y2 - _ib2);
			_poly22.push(_x2 + _ia2, _y2 + _ib2);
		}

		_poly22.reverse();
		_poly21.concat(_poly22);
		polygons.push(_poly21);
	}
}

function cdDrawBezier(kage, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a1, a2) {
	cdDrawCurveU(kage, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a1, a2);
}

function cdDrawCurve(kage, polygons, x1, y1, x2, y2, x3, y3, a1, a2) {
	cdDrawCurveU(kage, polygons, x1, y1, x2, y2, x2, y2, x3, y3, a1, a2);
}

function cdDrawLine(kage, polygons, tx1, ty1, tx2, ty2, ta1, ta2) {

	if (kage.kShotai == kage.kMincho) {
		// mincho
		var x1 = tx1;
		var y1 = ty1;
		var x2 = tx2;
		var y2 = ty2;
		var a1 = ta1 % 1000;
		var a2 = ta2 % 100;
		var opt1 = Math.floor(ta1 / 1000);
		var opt2 = Math.floor(ta2 / 100);

		var kMinWidthT = kage.kMinWidthT - opt1 / 2;

		if (x1 == x2) {
			// if TATE stroke, use y-axis
			var poly0 = new _polygon.Polygon(4);
			switch (a1) {
				case 0:
					poly0.set(3, x1 - kMinWidthT, y1 - kage.kMinWidthY / 2);
					poly0.set(0, x1 + kMinWidthT, y1 + kage.kMinWidthY / 2);
					break;
				case 1:
				case 6: // ... no need
				case 22:
					poly0.set(3, x1 - kMinWidthT, y1);
					poly0.set(0, x1 + kMinWidthT, y1);
					break;
				case 12:
					poly0.set(3, x1 - kMinWidthT, y1 - kage.kMinWidthY - kMinWidthT);
					poly0.set(0, x1 + kMinWidthT, y1 - kage.kMinWidthY);
					break;
				case 32:
					poly0.set(3, x1 - kMinWidthT, y1 - kage.kMinWidthY);
					poly0.set(0, x1 + kMinWidthT, y1 - kage.kMinWidthY);
					break;
			}

			switch (a2) {
				case 0:
					if (a1 == 6) {
						// KAGI's tail ... no need
						poly0.set(2, x2 - kMinWidthT, y2);
						poly0.set(1, x2 + kMinWidthT, y2);
					} else {
						poly0.set(2, x2 - kMinWidthT, y2 + kMinWidthT / 2);
						poly0.set(1, x2 + kMinWidthT, y2 - kMinWidthT / 2);
					}
					break;
				case 1:
					poly0.set(2, x2 - kMinWidthT, y2);
					poly0.set(1, x2 + kMinWidthT, y2);
					break;
				case 13:
					poly0.set(2, x2 - kMinWidthT, y2 + kage.kAdjustKakatoL[opt2] + kMinWidthT);
					poly0.set(1, x2 + kMinWidthT, y2 + kage.kAdjustKakatoL[opt2]);
					break;
				case 23:
					poly0.set(2, x2 - kMinWidthT, y2 + kage.kAdjustKakatoR[opt2] + kMinWidthT);
					poly0.set(1, x2 + kMinWidthT, y2 + kage.kAdjustKakatoR[opt2]);
					break;
				case 24:
					// for T/H design
					poly0.set(2, x2 - kMinWidthT, y2 + kage.kMinWidthY);
					poly0.set(1, x2 + kMinWidthT, y2 + kage.kMinWidthY);
					break;
				case 32:
					poly0.set(2, x2 - kMinWidthT, y2 + kage.kMinWidthY);
					poly0.set(1, x2 + kMinWidthT, y2 + kage.kMinWidthY);
					break;
			}

			polygons.push(poly0);

			if (a2 == 24) {
				// for T design
				var poly = new _polygon.Polygon();
				poly.push(x2, y2 + kage.kMinWidthY);
				poly.push(x2 + kMinWidthT, y2 - kage.kMinWidthY * 3);
				poly.push(x2 + kMinWidthT * 2, y2 - kage.kMinWidthY);
				poly.push(x2 + kMinWidthT * 2, y2 + kage.kMinWidthY);
				polygons.push(poly);
			}

			if (a2 == 13 && opt2 == 4) {
				// for new GTH box's left bottom corner
				var _poly23 = new _polygon.Polygon();
				_poly23.push(x2 - kMinWidthT, y2 - kage.kMinWidthY * 3);
				_poly23.push(x2 - kMinWidthT * 2, y2);
				_poly23.push(x2 - kage.kMinWidthY, y2 + kage.kMinWidthY * 5);
				_poly23.push(x2 + kMinWidthT, y2 + kage.kMinWidthY);
				polygons.push(_poly23);
			}

			if (a1 == 22) {
				// box's right top corner
				var _poly24 = new _polygon.Polygon();
				_poly24.push(x1 - kMinWidthT, y1 - kage.kMinWidthY);
				_poly24.push(x1, y1 - kage.kMinWidthY - kage.kWidth);
				_poly24.push(x1 + kMinWidthT + kage.kWidth, y1 + kage.kMinWidthY);
				_poly24.push(x1 + kMinWidthT, y1 + kMinWidthT);
				_poly24.push(x1 - kMinWidthT, y1);
				polygons.push(_poly24);
			}

			if (a1 == 0) {
				// beginning of the stroke
				var _poly25 = new _polygon.Polygon();
				_poly25.push(x1 + kMinWidthT, y1 + kage.kMinWidthY * 0.5);
				_poly25.push(x1 + kMinWidthT + kMinWidthT * 0.5, y1 + kage.kMinWidthY * 0.5 + kage.kMinWidthY);
				_poly25.push(x1 + kMinWidthT - 2, y1 + kage.kMinWidthY * 0.5 + kage.kMinWidthY * 2 + 1);
				polygons.push(_poly25);
			}

			if (a1 == 6 && a2 == 0 || a2 == 1) {
				// KAGI NO YOKO BOU NO SAIGO NO MARU ... no need only used at 1st=yoko
				var _poly26 = new _polygon.Polygon();
				if (kage.kUseCurve) {
					_poly26.push(x2 - kMinWidthT, y2);
					_poly26.push(x2 - kMinWidthT * 0.9, y2 + kMinWidthT * 0.9, 1);
					_poly26.push(x2, y2 + kMinWidthT);
					_poly26.push(x2 + kMinWidthT * 0.9, y2 + kMinWidthT * 0.9, 1);
					_poly26.push(x2 + kMinWidthT, y2);
				} else {
					_poly26.push(x2 - kMinWidthT, y2);
					_poly26.push(x2 - kMinWidthT * 0.6, y2 + kMinWidthT * 0.6);
					_poly26.push(x2, y2 + kMinWidthT);
					_poly26.push(x2 + kMinWidthT * 0.6, y2 + kMinWidthT * 0.6);
					_poly26.push(x2 + kMinWidthT, y2);
				}
				// poly.reverse(); // for fill-rule
				polygons.push(_poly26);
			}
		} else if (y1 == y2) {
			// if it is YOKO stroke, use x-axis
			if (a1 == 6) {
				// if it is KAGI's YOKO stroke, get bold
				var _poly27 = new _polygon.Polygon();
				_poly27.push(x1, y1 - kMinWidthT);
				_poly27.push(x2, y2 - kMinWidthT);
				_poly27.push(x2, y2 + kMinWidthT);
				_poly27.push(x1, y1 + kMinWidthT);
				polygons.push(_poly27);

				if (a2 == 1 || a2 == 0 || a2 == 5) {
					// no need a2=1
					// KAGI NO YOKO BOU NO SAIGO NO MARU
					var poly2 = new _polygon.Polygon();
					if (kage.kUseCurve) {
						if (x1 < x2) {
							poly2.push(x2, y2 - kMinWidthT);
							poly2.push(x2 + kMinWidthT * 0.9, y2 - kMinWidthT * 0.9, 1);
							poly2.push(x2 + kMinWidthT, y2);
							poly2.push(x2 + kMinWidthT * 0.9, y2 + kMinWidthT * 0.9, 1);
							poly2.push(x2, y2 + kMinWidthT);
						} else {
							poly2.push(x2, y2 - kMinWidthT);
							poly2.push(x2 - kMinWidthT * 0.9, y2 - kMinWidthT * 0.9, 1);
							poly2.push(x2 - kMinWidthT, y2);
							poly2.push(x2 - kMinWidthT * 0.9, y2 + kMinWidthT * 0.9, 1);
							poly2.push(x2, y2 + kMinWidthT);
						}
					} else {
						if (x1 < x2) {
							poly2.push(x2, y2 - kMinWidthT);
							poly2.push(x2 + kMinWidthT * 0.6, y2 - kMinWidthT * 0.6);
							poly2.push(x2 + kMinWidthT, y2);
							poly2.push(x2 + kMinWidthT * 0.6, y2 + kMinWidthT * 0.6);
							poly2.push(x2, y2 + kMinWidthT);
						} else {
							poly2.push(x2, y2 - kMinWidthT);
							poly2.push(x2 - kMinWidthT * 0.6, y2 - kMinWidthT * 0.6);
							poly2.push(x2 - kMinWidthT, y2);
							poly2.push(x2 - kMinWidthT * 0.6, y2 + kMinWidthT * 0.6);
							poly2.push(x2, y2 + kMinWidthT);
						}
					}
					polygons.push(poly2);
				}

				if (a2 == 5) {
					// KAGI NO YOKO BOU NO HANE
					var _poly28 = new _polygon.Polygon();
					if (x1 < x2) {
						_poly28.push(x2, y2 - kMinWidthT + 1);
						_poly28.push(x2 + 2, y2 - kMinWidthT - kage.kWidth * (4 * (1 - opt1 / kage.kAdjustMageStep) + 1));
						_poly28.push(x2, y2 - kMinWidthT - kage.kWidth * (4 * (1 - opt1 / kage.kAdjustMageStep) + 1));
						_poly28.push(x2 - kMinWidthT, y2 - kMinWidthT + 1);
					} else {
						_poly28.push(x2, y2 - kMinWidthT + 1);
						_poly28.push(x2 - 2, y2 - kMinWidthT - kage.kWidth * (4 * (1 - opt1 / kage.kAdjustMageStep) + 1));
						_poly28.push(x2, y2 - kMinWidthT - kage.kWidth * (4 * (1 - opt1 / kage.kAdjustMageStep) + 1));
						_poly28.push(x2 + kMinWidthT, y2 - kMinWidthT + 1);
					}
					// poly2.reverse(); // for fill-rule
					polygons.push(_poly28);
				}
			} else {
				// always same
				var _poly29 = new _polygon.Polygon(4);
				_poly29.set(0, x1, y1 - kage.kMinWidthY);
				_poly29.set(1, x2, y2 - kage.kMinWidthY);
				_poly29.set(2, x2, y2 + kage.kMinWidthY);
				_poly29.set(3, x1, y1 + kage.kMinWidthY);
				polygons.push(_poly29);

				// UROKO
				if (a2 == 0) {
					var _poly30 = new _polygon.Polygon();
					_poly30.push(x2, y2 - kage.kMinWidthY);
					_poly30.push(x2 - kage.kAdjustUrokoX[opt2], y2);
					_poly30.push(x2 - kage.kAdjustUrokoX[opt2] / 2, y2 - kage.kAdjustUrokoY[opt2]);
					polygons.push(_poly30);
				}
			}
		} else {
			// for others, use x-axis
			var rad = Math.atan((y2 - y1) / (x2 - x1));
			if (Math.abs(y2 - y1) < Math.abs(x2 - x1) && a1 != 6 && a2 != 6 && !(x1 > x2)) {
				// ASAI KAUDO
				// always same
				var _poly31 = new _polygon.Polygon(4);
				_poly31.set(0, x1 + Math.sin(rad) * kage.kMinWidthY, y1 - Math.cos(rad) * kage.kMinWidthY);
				_poly31.set(1, x2 + Math.sin(rad) * kage.kMinWidthY, y2 - Math.cos(rad) * kage.kMinWidthY);
				_poly31.set(2, x2 - Math.sin(rad) * kage.kMinWidthY, y2 + Math.cos(rad) * kage.kMinWidthY);
				_poly31.set(3, x1 - Math.sin(rad) * kage.kMinWidthY, y1 + Math.cos(rad) * kage.kMinWidthY);
				polygons.push(_poly31);

				// UROKO
				if (a2 == 0) {
					var _poly32 = new _polygon.Polygon();
					_poly32.push(x2 + Math.sin(rad) * kage.kMinWidthY, y2 - Math.cos(rad) * kage.kMinWidthY);
					_poly32.push(x2 - Math.cos(rad) * kage.kAdjustUrokoX[opt2], y2 - Math.sin(rad) * kage.kAdjustUrokoX[opt2]);
					_poly32.push(x2 - Math.cos(rad) * kage.kAdjustUrokoX[opt2] / 2 + Math.sin(rad) * kage.kAdjustUrokoX[opt2] / 2, y2 - Math.sin(rad) * kage.kAdjustUrokoY[opt2] - Math.cos(rad) * kage.kAdjustUrokoY[opt2]);
					polygons.push(_poly32);
				}
			} else {
				// KAKUDO GA FUKAI or KAGI NO YOKO BOU
				var v = x1 > x2 ? -1 : 1;
				var _poly33 = new _polygon.Polygon(4);
				switch (a1) {
					case 0:
						_poly33.set(0, x1 + Math.sin(rad) * kMinWidthT * v + kage.kMinWidthY * Math.cos(rad) * 0.5 * v, y1 - Math.cos(rad) * kMinWidthT * v + kage.kMinWidthY * Math.sin(rad) * 0.5 * v);
						_poly33.set(3, x1 - Math.sin(rad) * kMinWidthT * v - kage.kMinWidthY * Math.cos(rad) * 0.5 * v, y1 + Math.cos(rad) * kMinWidthT * v - kage.kMinWidthY * Math.sin(rad) * 0.5 * v);
						break;
					case 1:
					case 6:
						_poly33.set(0, x1 + Math.sin(rad) * kMinWidthT * v, y1 - Math.cos(rad) * kMinWidthT * v);
						_poly33.set(3, x1 - Math.sin(rad) * kMinWidthT * v, y1 + Math.cos(rad) * kMinWidthT * v);
						break;
					case 12:
						_poly33.set(0, x1 + Math.sin(rad) * kMinWidthT * v - kage.kMinWidthY * Math.cos(rad) * v, y1 - Math.cos(rad) * kMinWidthT * v - kage.kMinWidthY * Math.sin(rad) * v);
						_poly33.set(3, x1 - Math.sin(rad) * kMinWidthT * v - (kMinWidthT + kage.kMinWidthY) * Math.cos(rad) * v, y1 + Math.cos(rad) * kMinWidthT * v - (kMinWidthT + kage.kMinWidthY) * Math.sin(rad) * v);
						break;
					case 22:
						_poly33.set(0, x1 + (kMinWidthT * v + 1) / Math.sin(rad), y1 + 1);
						_poly33.set(3, x1 - kMinWidthT * v / Math.sin(rad), y1);
						break;
					case 32:
						_poly33.set(0, x1 + kMinWidthT * v / Math.sin(rad), y1);
						_poly33.set(3, x1 - kMinWidthT * v / Math.sin(rad), y1);
						break;
				}

				switch (a2) {
					case 0:
						if (a1 == 6) {
							_poly33.set(1, x2 + Math.sin(rad) * kMinWidthT * v, y2 - Math.cos(rad) * kMinWidthT * v);
							_poly33.set(2, x2 - Math.sin(rad) * kMinWidthT * v, y2 + Math.cos(rad) * kMinWidthT * v);
						} else {
							_poly33.set(1, x2 + Math.sin(rad) * kMinWidthT * v - kMinWidthT * 0.5 * Math.cos(rad) * v, y2 - Math.cos(rad) * kMinWidthT * v - kMinWidthT * 0.5 * Math.sin(rad) * v);
							_poly33.set(2, x2 - Math.sin(rad) * kMinWidthT * v + kMinWidthT * 0.5 * Math.cos(rad) * v, y2 + Math.cos(rad) * kMinWidthT * v + kMinWidthT * 0.5 * Math.sin(rad) * v);
						}
						break;
					case 1: // is needed?
					case 5:
						_poly33.set(1, x2 + Math.sin(rad) * kMinWidthT * v, y2 - Math.cos(rad) * kMinWidthT * v);
						_poly33.set(2, x2 - Math.sin(rad) * kMinWidthT * v, y2 + Math.cos(rad) * kMinWidthT * v);
						break;
					case 13:
						_poly33.set(1, x2 + Math.sin(rad) * kMinWidthT * v + kage.kAdjustKakatoL[opt2] * Math.cos(rad) * v, y2 - Math.cos(rad) * kMinWidthT * v + kage.kAdjustKakatoL[opt2] * Math.sin(rad) * v);
						_poly33.set(2, x2 - Math.sin(rad) * kMinWidthT * v + (kage.kAdjustKakatoL[opt2] + kMinWidthT) * Math.cos(rad) * v, y2 + Math.cos(rad) * kMinWidthT * v + (kage.kAdjustKakatoL[opt2] + kMinWidthT) * Math.sin(rad) * v);
						break;
					case 23:
						_poly33.set(1, x2 + Math.sin(rad) * kMinWidthT * v + kage.kAdjustKakatoR[opt2] * Math.cos(rad) * v, y2 - Math.cos(rad) * kMinWidthT * v + kage.kAdjustKakatoR[opt2] * Math.sin(rad) * v);
						_poly33.set(2, x2 - Math.sin(rad) * kMinWidthT * v + (kage.kAdjustKakatoR[opt2] + kMinWidthT) * Math.cos(rad) * v, y2 + Math.cos(rad) * kMinWidthT * v + (kage.kAdjustKakatoR[opt2] + kMinWidthT) * Math.sin(rad) * v);
						break;
					case 24:
						_poly33.set(1, x2 + kMinWidthT * v / Math.sin(rad), y2);
						_poly33.set(2, x2 - kMinWidthT * v / Math.sin(rad), y2);
						break;
					case 32:
						_poly33.set(1, x2 + kMinWidthT * v / Math.sin(rad), y2);
						_poly33.set(2, x2 - kMinWidthT * v / Math.sin(rad), y2);
						break;
				}

				polygons.push(_poly33);

				if (a2 == 24) {
					// for T design
					var _poly34 = new _polygon.Polygon();
					_poly34.push(x2, y2 + kage.kMinWidthY);
					_poly34.push(x2 + kMinWidthT * 0.5, y2 - kage.kMinWidthY * 4);
					_poly34.push(x2 + kMinWidthT * 2, y2 - kage.kMinWidthY);
					_poly34.push(x2 + kMinWidthT * 2, y2 + kage.kMinWidthY);
					polygons.push(_poly34);
				}

				if (a1 == 6 && (a2 == 0 || a2 == 5)) {
					// KAGI NO YOKO BOU NO SAIGO NO MARU
					var _poly35 = new _polygon.Polygon();
					if (kage.kUseCurve) {
						_poly35.push(x2 + Math.sin(rad) * kMinWidthT * v, y2 - Math.cos(rad) * kMinWidthT * v);
						_poly35.push(x2 - Math.cos(rad) * kMinWidthT * 0.9 * v + Math.sin(rad) * kMinWidthT * 0.9 * v, y2 + Math.sin(rad) * kMinWidthT * 0.9 * v - Math.cos(rad) * kMinWidthT * 0.9 * v, 1);
						_poly35.push(x2 + Math.cos(rad) * kMinWidthT * v, y2 + Math.sin(rad) * kMinWidthT * v);
						_poly35.push(x2 + Math.cos(rad) * kMinWidthT * 0.9 * v - Math.sin(rad) * kMinWidthT * 0.9 * v, y2 + Math.sin(rad) * kMinWidthT * 0.9 * v + Math.cos(rad) * kMinWidthT * 0.9 * v, 1);
						_poly35.push(x2 - Math.sin(rad) * kMinWidthT * v, y2 + Math.cos(rad) * kMinWidthT * v);
					} else {
						_poly35.push(x2 + Math.sin(rad) * kMinWidthT * v, y2 - Math.cos(rad) * kMinWidthT * v);
						_poly35.push(x2 + Math.cos(rad) * kMinWidthT * 0.8 * v + Math.sin(rad) * kMinWidthT * 0.6 * v, y2 + Math.sin(rad) * kMinWidthT * 0.8 * v - Math.cos(rad) * kMinWidthT * 0.6 * v);
						_poly35.push(x2 + Math.cos(rad) * kMinWidthT * v, y2 + Math.sin(rad) * kMinWidthT * v);
						_poly35.push(x2 + Math.cos(rad) * kMinWidthT * 0.8 * v - Math.sin(rad) * kMinWidthT * 0.6 * v, y2 + Math.sin(rad) * kMinWidthT * 0.8 * v + Math.cos(rad) * kMinWidthT * 0.6 * v);
						_poly35.push(x2 - Math.sin(rad) * kMinWidthT * v, y2 + Math.cos(rad) * kMinWidthT * v);
					}
					polygons.push(_poly35);
				}

				if (a1 == 6 && a2 == 5) {
					// KAGI NO YOKO BOU NO HANE
					var _poly36 = new _polygon.Polygon();
					if (x1 < x2) {
						_poly36.push(x2 + (kMinWidthT - 1) * Math.sin(rad) * v, y2 - (kMinWidthT - 1) * Math.cos(rad) * v);
						_poly36.push(x2 + 2 * Math.cos(rad) * v + (kMinWidthT + kage.kWidth * 5) * Math.sin(rad) * v, y2 + 2 * Math.sin(rad) * v - (kMinWidthT + kage.kWidth * 5) * Math.cos(rad) * v);
						_poly36.push(x2 + (kMinWidthT + kage.kWidth * 5) * Math.sin(rad) * v, y2 - (kMinWidthT + kage.kWidth * 5) * Math.cos(rad) * v);
						_poly36.push(x2 + (kMinWidthT - 1) * Math.sin(rad) * v - kMinWidthT * Math.cos(rad) * v, y2 - (kMinWidthT - 1) * Math.cos(rad) * v - kMinWidthT * Math.sin(rad) * v);
					} else {
						_poly36.push(x2 - (kMinWidthT - 1) * Math.sin(rad) * v, y2 + (kMinWidthT - 1) * Math.cos(rad) * v);
						_poly36.push(x2 + 2 * Math.cos(rad) * v - (kMinWidthT + kage.kWidth * 5) * Math.sin(rad) * v, y2 + 2 * Math.sin(rad) * v + (kMinWidthT + kage.kWidth * 5) * Math.cos(rad) * v);
						_poly36.push(x2 - (kMinWidthT + kage.kWidth * 5) * Math.sin(rad) * v, y2 + (kMinWidthT + kage.kWidth * 5) * Math.cos(rad) * v);
						_poly36.push(x2 + (kMinWidthT - 1) * Math.sin(rad) * v - kMinWidthT * Math.cos(rad) * v, y2 - (kMinWidthT - 1) * Math.cos(rad) * v - kMinWidthT * Math.sin(rad) * v);
					}
					polygons.push(_poly36);
				}

				if (a1 == 22) {
					// SHIKAKU MIGIUE UROKO NANAME DEMO MASSUGU MUKI
					var _poly37 = new _polygon.Polygon();
					_poly37.push(x1 - kMinWidthT, y1 - kage.kMinWidthY);
					_poly37.push(x1, y1 - kage.kMinWidthY - kage.kWidth);
					_poly37.push(x1 + kMinWidthT + kage.kWidth, y1 + kage.kMinWidthY);
					_poly37.push(x1 + kMinWidthT, y1 + kMinWidthT - 1);
					_poly37.push(x1 - kMinWidthT, y1 + kMinWidthT + 4);
					polygons.push(_poly37);
				}

				if (a2 == 13 && opt2 == 4) {
					// for new GTH box's left bottom corner MUKI KANKEINASHI
					var _poly38 = new _polygon.Polygon();
					var m = 0;
					if (x1 > x2 && y1 != y2) {
						m = Math.floor((x1 - x2) / (y2 - y1) * 3);
					}
					_poly38.push(x2 + m, y2 - kage.kMinWidthY * 5);
					_poly38.push(x2 - kMinWidthT * 2 + m, y2);
					_poly38.push(x2 - kage.kMinWidthY + m, y2 + kage.kMinWidthY * 5);
					_poly38.push(x2 + kMinWidthT + m, y2 + kage.kMinWidthY);
					_poly38.push(x2 + m, y2);
					polygons.push(_poly38);
				}

				var XX = Math.sin(rad) * v;
				var XY = Math.cos(rad) * v * -1;
				var YX = Math.cos(rad) * v;
				var YY = Math.sin(rad) * v;

				if (a1 == 0) {
					// beginning of the storke
					var _poly39 = new _polygon.Polygon();
					_poly39.push(x1 + kMinWidthT * XX + kage.kMinWidthY * 0.5 * YX, y1 + kMinWidthT * XY + kage.kMinWidthY * 0.5 * YY);
					_poly39.push(x1 + (kMinWidthT + kMinWidthT * 0.5) * XX + (kage.kMinWidthY * 0.5 + kage.kMinWidthY) * YX, y1 + (kMinWidthT + kMinWidthT * 0.5) * XY + (kage.kMinWidthY * 0.5 + kage.kMinWidthY) * YY);
					_poly39.push(x1 + kMinWidthT * XX + (kage.kMinWidthY * 0.5 + kage.kMinWidthY * 2) * YX - 2 * XX, y1 + kMinWidthT * XY + (kage.kMinWidthY * 0.5 + kage.kMinWidthY * 2) * YY + 1 * XY);
					polygons.push(_poly39);
				}
			}
		}
	} else {
		// gothic
		if (tx1 == tx2) {
			// if TATE stroke, use y-axis
			var _x3 = void 0;
			var _y3 = void 0;
			var _x4 = void 0;
			var _y4 = void 0;
			var _a3 = void 0;
			var _a4 = void 0;
			if (ty1 > ty2) {
				_x3 = tx2;
				_y3 = ty2;
				_x4 = tx1;
				_y4 = ty1;
				_a3 = ta2;
				_a4 = ta1;
			} else {
				_x3 = tx1;
				_y3 = ty1;
				_x4 = tx2;
				_y4 = ty2;
				_a3 = ta1;
				_a4 = ta2;
			}

			if (_a3 % 10 === 2) {
				_y3 -= kage.kWidth;
			}
			if (_a4 % 10 === 2) {
				_y4 += kage.kWidth;
			}
			if (_a3 % 10 === 3) {
				_y3 -= kage.kWidth * kage.kKakato;
			}
			if (_a4 % 10 === 3) {
				_y4 += kage.kWidth * kage.kKakato;
			}

			var _poly40 = new _polygon.Polygon();
			_poly40.push(_x3 - kage.kWidth, _y3);
			_poly40.push(_x4 - kage.kWidth, _y4);
			_poly40.push(_x4 + kage.kWidth, _y4);
			_poly40.push(_x3 + kage.kWidth, _y3);
			// poly.reverse(); // for fill-rule

			polygons.push(_poly40);
		} else if (ty1 == ty2) {
			// if YOKO stroke, use x-axis
			var _x5 = void 0;
			var _y5 = void 0;
			var _x6 = void 0;
			var _y6 = void 0;
			var _a5 = void 0;
			var _a6 = void 0;
			if (tx1 > tx2) {
				_x5 = tx2;
				_y5 = ty2;
				_x6 = tx1;
				_y6 = ty1;
				_a5 = ta2;
				_a6 = ta1;
			} else {
				_x5 = tx1;
				_y5 = ty1;
				_x6 = tx2;
				_y6 = ty2;
				_a5 = ta1;
				_a6 = ta2;
			}
			if (_a5 % 10 === 2) {
				_x5 -= kage.kWidth;
			}
			if (_a6 % 10 === 2) {
				_x6 += kage.kWidth;
			}
			if (_a5 % 10 === 3) {
				_x5 -= kage.kWidth * kage.kKakato;
			}
			if (_a6 % 10 === 3) {
				_x6 += kage.kWidth * kage.kKakato;
			}

			var _poly41 = new _polygon.Polygon();
			_poly41.push(_x5, _y5 - kage.kWidth);
			_poly41.push(_x6, _y6 - kage.kWidth);
			_poly41.push(_x6, _y6 + kage.kWidth);
			_poly41.push(_x5, _y5 + kage.kWidth);

			polygons.push(_poly41);
		} else {
			// for others, use x-axis
			var _x7 = void 0;
			var _y7 = void 0;
			var _x8 = void 0;
			var _y8 = void 0;
			var _a7 = void 0;
			var _a8 = void 0;
			if (tx1 > tx2) {
				_x7 = tx2;
				_y7 = ty2;
				_x8 = tx1;
				_y8 = ty1;
				_a7 = ta2;
				_a8 = ta1;
			} else {
				_x7 = tx1;
				_y7 = ty1;
				_x8 = tx2;
				_y8 = ty2;
				_a7 = ta1;
				_a8 = ta2;
			}
			var _rad6 = Math.atan((_y8 - _y7) / (_x8 - _x7));
			if (_a7 % 10 === 2) {
				_x7 -= kage.kWidth * Math.cos(_rad6);
				_y7 -= kage.kWidth * Math.sin(_rad6);
			}
			if (_a8 % 10 === 2) {
				_x8 += kage.kWidth * Math.cos(_rad6);
				_y8 += kage.kWidth * Math.sin(_rad6);
			}
			if (_a7 % 10 === 3) {
				_x7 -= kage.kWidth * Math.cos(_rad6) * kage.kKakato;
				_y7 -= kage.kWidth * Math.sin(_rad6) * kage.kKakato;
			}
			if (_a8 % 10 === 3) {
				_x8 += kage.kWidth * Math.cos(_rad6) * kage.kKakato;
				_y8 += kage.kWidth * Math.sin(_rad6) * kage.kKakato;
			}

			// SUICHOKU NO ICHI ZURASHI HA Math.sin TO Math.cos NO IREKAE + x-axis MAINASU KA
			var _poly42 = new _polygon.Polygon();
			_poly42.push(_x7 + Math.sin(_rad6) * kage.kWidth, _y7 - Math.cos(_rad6) * kage.kWidth);
			_poly42.push(_x8 + Math.sin(_rad6) * kage.kWidth, _y8 - Math.cos(_rad6) * kage.kWidth);
			_poly42.push(_x8 - Math.sin(_rad6) * kage.kWidth, _y8 + Math.cos(_rad6) * kage.kWidth);
			_poly42.push(_x7 - Math.sin(_rad6) * kage.kWidth, _y7 + Math.cos(_rad6) * kage.kWidth);

			polygons.push(_poly42);
		}
	}
}

},{"./curve":4,"./kage":6,"./polygon":9}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.dfDrawFont = dfDrawFont;

var _kagecd = require("./kagecd");

function dfDrawFont(kage, polygons, a1, a2, a3, x1, y1, x2, y2, x3, y3, x4, y4) {

	if (kage.kShotai == kage.kMincho) {
		switch (a1 % 100) {// ... no need to divide
			case 0:
				break;
			case 1:
				{
					if (a3 % 100 === 4) {
						var tx1 = void 0;
						var ty1 = void 0;
						if (x1 == x2) {
							var v = y1 < y2 ? 1 : -1;
							tx1 = x2;
							ty1 = y2 - kage.kMage * v;
						} else if (y1 == y2) {
							// ... no need
							var _v = x1 < x2 ? 1 : -1;
							tx1 = x2 - kage.kMage * _v;
							ty1 = y2;
						} else {
							var rad = Math.atan2(y2 - y1, x2 - x1);
							tx1 = x2 - kage.kMage * Math.cos(rad);
							ty1 = y2 - kage.kMage * Math.sin(rad);
						}
						(0, _kagecd.cdDrawLine)(kage, polygons, x1, y1, tx1, ty1, a2, 1);
						(0, _kagecd.cdDrawCurve)(kage, polygons, tx1, ty1, x2, y2, x2 - kage.kMage * ((kage.kAdjustTateStep + 4 - Math.floor(a2 / 1000)) / (kage.kAdjustTateStep + 4)), y2, 1 + (a2 - a2 % 1000), a3 + 10);
					} else {
						(0, _kagecd.cdDrawLine)(kage, polygons, x1, y1, x2, y2, a2, a3);
					}
					break;
				}
			case 2:
				{
					// case 12: // ... no need
					if (a3 % 100 === 4) {
						var _tx = void 0;
						var _ty = void 0;
						if (x2 == x3) {
							_tx = x3;
							_ty = y3 - kage.kMage;
						} else if (y2 == y3) {
							_tx = x3 - kage.kMage;
							_ty = y3;
						} else {
							var _rad = Math.atan2(y3 - y2, x3 - x2);
							_tx = x3 - kage.kMage * Math.cos(_rad);
							_ty = y3 - kage.kMage * Math.sin(_rad);
						}
						(0, _kagecd.cdDrawCurve)(kage, polygons, x1, y1, x2, y2, _tx, _ty, a2, 1);
						(0, _kagecd.cdDrawCurve)(kage, polygons, _tx, _ty, x3, y3, x3 - kage.kMage, y3, 1, a3 + 10);
					} else if (a3 == 5) {
						(0, _kagecd.cdDrawCurve)(kage, polygons, x1, y1, x2, y2, x3, y3, a2, 15);
					} else {
						(0, _kagecd.cdDrawCurve)(kage, polygons, x1, y1, x2, y2, x3, y3, a2, a3);
					}
					break;
				}
			case 3:
				{
					if (a3 % 1000 === 5) {
						var _tx2 = void 0;
						var _ty2 = void 0;
						if (x1 == x2) {
							var _v2 = y1 < y2 ? 1 : -1;
							_tx2 = x2;
							_ty2 = y2 - kage.kMage * _v2;
						} else if (y1 == y2) {
							var _v3 = x1 < x2 ? 1 : -1;
							_tx2 = x2 - kage.kMage * _v3;
							_ty2 = y2;
						} else {
							var _rad2 = Math.atan2(y2 - y1, x2 - x1);
							_tx2 = x2 - kage.kMage * Math.cos(_rad2);
							_ty2 = y2 - kage.kMage * Math.sin(_rad2);
						}
						var tx2 = void 0;
						var ty2 = void 0;
						if (x2 == x3) {
							var _v4 = y2 < y3 ? 1 : -1;
							tx2 = x2;
							ty2 = y2 + kage.kMage * _v4;
						} else if (y2 == y3) {
							var _v5 = x2 < x3 ? 1 : -1;
							tx2 = x2 + kage.kMage * _v5;
							ty2 = y2;
						} else {
							var _rad3 = Math.atan2(y3 - y2, x3 - x2);
							tx2 = x2 + kage.kMage * Math.cos(_rad3);
							ty2 = y2 + kage.kMage * Math.sin(_rad3);
						}
						var tx3 = x3;
						var ty3 = y3;

						(0, _kagecd.cdDrawLine)(kage, polygons, x1, y1, _tx2, _ty2, a2, 1);
						(0, _kagecd.cdDrawCurve)(kage, polygons, _tx2, _ty2, x2, y2, tx2, ty2, 1 + (a2 - a2 % 1000) * 10, 1 + (a3 - a3 % 1000));
						if (x2 < x3 && tx3 - tx2 > 0 || x2 > x3 && tx2 - tx3 > 0) {
							// for closer position
							(0, _kagecd.cdDrawLine)(kage, polygons, tx2, ty2, tx3, ty3, 6 + (a3 - a3 % 1000), 5); // bolder by force
						}
					} else {
						var _tx3 = void 0;
						var _ty3 = void 0;
						if (x1 == x2) {
							var _v6 = y1 < y2 ? 1 : -1;
							_tx3 = x2;
							_ty3 = y2 - kage.kMage * _v6;
						} else if (y1 == y2) {
							var _v7 = x1 < x2 ? 1 : -1;
							_tx3 = x2 - kage.kMage * _v7;
							_ty3 = y2;
						} else {
							var _rad4 = Math.atan2(y2 - y1, x2 - x1);
							_tx3 = x2 - kage.kMage * Math.cos(_rad4);
							_ty3 = y2 - kage.kMage * Math.sin(_rad4);
						}
						var _tx4 = void 0;
						var _ty4 = void 0;
						if (x2 == x3) {
							var _v8 = y2 < y3 ? 1 : -1;
							_tx4 = x2;
							_ty4 = y2 + kage.kMage * _v8;
						} else if (y2 == y3) {
							var _v9 = x2 < x3 ? 1 : -1;
							_tx4 = x2 + kage.kMage * _v9;
							_ty4 = y2;
						} else {
							var _rad5 = Math.atan2(y3 - y2, x3 - x2);
							_tx4 = x2 + kage.kMage * Math.cos(_rad5);
							_ty4 = y2 + kage.kMage * Math.sin(_rad5);
						}
						(0, _kagecd.cdDrawLine)(kage, polygons, x1, y1, _tx3, _ty3, a2, 1);
						(0, _kagecd.cdDrawCurve)(kage, polygons, _tx3, _ty3, x2, y2, _tx4, _ty4, 1 + (a2 - a2 % 1000) * 10, 1 + (a3 - a3 % 1000));
						(0, _kagecd.cdDrawLine)(kage, polygons, _tx4, _ty4, x3, y3, 6 + (a3 - a3 % 1000), a3); // bolder by force
					}
					break;
				}
			case 12:
				{
					(0, _kagecd.cdDrawCurve)(kage, polygons, x1, y1, x2, y2, x3, y3, a2, 1);
					(0, _kagecd.cdDrawLine)(kage, polygons, x3, y3, x4, y4, 6, a3);
					break;
				}
			case 4:
				{
					var rate = 6;
					if ((x3 - x2) * (x3 - x2) + (y3 - y2) * (y3 - y2) < 14400) {
						// smaller than 120 x 120
						rate = Math.sqrt((x3 - x2) * (x3 - x2) + (y3 - y2) * (y3 - y2)) / 120 * 6;
					}
					if (a3 == 5) {
						var _tx5 = void 0;
						var _ty5 = void 0;
						if (x1 == x2) {
							var _v10 = y1 < y2 ? 1 : -1;
							_tx5 = x2;
							_ty5 = y2 - kage.kMage * _v10 * rate;
						} else if (y1 == y2) {
							var _v11 = x1 < x2 ? 1 : -1;
							_tx5 = x2 - kage.kMage * _v11 * rate;
							_ty5 = y2;
						} else {
							var _rad6 = Math.atan2(y2 - y1, x2 - x1);
							_tx5 = x2 - kage.kMage * Math.cos(_rad6) * rate;
							_ty5 = y2 - kage.kMage * Math.sin(_rad6) * rate;
						}
						var _tx6 = void 0;
						var _ty6 = void 0;
						if (x2 == x3) {
							var _v12 = y2 < y3 ? 1 : -1;
							_tx6 = x2;
							_ty6 = y2 + kage.kMage * _v12 * rate;
						} else if (y2 == y3) {
							var _v13 = x2 < x3 ? 1 : -1;
							_tx6 = x2 + kage.kMage * _v13 * rate;
							_ty6 = y2;
						} else {
							var _rad7 = Math.atan2(y3 - y2, x3 - x2);
							_tx6 = x2 + kage.kMage * Math.cos(_rad7) * rate;
							_ty6 = y2 + kage.kMage * Math.sin(_rad7) * rate;
						}
						var _tx7 = x3;
						var _ty7 = y3;

						(0, _kagecd.cdDrawLine)(kage, polygons, x1, y1, _tx5, _ty5, a2, 1);
						(0, _kagecd.cdDrawCurve)(kage, polygons, _tx5, _ty5, x2, y2, _tx6, _ty6, 1, 1);
						if (_tx7 - _tx6 > 0) {
							// for closer position
							(0, _kagecd.cdDrawLine)(kage, polygons, _tx6, _ty6, _tx7, _ty7, 6, 5); // bolder by force
						}
					} else {
						var _tx8 = void 0;
						var _ty8 = void 0;
						if (x1 == x2) {
							var _v14 = y1 < y2 ? 1 : -1;
							_tx8 = x2;
							_ty8 = y2 - kage.kMage * _v14 * rate;
						} else if (y1 == y2) {
							var _v15 = x1 < x2 ? 1 : -1;
							_tx8 = x2 - kage.kMage * _v15 * rate;
							_ty8 = y2;
						} else {
							var _rad8 = Math.atan2(y2 - y1, x2 - x1);
							_tx8 = x2 - kage.kMage * Math.cos(_rad8) * rate;
							_ty8 = y2 - kage.kMage * Math.sin(_rad8) * rate;
						}
						var _tx9 = void 0;
						var _ty9 = void 0;
						if (x2 == x3) {
							var _v16 = y2 < y3 ? 1 : -1;
							_tx9 = x2;
							_ty9 = y2 + kage.kMage * _v16 * rate;
						} else if (y2 == y3) {
							var _v17 = x2 < x3 ? 1 : -1;
							_tx9 = x2 + kage.kMage * _v17 * rate;
							_ty9 = y2;
						} else {
							var _rad9 = Math.atan2(y3 - y2, x3 - x2);
							_tx9 = x2 + kage.kMage * Math.cos(_rad9) * rate;
							_ty9 = y2 + kage.kMage * Math.sin(_rad9) * rate;
						}
						(0, _kagecd.cdDrawLine)(kage, polygons, x1, y1, _tx8, _ty8, a2, 1);
						(0, _kagecd.cdDrawCurve)(kage, polygons, _tx8, _ty8, x2, y2, _tx9, _ty9, 1, 1);
						(0, _kagecd.cdDrawLine)(kage, polygons, _tx9, _ty9, x3, y3, 6, a3); // bolder by force
					}
					break;
				}
			case 6:
				{
					if (a3 % 100 === 4) {
						var _tx10 = void 0;
						var _ty10 = void 0;
						if (x3 == x4) {
							_tx10 = x4;
							_ty10 = y4 - kage.kMage;
						} else if (y3 == y4) {
							_tx10 = x4 - kage.kMage;
							_ty10 = y4;
						} else {
							var _rad10 = Math.atan2(y4 - y3, x4 - x3);
							_tx10 = x4 - kage.kMage * Math.cos(_rad10);
							_ty10 = y4 - kage.kMage * Math.sin(_rad10);
						}
						(0, _kagecd.cdDrawBezier)(kage, polygons, x1, y1, x2, y2, x3, y3, _tx10, _ty10, a2, 1);
						(0, _kagecd.cdDrawCurve)(kage, polygons, _tx10, _ty10, x4, y4, x4 - kage.kMage, y4, 1, a3 + 10);
					} else if (a3 == 5) {
						(0, _kagecd.cdDrawBezier)(kage, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a2, 15);
					} else {
						(0, _kagecd.cdDrawBezier)(kage, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a2, a3);
					}
					break;
				}
			case 7:
				{
					(0, _kagecd.cdDrawLine)(kage, polygons, x1, y1, x2, y2, a2, 1);
					(0, _kagecd.cdDrawCurve)(kage, polygons, x2, y2, x3, y3, x4, y4, 1 + (a2 - a2 % 1000), a3);
					break;
				}
			case 9:
				// may not be exist ... no need
				// kageCanvas[y1][x1] = 0;
				// kageCanvas[y2][x2] = 0;
				break;
			default:
				break;
		}
	} else {
		// gothic
		switch (a1 % 100) {
			case 0:
				break;
			case 1:
				{
					if (a3 == 4) {
						var _tx11 = void 0;
						var _ty11 = void 0;
						if (x1 == x2) {
							var _v18 = y1 < y2 ? 1 : -1;
							_tx11 = x2;
							_ty11 = y2 - kage.kMage * _v18;
						} else if (y1 == y2) {
							var _v19 = x1 < x2 ? 1 : -1;
							_tx11 = x2 - kage.kMage * _v19;
							_ty11 = y2;
						} else {
							var _rad11 = Math.atan2(y2 - y1, x2 - x1);
							_tx11 = x2 - kage.kMage * Math.cos(_rad11);
							_ty11 = y2 - kage.kMage * Math.sin(_rad11);
						}
						(0, _kagecd.cdDrawLine)(kage, polygons, x1, y1, _tx11, _ty11, a2, 1);
						(0, _kagecd.cdDrawCurve)(kage, polygons, _tx11, _ty11, x2, y2, x2 - kage.kMage * 2, y2 - kage.kMage * 0.5, 1, 0);
					} else {
						(0, _kagecd.cdDrawLine)(kage, polygons, x1, y1, x2, y2, a2, a3);
					}
					break;
				}
			case 2:
			case 12:
				{
					if (a3 == 4) {
						var _tx12 = void 0;
						var _ty12 = void 0;
						if (x2 == x3) {
							_tx12 = x3;
							_ty12 = y3 - kage.kMage;
						} else if (y2 == y3) {
							_tx12 = x3 - kage.kMage;
							_ty12 = y3;
						} else {
							var _rad12 = Math.atan2(y3 - y2, x3 - x2);
							_tx12 = x3 - kage.kMage * Math.cos(_rad12);
							_ty12 = y3 - kage.kMage * Math.sin(_rad12);
						}
						(0, _kagecd.cdDrawCurve)(kage, polygons, x1, y1, x2, y2, _tx12, _ty12, a2, 1);
						(0, _kagecd.cdDrawCurve)(kage, polygons, _tx12, _ty12, x3, y3, x3 - kage.kMage * 2, y3 - kage.kMage * 0.5, 1, 0);
					} else if (a3 == 5) {
						var _tx13 = x3 + kage.kMage;
						var _ty13 = y3;
						var _tx14 = _tx13 + kage.kMage * 0.5;
						var _ty14 = y3 - kage.kMage * 2;
						(0, _kagecd.cdDrawCurve)(kage, polygons, x1, y1, x2, y2, x3, y3, a2, 1);
						(0, _kagecd.cdDrawCurve)(kage, polygons, x3, y3, _tx13, _ty13, _tx14, _ty14, 1, 0);
					} else {
						(0, _kagecd.cdDrawCurve)(kage, polygons, x1, y1, x2, y2, x3, y3, a2, a3);
					}
					break;
				}
			case 3:
				{
					if (a3 == 5) {
						var _tx15 = void 0;
						var _ty15 = void 0;
						if (x1 == x2) {
							var _v20 = y1 < y2 ? 1 : -1;
							_tx15 = x2;
							_ty15 = y2 - kage.kMage * _v20;
						} else if (y1 == y2) {
							var _v21 = x1 < x2 ? 1 : -1;
							_tx15 = x2 - kage.kMage * _v21;
							_ty15 = y2;
						} else {
							var _rad13 = Math.atan2(y2 - y1, x2 - x1);
							_tx15 = x2 - kage.kMage * Math.cos(_rad13);
							_ty15 = y2 - kage.kMage * Math.sin(_rad13);
						}
						var _tx16 = void 0;
						var _ty16 = void 0;
						if (x2 == x3) {
							var _v22 = y2 < y3 ? 1 : -1;
							_tx16 = x2;
							_ty16 = y2 + kage.kMage * _v22;
						} else if (y2 == y3) {
							var _v23 = x2 < x3 ? 1 : -1;
							_tx16 = x2 + kage.kMage * _v23;
							_ty16 = y2;
						} else {
							var _rad14 = Math.atan2(y3 - y2, x3 - x2);
							_tx16 = x2 + kage.kMage * Math.cos(_rad14);
							_ty16 = y2 + kage.kMage * Math.sin(_rad14);
						}
						var _tx17 = x3 - kage.kMage;
						var _ty17 = y3;
						var tx4 = x3 + kage.kMage * 0.5;
						var ty4 = y3 - kage.kMage * 2;

						(0, _kagecd.cdDrawLine)(kage, polygons, x1, y1, _tx15, _ty15, a2, 1);
						(0, _kagecd.cdDrawCurve)(kage, polygons, _tx15, _ty15, x2, y2, _tx16, _ty16, 1, 1);
						(0, _kagecd.cdDrawLine)(kage, polygons, _tx16, _ty16, _tx17, _ty17, 1, 1);
						(0, _kagecd.cdDrawCurve)(kage, polygons, _tx17, _ty17, x3, y3, tx4, ty4, 1, 0);
					} else {
						var _tx18 = void 0;
						var _ty18 = void 0;
						if (x1 == x2) {
							var _v24 = y1 < y2 ? 1 : -1;
							_tx18 = x2;
							_ty18 = y2 - kage.kMage * _v24;
						} else if (y1 == y2) {
							var _v25 = x1 < x2 ? 1 : -1;
							_tx18 = x2 - kage.kMage * _v25;
							_ty18 = y2;
						} else {
							var _rad15 = Math.atan2(y2 - y1, x2 - x1);
							_tx18 = x2 - kage.kMage * Math.cos(_rad15);
							_ty18 = y2 - kage.kMage * Math.sin(_rad15);
						}
						var _tx19 = void 0;
						var _ty19 = void 0;
						if (x2 == x3) {
							var _v26 = y2 < y3 ? 1 : -1;
							_tx19 = x2;
							_ty19 = y2 + kage.kMage * _v26;
						} else if (y2 == y3) {
							var _v27 = x2 < x3 ? 1 : -1;
							_tx19 = x2 + kage.kMage * _v27;
							_ty19 = y2;
						} else {
							var _rad16 = Math.atan2(y3 - y2, x3 - x2);
							_tx19 = x2 + kage.kMage * Math.cos(_rad16);
							_ty19 = y2 + kage.kMage * Math.sin(_rad16);
						}

						(0, _kagecd.cdDrawLine)(kage, polygons, x1, y1, _tx18, _ty18, a2, 1);
						(0, _kagecd.cdDrawCurve)(kage, polygons, _tx18, _ty18, x2, y2, _tx19, _ty19, 1, 1);
						(0, _kagecd.cdDrawLine)(kage, polygons, _tx19, _ty19, x3, y3, 1, a3);
					}
					break;
				}
			case 6:
				{
					if (a3 == 5) {
						var _tx20 = x4 - kage.kMage;
						var _ty20 = y4;
						var _tx21 = x4 + kage.kMage * 0.5;
						var _ty21 = y4 - kage.kMage * 2;
						/*
      cdDrawCurve(x1, y1, x2, y2, (x2 + x3) / 2, (y2 + y3) / 2, a2, 1);
      cdDrawCurve((x2 + x3) / 2, (y2 + y3) / 2, x3, y3, tx1, ty1, 1, 1);
           */
						(0, _kagecd.cdDrawBezier)(kage, polygons, x1, y1, x2, y2, x3, y3, _tx20, _ty20, a2, 1);
						(0, _kagecd.cdDrawCurve)(kage, polygons, _tx20, _ty20, x4, y4, _tx21, _ty21, 1, 0);
					} else {
						/*
      cdDrawCurve(x1, y1, x2, y2, (x2 + x3) / 2, (y2 + y3) / 2, a2, 1);
      cdDrawCurve((x2 + x3) / 2, (y2 + y3) / 2, x3, y3, x4, y4, 1, a3);
           */
						(0, _kagecd.cdDrawBezier)(kage, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a2, a3);
					}
					break;
				}
			case 7:
				{
					(0, _kagecd.cdDrawLine)(kage, polygons, x1, y1, x2, y2, a2, 1);
					(0, _kagecd.cdDrawCurve)(kage, polygons, x2, y2, x3, y3, x4, y4, 1, a3);
					break;
				}
			case 9:
				// may not be exist
				// kageCanvas[y1][x1] = 0;
				// kageCanvas[y2][x2] = 0;
				break;
			default:
				break;
		}
	}
}

},{"./kagecd":7}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Polygon = exports.Polygon = function () {
	_createClass(Polygon, [{
		key: "push",

		// resolution : 0.1
		// method
		value: function push(x, y, off) {
			// void
			if (off != 1) {
				off = 0;
			}
			this.array.push({
				x: Math.floor(x * 10) / 10,
				y: Math.floor(y * 10) / 10,
				off: off
			});
		}
	}, {
		key: "set",
		value: function set(index, x, y, off) {
			// void
			this.array[index].x = Math.floor(x * 10) / 10;
			this.array[index].y = Math.floor(y * 10) / 10;
			if (off != 1) {
				off = 0;
			}
			this.array[index].off = off;
		}
	}, {
		key: "reverse",
		value: function reverse() {
			// void
			this.array.reverse();
		}
	}, {
		key: "concat",
		value: function concat(poly) {
			// void
			this.array = this.array.concat(poly.array);
		}
	}, {
		key: "shift",
		value: function shift() {
			// void
			this.array.shift();
		}
	}, {
		key: "unshift",
		value: function unshift(x, y, off) {
			// void
			if (off != 1) {
				off = 0;
			}
			this.array.unshift({
				x: Math.floor(x * 10) / 10,
				y: Math.floor(y * 10) / 10,
				off: off
			});
		}
	}]);

	function Polygon(number) {
		_classCallCheck(this, Polygon);

		// property
		this.array = [];
		// initialize
		if (number) {
			for (var i = 0; i < number; i++) {
				this.push(0, 0, 0);
			}
		}
	}

	return Polygon;
}();

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Polygons = exports.Polygons = function () {
	_createClass(Polygons, [{
		key: "clear",

		// method
		value: function clear() {
			// void
			this.array = [];
		}
	}, {
		key: "push",
		value: function push(polygon) {
			// void
			// only a simple check
			var minx = 200;
			var maxx = 0;
			var miny = 200;
			var maxy = 0;
			var error = 0;
			for (var i = 0; i < polygon.array.length; i++) {
				if (polygon.array[i].x < minx) {
					minx = polygon.array[i].x;
				}
				if (polygon.array[i].x > maxx) {
					maxx = polygon.array[i].x;
				}
				if (polygon.array[i].y < miny) {
					miny = polygon.array[i].y;
				}
				if (polygon.array[i].y > maxy) {
					maxy = polygon.array[i].y;
				}
				if (isNaN(polygon.array[i].x) || isNaN(polygon.array[i].y)) {
					error++;
				}
			}
			if (error === 0 && minx != maxx && miny != maxy && polygon.array.length >= 3) {
				var newArray = [polygon.array.shift()];
				while (polygon.array.length != 0) {
					var temp = polygon.array.shift();
					// if(newArray[newArray.length - 1].x != temp.x ||
					//   newArray[newArray.length - 1].y != temp.y){
					newArray.push(temp);
					// }
				}
				if (newArray.length >= 3) {
					polygon.array = newArray;
					this.array.push(polygon);
				}
			}
		}
	}, {
		key: "generateSVG",
		value: function generateSVG(curve) {
			// string
			var buffer = "";
			buffer += "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\" baseProfile=\"full\" viewBox=\"0 0 200 200\" width=\"200\" height=\"200\">\n";
			if (curve) {
				for (var i = 0; i < this.array.length; i++) {
					var mode = "L";
					buffer += "<path d=\"M ";
					buffer += this.array[i].array[0].x + "," + this.array[i].array[0].y + " ";
					for (var j = 1; j < this.array[i].array.length; j++) {
						if (this.array[i].array[j].off == 1) {
							buffer += "Q ";
							mode = "Q";
						} else if (mode === "Q" && this.array[i].array[j - 1].off != 1) {
							buffer += "L ";
						} else if (mode === "L" && j === 1) {
							buffer += "L ";
						}
						buffer += this.array[i].array[j].x + "," + this.array[i].array[j].y + " ";
					}
					buffer += "Z\" fill=\"black\" />\n";
				}
				buffer += "</svg>\n";
			} else {
				buffer += "<g fill=\"black\">\n";
				for (var _i = 0; _i < this.array.length; _i++) {
					buffer += "<polygon points=\"";
					for (var _j = 0; _j < this.array[_i].array.length; _j++) {
						buffer += this.array[_i].array[_j].x + "," + this.array[_i].array[_j].y + " ";
					}
					buffer += "\" />\n";
				}
				buffer += "</g>\n";
				buffer += "</svg>\n";
			}
			return buffer;
		}
	}, {
		key: "generateEPS",
		value: function generateEPS() {
			// string
			var buffer = "";
			buffer += "%!PS-Adobe-3.0 EPSF-3.0\n";
			buffer += "%%BoundingBox: 0 -208 1024 816\n";
			buffer += "%%Pages: 0\n";
			buffer += "%%Title: Kanji glyph\n";
			buffer += "%%Creator: GlyphWiki powered by KAGE system\n";
			buffer += "%%CreationDate: " + new Date() + "\n";
			buffer += "%%EndComments\n";
			buffer += "%%EndProlog\n";
			for (var i = 0; i < this.array.length; i++) {
				for (var j = 0; j < this.array[i].array.length; j++) {
					buffer += this.array[i].array[j].x * 5 + " " + (1000 - this.array[i].array[j].y * 5 - 200) + " ";
					if (j === 0) {
						buffer += "newpath\nmoveto\n";
					} else {
						buffer += "lineto\n";
					}
				}
				buffer += "closepath\nfill\n";
			}
			buffer += "%%EOF\n";
			return buffer;
		}
	}]);

	function Polygons() {
		_classCallCheck(this, Polygons);

		// property
		this.array = [];
	}

	return Polygons;
}();

},{}]},{},[2]);
