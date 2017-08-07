(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
// Reference : http://www.cam.hi-ho.ne.jp/strong_warriors/teacher/chapter0{4,5}.html
Object.defineProperty(exports, "__esModule", { value: true });
/** Cross product of two vectors */
function cross(x1, y1, x2, y2) {
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
function isCross(x11, y11, x12, y12, x21, y21, x22, y22) {
    var cross_1112_2122 = cross(x12 - x11, y12 - y11, x22 - x21, y22 - y21);
    if (cross_1112_2122 === 0) {
        // parallel
        return false; // XXX should check if segments overlap?
    }
    var cross_1112_1121 = cross(x12 - x11, y12 - y11, x21 - x11, y21 - y11);
    var cross_1112_1122 = cross(x12 - x11, y12 - y11, x22 - x11, y22 - y11);
    var cross_2122_2111 = cross(x22 - x21, y22 - y21, x11 - x21, y11 - y21);
    var cross_2122_2112 = cross(x22 - x21, y22 - y21, x12 - x21, y12 - y21);
    return cross_1112_1121 * cross_1112_1122 <= 0 && cross_2122_2111 * cross_2122_2112 <= 0;
}
function isCrossBox(x1, y1, x2, y2, bx1, by1, bx2, by2) {
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
    for (var j = 0; j < strokesArray.length; j++) {
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
                if (isCrossBox(strokesArray[j][7], strokesArray[j][8], strokesArray[j][9], strokesArray[j][10], bx1, by1, bx2, by2)) {
                    return true;
                }
            // falls through
            case 2:
            case 12:
            case 3:
                if (isCrossBox(strokesArray[j][5], strokesArray[j][6], strokesArray[j][7], strokesArray[j][8], bx1, by1, bx2, by2)) {
                    return true;
                }
            // falls through
            default:
                if (isCrossBox(strokesArray[j][3], strokesArray[j][4], strokesArray[j][5], strokesArray[j][6], bx1, by1, bx2, by2)) {
                    return true;
                }
        }
    }
    return false;
}
exports.isCrossBoxWithOthers = isCrossBoxWithOthers;
function isCrossWithOthers(strokesArray, i, bx1, by1, bx2, by2) {
    for (var j = 0; j < strokesArray.length; j++) {
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
exports.isCrossWithOthers = isCrossWithOthers;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
window.Kage = _1.Kage;
window.Polygons = _1.Polygons;

},{"./":5}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Buhin = (function () {
    function Buhin() {
        // initialize
        // no operation
        this.hash = {};
    }
    // method
    Buhin.prototype.set = function (name, data) {
        this.hash[name] = data;
    };
    Buhin.prototype.search = function (name) {
        if (this.hash[name]) {
            return this.hash[name];
        }
        return ""; // no data
    };
    return Buhin;
}());
exports.Buhin = Buhin;
Buhin.prototype.push = Buhin.prototype.set;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
function divide_curve(_kage, x1, y1, sx1, sy1, x2, y2, curve) {
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
    return {
        index: cut,
        off: [[x1, y1, tx1, ty1, tx3, ty3], [tx3, ty3, tx2, ty2, x2, y2]],
    };
}
exports.divide_curve = divide_curve;
// ------------------------------------------------------------------
function find_offcurve(_kage, curve, sx, sy) {
    var _a = curve[0], nx1 = _a[0], ny1 = _a[1];
    var _b = curve[curve.length - 1], nx2 = _b[0], ny2 = _b[1];
    var area = 8;
    var minx = util_1.ternarySearchMin(function (tx) {
        return curve.reduce(function (diff, p, i) {
            var t = i / curve.length;
            var x = util_1.quadraticBezier(nx1, tx, nx2, t);
            return diff + Math.pow((p[0] - x), 2);
        }, 0);
    }, sx - area, sx + area);
    var miny = util_1.ternarySearchMin(function (ty) {
        return curve.reduce(function (diff, p, i) {
            var t = i / curve.length;
            var y = util_1.quadraticBezier(ny1, ty, ny2, t);
            return diff + Math.pow((p[1] - y), 2);
        }, 0);
    }, sy - area, sy + area);
    return [nx1, ny1, minx, miny, nx2, ny2];
}
exports.find_offcurve = find_offcurve;
// ------------------------------------------------------------------
function get_candidate(kage, a1, a2, x1, y1, sx1, sy1, x2, y2, opt3, opt4) {
    var curve = [[], []];
    for (var tt = 0; tt <= 1000; tt += kage.kRate) {
        var t = tt / 1000;
        // calculate a dot
        var x = util_1.quadraticBezier(x1, sx1, x2, t);
        var y = util_1.quadraticBezier(y1, sy1, y2, t);
        // KATAMUKI of vector by BIBUN
        var ix = util_1.quadraticBezierDeriv(x1, sx1, x2, t);
        var iy = util_1.quadraticBezierDeriv(y1, sy1, y2, t);
        var hosomi = 0.5;
        var deltad = (a1 === 7 && a2 === 0) // L2RD: fatten
            ? Math.pow(t, hosomi) * kage.kL2RDfatten
            : (a1 === 7)
                ? Math.pow(t, hosomi)
                : (a2 === 7)
                    ? Math.pow((1 - t), hosomi)
                    : (opt3 > 0)
                        ? 1 - opt3 / 2 / (kage.kMinWidthT - opt4 / 2) + opt3 / 2 / (kage.kMinWidthT - opt4) * t
                        : 1;
        if (deltad < 0.15) {
            deltad = 0.15;
        }
        // line SUICHOKU by vector
        var _a = (ix === 0)
            ? [-kage.kMinWidthT * deltad, 0] // ?????
            : util_1.normalize([-iy, ix], kage.kMinWidthT * deltad), ia = _a[0], ib = _a[1];
        curve[0].push([x - ia, y - ib]);
        curve[1].push([x + ia, y + ib]);
    }
    return curve;
}
exports.get_candidate = get_candidate;

},{"./util":11}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kage_1 = require("./kage");
exports.Kage = kage_1.Kage;
var polygons_1 = require("./polygons");
exports.Polygons = polygons_1.Polygons;

},{"./kage":6,"./polygons":10}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _2d_1 = require("./2d");
var buhin_1 = require("./buhin");
var kagedf_1 = require("./kagedf");
var polygons_1 = require("./polygons");
var util_1 = require("./util");
var KShotai;
(function (KShotai) {
    KShotai[KShotai["kMincho"] = 0] = "kMincho";
    KShotai[KShotai["kGothic"] = 1] = "kGothic";
})(KShotai = exports.KShotai || (exports.KShotai = {}));
var Kage = (function () {
    function Kage(size) {
        // TODO: must be static
        this.kMincho = KShotai.kMincho;
        this.kGothic = KShotai.kGothic;
        // properties
        this.kShotai = KShotai.kMincho;
        this.kRate = 100; // must divide 1000
        if (size === 1) {
            this.kMinWidthY = 1.2;
            this.kMinWidthT = 3.6;
            this.kWidth = 3;
            this.kKakato = 1.8;
            this.kL2RDfatten = 1.1;
            this.kMage = 6;
            this.kUseCurve = false;
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
        }
        else {
            this.kMinWidthY = 2;
            this.kMinWidthT = 6;
            this.kWidth = 5;
            this.kKakato = 3;
            this.kL2RDfatten = 1.1;
            this.kMage = 10;
            this.kUseCurve = false;
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
        this.kBuhin = new buhin_1.Buhin();
    }
    // method
    Kage.prototype.makeGlyph = function (polygons, buhin) {
        var glyphData = this.kBuhin.search(buhin);
        this.makeGlyph2(polygons, glyphData);
    };
    Kage.prototype.makeGlyph2 = function (polygons, data) {
        var _this = this;
        if (data !== "") {
            var strokesArray = this.adjustKirikuchi(this.adjustUroko2(this.adjustUroko(this.adjustKakato(this.adjustTate(this.adjustMage(this.adjustHane(this.getEachStrokes(data))))))));
            strokesArray.forEach(function (stroke) {
                kagedf_1.dfDrawFont(_this, polygons, stroke[0], stroke[1], stroke[2], stroke[3], stroke[4], stroke[5], stroke[6], stroke[7], stroke[8], stroke[9], stroke[10]);
            });
        }
    };
    Kage.prototype.makeGlyph3 = function (data) {
        var _this = this;
        var result = [];
        if (data !== "") {
            var strokesArray = this.adjustKirikuchi(this.adjustUroko2(this.adjustUroko(this.adjustKakato(this.adjustTate(this.adjustMage(this.adjustHane(this.getEachStrokes(data))))))));
            strokesArray.forEach(function (stroke) {
                var polygons = new polygons_1.Polygons();
                kagedf_1.dfDrawFont(_this, polygons, stroke[0], stroke[1], stroke[2], stroke[3], stroke[4], stroke[5], stroke[6], stroke[7], stroke[8], stroke[9], stroke[10]);
                result.push(polygons);
            });
        }
        return result;
    };
    Kage.prototype.getEachStrokes = function (glyphData) {
        var _this = this;
        var strokesArray = [];
        var strokes = glyphData.split("$");
        strokes.forEach(function (stroke) {
            var columns = stroke.split(":");
            if (Math.floor(+columns[0]) !== 99) {
                strokesArray.push([
                    Math.floor(+columns[0]),
                    Math.floor(+columns[1]),
                    Math.floor(+columns[2]),
                    Math.floor(+columns[3]),
                    Math.floor(+columns[4]),
                    Math.floor(+columns[5]),
                    Math.floor(+columns[6]),
                    Math.floor(+columns[7]),
                    Math.floor(+columns[8]),
                    Math.floor(+columns[9]),
                    Math.floor(+columns[10]),
                ]);
            }
            else {
                var buhin = _this.kBuhin.search(columns[7]);
                if (buhin !== "") {
                    strokesArray = strokesArray.concat(_this.getEachStrokesOfBuhin(buhin, Math.floor(+columns[3]), Math.floor(+columns[4]), Math.floor(+columns[5]), Math.floor(+columns[6]), Math.floor(+columns[1]), Math.floor(+columns[2]), Math.floor(+columns[9]), Math.floor(+columns[10])));
                }
            }
        });
        return strokesArray;
    };
    Kage.prototype.getEachStrokesOfBuhin = function (buhin, x1, y1, x2, y2, sx, sy, sx2, sy2) {
        var _this = this;
        var temp = this.getEachStrokes(buhin);
        var result = [];
        var box = this.getBox(buhin);
        if (sx !== 0 || sy !== 0) {
            if (sx > 100) {
                sx -= 200;
            }
            else {
                sx2 = 0;
                sy2 = 0;
            }
        }
        temp.forEach(function (stroke) {
            if (sx !== 0 || sy !== 0) {
                stroke[3] = _this.stretch(sx, sx2, stroke[3], box.minX, box.maxX);
                stroke[4] = _this.stretch(sy, sy2, stroke[4], box.minY, box.maxY);
                stroke[5] = _this.stretch(sx, sx2, stroke[5], box.minX, box.maxX);
                stroke[6] = _this.stretch(sy, sy2, stroke[6], box.minY, box.maxY);
                if (stroke[0] !== 99) {
                    stroke[7] = _this.stretch(sx, sx2, stroke[7], box.minX, box.maxX);
                    stroke[8] = _this.stretch(sy, sy2, stroke[8], box.minY, box.maxY);
                    stroke[9] = _this.stretch(sx, sx2, stroke[9], box.minX, box.maxX);
                    stroke[10] = _this.stretch(sy, sy2, stroke[10], box.minY, box.maxY);
                }
            }
            result.push([
                stroke[0], stroke[1], stroke[2],
                x1 + stroke[3] * (x2 - x1) / 200,
                y1 + stroke[4] * (y2 - y1) / 200,
                x1 + stroke[5] * (x2 - x1) / 200,
                y1 + stroke[6] * (y2 - y1) / 200,
                x1 + stroke[7] * (x2 - x1) / 200,
                y1 + stroke[8] * (y2 - y1) / 200,
                x1 + stroke[9] * (x2 - x1) / 200,
                y1 + stroke[10] * (y2 - y1) / 200,
            ]);
        });
        return result;
    };
    Kage.prototype.getBox = function (glyph) {
        var minX = 200;
        var minY = 200;
        var maxX = 0;
        var maxY = 0;
        var strokes = this.getEachStrokes(glyph);
        strokes.forEach(function (stroke) {
            if (stroke[0] === 0) {
                return;
            }
            minX = Math.min(minX, stroke[3], stroke[5]);
            maxX = Math.max(maxX, stroke[3], stroke[5]);
            minY = Math.min(minY, stroke[4], stroke[6]);
            maxY = Math.max(maxY, stroke[4], stroke[6]);
            if (stroke[0] === 1) {
                return;
            }
            if (stroke[0] === 99) {
                return;
            }
            minX = Math.min(minX, stroke[7]);
            maxX = Math.max(maxX, stroke[7]);
            minY = Math.min(minY, stroke[8]);
            maxY = Math.max(maxY, stroke[8]);
            if (stroke[0] === 2 || stroke[0] === 3 || stroke[0] === 4) {
                return;
            }
            minX = Math.min(minX, stroke[9]);
            maxX = Math.max(maxX, stroke[9]);
            minY = Math.min(minY, stroke[10]);
            maxY = Math.max(maxY, stroke[10]);
        });
        return {
            minX: minX,
            maxX: maxX,
            minY: minY,
            maxY: maxY,
        };
    };
    Kage.prototype.stretch = function (dp, sp, p, min, max) {
        var p1;
        var p2;
        var p3;
        var p4;
        if (p < sp + 100) {
            p1 = min;
            p3 = min;
            p2 = sp + 100;
            p4 = dp + 100;
        }
        else {
            p1 = sp + 100;
            p3 = dp + 100;
            p2 = max;
            p4 = max;
        }
        return Math.floor(((p - p1) / (p2 - p1)) * (p4 - p3) + p3);
    };
    Kage.prototype.adjustHane = function (strokesArray) {
        strokesArray.forEach(function (stroke, i) {
            if ((stroke[0] === 1 || stroke[0] === 2 || stroke[0] === 6) && stroke[2] === 4) {
                var lpx_1; // lastPointX
                var lpy_1; // lastPointY
                if (stroke[0] === 1) {
                    lpx_1 = stroke[5];
                    lpy_1 = stroke[6];
                }
                else if (stroke[0] === 2) {
                    lpx_1 = stroke[7];
                    lpy_1 = stroke[8];
                }
                else {
                    lpx_1 = stroke[9];
                    lpy_1 = stroke[10];
                }
                var mn_1 = Infinity; // mostNear
                if (lpx_1 + 18 < 100) {
                    mn_1 = lpx_1 + 18;
                }
                strokesArray.forEach(function (stroke2, j) {
                    if (i !== j
                        && stroke2[0] === 1
                        && stroke2[3] === stroke2[5] && stroke2[3] < lpx_1
                        && stroke2[4] <= lpy_1 && stroke2[6] >= lpy_1) {
                        if (lpx_1 - stroke2[3] < 100) {
                            mn_1 = Math.min(mn_1, lpx_1 - stroke2[3]);
                        }
                    }
                });
                if (mn_1 !== Infinity) {
                    stroke[2] += 700 - Math.floor(mn_1 / 15) * 100; // 0-99 -> 0-700
                }
            }
        });
        return strokesArray;
    };
    Kage.prototype.adjustUroko = function (strokesArray) {
        var _this = this;
        strokesArray.forEach(function (stroke, i) {
            if (stroke[0] === 1 && stroke[2] === 0) {
                for (var k = 0; k < _this.kAdjustUrokoLengthStep; k++) {
                    var tx = void 0;
                    var ty = void 0;
                    var tlen = void 0;
                    if (stroke[4] === stroke[6]) {
                        tx = stroke[5] - _this.kAdjustUrokoLine[k];
                        ty = stroke[6] - 0.5;
                        tlen = stroke[5] - stroke[3];
                    }
                    else {
                        var rad = Math.atan((stroke[6] - stroke[4]) / (stroke[5] - stroke[3]));
                        tx = stroke[5] - _this.kAdjustUrokoLine[k] * Math.cos(rad) - 0.5 * Math.sin(rad);
                        ty = stroke[6] - _this.kAdjustUrokoLine[k] * Math.sin(rad) - 0.5 * Math.cos(rad);
                        tlen = util_1.hypot(stroke[6] - stroke[4], stroke[5] - stroke[3]);
                    }
                    if (tlen < _this.kAdjustUrokoLength[k]
                        || _2d_1.isCrossWithOthers(strokesArray, i, tx, ty, stroke[5], stroke[6])) {
                        stroke[2] += (_this.kAdjustUrokoLengthStep - k) * 100;
                        break;
                    }
                }
            }
        });
        return strokesArray;
    };
    Kage.prototype.adjustUroko2 = function (strokesArray) {
        var _this = this;
        strokesArray.forEach(function (stroke, i) {
            if (stroke[0] === 1 && stroke[2] === 0 && stroke[4] === stroke[6]) {
                var pressure_1 = 0;
                strokesArray.forEach(function (stroke2, j) {
                    if (i !== j && ((stroke2[0] === 1
                        && stroke2[4] === stroke2[6]
                        && !(stroke[3] + 1 > stroke2[5] || stroke[5] - 1 < stroke2[3])
                        && Math.abs(stroke[4] - stroke2[4]) < _this.kAdjustUroko2Length) || (stroke2[0] === 3
                        && stroke2[6] === stroke2[8]
                        && !(stroke[3] + 1 > stroke2[7] || stroke[5] - 1 < stroke2[5])
                        && Math.abs(stroke[4] - stroke2[6]) < _this.kAdjustUroko2Length))) {
                        pressure_1 += Math.pow((_this.kAdjustUroko2Length - Math.abs(stroke[4] - stroke2[6])), 1.1);
                    }
                });
                var result = Math.min(Math.floor(pressure_1 / _this.kAdjustUroko2Length), _this.kAdjustUroko2Step) * 100;
                if (stroke[2] < result) {
                    stroke[2] = stroke[2] % 100
                        + Math.min(Math.floor(pressure_1 / _this.kAdjustUroko2Length), _this.kAdjustUroko2Step) * 100;
                }
            }
        });
        return strokesArray;
    };
    Kage.prototype.adjustTate = function (strokesArray) {
        var _this = this;
        strokesArray.forEach(function (stroke, i) {
            if ((stroke[0] === 1 || stroke[0] === 3 || stroke[0] === 7)
                && stroke[3] === stroke[5]) {
                strokesArray.forEach(function (stroke2, j) {
                    if (i !== j
                        && (stroke2[0] === 1 || stroke2[0] === 3 || stroke2[0] === 7)
                        && stroke2[3] === stroke2[5]
                        && !(stroke[4] + 1 > stroke2[6] || stroke[6] - 1 < stroke2[4])
                        && Math.abs(stroke[3] - stroke2[3]) < _this.kMinWidthT * _this.kAdjustTateStep) {
                        stroke[1] += (_this.kAdjustTateStep - Math.floor(Math.abs(stroke[3] - stroke2[3]) / _this.kMinWidthT)) * 1000;
                        if (stroke[1] > _this.kAdjustTateStep * 1000) {
                            stroke[1] = stroke[1] % 1000 + _this.kAdjustTateStep * 1000;
                        }
                    }
                });
            }
        });
        return strokesArray;
    };
    Kage.prototype.adjustMage = function (strokesArray) {
        var _this = this;
        strokesArray.forEach(function (stroke, i) {
            if (stroke[0] === 3 && stroke[6] === stroke[8]) {
                strokesArray.forEach(function (stroke2, j) {
                    if (i !== j && ((stroke2[0] === 1
                        && stroke2[4] === stroke2[6]
                        && !(stroke[5] + 1 > stroke2[5] || stroke[7] - 1 < stroke2[3])
                        && Math.abs(stroke[6] - stroke2[4]) < _this.kMinWidthT * _this.kAdjustMageStep) || (stroke2[0] === 3
                        && stroke2[6] === stroke2[8]
                        && !(stroke[5] + 1 > stroke2[7] || stroke[7] - 1 < stroke2[5])
                        && Math.abs(stroke[6] - stroke2[6]) < _this.kMinWidthT * _this.kAdjustMageStep))) {
                        stroke[2] += (_this.kAdjustMageStep - Math.floor(Math.abs(stroke[6] - stroke2[6]) / _this.kMinWidthT)) * 1000;
                        if (stroke[2] > _this.kAdjustMageStep * 1000) {
                            stroke[2] = stroke[2] % 1000 + _this.kAdjustMageStep * 1000;
                        }
                    }
                });
            }
        });
        return strokesArray;
    };
    Kage.prototype.adjustKirikuchi = function (strokesArray) {
        strokesArray.forEach(function (stroke) {
            if (stroke[0] === 2 && stroke[1] === 32
                && stroke[3] > stroke[5] && stroke[4] < stroke[6]) {
                for (var _i = 0, strokesArray_1 = strokesArray; _i < strokesArray_1.length; _i++) {
                    var stroke2 = strokesArray_1[_i];
                    if (stroke2[0] === 1
                        && stroke2[3] < stroke[3] && stroke2[5] > stroke[3]
                        && stroke2[4] === stroke[4] && stroke2[4] === stroke2[6]) {
                        stroke[1] = 132;
                        break;
                    }
                }
            }
        });
        return strokesArray;
    };
    Kage.prototype.adjustKakato = function (strokesArray) {
        var _this = this;
        strokesArray.forEach(function (stroke, i) {
            if (stroke[0] === 1
                && (stroke[2] === 13 || stroke[2] === 23)) {
                for (var k = 0; k < _this.kAdjustKakatoStep; k++) {
                    if (_2d_1.isCrossBoxWithOthers(strokesArray, i, stroke[5] - _this.kAdjustKakatoRangeX / 2, stroke[6] + _this.kAdjustKakatoRangeY[k], stroke[5] + _this.kAdjustKakatoRangeX / 2, stroke[6] + _this.kAdjustKakatoRangeY[k + 1])
                        || stroke[6] + _this.kAdjustKakatoRangeY[k + 1] > 200 // adjust for baseline
                        || stroke[6] - stroke[4] < _this.kAdjustKakatoRangeY[k + 1] // for thin box
                    ) {
                        stroke[2] += (3 - k) * 100;
                        break;
                    }
                }
            }
        });
        return strokesArray;
    };
    return Kage;
}());
exports.Kage = Kage;

},{"./2d":1,"./buhin":3,"./kagedf":8,"./polygons":10,"./util":11}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var curve_1 = require("./curve");
var kage_1 = require("./kage");
var polygon_1 = require("./polygon");
var util_1 = require("./util");
function cdDrawCurveU(kage, polygons, x1, y1, sx1, sy1, sx2, sy2, x2, y2, ta1, ta2) {
    if (kage.kShotai === kage.kMincho) {
        var a1 = ta1 % 1000;
        var a2 = ta2 % 100;
        var opt1 = Math.floor((ta1 % 10000) / 1000);
        var opt2 = Math.floor((ta2 % 1000) / 100);
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
            case 32:// changed
                delta = 0;
                break;
            case 12:
                // case 32:
                delta = kage.kMinWidthY;
                break;
            default:
                return;
        }
        var _a = (x1 === sx1 && y1 === sy1)
            ? [0, delta] // ?????
            : util_1.normalize([x1 - sx1, y1 - sy1], delta), dx1 = _a[0], dy1 = _a[1];
        x1 += dx1;
        y1 += dy1;
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
            case 8:// get shorten for tail's circle
                delta = -1 * kMinWidthT * 0.5;
                break;
            default:
                break;
        }
        var _b = (sx2 === x2 && sy2 === y2)
            ? [0, -delta] // ?????
            : util_1.normalize([x2 - sx2, y2 - sy2], delta), dx2 = _b[0], dy2 = _b[1];
        x2 += dx2;
        y2 += dy2;
        var hosomi = 0.5;
        if (util_1.hypot(x2 - x1, y2 - y1) < 50) {
            hosomi += 0.4 * (1 - util_1.hypot(x2 - x1, y2 - y1) / 50);
        }
        // ---------------------------------------------------------------
        if (sx1 === sx2 && sy1 === sy2) {
            if (kage.kUseCurve) {
                var poly = new polygon_1.Polygon();
                var poly2 = new polygon_1.Polygon();
                // generating fatten curve -- begin
                var kage2 = new kage_1.Kage();
                kage2.kMinWidthY = kage.kMinWidthY;
                kage2.kMinWidthT = kMinWidthT;
                kage2.kWidth = kage.kWidth;
                kage2.kKakato = kage.kKakato;
                kage2.kRate = 10;
                var _c = curve_1.get_candidate(kage2, a1, a2, x1, y1, sx1, sy1, x2, y2, opt3, opt4), curveL = _c[0], curveR = _c[1]; // L and R
                var _d = curve_1.divide_curve(kage2, x1, y1, sx1, sy1, x2, y2, curveL), _e = _d.off, offL1 = _e[0], offL2 = _e[1], indexL = _d.index;
                var curveL1 = curveL.slice(0, indexL + 1);
                var curveL2 = curveL.slice(indexL);
                var _f = curve_1.divide_curve(kage2, x1, y1, sx1, sy1, x2, y2, curveR), _g = _f.off, offR1 = _g[0], offR2 = _g[1], indexR = _f.index;
                var ncl1 = curve_1.find_offcurve(kage2, curveL1, offL1[2], offL1[3]);
                var ncl2 = curve_1.find_offcurve(kage2, curveL2, offL2[2], offL2[3]);
                poly.push(ncl1[0], ncl1[1]);
                poly.push(ncl1[2], ncl1[3], true);
                poly.push(ncl1[4], ncl1[5]);
                poly.push(ncl2[2], ncl2[3], true);
                poly.push(ncl2[4], ncl2[5]);
                poly2.push(curveR[0][0], curveR[0][1]);
                poly2.push(offR1[2] - (ncl1[2] - offL1[2]), offL1[3] - (ncl1[3] - offL1[3]), true); // typo?
                poly2.push(curveR[indexR][0], curveR[indexR][1]);
                poly2.push(offR2[2] - (ncl2[2] - offL2[2]), offL2[3] - (ncl2[3] - offL2[3]), true); // typo?
                poly2.push(curveR[curveR.length - 1][0], curveR[curveR.length - 1][1]);
                poly2.reverse();
                poly.concat(poly2);
                polygons.push(poly);
                // generating fatten curve -- end
            }
            else {
                var poly = new polygon_1.Polygon();
                var poly2 = new polygon_1.Polygon();
                for (var tt = 0; tt <= 1000; tt += kage.kRate) {
                    var t = tt / 1000;
                    // calculate a dot
                    var x = util_1.quadraticBezier(x1, sx1, x2, t);
                    var y = util_1.quadraticBezier(y1, sy1, y2, t);
                    // KATAMUKI of vector by BIBUN
                    var ix = util_1.quadraticBezierDeriv(x1, sx1, x2, t);
                    var iy = util_1.quadraticBezierDeriv(y1, sy1, y2, t);
                    var deltad = a1 === 7 && a2 === 0 // L2RD: fatten
                        ? Math.pow(t, hosomi) * kage.kL2RDfatten
                        : a1 === 7
                            ? Math.pow(t, hosomi)
                            : a2 === 7
                                ? Math.pow((1 - t), hosomi)
                                : opt3 > 0 || opt4 > 0
                                    ? ((kage.kMinWidthT - opt3 / 2) - (opt4 - opt3) / 2 * t) / kage.kMinWidthT
                                    : 1;
                    if (deltad < 0.15) {
                        deltad = 0.15;
                    }
                    // line SUICHOKU by vector
                    var _h = (ix === 0)
                        ? [-kMinWidthT * deltad, 0] // ?????
                        : util_1.normalize([-iy, ix], kMinWidthT * deltad), ia = _h[0], ib = _h[1];
                    // copy to polygon structure
                    poly.push(x - ia, y - ib);
                    poly2.push(x + ia, y + ib);
                }
                // suiheisen ni setsuzoku
                if (a1 === 132) {
                    var index = 0;
                    for (; index + 1 < poly2.array.length; index++) {
                        if (poly2.array[index].y <= y1 && y1 <= poly2.array[index + 1].y) {
                            break;
                        }
                    }
                    var newx1 = poly2.array[index + 1].x
                        + (poly2.array[index].x - poly2.array[index + 1].x) * (poly2.array[index + 1].y - y1)
                            / (poly2.array[index + 1].y - poly2.array[index].y);
                    var newy1 = y1;
                    var newx2 = poly.array[0].x
                        + (poly.array[0].x - poly.array[1].x) * (poly.array[0].y - y1)
                            / (poly.array[1].y - poly.array[0].y);
                    var newy2 = y1;
                    for (var i = 0; i < index; i++) {
                        poly2.shift();
                    }
                    poly2.set(0, newx1, newy1);
                    poly.unshift(newx2, newy2);
                }
                // suiheisen ni setsuzoku 2
                if (a1 === 22 && y1 > y2) {
                    var index = 0;
                    for (; index + 1 < poly2.array.length; index++) {
                        if (poly2.array[index].y <= y1 && y1 <= poly2.array[index + 1].y) {
                            break;
                        }
                    }
                    var newx1 = poly2.array[index + 1].x
                        + (poly2.array[index].x - poly2.array[index + 1].x) * (poly2.array[index + 1].y - y1)
                            / (poly2.array[index + 1].y - poly2.array[index].y);
                    var newy1 = y1;
                    var newx2 = poly.array[0].x
                        + (poly.array[0].x - poly.array[1].x - 1) * (poly.array[0].y - y1)
                            / (poly.array[1].y - poly.array[0].y);
                    var newy2 = y1 + 1;
                    for (var i = 0; i < index; i++) {
                        poly2.shift();
                    }
                    poly2.set(0, newx1, newy1);
                    poly.unshift(newx2, newy2);
                }
                poly2.reverse();
                poly.concat(poly2);
                polygons.push(poly);
            }
        }
        else {
            var poly = new polygon_1.Polygon();
            var poly2 = new polygon_1.Polygon();
            for (var tt = 0; tt <= 1000; tt += kage.kRate) {
                var t = tt / 1000;
                // calculate a dot
                var x = util_1.cubicBezier(x1, sx1, sx2, x2, t);
                var y = util_1.cubicBezier(y1, sy1, sy2, y2, t);
                // KATAMUKI of vector by BIBUN
                var ix = util_1.cubicBezierDeriv(x1, sx1, sx2, x2, t);
                var iy = util_1.cubicBezierDeriv(y1, sy1, sy2, y2, t);
                var deltad = a1 === 7 && a2 === 0 // L2RD: fatten
                    ? Math.pow(t, hosomi) * kage.kL2RDfatten
                    : a1 === 7
                        ? Math.pow((Math.pow(t, hosomi)), 0.7) // make fatten
                        : a2 === 7
                            ? Math.pow((1 - t), hosomi)
                            : 1;
                if (deltad < 0.15) {
                    deltad = 0.15;
                }
                // line SUICHOKU by vector
                var _j = (ix === 0)
                    ? [-kMinWidthT * deltad, 0] // ?????
                    : util_1.normalize([-iy, ix], kMinWidthT * deltad), ia = _j[0], ib = _j[1];
                // copy to polygon structure
                poly.push(x - ia, y - ib);
                poly2.push(x + ia, y + ib);
            }
            // suiheisen ni setsuzoku
            if (a1 === 132) {
                var index = 0;
                for (; index + 1 < poly2.array.length; index++) {
                    if (poly2.array[index].y <= y1 && y1 <= poly2.array[index + 1].y) {
                        break;
                    }
                }
                var newx1 = poly2.array[index + 1].x
                    + (poly2.array[index].x - poly2.array[index + 1].x) * (poly2.array[index + 1].y - y1)
                        / (poly2.array[index + 1].y - poly2.array[index].y);
                var newy1 = y1;
                var newx2 = poly.array[0].x
                    + (poly.array[0].x - poly.array[1].x) * (poly.array[0].y - y1)
                        / (poly.array[1].y - poly.array[0].y);
                var newy2 = y1;
                for (var i = 0; i < index; i++) {
                    poly2.shift();
                }
                poly2.set(0, newx1, newy1);
                poly.unshift(newx2, newy2);
            }
            // suiheisen ni setsuzoku 2
            if (a1 === 22) {
                if (x1 > sx1) {
                    var index = 0;
                    for (; index + 1 < poly2.array.length; index++) {
                        if (poly2.array[index].y <= y1 && y1 <= poly2.array[index + 1].y) {
                            break;
                        }
                    }
                    var newx1 = poly2.array[index + 1].x
                        + (poly2.array[index].x - poly2.array[index + 1].x) * (poly2.array[index + 1].y - y1)
                            / (poly2.array[index + 1].y - poly2.array[index].y);
                    var newy1 = y1;
                    var newx2 = poly.array[0].x
                        + (poly.array[0].x - poly.array[1].x - 1) * (poly.array[0].y - y1)
                            / (poly.array[1].y - poly.array[0].y);
                    var newy2 = y1 + 1;
                    for (var i = 0; i < index; i++) {
                        poly2.shift();
                    }
                    poly2.set(0, newx1, newy1);
                    poly.unshift(newx2, newy2);
                }
            }
            poly2.reverse();
            poly.concat(poly2);
            polygons.push(poly);
        }
        // process for head of stroke
        var rad1 = Math.atan2(sy1 - y1, sx1 - x1);
        var XX = Math.sin(rad1);
        var XY = -Math.cos(rad1);
        var YX = Math.cos(rad1);
        var YY = Math.sin(rad1);
        if (a1 === 12) {
            if (x1 === x2) {
                var poly = new polygon_1.Polygon();
                poly.push(x1 - kMinWidthT, y1);
                poly.push(x1 + kMinWidthT, y1);
                poly.push(x1 - kMinWidthT, y1 - kMinWidthT);
                polygons.push(poly);
            }
            else {
                var poly = new polygon_1.Polygon();
                poly.push(x1 - kMinWidthT * XX, y1 - kMinWidthT * XY);
                poly.push(x1 + kMinWidthT * XX, y1 + kMinWidthT * XY);
                poly.push(x1 - kMinWidthT * XX - kMinWidthT * YX, y1 - kMinWidthT * XY - kMinWidthT * YY);
                polygons.push(poly);
            }
        }
        if (a1 === 0) {
            if (y1 <= y2) {
                var type = (Math.atan2(Math.abs(y1 - sy1), Math.abs(x1 - sx1)) / Math.PI * 2 - 0.4);
                if (type > 0) {
                    type *= 2;
                }
                else {
                    type *= 16;
                }
                var pm = type < 0 ? -1 : 1;
                if (x1 === sx1) {
                    var poly = new polygon_1.Polygon();
                    poly.push(x1 - kMinWidthT, y1 + 1);
                    poly.push(x1 + kMinWidthT, y1);
                    poly.push(x1 - kMinWidthT * pm, y1 - kage.kMinWidthY * type * pm);
                    // if(x1 > x2){
                    //  poly.reverse();
                    // }
                    polygons.push(poly);
                }
                else {
                    var poly = new polygon_1.Polygon();
                    poly.push(x1 - kMinWidthT * XX + 1 * YX, y1 - kMinWidthT * XY + 1 * YY);
                    poly.push(x1 + kMinWidthT * XX, y1 + kMinWidthT * XY);
                    poly.push(x1 - kMinWidthT * pm * XX - kage.kMinWidthY * type * pm * YX, y1 - kMinWidthT * pm * XY - kage.kMinWidthY * type * pm * YY);
                    // if(x1 > x2){
                    //  poly.reverse();
                    // }
                    polygons.push(poly);
                }
                // beginning of the stroke
                if (pm > 0) {
                    type = 0;
                }
                var move = kage.kMinWidthY * type * pm;
                if (x1 === sx1) {
                    var poly = new polygon_1.Polygon();
                    poly.push(x1 + kMinWidthT, y1 - move);
                    poly.push(x1 + kMinWidthT * 1.5, y1 + kage.kMinWidthY - move);
                    poly.push(x1 + kMinWidthT - 2, y1 + kage.kMinWidthY * 2 + 1);
                    polygons.push(poly);
                }
                else {
                    var poly = new polygon_1.Polygon();
                    poly.push(x1 + kMinWidthT * XX - move * YX, y1 + kMinWidthT * XY - move * YY);
                    poly.push(x1 + kMinWidthT * 1.5 * XX + (kage.kMinWidthY - move * 1.2) * YX, y1 + kMinWidthT * 1.5 * XY + (kage.kMinWidthY - move * 1.2) * YY);
                    poly.push(x1 + (kMinWidthT - 2) * XX + (kage.kMinWidthY * 2 - move * 0.8 + 1) * YX, y1 + (kMinWidthT - 2) * XY + (kage.kMinWidthY * 2 - move * 0.8 + 1) * YY);
                    // if(x1 < x2){
                    //  poly.reverse();
                    // }
                    polygons.push(poly);
                }
            }
            else {
                if (x1 === sx1) {
                    var poly = new polygon_1.Polygon();
                    poly.push(x1 - kMinWidthT, y1);
                    poly.push(x1 + kMinWidthT, y1);
                    poly.push(x1 + kMinWidthT, y1 - kage.kMinWidthY);
                    polygons.push(poly);
                }
                else {
                    var poly = new polygon_1.Polygon();
                    poly.push(x1 - kMinWidthT * XX, y1 - kMinWidthT * XY);
                    poly.push(x1 + kMinWidthT * XX, y1 + kMinWidthT * XY);
                    poly.push(x1 + kMinWidthT * XX - kage.kMinWidthY * YX, y1 + kMinWidthT * XY - kage.kMinWidthY * YY);
                    // if(x1 < x2){
                    //  poly.reverse();
                    // }
                    polygons.push(poly);
                }
                // beginning of the stroke
                if (x1 === sx1) {
                    var poly = new polygon_1.Polygon();
                    poly.push(x1 - kMinWidthT, y1);
                    poly.push(x1 - kMinWidthT * 1.5, y1 + kage.kMinWidthY);
                    poly.push(x1 - kMinWidthT * 0.5, y1 + kage.kMinWidthY * 3);
                    polygons.push(poly);
                }
                else {
                    var poly = new polygon_1.Polygon();
                    poly.push(x1 - kMinWidthT * XX, y1 - kMinWidthT * XY);
                    poly.push(x1 - kMinWidthT * 1.5 * XX + kage.kMinWidthY * YX, y1 + kage.kMinWidthY * YY - kMinWidthT * 1.5 * XY);
                    poly.push(x1 - kMinWidthT * 0.5 * XX + kage.kMinWidthY * 3 * YX, y1 + kage.kMinWidthY * 3 * YY - kMinWidthT * 0.5 * XY);
                    // if(x1 < x2){
                    //  poly.reverse();
                    // }
                    polygons.push(poly);
                }
            }
        }
        if (a1 === 22) {
            var poly = new polygon_1.Polygon();
            poly.push(x1 - kMinWidthT, y1 - kage.kMinWidthY);
            poly.push(x1, y1 - kage.kMinWidthY - kage.kWidth);
            poly.push(x1 + kMinWidthT + kage.kWidth, y1 + kage.kMinWidthY);
            poly.push(x1 + kMinWidthT, y1 + kMinWidthT - 1);
            poly.push(x1 - kMinWidthT, y1 + kMinWidthT + 4);
            polygons.push(poly);
        }
        // process for tail
        var rad2 = Math.atan2(y2 - sy2, x2 - sx2);
        if (a2 === 1 || a2 === 8 || a2 === 15) {
            if (sx2 === x2) {
                var poly = new polygon_1.Polygon();
                if (kage.kUseCurve) {
                    // by curve path
                    poly.push(x2 - kMinWidthT2, y2);
                    poly.push(x2 - kMinWidthT2 * 0.9, y2 + kMinWidthT2 * 0.9, true);
                    poly.push(x2, y2 + kMinWidthT2);
                    poly.push(x2 + kMinWidthT2 * 0.9, y2 + kMinWidthT2 * 0.9, true);
                    poly.push(x2 + kMinWidthT2, y2);
                }
                else {
                    // by polygon
                    poly.push(x2 - kMinWidthT2, y2);
                    poly.push(x2 - kMinWidthT2 * 0.7, y2 + kMinWidthT2 * 0.7);
                    poly.push(x2, y2 + kMinWidthT2);
                    poly.push(x2 + kMinWidthT2 * 0.7, y2 + kMinWidthT2 * 0.7);
                    poly.push(x2 + kMinWidthT2, y2);
                }
                polygons.push(poly);
            }
            else if (sy2 === y2) {
                var poly = new polygon_1.Polygon();
                if (kage.kUseCurve) {
                    // by curve path
                    poly.push(x2, y2 - kMinWidthT2);
                    poly.push(x2 + kMinWidthT2 * 0.9, y2 - kMinWidthT2 * 0.9, true);
                    poly.push(x2 + kMinWidthT2, y2);
                    poly.push(x2 + kMinWidthT2 * 0.9, y2 + kMinWidthT2 * 0.9, true);
                    poly.push(x2, y2 + kMinWidthT2);
                }
                else {
                    // by polygon
                    poly.push(x2, y2 - kMinWidthT2);
                    poly.push(x2 + kMinWidthT2 * 0.7, y2 - kMinWidthT2 * 0.7);
                    poly.push(x2 + kMinWidthT2, y2);
                    poly.push(x2 + kMinWidthT2 * 0.7, y2 + kMinWidthT2 * 0.7);
                    poly.push(x2, y2 + kMinWidthT2);
                }
                polygons.push(poly);
            }
            else {
                var poly = new polygon_1.Polygon();
                if (kage.kUseCurve) {
                    poly.push(x2 + Math.sin(rad2) * kMinWidthT2, y2 - Math.cos(rad2) * kMinWidthT2);
                    poly.push(x2 + Math.cos(rad2) * kMinWidthT2 * 0.9 + Math.sin(rad2) * kMinWidthT2 * 0.9, y2 + Math.sin(rad2) * kMinWidthT2 * 0.9 - Math.cos(rad2) * kMinWidthT2 * 0.9, true);
                    poly.push(x2 + Math.cos(rad2) * kMinWidthT2, y2 + Math.sin(rad2) * kMinWidthT2);
                    poly.push(x2 + Math.cos(rad2) * kMinWidthT2 * 0.9 - Math.sin(rad2) * kMinWidthT2 * 0.9, y2 + Math.sin(rad2) * kMinWidthT2 * 0.9 + Math.cos(rad2) * kMinWidthT2 * 0.9, true);
                    poly.push(x2 - Math.sin(rad2) * kMinWidthT2, y2 + Math.cos(rad2) * kMinWidthT2);
                }
                else {
                    poly.push(x2 + Math.sin(rad2) * kMinWidthT2, y2 - Math.cos(rad2) * kMinWidthT2);
                    poly.push(x2 + Math.cos(rad2) * kMinWidthT2 * 0.7 + Math.sin(rad2) * kMinWidthT2 * 0.7, y2 + Math.sin(rad2) * kMinWidthT2 * 0.7 - Math.cos(rad2) * kMinWidthT2 * 0.7);
                    poly.push(x2 + Math.cos(rad2) * kMinWidthT2, y2 + Math.sin(rad2) * kMinWidthT2);
                    poly.push(x2 + Math.cos(rad2) * kMinWidthT2 * 0.7 - Math.sin(rad2) * kMinWidthT2 * 0.7, y2 + Math.sin(rad2) * kMinWidthT2 * 0.7 + Math.cos(rad2) * kMinWidthT2 * 0.7);
                    poly.push(x2 - Math.sin(rad2) * kMinWidthT2, y2 + Math.cos(rad2) * kMinWidthT2);
                }
                polygons.push(poly);
            }
        }
        if (a2 === 9 || (a1 === 7 && a2 === 0)) {
            var type2 = (Math.atan2(Math.abs(y2 - sy2), Math.abs(x2 - sx2)) / Math.PI * 2 - 0.6);
            if (type2 > 0) {
                type2 *= 8;
            }
            else {
                type2 *= 3;
            }
            var pm2 = type2 < 0 ? -1 : 1;
            if (sy2 === y2) {
                var poly = new polygon_1.Polygon();
                poly.push(x2, y2 + kMinWidthT * kage.kL2RDfatten);
                poly.push(x2, y2 - kMinWidthT * kage.kL2RDfatten);
                poly.push(x2 + kMinWidthT * kage.kL2RDfatten * Math.abs(type2), y2 + kMinWidthT * kage.kL2RDfatten * pm2);
                polygons.push(poly);
            }
            else {
                var poly = new polygon_1.Polygon();
                var YX2 = -Math.sin(rad2);
                var YY2 = Math.cos(rad2);
                var XX2 = Math.cos(rad2);
                var XY2 = Math.sin(rad2);
                poly.push(x2 + kMinWidthT * kage.kL2RDfatten * YX2, y2 + kMinWidthT * kage.kL2RDfatten * YY2);
                poly.push(x2 - kMinWidthT * kage.kL2RDfatten * YX2, y2 - kMinWidthT * kage.kL2RDfatten * YY2);
                poly.push(x2 + kMinWidthT * kage.kL2RDfatten * Math.abs(type2) * XX2 + kMinWidthT * kage.kL2RDfatten * pm2 * YX2, y2 + kMinWidthT * kage.kL2RDfatten * Math.abs(type2) * XY2 + kMinWidthT * kage.kL2RDfatten * pm2 * YY2);
                polygons.push(poly);
            }
        }
        if (a2 === 15) {
            // anytime same degree
            var poly = new polygon_1.Polygon();
            if (y1 < y2) {
                poly.push(x2, y2 - kMinWidthT + 1);
                poly.push(x2 + 2, y2 - kMinWidthT - kage.kWidth * 5);
                poly.push(x2, y2 - kMinWidthT - kage.kWidth * 5);
                poly.push(x2 - kMinWidthT, y2 - kMinWidthT + 1);
            }
            else {
                poly.push(x2, y2 + kMinWidthT - 1);
                poly.push(x2 - 2, y2 + kMinWidthT + kage.kWidth * 5);
                poly.push(x2, y2 + kMinWidthT + kage.kWidth * 5);
                poly.push(x2 + kMinWidthT, y2 + kMinWidthT - 1);
            }
            polygons.push(poly);
        }
        if (a2 === 14) {
            var poly = new polygon_1.Polygon();
            poly.push(x2, y2);
            poly.push(x2, y2 - kMinWidthT);
            poly.push(x2 - kage.kWidth * 4 * Math.min(1 - opt2 / 10, Math.pow((kMinWidthT / kage.kMinWidthT), 3)), y2 - kMinWidthT);
            poly.push(x2 - kage.kWidth * 4 * Math.min(1 - opt2 / 10, Math.pow((kMinWidthT / kage.kMinWidthT), 3)), y2 - kMinWidthT * 0.5);
            // poly.reverse();
            polygons.push(poly);
        }
    }
    else {
        var a1 = ta1 % 1000;
        var a2 = ta2 % 100;
        if (a1 % 10 === 2) {
            var _k = (x1 === sx1 && y1 === sy1)
                ? [0, kage.kWidth] // ?????
                : util_1.normalize([x1 - sx1, y1 - sy1], kage.kWidth), dx1 = _k[0], dy1 = _k[1];
            x1 += dx1;
            y1 += dy1;
        }
        if (a1 % 10 === 3) {
            var _l = (x1 === sx1 && y1 === sy1)
                ? [0, kage.kWidth * kage.kKakato] // ?????
                : util_1.normalize([x1 - sx1, y1 - sy1], kage.kWidth * kage.kKakato), dx1 = _l[0], dy1 = _l[1];
            x1 += dx1;
            y1 += dy1;
        }
        if (a2 % 10 === 2) {
            var _m = (sx2 === x2 && sy2 === y2)
                ? [0, -kage.kWidth] // ?????
                : util_1.normalize([x2 - sx2, y2 - sy2], kage.kWidth), dx2 = _m[0], dy2 = _m[1];
            x2 += dx2;
            y2 += dy2;
        }
        if (a2 % 10 === 3) {
            var _o = (sx2 === x2 && sy2 === y2)
                ? [0, -kage.kWidth * kage.kKakato] // ?????
                : util_1.normalize([x2 - sx2, y2 - sy2], kage.kWidth * kage.kKakato), dx2 = _o[0], dy2 = _o[1];
            x2 += dx2;
            y2 += dy2;
        }
        var poly = new polygon_1.Polygon();
        var poly2 = new polygon_1.Polygon();
        var x = void 0;
        var y = void 0;
        var ix = void 0;
        var iy = void 0;
        for (var tt = 0; tt <= 1000; tt += kage.kRate) {
            var t = tt / 1000;
            if (sx1 === sx2 && sy1 === sy2) {
                // calculating each point
                x = util_1.quadraticBezier(x1, sx1, x2, t);
                y = util_1.quadraticBezier(y1, sy1, y2, t);
                // SESSEN NO KATAMUKI NO KEISAN(BIBUN)
                ix = util_1.quadraticBezierDeriv(x1, sx1, x2, t);
                iy = util_1.quadraticBezierDeriv(y1, sy1, y2, t);
            }
            else {
                // calculate a dot
                x = util_1.cubicBezier(x1, sx1, sx2, x2, t);
                y = util_1.cubicBezier(y1, sy1, sy2, y2, t);
                // KATAMUKI of vector by BIBUN
                ix = util_1.cubicBezierDeriv(x1, sx1, sx2, x2, t);
                iy = util_1.cubicBezierDeriv(y1, sy1, sy2, y2, t);
            }
            // SESSEN NI SUICHOKU NA CHOKUSEN NO KEISAN
            var _p = (kage.kShotai === kage.kMincho) // always false ?
                ? (ix === 0)
                    ? [-kage.kMinWidthT * Math.sqrt(1 - t), 0] // ?????
                    : util_1.normalize([-iy, ix], kage.kMinWidthT * Math.sqrt(1 - t))
                : (ix === 0)
                    ? [-kage.kWidth, 0] // ?????
                    : util_1.normalize([-iy, ix], kage.kWidth), ia = _p[0], ib = _p[1];
            // save to polygon
            poly.push(x - ia, y - ib);
            poly2.push(x + ia, y + ib);
        }
        poly2.reverse();
        poly.concat(poly2);
        polygons.push(poly);
    }
}
function cdDrawBezier(kage, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a1, a2) {
    cdDrawCurveU(kage, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a1, a2);
}
exports.cdDrawBezier = cdDrawBezier;
function cdDrawCurve(kage, polygons, x1, y1, x2, y2, x3, y3, a1, a2) {
    cdDrawCurveU(kage, polygons, x1, y1, x2, y2, x2, y2, x3, y3, a1, a2);
}
exports.cdDrawCurve = cdDrawCurve;
function cdDrawLine(kage, polygons, tx1, ty1, tx2, ty2, ta1, ta2) {
    if (kage.kShotai === kage.kMincho) {
        var x1 = tx1;
        var y1 = ty1;
        var x2 = tx2;
        var y2 = ty2;
        var a1 = ta1 % 1000;
        var a2 = ta2 % 100;
        var opt1 = Math.floor(ta1 / 1000);
        var opt2 = Math.floor(ta2 / 100);
        var kMinWidthT = kage.kMinWidthT - opt1 / 2;
        if (x1 === x2) {
            var poly0 = new polygon_1.Polygon(4);
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
                    if (a1 === 6) {
                        poly0.set(2, x2 - kMinWidthT, y2);
                        poly0.set(1, x2 + kMinWidthT, y2);
                    }
                    else {
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
                case 24:// for T/H design
                    poly0.set(2, x2 - kMinWidthT, y2 + kage.kMinWidthY);
                    poly0.set(1, x2 + kMinWidthT, y2 + kage.kMinWidthY);
                    break;
                case 32:
                    poly0.set(2, x2 - kMinWidthT, y2 + kage.kMinWidthY);
                    poly0.set(1, x2 + kMinWidthT, y2 + kage.kMinWidthY);
                    break;
            }
            polygons.push(poly0);
            if (a2 === 24) {
                var poly = new polygon_1.Polygon();
                poly.push(x2, y2 + kage.kMinWidthY);
                poly.push(x2 + kMinWidthT, y2 - kage.kMinWidthY * 3);
                poly.push(x2 + kMinWidthT * 2, y2 - kage.kMinWidthY);
                poly.push(x2 + kMinWidthT * 2, y2 + kage.kMinWidthY);
                polygons.push(poly);
            }
            if (a2 === 13 && opt2 === 4) {
                var poly = new polygon_1.Polygon();
                poly.push(x2 - kMinWidthT, y2 - kage.kMinWidthY * 3);
                poly.push(x2 - kMinWidthT * 2, y2);
                poly.push(x2 - kage.kMinWidthY, y2 + kage.kMinWidthY * 5);
                poly.push(x2 + kMinWidthT, y2 + kage.kMinWidthY);
                polygons.push(poly);
            }
            if (a1 === 22) {
                var poly = new polygon_1.Polygon();
                poly.push(x1 - kMinWidthT, y1 - kage.kMinWidthY);
                poly.push(x1, y1 - kage.kMinWidthY - kage.kWidth);
                poly.push(x1 + kMinWidthT + kage.kWidth, y1 + kage.kMinWidthY);
                poly.push(x1 + kMinWidthT, y1 + kMinWidthT);
                poly.push(x1 - kMinWidthT, y1);
                polygons.push(poly);
            }
            if (a1 === 0) {
                var poly = new polygon_1.Polygon();
                poly.push(x1 + kMinWidthT, y1 + kage.kMinWidthY * 0.5);
                poly.push(x1 + kMinWidthT + kMinWidthT * 0.5, y1 + kage.kMinWidthY * 0.5 + kage.kMinWidthY);
                poly.push(x1 + kMinWidthT - 2, y1 + kage.kMinWidthY * 0.5 + kage.kMinWidthY * 2 + 1);
                polygons.push(poly);
            }
            if ((a1 === 6 && a2 === 0) || a2 === 1) {
                var poly = new polygon_1.Polygon();
                if (kage.kUseCurve) {
                    poly.push(x2 - kMinWidthT, y2);
                    poly.push(x2 - kMinWidthT * 0.9, y2 + kMinWidthT * 0.9, true);
                    poly.push(x2, y2 + kMinWidthT);
                    poly.push(x2 + kMinWidthT * 0.9, y2 + kMinWidthT * 0.9, true);
                    poly.push(x2 + kMinWidthT, y2);
                }
                else {
                    poly.push(x2 - kMinWidthT, y2);
                    poly.push(x2 - kMinWidthT * 0.6, y2 + kMinWidthT * 0.6);
                    poly.push(x2, y2 + kMinWidthT);
                    poly.push(x2 + kMinWidthT * 0.6, y2 + kMinWidthT * 0.6);
                    poly.push(x2 + kMinWidthT, y2);
                }
                // poly.reverse(); // for fill-rule
                polygons.push(poly);
            }
        }
        else if (y1 === y2) {
            if (a1 === 6) {
                var poly = new polygon_1.Polygon();
                poly.push(x1, y1 - kMinWidthT);
                poly.push(x2, y2 - kMinWidthT);
                poly.push(x2, y2 + kMinWidthT);
                poly.push(x1, y1 + kMinWidthT);
                polygons.push(poly);
                if (a2 === 1 || a2 === 0 || a2 === 5) {
                    // KAGI NO YOKO BOU NO SAIGO NO MARU
                    var poly2 = new polygon_1.Polygon();
                    if (kage.kUseCurve) {
                        if (x1 < x2) {
                            poly2.push(x2, y2 - kMinWidthT);
                            poly2.push(x2 + kMinWidthT * 0.9, y2 - kMinWidthT * 0.9, true);
                            poly2.push(x2 + kMinWidthT, y2);
                            poly2.push(x2 + kMinWidthT * 0.9, y2 + kMinWidthT * 0.9, true);
                            poly2.push(x2, y2 + kMinWidthT);
                        }
                        else {
                            poly2.push(x2, y2 - kMinWidthT);
                            poly2.push(x2 - kMinWidthT * 0.9, y2 - kMinWidthT * 0.9, true);
                            poly2.push(x2 - kMinWidthT, y2);
                            poly2.push(x2 - kMinWidthT * 0.9, y2 + kMinWidthT * 0.9, true);
                            poly2.push(x2, y2 + kMinWidthT);
                        }
                    }
                    else {
                        if (x1 < x2) {
                            poly2.push(x2, y2 - kMinWidthT);
                            poly2.push(x2 + kMinWidthT * 0.6, y2 - kMinWidthT * 0.6);
                            poly2.push(x2 + kMinWidthT, y2);
                            poly2.push(x2 + kMinWidthT * 0.6, y2 + kMinWidthT * 0.6);
                            poly2.push(x2, y2 + kMinWidthT);
                        }
                        else {
                            poly2.push(x2, y2 - kMinWidthT);
                            poly2.push(x2 - kMinWidthT * 0.6, y2 - kMinWidthT * 0.6);
                            poly2.push(x2 - kMinWidthT, y2);
                            poly2.push(x2 - kMinWidthT * 0.6, y2 + kMinWidthT * 0.6);
                            poly2.push(x2, y2 + kMinWidthT);
                        }
                    }
                    polygons.push(poly2);
                }
                if (a2 === 5) {
                    // KAGI NO YOKO BOU NO HANE
                    var poly2 = new polygon_1.Polygon();
                    if (x1 < x2) {
                        poly2.push(x2, y2 - kMinWidthT + 1);
                        poly2.push(x2 + 2, y2 - kMinWidthT - kage.kWidth * (4 * (1 - opt1 / kage.kAdjustMageStep) + 1));
                        poly2.push(x2, y2 - kMinWidthT - kage.kWidth * (4 * (1 - opt1 / kage.kAdjustMageStep) + 1));
                        poly2.push(x2 - kMinWidthT, y2 - kMinWidthT + 1);
                    }
                    else {
                        poly2.push(x2, y2 - kMinWidthT + 1);
                        poly2.push(x2 - 2, y2 - kMinWidthT - kage.kWidth * (4 * (1 - opt1 / kage.kAdjustMageStep) + 1));
                        poly2.push(x2, y2 - kMinWidthT - kage.kWidth * (4 * (1 - opt1 / kage.kAdjustMageStep) + 1));
                        poly2.push(x2 + kMinWidthT, y2 - kMinWidthT + 1);
                    }
                    // poly2.reverse(); // for fill-rule
                    polygons.push(poly2);
                }
            }
            else {
                // always same
                var poly = new polygon_1.Polygon(4);
                poly.set(0, x1, y1 - kage.kMinWidthY);
                poly.set(1, x2, y2 - kage.kMinWidthY);
                poly.set(2, x2, y2 + kage.kMinWidthY);
                poly.set(3, x1, y1 + kage.kMinWidthY);
                polygons.push(poly);
                // UROKO
                if (a2 === 0) {
                    var poly2 = new polygon_1.Polygon();
                    poly2.push(x2, y2 - kage.kMinWidthY);
                    poly2.push(x2 - kage.kAdjustUrokoX[opt2], y2);
                    poly2.push(x2 - kage.kAdjustUrokoX[opt2] / 2, y2 - kage.kAdjustUrokoY[opt2]);
                    polygons.push(poly2);
                }
            }
        }
        else {
            if ((Math.abs(y2 - y1) < Math.abs(x2 - x1)) && (a1 !== 6) && (a2 !== 6) && !(x1 > x2)) {
                var rad = Math.atan((y2 - y1) / (x2 - x1));
                // always same
                var poly = new polygon_1.Polygon(4);
                poly.set(0, x1 + Math.sin(rad) * kage.kMinWidthY, y1 - Math.cos(rad) * kage.kMinWidthY);
                poly.set(1, x2 + Math.sin(rad) * kage.kMinWidthY, y2 - Math.cos(rad) * kage.kMinWidthY);
                poly.set(2, x2 - Math.sin(rad) * kage.kMinWidthY, y2 + Math.cos(rad) * kage.kMinWidthY);
                poly.set(3, x1 - Math.sin(rad) * kage.kMinWidthY, y1 + Math.cos(rad) * kage.kMinWidthY);
                polygons.push(poly);
                // UROKO
                if (a2 === 0) {
                    var poly2 = new polygon_1.Polygon();
                    poly2.push(x2 + Math.sin(rad) * kage.kMinWidthY, y2 - Math.cos(rad) * kage.kMinWidthY);
                    poly2.push(x2 - Math.cos(rad) * kage.kAdjustUrokoX[opt2], y2 - Math.sin(rad) * kage.kAdjustUrokoX[opt2]);
                    poly2.push(x2 - Math.cos(rad) * kage.kAdjustUrokoX[opt2] / 2 + Math.sin(rad) * kage.kAdjustUrokoX[opt2] / 2, y2 - Math.sin(rad) * kage.kAdjustUrokoY[opt2] - Math.cos(rad) * kage.kAdjustUrokoY[opt2]);
                    polygons.push(poly2);
                }
            }
            else {
                var rad = Math.atan((y2 - y1) / (x2 - x1));
                var v = x1 > x2 ? -1 : 1;
                var poly0 = new polygon_1.Polygon(4);
                switch (a1) {
                    case 0:
                        poly0.set(0, x1 + Math.sin(rad) * kMinWidthT * v + kage.kMinWidthY * Math.cos(rad) * 0.5 * v, y1 - Math.cos(rad) * kMinWidthT * v + kage.kMinWidthY * Math.sin(rad) * 0.5 * v);
                        poly0.set(3, x1 - Math.sin(rad) * kMinWidthT * v - kage.kMinWidthY * Math.cos(rad) * 0.5 * v, y1 + Math.cos(rad) * kMinWidthT * v - kage.kMinWidthY * Math.sin(rad) * 0.5 * v);
                        break;
                    case 1:
                    case 6:
                        poly0.set(0, x1 + Math.sin(rad) * kMinWidthT * v, y1 - Math.cos(rad) * kMinWidthT * v);
                        poly0.set(3, x1 - Math.sin(rad) * kMinWidthT * v, y1 + Math.cos(rad) * kMinWidthT * v);
                        break;
                    case 12:
                        poly0.set(0, x1 + Math.sin(rad) * kMinWidthT * v - kage.kMinWidthY * Math.cos(rad) * v, y1 - Math.cos(rad) * kMinWidthT * v - kage.kMinWidthY * Math.sin(rad) * v);
                        poly0.set(3, x1 - Math.sin(rad) * kMinWidthT * v - (kMinWidthT + kage.kMinWidthY) * Math.cos(rad) * v, y1 + Math.cos(rad) * kMinWidthT * v - (kMinWidthT + kage.kMinWidthY) * Math.sin(rad) * v);
                        break;
                    case 22:
                        // TODO: why " + 1" ???
                        poly0.set(0, x1 + (kMinWidthT * v + 1) / Math.sin(rad), y1 + 1);
                        poly0.set(3, x1 - (kMinWidthT * v) / Math.sin(rad), y1);
                        break;
                    case 32:
                        poly0.set(0, x1 + (kMinWidthT * v) / Math.sin(rad), y1);
                        poly0.set(3, x1 - (kMinWidthT * v) / Math.sin(rad), y1);
                        break;
                }
                switch (a2) {
                    case 0:
                        if (a1 === 6) {
                            poly0.set(1, x2 + Math.sin(rad) * kMinWidthT * v, y2 - Math.cos(rad) * kMinWidthT * v);
                            poly0.set(2, x2 - Math.sin(rad) * kMinWidthT * v, y2 + Math.cos(rad) * kMinWidthT * v);
                        }
                        else {
                            poly0.set(1, x2 + Math.sin(rad) * kMinWidthT * v - kMinWidthT * 0.5 * Math.cos(rad) * v, y2 - Math.cos(rad) * kMinWidthT * v - kMinWidthT * 0.5 * Math.sin(rad) * v);
                            poly0.set(2, x2 - Math.sin(rad) * kMinWidthT * v + kMinWidthT * 0.5 * Math.cos(rad) * v, y2 + Math.cos(rad) * kMinWidthT * v + kMinWidthT * 0.5 * Math.sin(rad) * v);
                        }
                        break;
                    case 1: // is needed?
                    case 5:
                        poly0.set(1, x2 + Math.sin(rad) * kMinWidthT * v, y2 - Math.cos(rad) * kMinWidthT * v);
                        poly0.set(2, x2 - Math.sin(rad) * kMinWidthT * v, y2 + Math.cos(rad) * kMinWidthT * v);
                        break;
                    case 13:
                        poly0.set(1, x2 + Math.sin(rad) * kMinWidthT * v + kage.kAdjustKakatoL[opt2] * Math.cos(rad) * v, y2 - Math.cos(rad) * kMinWidthT * v + kage.kAdjustKakatoL[opt2] * Math.sin(rad) * v);
                        poly0.set(2, x2 - Math.sin(rad) * kMinWidthT * v + (kage.kAdjustKakatoL[opt2] + kMinWidthT) * Math.cos(rad) * v, y2 + Math.cos(rad) * kMinWidthT * v + (kage.kAdjustKakatoL[opt2] + kMinWidthT) * Math.sin(rad) * v);
                        break;
                    case 23:
                        poly0.set(1, x2 + Math.sin(rad) * kMinWidthT * v + kage.kAdjustKakatoR[opt2] * Math.cos(rad) * v, y2 - Math.cos(rad) * kMinWidthT * v + kage.kAdjustKakatoR[opt2] * Math.sin(rad) * v);
                        poly0.set(2, x2 - Math.sin(rad) * kMinWidthT * v + (kage.kAdjustKakatoR[opt2] + kMinWidthT) * Math.cos(rad) * v, y2 + Math.cos(rad) * kMinWidthT * v + (kage.kAdjustKakatoR[opt2] + kMinWidthT) * Math.sin(rad) * v);
                        break;
                    case 24:
                        poly0.set(1, x2 + (kMinWidthT * v) / Math.sin(rad), y2);
                        poly0.set(2, x2 - (kMinWidthT * v) / Math.sin(rad), y2);
                        break;
                    case 32:
                        poly0.set(1, x2 + (kMinWidthT * v) / Math.sin(rad), y2);
                        poly0.set(2, x2 - (kMinWidthT * v) / Math.sin(rad), y2);
                        break;
                }
                polygons.push(poly0);
                if (a2 === 24) {
                    var poly = new polygon_1.Polygon();
                    poly.push(x2, y2 + kage.kMinWidthY);
                    poly.push(x2 + kMinWidthT * 0.5, y2 - kage.kMinWidthY * 4);
                    poly.push(x2 + kMinWidthT * 2, y2 - kage.kMinWidthY);
                    poly.push(x2 + kMinWidthT * 2, y2 + kage.kMinWidthY);
                    polygons.push(poly);
                }
                if ((a1 === 6) && (a2 === 0 || a2 === 5)) {
                    var poly = new polygon_1.Polygon();
                    if (kage.kUseCurve) {
                        poly.push(x2 + Math.sin(rad) * kMinWidthT * v, y2 - Math.cos(rad) * kMinWidthT * v);
                        poly.push(x2 - Math.cos(rad) * kMinWidthT * 0.9 * v + Math.sin(rad) * kMinWidthT * 0.9 * v, y2 + Math.sin(rad) * kMinWidthT * 0.9 * v - Math.cos(rad) * kMinWidthT * 0.9 * v, true);
                        poly.push(x2 + Math.cos(rad) * kMinWidthT * v, y2 + Math.sin(rad) * kMinWidthT * v);
                        poly.push(x2 + Math.cos(rad) * kMinWidthT * 0.9 * v - Math.sin(rad) * kMinWidthT * 0.9 * v, y2 + Math.sin(rad) * kMinWidthT * 0.9 * v + Math.cos(rad) * kMinWidthT * 0.9 * v, true);
                        poly.push(x2 - Math.sin(rad) * kMinWidthT * v, y2 + Math.cos(rad) * kMinWidthT * v);
                    }
                    else {
                        poly.push(x2 + Math.sin(rad) * kMinWidthT * v, y2 - Math.cos(rad) * kMinWidthT * v);
                        poly.push(x2 + Math.cos(rad) * kMinWidthT * 0.8 * v + Math.sin(rad) * kMinWidthT * 0.6 * v, y2 + Math.sin(rad) * kMinWidthT * 0.8 * v - Math.cos(rad) * kMinWidthT * 0.6 * v);
                        poly.push(x2 + Math.cos(rad) * kMinWidthT * v, y2 + Math.sin(rad) * kMinWidthT * v);
                        poly.push(x2 + Math.cos(rad) * kMinWidthT * 0.8 * v - Math.sin(rad) * kMinWidthT * 0.6 * v, y2 + Math.sin(rad) * kMinWidthT * 0.8 * v + Math.cos(rad) * kMinWidthT * 0.6 * v);
                        poly.push(x2 - Math.sin(rad) * kMinWidthT * v, y2 + Math.cos(rad) * kMinWidthT * v);
                    }
                    polygons.push(poly);
                }
                if (a1 === 6 && a2 === 5) {
                    // KAGI NO YOKO BOU NO HANE
                    var poly = new polygon_1.Polygon();
                    if (x1 < x2) {
                        poly.push(x2 + (kMinWidthT - 1) * Math.sin(rad) * v, y2 - (kMinWidthT - 1) * Math.cos(rad) * v);
                        poly.push(x2 + 2 * Math.cos(rad) * v + (kMinWidthT + kage.kWidth * 5) * Math.sin(rad) * v, y2 + 2 * Math.sin(rad) * v - (kMinWidthT + kage.kWidth * 5) * Math.cos(rad) * v);
                        poly.push(x2 + (kMinWidthT + kage.kWidth * 5) * Math.sin(rad) * v, y2 - (kMinWidthT + kage.kWidth * 5) * Math.cos(rad) * v);
                        poly.push(x2 + (kMinWidthT - 1) * Math.sin(rad) * v - kMinWidthT * Math.cos(rad) * v, y2 - (kMinWidthT - 1) * Math.cos(rad) * v - kMinWidthT * Math.sin(rad) * v);
                    }
                    else {
                        poly.push(x2 - (kMinWidthT - 1) * Math.sin(rad) * v, y2 + (kMinWidthT - 1) * Math.cos(rad) * v);
                        poly.push(x2 + 2 * Math.cos(rad) * v - (kMinWidthT + kage.kWidth * 5) * Math.sin(rad) * v, y2 + 2 * Math.sin(rad) * v + (kMinWidthT + kage.kWidth * 5) * Math.cos(rad) * v);
                        poly.push(x2 - (kMinWidthT + kage.kWidth * 5) * Math.sin(rad) * v, y2 + (kMinWidthT + kage.kWidth * 5) * Math.cos(rad) * v);
                        poly.push(x2 + (kMinWidthT - 1) * Math.sin(rad) * v - kMinWidthT * Math.cos(rad) * v, y2 - (kMinWidthT - 1) * Math.cos(rad) * v - kMinWidthT * Math.sin(rad) * v);
                    }
                    polygons.push(poly);
                }
                if (a1 === 22) {
                    var poly = new polygon_1.Polygon();
                    poly.push(x1 - kMinWidthT, y1 - kage.kMinWidthY);
                    poly.push(x1, y1 - kage.kMinWidthY - kage.kWidth);
                    poly.push(x1 + kMinWidthT + kage.kWidth, y1 + kage.kMinWidthY);
                    poly.push(x1 + kMinWidthT, y1 + kMinWidthT - 1);
                    poly.push(x1 - kMinWidthT, y1 + kMinWidthT + 4);
                    polygons.push(poly);
                }
                if (a2 === 13 && opt2 === 4) {
                    var poly = new polygon_1.Polygon();
                    var m = 0;
                    if (x1 > x2 && y1 !== y2) {
                        m = Math.floor((x1 - x2) / (y2 - y1) * 3);
                    }
                    poly.push(x2 + m, y2 - kage.kMinWidthY * 5);
                    poly.push(x2 - kMinWidthT * 2 + m, y2);
                    poly.push(x2 - kage.kMinWidthY + m, y2 + kage.kMinWidthY * 5);
                    poly.push(x2 + kMinWidthT + m, y2 + kage.kMinWidthY);
                    poly.push(x2 + m, y2);
                    polygons.push(poly);
                }
                var XX = Math.sin(rad) * v;
                var XY = Math.cos(rad) * v * -1;
                var YX = Math.cos(rad) * v;
                var YY = Math.sin(rad) * v;
                if (a1 === 0) {
                    var poly = new polygon_1.Polygon();
                    poly.push(x1 + kMinWidthT * XX + (kage.kMinWidthY * 0.5) * YX, y1 + kMinWidthT * XY + (kage.kMinWidthY * 0.5) * YY);
                    poly.push(x1 + (kMinWidthT + kMinWidthT * 0.5) * XX + (kage.kMinWidthY * 0.5 + kage.kMinWidthY) * YX, y1 + (kMinWidthT + kMinWidthT * 0.5) * XY + (kage.kMinWidthY * 0.5 + kage.kMinWidthY) * YY);
                    poly.push(x1 + kMinWidthT * XX + (kage.kMinWidthY * 0.5 + kage.kMinWidthY * 2) * YX - 2 * XX, y1 + kMinWidthT * XY + (kage.kMinWidthY * 0.5 + kage.kMinWidthY * 2) * YY + 1 * XY);
                    polygons.push(poly);
                }
            }
        }
    }
    else {
        if (tx1 === tx2) {
            var x1 = void 0;
            var y1 = void 0;
            var x2 = void 0;
            var y2 = void 0;
            var a1 = void 0;
            var a2 = void 0;
            if (ty1 > ty2) {
                x1 = tx2;
                y1 = ty2;
                x2 = tx1;
                y2 = ty1;
                a1 = ta2;
                a2 = ta1;
            }
            else {
                x1 = tx1;
                y1 = ty1;
                x2 = tx2;
                y2 = ty2;
                a1 = ta1;
                a2 = ta2;
            }
            if (a1 % 10 === 2) {
                y1 -= kage.kWidth;
            }
            if (a2 % 10 === 2) {
                y2 += kage.kWidth;
            }
            if (a1 % 10 === 3) {
                y1 -= kage.kWidth * kage.kKakato;
            }
            if (a2 % 10 === 3) {
                y2 += kage.kWidth * kage.kKakato;
            }
            var poly = new polygon_1.Polygon();
            poly.push(x1 - kage.kWidth, y1);
            poly.push(x2 - kage.kWidth, y2);
            poly.push(x2 + kage.kWidth, y2);
            poly.push(x1 + kage.kWidth, y1);
            // poly.reverse(); // for fill-rule
            polygons.push(poly);
        }
        else if (ty1 === ty2) {
            var x1 = void 0;
            var y1 = void 0;
            var x2 = void 0;
            var y2 = void 0;
            var a1 = void 0;
            var a2 = void 0;
            if (tx1 > tx2) {
                x1 = tx2;
                y1 = ty2;
                x2 = tx1;
                y2 = ty1;
                a1 = ta2;
                a2 = ta1;
            }
            else {
                x1 = tx1;
                y1 = ty1;
                x2 = tx2;
                y2 = ty2;
                a1 = ta1;
                a2 = ta2;
            }
            if (a1 % 10 === 2) {
                x1 -= kage.kWidth;
            }
            if (a2 % 10 === 2) {
                x2 += kage.kWidth;
            }
            if (a1 % 10 === 3) {
                x1 -= kage.kWidth * kage.kKakato;
            }
            if (a2 % 10 === 3) {
                x2 += kage.kWidth * kage.kKakato;
            }
            var poly = new polygon_1.Polygon();
            poly.push(x1, y1 - kage.kWidth);
            poly.push(x2, y2 - kage.kWidth);
            poly.push(x2, y2 + kage.kWidth);
            poly.push(x1, y1 + kage.kWidth);
            polygons.push(poly);
        }
        else {
            var x1 = void 0;
            var y1 = void 0;
            var x2 = void 0;
            var y2 = void 0;
            var a1 = void 0;
            var a2 = void 0;
            if (tx1 > tx2) {
                x1 = tx2;
                y1 = ty2;
                x2 = tx1;
                y2 = ty1;
                a1 = ta2;
                a2 = ta1;
            }
            else {
                x1 = tx1;
                y1 = ty1;
                x2 = tx2;
                y2 = ty2;
                a1 = ta1;
                a2 = ta2;
            }
            // x2 > x1, y2 !== y1
            var _a = util_1.normalize([x2 - x1, y2 - y1], kage.kWidth), dx = _a[0], dy = _a[1];
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
            var poly = new polygon_1.Polygon();
            poly.push(x1 + dy, y1 - dx);
            poly.push(x2 + dy, y2 - dx);
            poly.push(x2 - dy, y2 + dx);
            poly.push(x1 - dy, y1 + dx);
            polygons.push(poly);
        }
    }
}
exports.cdDrawLine = cdDrawLine;

},{"./curve":4,"./kage":6,"./polygon":9,"./util":11}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kagecd_1 = require("./kagecd");
var util_1 = require("./util");
function dfDrawFont(kage, polygons, a1, a2, a3, x1, y1, x2, y2, x3, y3, x4, y4) {
    if (kage.kShotai === kage.kMincho) {
        switch (a1 % 100) {
            case 0:
                break;
            case 1: {
                if (a3 % 100 === 4) {
                    var _a = (x1 === x2 && y1 === y2)
                        ? [0, kage.kMage] // ?????
                        : util_1.normalize([x1 - x2, y1 - y2], kage.kMage), dx1 = _a[0], dy1 = _a[1];
                    var tx1 = x2 + dx1;
                    var ty1 = y2 + dy1;
                    kagecd_1.cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2, 1);
                    kagecd_1.cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, x2 - kage.kMage * (((kage.kAdjustTateStep + 4) - Math.floor(a2 / 1000)) / (kage.kAdjustTateStep + 4)), y2, 1 + (a2 - a2 % 1000), a3 + 10);
                }
                else {
                    kagecd_1.cdDrawLine(kage, polygons, x1, y1, x2, y2, a2, a3);
                }
                break;
            }
            case 2: {
                // case 12: // ... no need
                if (a3 % 100 === 4) {
                    var _b = (x2 === x3)
                        ? [0, -kage.kMage] // ?????
                        : (y2 === y3)
                            ? [-kage.kMage, 0] // ?????
                            : util_1.normalize([x2 - x3, y2 - y3], kage.kMage), dx1 = _b[0], dy1 = _b[1];
                    var tx1 = x3 + dx1;
                    var ty1 = y3 + dy1;
                    kagecd_1.cdDrawCurve(kage, polygons, x1, y1, x2, y2, tx1, ty1, a2, 1);
                    kagecd_1.cdDrawCurve(kage, polygons, tx1, ty1, x3, y3, x3 - kage.kMage, y3, 1, a3 + 10);
                }
                else if (a3 === 5) {
                    kagecd_1.cdDrawCurve(kage, polygons, x1, y1, x2, y2, x3, y3, a2, 15);
                }
                else {
                    kagecd_1.cdDrawCurve(kage, polygons, x1, y1, x2, y2, x3, y3, a2, a3);
                }
                break;
            }
            case 3: {
                if (a3 % 1000 === 5) {
                    var _c = (x1 === x2 && y1 === y2)
                        ? [0, kage.kMage] // ?????
                        : util_1.normalize([x1 - x2, y1 - y2], kage.kMage), dx1 = _c[0], dy1 = _c[1];
                    var tx1 = x2 + dx1;
                    var ty1 = y2 + dy1;
                    var _d = (x2 === x3 && y2 === y3)
                        ? [0, -kage.kMage] // ?????
                        : util_1.normalize([x3 - x2, y3 - y2], kage.kMage), dx2 = _d[0], dy2 = _d[1];
                    var tx2 = x2 + dx2;
                    var ty2 = y2 + dy2;
                    var tx3 = x3;
                    var ty3 = y3;
                    kagecd_1.cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2, 1);
                    kagecd_1.cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, tx2, ty2, 1 + (a2 - a2 % 1000) * 10, 1 + (a3 - a3 % 1000));
                    if ((x2 < x3 && tx3 - tx2 > 0) || (x2 > x3 && tx2 - tx3 > 0)) {
                        kagecd_1.cdDrawLine(kage, polygons, tx2, ty2, tx3, ty3, 6 + (a3 - a3 % 1000), 5); // bolder by force
                    }
                }
                else {
                    var _e = (x1 === x2 && y1 === y2)
                        ? [0, kage.kMage] // ?????
                        : util_1.normalize([x1 - x2, y1 - y2], kage.kMage), dx1 = _e[0], dy1 = _e[1];
                    var tx1 = x2 + dx1;
                    var ty1 = y2 + dy1;
                    var _f = (x2 === x3 && y2 === y3)
                        ? [0, -kage.kMage] // ?????
                        : util_1.normalize([x3 - x2, y3 - y2], kage.kMage), dx2 = _f[0], dy2 = _f[1];
                    var tx2 = x2 + dx2;
                    var ty2 = y2 + dy2;
                    kagecd_1.cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2, 1);
                    kagecd_1.cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, tx2, ty2, 1 + (a2 - a2 % 1000) * 10, 1 + (a3 - a3 % 1000));
                    kagecd_1.cdDrawLine(kage, polygons, tx2, ty2, x3, y3, 6 + (a3 - a3 % 1000), a3); // bolder by force
                }
                break;
            }
            case 12: {
                kagecd_1.cdDrawCurve(kage, polygons, x1, y1, x2, y2, x3, y3, a2, 1);
                kagecd_1.cdDrawLine(kage, polygons, x3, y3, x4, y4, 6, a3);
                break;
            }
            case 4: {
                var rate = 6;
                if (Math.pow((x3 - x2), 2) + Math.pow((y3 - y2), 2) < 14400) {
                    rate = util_1.hypot(x3 - x2, y3 - y2) / 120 * 6;
                }
                if (a3 === 5) {
                    var _g = (x1 === x2 && y1 === y2)
                        ? [0, kage.kMage * rate] // ?????
                        : util_1.normalize([x1 - x2, y1 - y2], kage.kMage * rate), dx1 = _g[0], dy1 = _g[1];
                    var tx1 = x2 + dx1;
                    var ty1 = y2 + dy1;
                    var _h = (x2 === x3 && y2 === y3)
                        ? [0, -kage.kMage * rate] // ?????
                        : util_1.normalize([x3 - x2, y3 - y2], kage.kMage * rate), dx2 = _h[0], dy2 = _h[1];
                    var tx2 = x2 + dx2;
                    var ty2 = y2 + dy2;
                    var tx3 = x3;
                    var ty3 = y3;
                    kagecd_1.cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2, 1);
                    kagecd_1.cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1);
                    if (tx3 - tx2 > 0) {
                        kagecd_1.cdDrawLine(kage, polygons, tx2, ty2, tx3, ty3, 6, 5); // bolder by force
                    }
                }
                else {
                    var _j = (x1 === x2 && y1 === y2)
                        ? [0, kage.kMage * rate] // ?????
                        : util_1.normalize([x1 - x2, y1 - y2], kage.kMage * rate), dx1 = _j[0], dy1 = _j[1];
                    var tx1 = x2 + dx1;
                    var ty1 = y2 + dy1;
                    var _k = (x2 === x3 && y2 === y3)
                        ? [0, -kage.kMage * rate] // ?????
                        : util_1.normalize([x3 - x2, y3 - y2], kage.kMage * rate), dx2 = _k[0], dy2 = _k[1];
                    var tx2 = x2 + dx2;
                    var ty2 = y2 + dy2;
                    kagecd_1.cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2, 1);
                    kagecd_1.cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1);
                    kagecd_1.cdDrawLine(kage, polygons, tx2, ty2, x3, y3, 6, a3); // bolder by force
                }
                break;
            }
            case 6: {
                if (a3 % 100 === 4) {
                    var _l = (x3 === x4)
                        ? [0, -kage.kMage] // ?????
                        : (y3 === y4)
                            ? [-kage.kMage, 0] // ?????
                            : util_1.normalize([x3 - x4, y3 - y4], kage.kMage), dx1 = _l[0], dy1 = _l[1];
                    var tx1 = x4 + dx1;
                    var ty1 = y4 + dy1;
                    kagecd_1.cdDrawBezier(kage, polygons, x1, y1, x2, y2, x3, y3, tx1, ty1, a2, 1);
                    kagecd_1.cdDrawCurve(kage, polygons, tx1, ty1, x4, y4, x4 - kage.kMage, y4, 1, a3 + 10);
                }
                else if (a3 === 5) {
                    kagecd_1.cdDrawBezier(kage, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a2, 15);
                }
                else {
                    kagecd_1.cdDrawBezier(kage, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a2, a3);
                }
                break;
            }
            case 7: {
                kagecd_1.cdDrawLine(kage, polygons, x1, y1, x2, y2, a2, 1);
                kagecd_1.cdDrawCurve(kage, polygons, x2, y2, x3, y3, x4, y4, 1 + (a2 - a2 % 1000), a3);
                break;
            }
            case 9:// may not be exist ... no need
                // kageCanvas[y1][x1] = 0;
                // kageCanvas[y2][x2] = 0;
                break;
            default:
                break;
        }
    }
    else {
        switch (a1 % 100) {
            case 0:
                break;
            case 1: {
                if (a3 === 4) {
                    var _m = (x1 === x2 && y1 === y2)
                        ? [0, kage.kMage] // ?????
                        : util_1.normalize([x1 - x2, y1 - y2], kage.kMage), dx1 = _m[0], dy1 = _m[1];
                    var tx1 = x2 + dx1;
                    var ty1 = y2 + dy1;
                    kagecd_1.cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2, 1);
                    kagecd_1.cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, x2 - kage.kMage * 2, y2 - kage.kMage * 0.5, 1, 0);
                }
                else {
                    kagecd_1.cdDrawLine(kage, polygons, x1, y1, x2, y2, a2, a3);
                }
                break;
            }
            case 2:
            case 12: {
                if (a3 === 4) {
                    var _o = (x2 === x3)
                        ? [0, -kage.kMage] // ?????
                        : (y2 === y3)
                            ? [-kage.kMage, 0] // ?????
                            : util_1.normalize([x2 - x3, y2 - y3], kage.kMage), dx1 = _o[0], dy1 = _o[1];
                    var tx1 = x3 + dx1;
                    var ty1 = y3 + dy1;
                    kagecd_1.cdDrawCurve(kage, polygons, x1, y1, x2, y2, tx1, ty1, a2, 1);
                    kagecd_1.cdDrawCurve(kage, polygons, tx1, ty1, x3, y3, x3 - kage.kMage * 2, y3 - kage.kMage * 0.5, 1, 0);
                }
                else if (a3 === 5) {
                    var tx1 = x3 + kage.kMage;
                    var ty1 = y3;
                    var tx2 = tx1 + kage.kMage * 0.5;
                    var ty2 = y3 - kage.kMage * 2;
                    kagecd_1.cdDrawCurve(kage, polygons, x1, y1, x2, y2, x3, y3, a2, 1);
                    kagecd_1.cdDrawCurve(kage, polygons, x3, y3, tx1, ty1, tx2, ty2, 1, 0);
                }
                else {
                    kagecd_1.cdDrawCurve(kage, polygons, x1, y1, x2, y2, x3, y3, a2, a3);
                }
                break;
            }
            case 3: {
                if (a3 === 5) {
                    var _p = (x1 === x2 && y1 === y2)
                        ? [0, kage.kMage] // ?????
                        : util_1.normalize([x1 - x2, y1 - y2], kage.kMage), dx1 = _p[0], dy1 = _p[1];
                    var tx1 = x2 + dx1;
                    var ty1 = y2 + dy1;
                    var _q = (x2 === x3 && y2 === y3)
                        ? [0, -kage.kMage] // ?????
                        : util_1.normalize([x3 - x2, y3 - y2], kage.kMage), dx2 = _q[0], dy2 = _q[1];
                    var tx2 = x2 + dx2;
                    var ty2 = y2 + dy2;
                    var tx3 = x3 - kage.kMage;
                    var ty3 = y3;
                    var tx4 = x3 + kage.kMage * 0.5;
                    var ty4 = y3 - kage.kMage * 2;
                    kagecd_1.cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2, 1);
                    kagecd_1.cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1);
                    kagecd_1.cdDrawLine(kage, polygons, tx2, ty2, tx3, ty3, 1, 1);
                    kagecd_1.cdDrawCurve(kage, polygons, tx3, ty3, x3, y3, tx4, ty4, 1, 0);
                }
                else {
                    var _r = (x1 === x2 && y1 === y2)
                        ? [0, kage.kMage] // ?????
                        : util_1.normalize([x1 - x2, y1 - y2], kage.kMage), dx1 = _r[0], dy1 = _r[1];
                    var tx1 = x2 + dx1;
                    var ty1 = y2 + dy1;
                    var _s = (x2 === x3 && y2 === y3)
                        ? [0, -kage.kMage] // ?????
                        : util_1.normalize([x3 - x2, y3 - y2], kage.kMage), dx2 = _s[0], dy2 = _s[1];
                    var tx2 = x2 + dx2;
                    var ty2 = y2 + dy2;
                    kagecd_1.cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2, 1);
                    kagecd_1.cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1);
                    kagecd_1.cdDrawLine(kage, polygons, tx2, ty2, x3, y3, 1, a3);
                }
                break;
            }
            case 6: {
                if (a3 === 5) {
                    var tx1 = x4 - kage.kMage;
                    var ty1 = y4;
                    var tx2 = x4 + kage.kMage * 0.5;
                    var ty2 = y4 - kage.kMage * 2;
                    /*
                    cdDrawCurve(x1, y1, x2, y2, (x2 + x3) / 2, (y2 + y3) / 2, a2, 1);
                    cdDrawCurve((x2 + x3) / 2, (y2 + y3) / 2, x3, y3, tx1, ty1, 1, 1);
                     */
                    kagecd_1.cdDrawBezier(kage, polygons, x1, y1, x2, y2, x3, y3, tx1, ty1, a2, 1);
                    kagecd_1.cdDrawCurve(kage, polygons, tx1, ty1, x4, y4, tx2, ty2, 1, 0);
                }
                else {
                    /*
                    cdDrawCurve(x1, y1, x2, y2, (x2 + x3) / 2, (y2 + y3) / 2, a2, 1);
                    cdDrawCurve((x2 + x3) / 2, (y2 + y3) / 2, x3, y3, x4, y4, 1, a3);
                     */
                    kagecd_1.cdDrawBezier(kage, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a2, a3);
                }
                break;
            }
            case 7: {
                kagecd_1.cdDrawLine(kage, polygons, x1, y1, x2, y2, a2, 1);
                kagecd_1.cdDrawCurve(kage, polygons, x2, y2, x3, y3, x4, y4, 1, a3);
                break;
            }
            case 9:// may not be exist
                // kageCanvas[y1][x1] = 0;
                // kageCanvas[y2][x2] = 0;
                break;
            default:
                break;
        }
    }
}
exports.dfDrawFont = dfDrawFont;

},{"./kagecd":7,"./util":11}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Polygon = (function () {
    function Polygon(number) {
        // property
        this.array = [];
        // initialize
        if (number) {
            for (var i = 0; i < number; i++) {
                this.push(0, 0, false);
            }
        }
    }
    // method
    Polygon.prototype.push = function (x, y, off) {
        if (off === void 0) { off = false; }
        this.array.push({
            x: Math.floor(x * 10) / 10,
            y: Math.floor(y * 10) / 10,
            off: off,
        });
    };
    Polygon.prototype.set = function (index, x, y, off) {
        if (off === void 0) { off = false; }
        this.array[index].x = Math.floor(x * 10) / 10;
        this.array[index].y = Math.floor(y * 10) / 10;
        this.array[index].off = off;
    };
    Polygon.prototype.reverse = function () {
        this.array.reverse();
    };
    Polygon.prototype.concat = function (poly) {
        this.array = this.array.concat(poly.array);
    };
    Polygon.prototype.shift = function () {
        this.array.shift();
    };
    Polygon.prototype.unshift = function (x, y, off) {
        if (off === void 0) { off = false; }
        this.array.unshift({
            x: Math.floor(x * 10) / 10,
            y: Math.floor(y * 10) / 10,
            off: off,
        });
    };
    return Polygon;
}());
exports.Polygon = Polygon;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Polygons = (function () {
    function Polygons() {
        // property
        this.array = [];
    }
    // method
    Polygons.prototype.clear = function () {
        this.array = [];
    };
    Polygons.prototype.push = function (polygon) {
        // only a simple check
        var minx = 200;
        var maxx = 0;
        var miny = 200;
        var maxy = 0;
        var error = 0;
        polygon.array.forEach(function (_a) {
            var x = _a.x, y = _a.y;
            if (x < minx) {
                minx = x;
            }
            if (x > maxx) {
                maxx = x;
            }
            if (y < miny) {
                miny = y;
            }
            if (y > maxy) {
                maxy = y;
            }
            if (isNaN(x) || isNaN(y)) {
                error++;
            }
        });
        if (error === 0 && minx !== maxx && miny !== maxy && polygon.array.length >= 3) {
            this.array.push(polygon);
        }
    };
    Polygons.prototype.generateSVG = function (curve) {
        var buffer = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
            + 'version="1.1" baseProfile="full" viewBox="0 0 200 200" width="200" height="200">\n';
        if (curve) {
            this.array.forEach(function (_a) {
                var array = _a.array;
                var mode = "L";
                buffer += '<path d="';
                for (var j = 0; j < array.length; j++) {
                    if (j === 0) {
                        buffer += "M ";
                    }
                    else if (array[j].off) {
                        buffer += "Q ";
                        mode = "Q";
                    }
                    else if (mode === "Q" && !array[j - 1].off) {
                        buffer += "L ";
                    }
                    else if (mode === "L" && j === 1) {
                        buffer += "L ";
                    }
                    buffer += array[j].x + "," + array[j].y + " ";
                }
                buffer += 'Z" fill="black" />\n';
            });
        }
        else {
            buffer += '<g fill="black">\n';
            buffer += this.array.map(function (_a) {
                var array = _a.array;
                return "<polygon points=\"" + array.map(function (_a) {
                    var x = _a.x, y = _a.y;
                    return x + "," + y + " ";
                }).join("") + "\" />\n";
            }).join("");
            buffer += "</g>\n";
        }
        buffer += "</svg>\n";
        return buffer;
    };
    Polygons.prototype.generateEPS = function () {
        var buffer = "";
        buffer += "%!PS-Adobe-3.0 EPSF-3.0\n%%BoundingBox: 0 -208 1024 816\n%%Pages: 0\n%%Title: Kanji glyph\n%%Creator: GlyphWiki powered by KAGE system\n%%CreationDate: " + new Date() + "\n%%EndComments\n%%EndProlog\n";
        this.array.forEach(function (_a) {
            var array = _a.array;
            for (var j = 0; j < array.length; j++) {
                buffer += (array[j].x * 5) + " " + (1000 - array[j].y * 5 - 200) + " ";
                if (j === 0) {
                    buffer += "newpath\nmoveto\n";
                }
                else {
                    buffer += "lineto\n";
                }
            }
            buffer += "closepath\nfill\n";
        });
        buffer += "%%EOF\n";
        return buffer;
    };
    return Polygons;
}());
exports.Polygons = Polygons;

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hypot = Math.hypot || (function (x, y) { return Math.sqrt(x * x + y * y); });
/** Calculates a new vector with the same angle and a new magnitude. */
function normalize(_a, magnitude) {
    var x = _a[0], y = _a[1];
    if (magnitude === void 0) { magnitude = 1; }
    if (x === 0 && y === 0) {
        // Angle is the same as Math.atan2(y, x)
        return [1 / x === Infinity ? magnitude : -magnitude, 0];
    }
    var k = magnitude / exports.hypot(x, y);
    return [x * k, y * k];
}
exports.normalize = normalize;
function quadraticBezier(p1, p2, p3, t) {
    var s = 1 - t;
    return (s * s) * p1 + 2 * (s * t) * p2 + (t * t) * p3;
}
exports.quadraticBezier = quadraticBezier;
/** Returns d/dt(quadraticBezier) */
function quadraticBezierDeriv(p1, p2, p3, t) {
    var s = 1 - t;
    // ds/dt = -1
    return (-2 * s) * p1 + 2 * (s - t) * p2 + (2 * t) * p3;
    // = 2 * t * (p1 - 2 * p2 + p3) - 2 * p1 + 2 * p2
}
exports.quadraticBezierDeriv = quadraticBezierDeriv;
function cubicBezier(p1, p2, p3, p4, t) {
    var s = 1 - t;
    return (s * s * s) * p1 + 3 * (s * s * t) * p2 + 3 * (s * t * t) * p3 + (t * t * t) * p4;
}
exports.cubicBezier = cubicBezier;
/** Returns d/dt(cubicBezier) */
function cubicBezierDeriv(p1, p2, p3, p4, t) {
    var s = 1 - t;
    // ds/dt = -1
    var ss = s * s;
    var st = s * t;
    var tt = t * t;
    return (-3 * ss) * p1 + 3 * (ss - 2 * st) * p2 + 3 * (2 * st - tt) * p3 + (3 * tt) * p4;
    // = 3 * t * t * (-a + 3 * b - 3 * c + d) + 6 * t * (a - 2 * b + c) - 3 * a + 3 * b
}
exports.cubicBezierDeriv = cubicBezierDeriv;
/** Find the minimum of a function by ternary search. */
function ternarySearchMin(func, left, right, eps) {
    if (eps === void 0) { eps = 1E-5; }
    while (left + eps < right) {
        var x1 = left + (right - left) / 3;
        var x2 = right - (right - left) / 3;
        var y1 = func(x1);
        var y2 = func(x2);
        if (y1 < y2) {
            right = x2;
        }
        else {
            left = x1;
        }
    }
    return left + (right - left) / 2;
}
exports.ternarySearchMin = ternarySearchMin;
/** Find the maximum of a function by ternary search. */
function ternarySearchMax(func, left, right, eps) {
    return ternarySearchMin(function (x) { return -func(x); }, left, right, eps);
}
exports.ternarySearchMax = ternarySearchMax;

},{}]},{},[2]);
