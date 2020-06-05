(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCrossWithOthers = exports.isCrossBoxWithOthers = void 0;
var util_1 = require("./util");
// Reference : http://www.cam.hi-ho.ne.jp/strong_warriors/teacher/chapter0{4,5}.html
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
    if (isNaN(cross_1112_2122)) {
        return true; // for backward compatibility...
    }
    if (cross_1112_2122 === 0) {
        // parallel
        return false; // XXX should check if segments overlap?
    }
    var cross_1112_1121 = cross(x12 - x11, y12 - y11, x21 - x11, y21 - y11);
    var cross_1112_1122 = cross(x12 - x11, y12 - y11, x22 - x11, y22 - y11);
    var cross_2122_2111 = cross(x22 - x21, y22 - y21, x11 - x21, y11 - y21);
    var cross_2122_2112 = cross(x22 - x21, y22 - y21, x12 - x21, y12 - y21);
    return util_1.round(cross_1112_1121 * cross_1112_1122, 1E5) <= 0 && util_1.round(cross_2122_2111 * cross_2122_2112, 1E5) <= 0;
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
    return strokesArray.some(function (stroke, j) { return (i !== j
        && stroke.getControlSegments().some(function (_a) {
            var x1 = _a[0], y1 = _a[1], x2 = _a[2], y2 = _a[3];
            return (isCrossBox(x1, y1, x2, y2, bx1, by1, bx2, by2));
        })); });
}
exports.isCrossBoxWithOthers = isCrossBoxWithOthers;
function isCrossWithOthers(strokesArray, i, bx1, by1, bx2, by2) {
    return strokesArray.some(function (stroke, j) { return (i !== j
        && stroke.getControlSegments().some(function (_a) {
            var x1 = _a[0], y1 = _a[1], x2 = _a[2], y2 = _a[3];
            return (isCross(x1, y1, x2, y2, bx1, by1, bx2, by2));
        })); });
}
exports.isCrossWithOthers = isCrossWithOthers;

},{"./util":12}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
window.Kage = _1.Kage;
window.Polygons = _1.Polygons;

},{"./":5}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buhin = void 0;
var Buhin = /** @class */ (function () {
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
    Buhin.prototype.push = function (name, data) {
        this.set(name, data);
    };
    return Buhin;
}());
exports.Buhin = Buhin;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_candidate = exports.find_offcurve = exports.divide_curve = void 0;
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
    var minx = util_1.ternarySearchMin(function (tx) { return curve.reduce(function (diff, p, i) {
        var t = i / curve.length;
        var x = util_1.quadraticBezier(nx1, tx, nx2, t);
        return diff + Math.pow((p[0] - x), 2);
    }, 0); }, sx - area, sx + area);
    var miny = util_1.ternarySearchMin(function (ty) { return curve.reduce(function (diff, p, i) {
        var t = i / curve.length;
        var y = util_1.quadraticBezier(ny1, ty, ny2, t);
        return diff + Math.pow((p[1] - y), 2);
    }, 0); }, sy - area, sy + area);
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

},{"./util":12}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polygons = exports.Kage = void 0;
var kage_1 = require("./kage");
Object.defineProperty(exports, "Kage", { enumerable: true, get: function () { return kage_1.Kage; } });
var polygons_1 = require("./polygons");
Object.defineProperty(exports, "Polygons", { enumerable: true, get: function () { return polygons_1.Polygons; } });

},{"./kage":6,"./polygons":10}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kage = exports.KShotai = void 0;
var _2d_1 = require("./2d");
var buhin_1 = require("./buhin");
var kagedf_1 = require("./kagedf");
var polygons_1 = require("./polygons");
var stroke_1 = require("./stroke");
var util_1 = require("./util");
var KShotai;
(function (KShotai) {
    KShotai[KShotai["kMincho"] = 0] = "kMincho";
    KShotai[KShotai["kGothic"] = 1] = "kGothic";
})(KShotai = exports.KShotai || (exports.KShotai = {}));
var Kage = /** @class */ (function () {
    function Kage(size) {
        // TODO: should be static
        this.kMincho = KShotai.kMincho;
        this.kGothic = KShotai.kGothic;
        // properties
        this.kShotai = KShotai.kMincho;
        this.kRate = 100; // must divide 1000
        this.stretch = stroke_1.stretch;
        if (size === 1) {
            this.kMinWidthY = 1.2;
            this.kMinWidthT = 3.6;
            this.kWidth = 3;
            this.kKakato = 1.8;
            this.kL2RDfatten = 1.1;
            this.kMage = 6;
            this.kUseCurve = false;
            this.kAdjustKakatoL = [8, 5, 3, 1, 0];
            this.kAdjustKakatoR = [4, 3, 2, 1];
            this.kAdjustKakatoRangeX = 12;
            this.kAdjustKakatoRangeY = [1, 11, 14, 18];
            this.kAdjustKakatoStep = 3;
            this.kAdjustUrokoX = [14, 12, 9, 7];
            this.kAdjustUrokoY = [7, 6, 5, 4];
            this.kAdjustUrokoLength = [13, 21, 30];
            this.kAdjustUrokoLengthStep = 3;
            this.kAdjustUrokoLine = [13, 15, 18];
        }
        else {
            this.kMinWidthY = 2;
            this.kMinWidthT = 6;
            this.kWidth = 5;
            this.kKakato = 3;
            this.kL2RDfatten = 1.1;
            this.kMage = 10;
            this.kUseCurve = false;
            this.kAdjustKakatoL = [14, 9, 5, 2, 0];
            this.kAdjustKakatoR = [8, 6, 4, 2];
            this.kAdjustKakatoRangeX = 20;
            this.kAdjustKakatoRangeY = [1, 19, 24, 30];
            this.kAdjustKakatoStep = 3;
            this.kAdjustUrokoX = [24, 20, 16, 12];
            this.kAdjustUrokoY = [12, 11, 9, 8];
            this.kAdjustUrokoLength = [22, 36, 50];
            this.kAdjustUrokoLengthStep = 3;
            this.kAdjustUrokoLine = [22, 26, 30];
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
            var strokesArray = this.getEachStrokes(data);
            this.adjustStrokes(strokesArray);
            strokesArray.forEach(function (stroke) {
                kagedf_1.dfDrawFont(_this, polygons, stroke);
            });
        }
    };
    Kage.prototype.makeGlyph3 = function (data) {
        var _this = this;
        var result = [];
        if (data !== "") {
            var strokesArray = this.getEachStrokes(data);
            this.adjustStrokes(strokesArray);
            strokesArray.forEach(function (stroke) {
                var polygons = new polygons_1.Polygons();
                kagedf_1.dfDrawFont(_this, polygons, stroke);
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
                strokesArray.push(new stroke_1.Stroke([
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
                ]));
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
        var strokes = this.getEachStrokes(buhin);
        var box = this.getBox(strokes);
        if (sx !== 0 || sy !== 0) {
            if (sx > 100) {
                sx -= 200;
            }
            else {
                sx2 = 0;
                sy2 = 0;
            }
        }
        strokes.forEach(function (stroke) {
            if (sx !== 0 || sy !== 0) {
                stroke.stretch(sx, sx2, sy, sy2, box.minX, box.maxX, box.minY, box.maxY);
            }
            stroke.x1 = x1 + stroke.x1 * (x2 - x1) / 200;
            stroke.y1 = y1 + stroke.y1 * (y2 - y1) / 200;
            stroke.x2 = x1 + stroke.x2 * (x2 - x1) / 200;
            stroke.y2 = y1 + stroke.y2 * (y2 - y1) / 200;
            stroke.x3 = x1 + stroke.x3 * (x2 - x1) / 200;
            stroke.y3 = y1 + stroke.y3 * (y2 - y1) / 200;
            stroke.x4 = x1 + stroke.x4 * (x2 - x1) / 200;
            stroke.y4 = y1 + stroke.y4 * (y2 - y1) / 200;
        });
        return strokes;
    };
    Kage.prototype.getBox = function (strokes) {
        var minX = 200;
        var minY = 200;
        var maxX = 0;
        var maxY = 0;
        strokes.forEach(function (stroke) {
            var _a = stroke.getBox(), sminX = _a.minX, smaxX = _a.maxX, sminY = _a.minY, smaxY = _a.maxY;
            minX = Math.min(minX, sminX);
            maxX = Math.max(maxX, smaxX);
            minY = Math.min(minY, sminY);
            maxY = Math.max(maxY, smaxY);
        });
        return { minX: minX, maxX: maxX, minY: minY, maxY: maxY };
    };
    Kage.prototype.adjustStrokes = function (strokesArray) {
        this.adjustHane(strokesArray);
        this.adjustMage(strokesArray);
        this.adjustTate(strokesArray);
        this.adjustKakato(strokesArray);
        this.adjustUroko(strokesArray);
        this.adjustUroko2(strokesArray);
        this.adjustKirikuchi(strokesArray);
        return strokesArray;
    };
    Kage.prototype.adjustHane = function (strokesArray) {
        strokesArray.forEach(function (stroke, i) {
            if ((stroke.a1 === 1 || stroke.a1 === 2 || stroke.a1 === 6)
                && stroke.a3_100 === 4 && stroke.opt2 === 0 && stroke.mageAdjustment === 0) {
                var lpx_1; // lastPointX
                var lpy_1; // lastPointY
                if (stroke.a1 === 1) {
                    lpx_1 = stroke.x2;
                    lpy_1 = stroke.y2;
                }
                else if (stroke.a1 === 2) {
                    lpx_1 = stroke.x3;
                    lpy_1 = stroke.y3;
                }
                else {
                    lpx_1 = stroke.x4;
                    lpy_1 = stroke.y4;
                }
                var mn_1 = Infinity; // mostNear
                if (lpx_1 + 18 < 100) {
                    mn_1 = lpx_1 + 18;
                }
                strokesArray.forEach(function (stroke2, j) {
                    if (i !== j
                        && stroke2.a1 === 1
                        && stroke2.x1 === stroke2.x2 && stroke2.x1 < lpx_1
                        && stroke2.y1 <= lpy_1 && stroke2.y2 >= lpy_1) {
                        if (lpx_1 - stroke2.x1 < 100) {
                            mn_1 = Math.min(mn_1, lpx_1 - stroke2.x1);
                        }
                    }
                });
                if (mn_1 !== Infinity) {
                    stroke.opt2 += 7 - Math.floor(mn_1 / 15);
                }
            }
        });
        return strokesArray;
    };
    Kage.prototype.adjustMage = function (strokesArray) {
        var _this = this;
        strokesArray.forEach(function (stroke, i) {
            if (stroke.a1 === 3 && stroke.y2 === stroke.y3) {
                strokesArray.forEach(function (stroke2, j) {
                    if (i !== j && ((stroke2.a1 === 1
                        && stroke2.y1 === stroke2.y2
                        && !(stroke.x2 + 1 > stroke2.x2 || stroke.x3 - 1 < stroke2.x1)
                        && util_1.round(Math.abs(stroke.y2 - stroke2.y1)) < _this.kMinWidthT * _this.kAdjustMageStep) || (stroke2.a1 === 3
                        && stroke2.y2 === stroke2.y3
                        && !(stroke.x2 + 1 > stroke2.x3 || stroke.x3 - 1 < stroke2.x2)
                        && util_1.round(Math.abs(stroke.y2 - stroke2.y2)) < _this.kMinWidthT * _this.kAdjustMageStep))) {
                        stroke.mageAdjustment += _this.kAdjustMageStep - Math.floor(Math.abs(stroke.y2 - stroke2.y2) / _this.kMinWidthT);
                        if (stroke.mageAdjustment > _this.kAdjustMageStep) {
                            stroke.mageAdjustment = _this.kAdjustMageStep;
                        }
                    }
                });
            }
        });
        return strokesArray;
    };
    Kage.prototype.adjustTate = function (strokesArray) {
        var _this = this;
        strokesArray.forEach(function (stroke, i) {
            if ((stroke.a1 === 1 || stroke.a1 === 3 || stroke.a1 === 7)
                && stroke.x1 === stroke.x2) {
                strokesArray.forEach(function (stroke2, j) {
                    if (i !== j
                        && (stroke2.a1 === 1 || stroke2.a1 === 3 || stroke2.a1 === 7)
                        && stroke2.x1 === stroke2.x2
                        && !(stroke.y1 + 1 > stroke2.y2 || stroke.y2 - 1 < stroke2.y1)
                        && util_1.round(Math.abs(stroke.x1 - stroke2.x1)) < _this.kMinWidthT * _this.kAdjustTateStep) {
                        stroke.tateAdjustment += _this.kAdjustTateStep - Math.floor(Math.abs(stroke.x1 - stroke2.x1) / _this.kMinWidthT);
                        if (stroke.tateAdjustment > _this.kAdjustTateStep) {
                            stroke.tateAdjustment = _this.kAdjustTateStep;
                        }
                    }
                });
            }
        });
        return strokesArray;
    };
    Kage.prototype.adjustKakato = function (strokesArray) {
        var _this = this;
        strokesArray.forEach(function (stroke, i) {
            if (stroke.a1 === 1
                && (stroke.a3_100 === 13 || stroke.a3_100 === 23) && stroke.opt2 === 0 && stroke.mageAdjustment === 0) {
                for (var k = 0; k < _this.kAdjustKakatoStep; k++) {
                    if (_2d_1.isCrossBoxWithOthers(strokesArray, i, stroke.x2 - _this.kAdjustKakatoRangeX / 2, stroke.y2 + _this.kAdjustKakatoRangeY[k], stroke.x2 + _this.kAdjustKakatoRangeX / 2, stroke.y2 + _this.kAdjustKakatoRangeY[k + 1])
                        || util_1.round(stroke.y2 + _this.kAdjustKakatoRangeY[k + 1]) > 200 // adjust for baseline
                        || util_1.round(stroke.y2 - stroke.y1) < _this.kAdjustKakatoRangeY[k + 1] // for thin box
                    ) {
                        stroke.opt2 += 3 - k;
                        break;
                    }
                }
            }
        });
        return strokesArray;
    };
    Kage.prototype.adjustUroko = function (strokesArray) {
        var _this = this;
        strokesArray.forEach(function (stroke, i) {
            if (stroke.a1 === 1
                && stroke.a3_100 === 0 && stroke.opt2 === 0 && stroke.mageAdjustment === 0) { // no operation for TATE
                for (var k = 0; k < _this.kAdjustUrokoLengthStep; k++) {
                    var tx = void 0;
                    var ty = void 0;
                    var tlen = void 0;
                    if (stroke.y1 === stroke.y2) { // YOKO
                        tx = stroke.x2 - _this.kAdjustUrokoLine[k];
                        ty = stroke.y2 - 0.5;
                        tlen = stroke.x2 - stroke.x1; // should be Math.abs(...)?
                    }
                    else {
                        var _a = (stroke.x1 === stroke.x2)
                            ? [0, (stroke.y2 - stroke.y1) / (stroke.x2 - stroke.x1) > 0 ? 1 : -1] // maybe unnecessary?
                            : (stroke.x2 - stroke.x1 < 0)
                                ? util_1.normalize([stroke.x1 - stroke.x2, stroke.y1 - stroke.y2]) // for backward compatibility...
                                : util_1.normalize([stroke.x2 - stroke.x1, stroke.y2 - stroke.y1]), cosrad = _a[0], sinrad = _a[1];
                        tx = stroke.x2 - _this.kAdjustUrokoLine[k] * cosrad - 0.5 * sinrad;
                        ty = stroke.y2 - _this.kAdjustUrokoLine[k] * sinrad - 0.5 * cosrad;
                        tlen = util_1.hypot(stroke.y2 - stroke.y1, stroke.x2 - stroke.x1);
                    }
                    if (util_1.round(tlen) < _this.kAdjustUrokoLength[k]
                        || _2d_1.isCrossWithOthers(strokesArray, i, tx, ty, stroke.x2, stroke.y2)) {
                        stroke.opt2 += _this.kAdjustUrokoLengthStep - k;
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
            if (stroke.a1 === 1 && stroke.a3_100 === 0 && stroke.opt2 === 0 && stroke.mageAdjustment === 0
                && stroke.y1 === stroke.y2) {
                var pressure_1 = 0;
                strokesArray.forEach(function (stroke2, j) {
                    if (i !== j && ((stroke2.a1 === 1
                        && stroke2.y1 === stroke2.y2
                        && !(stroke.x1 + 1 > stroke2.x2 || stroke.x2 - 1 < stroke2.x1)
                        && util_1.round(Math.abs(stroke.y1 - stroke2.y1)) < _this.kAdjustUroko2Length) || (stroke2.a1 === 3
                        && stroke2.y2 === stroke2.y3
                        && !(stroke.x1 + 1 > stroke2.x3 || stroke.x2 - 1 < stroke2.x2)
                        && util_1.round(Math.abs(stroke.y1 - stroke2.y2)) < _this.kAdjustUroko2Length))) {
                        pressure_1 += Math.pow((_this.kAdjustUroko2Length - Math.abs(stroke.y1 - stroke2.y2)), 1.1);
                    }
                });
                // const result = Math.min(Math.floor(pressure / this.kAdjustUroko2Length), this.kAdjustUroko2Step) * 100;
                // if (stroke.a3 < result) {
                stroke.opt2 = Math.min(Math.floor(pressure_1 / _this.kAdjustUroko2Length), _this.kAdjustUroko2Step);
                // }
            }
        });
        return strokesArray;
    };
    Kage.prototype.adjustKirikuchi = function (strokesArray) {
        strokesArray.forEach(function (stroke) {
            if (stroke.a1 === 2
                && stroke.a2_100 === 32 && stroke.kirikuchiAdjustment === 0 && stroke.tateAdjustment === 0 && stroke.opt3 === 0
                && stroke.x1 > stroke.x2 && stroke.y1 < stroke.y2) {
                for (var _i = 0, strokesArray_1 = strokesArray; _i < strokesArray_1.length; _i++) { // no need to skip when i == j
                    var stroke2 = strokesArray_1[_i];
                    if (stroke2.a1 === 1
                        && stroke2.x1 < stroke.x1 && stroke2.x2 > stroke.x1 && stroke2.y1 === stroke.y1
                        && stroke2.y1 === stroke2.y2) {
                        stroke.kirikuchiAdjustment = 1;
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

},{"./2d":1,"./buhin":3,"./kagedf":8,"./polygons":10,"./stroke":11,"./util":12}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cdDrawLine = exports.cdDrawCurve = exports.cdDrawBezier = void 0;
var curve_1 = require("./curve");
var kage_1 = require("./kage");
var polygon_1 = require("./polygon");
var util_1 = require("./util");
function cdDrawCurveU(kage, polygons, x1, y1, sx1, sy1, sx2, sy2, x2, y2, ta1, ta2, opt1, opt2, opt3, opt4) {
    if (kage.kShotai === kage.kMincho) { // mincho
        var a1 = ta1;
        var a2 = ta2;
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
            case 32: // changed
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
            case 8: // get shorten for tail's circle
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
        if (sx1 === sx2 && sy1 === sy2 && kage.kUseCurve) {
            // Spline
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
            var poly = new polygon_1.Polygon([
                { x: ncl1[0], y: ncl1[1] },
                { x: ncl1[2], y: ncl1[3], off: true },
                { x: ncl1[4], y: ncl1[5] },
                { x: ncl2[2], y: ncl2[3], off: true },
                { x: ncl2[4], y: ncl2[5] },
            ]);
            var poly2 = new polygon_1.Polygon([
                { x: curveR[0][0], y: curveR[0][1] },
                {
                    x: offR1[2] - (ncl1[2] - offL1[2]),
                    y: offL1[3] - (ncl1[3] - offL1[3]),
                    off: true,
                },
                { x: curveR[indexR][0], y: curveR[indexR][1] },
                {
                    x: offR2[2] - (ncl2[2] - offL2[2]),
                    y: offL2[3] - (ncl2[3] - offL2[3]),
                    off: true,
                },
                { x: curveR[curveR.length - 1][0], y: curveR[curveR.length - 1][1] },
            ]);
            poly2.reverse();
            poly.concat(poly2);
            polygons.push(poly);
            // generating fatten curve -- end
        }
        else {
            var poly = new polygon_1.Polygon();
            var poly2 = new polygon_1.Polygon();
            if (sx1 === sx2 && sy1 === sy2) {
                // Spline
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
                    var _h = (util_1.round(ix) === 0 && util_1.round(iy) === 0)
                        ? [-kMinWidthT * deltad, 0] // ?????
                        : util_1.normalize([-iy, ix], kMinWidthT * deltad), ia = _h[0], ib = _h[1];
                    // copy to polygon structure
                    poly.push(x - ia, y - ib);
                    poly2.push(x + ia, y + ib);
                }
            }
            else { // Bezier
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
                    var _j = (util_1.round(ix) === 0 && util_1.round(iy) === 0)
                        ? [-kMinWidthT * deltad, 0] // ?????
                        : util_1.normalize([-iy, ix], kMinWidthT * deltad), ia = _j[0], ib = _j[1];
                    // copy to polygon structure
                    poly.push(x - ia, y - ib);
                    poly2.push(x + ia, y + ib);
                }
            }
            // suiheisen ni setsuzoku
            if (a1 === 132) {
                for (var index = 0, length_1 = poly2.length; index + 1 < length_1; index++) {
                    var point1 = poly2.get(index);
                    var point2 = poly2.get(index + 1);
                    if (point1.y <= y1 && y1 <= point2.y) {
                        var newx1 = point2.x + (y1 - point2.y) * (point1.x - point2.x) / (point1.y - point2.y);
                        var newy1 = y1;
                        var point3 = poly.get(0);
                        var point4 = poly.get(1);
                        var newx2 = point3.x + (y1 - point3.y) * (point3.x - point4.x) / (point3.y - point4.y);
                        var newy2 = y1;
                        for (var i = 0; i < index; i++) {
                            poly2.shift();
                        }
                        poly2.set(0, newx1, newy1);
                        poly.unshift(newx2, newy2);
                        break;
                    }
                }
            }
            // suiheisen ni setsuzoku 2
            if (a1 === 22 && (sx1 === sx2 && sy1 === sy2 && y1 > y2 || !(sx1 === sx2 && sy1 === sy2) && x1 > sx1)) {
                for (var index = 0, length_2 = poly2.length; index + 1 < length_2; index++) {
                    var point1 = poly2.get(index);
                    var point2 = poly2.get(index + 1);
                    if (point1.y <= y1 && y1 <= point2.y) {
                        var newx1 = point2.x + (point1.x - point2.x) * (point2.y - y1) / (point2.y - point1.y);
                        var newy1 = y1;
                        var point3 = poly.get(0);
                        var point4 = poly.get(1);
                        var newx2 = point3.x + (point3.x - point4.x - 1) * (point3.y - y1) / (point4.y - point3.y);
                        var newy2 = y1 + 1;
                        for (var i = 0; i < index; i++) {
                            poly2.shift();
                        }
                        poly2.set(0, newx1, newy1);
                        poly.unshift(newx2, newy2);
                        break;
                    }
                }
            }
            poly2.reverse();
            poly.concat(poly2);
            polygons.push(poly);
        }
        // process for head of stroke
        if (a1 === 12) {
            var _k = (x1 === x2)
                ? [1, 0] // ?????
                : (sx1 === x1)
                    ? [sy1 < y1 ? 1 : -1, 0] // for backward compatibility...
                    : util_1.normalize([sy1 - y1, -(sx1 - x1)]), dx = _k[0], dy = _k[1];
            var poly = new polygon_1.Polygon([
                { x: -kMinWidthT, y: 0 },
                { x: +kMinWidthT, y: 0 },
                { x: -kMinWidthT, y: -kMinWidthT },
            ]).transformMatrix2(dx, dy).translate(x1, y1);
            polygons.push(poly);
        }
        if (a1 === 0) {
            if (y1 <= y2) { // from up to bottom
                var type = Math.atan2(Math.abs(y1 - sy1), Math.abs(x1 - sx1)) / Math.PI * 2 - 0.4;
                if (type > 0) {
                    type *= 2;
                }
                else {
                    type *= 16;
                }
                var pm = type < 0 ? -1 : 1;
                var move = type < 0 ? -type * kage.kMinWidthY : 0;
                var _l = (x1 === sx1)
                    ? [1, 0] // ?????
                    : util_1.normalize([sy1 - y1, -(sx1 - x1)]), XX = _l[0], XY = _l[1];
                var poly = new polygon_1.Polygon([
                    { x: -kMinWidthT, y: 1 },
                    { x: +kMinWidthT, y: 0 },
                    { x: -kMinWidthT * pm, y: -kage.kMinWidthY * type * pm },
                ]).transformMatrix2(XX, XY).translate(x1, y1);
                // if(x1 > x2){
                //  poly.reverse();
                // }
                polygons.push(poly);
                // beginning of the stroke
                var poly2 = new polygon_1.Polygon();
                poly2.push(kMinWidthT, -move);
                if (x1 === sx1 && y1 === sy1) { // ?????
                    // type === -6.4 && pm === -1 && move === 6.4 * kage.kMinWidthY
                    poly2.push(kMinWidthT * 1.5, kage.kMinWidthY - move);
                    poly2.push(kMinWidthT - 2, kage.kMinWidthY * 2 + 1);
                }
                else {
                    poly2.push(kMinWidthT * 1.5, kage.kMinWidthY - move * 1.2);
                    poly2.push(kMinWidthT - 2, kage.kMinWidthY * 2 - move * 0.8 + 1);
                    // if(x1 < x2){
                    //  poly2.reverse();
                    // }
                }
                poly2.transformMatrix2(XX, XY).translate(x1, y1);
                polygons.push(poly2);
            }
            else { // bottom to up
                var _m = (x1 === sx1)
                    ? [1, 0] // ?????
                    : util_1.normalize([sy1 - y1, -(sx1 - x1)]), XX = _m[0], XY = _m[1];
                var poly = new polygon_1.Polygon([
                    { x: -kMinWidthT, y: 0 },
                    { x: +kMinWidthT, y: 0 },
                    { x: +kMinWidthT, y: -kage.kMinWidthY },
                ]);
                poly.transformMatrix2(XX, XY).translate(x1, y1);
                // if(x1 < x2){
                //  poly.reverse();
                // }
                polygons.push(poly);
                // beginning of the stroke
                var poly2 = new polygon_1.Polygon([
                    { x: -kMinWidthT, y: 0 },
                    { x: -kMinWidthT * 1.5, y: +kage.kMinWidthY },
                    { x: -kMinWidthT * 0.5, y: +kage.kMinWidthY * 3 },
                ]);
                // if(x1 < x2){
                //  poly2.reverse();
                // }
                poly2.transformMatrix2(XX, XY).translate(x1, y1);
                polygons.push(poly2);
            }
        }
        if (a1 === 22) { // box's up-right corner, any time same degree
            var poly = new polygon_1.Polygon([
                { x: -kMinWidthT, y: -kage.kMinWidthY },
                { x: 0, y: -kage.kMinWidthY - kage.kWidth },
                { x: +kMinWidthT + kage.kWidth, y: +kage.kMinWidthY },
                { x: +kMinWidthT, y: +kMinWidthT - 1 },
                { x: -kMinWidthT, y: +kMinWidthT + 4 },
            ]);
            poly.translate(x1, y1);
            polygons.push(poly);
        }
        // process for tail
        if (a2 === 1 || a2 === 8 || a2 === 15) { // the last filled circle ... it can change 15->5
            var _o = (sx2 === x2)
                ? [0, 1] // ?????
                : (sy2 === y2)
                    ? [1, 0] // ?????
                    : util_1.normalize([x2 - sx2, y2 - sy2]), dx = _o[0], dy = _o[1];
            var poly = new polygon_1.Polygon((kage.kUseCurve)
                ? // by curve path
                    [
                        { x: 0, y: -kMinWidthT2 },
                        { x: +kMinWidthT2 * 0.9, y: -kMinWidthT2 * 0.9, off: true },
                        { x: +kMinWidthT2, y: 0 },
                        { x: +kMinWidthT2 * 0.9, y: +kMinWidthT2 * 0.9, off: true },
                        { x: 0, y: +kMinWidthT2 },
                    ]
                : // by polygon
                    [
                        { x: 0, y: -kMinWidthT2 },
                        { x: +kMinWidthT2 * 0.7, y: -kMinWidthT2 * 0.7 },
                        { x: +kMinWidthT2, y: 0 },
                        { x: +kMinWidthT2 * 0.7, y: +kMinWidthT2 * 0.7 },
                        { x: 0, y: +kMinWidthT2 },
                    ]);
            if (sx2 === x2) {
                poly.reverse();
            }
            poly.transformMatrix2(dx, dy).translate(x2, y2);
            polygons.push(poly);
        }
        if (a2 === 9 || (a1 === 7 && a2 === 0)) { // Math.sinnyu & L2RD Harai ... no need for a2=9
            var type2 = (Math.atan2(Math.abs(y2 - sy2), Math.abs(x2 - sx2)) / Math.PI * 2 - 0.6);
            if (type2 > 0) {
                type2 *= 8;
            }
            else {
                type2 *= 3;
            }
            var pm2 = type2 < 0 ? -1 : 1;
            var _p = (sy2 === y2)
                ? [0, 1] // ?????
                : (sx2 === x2)
                    ? [y2 > sy2 ? 1 : -1, 0] // for backward compatibility...
                    : util_1.normalize([-(y2 - sy2), x2 - sx2], 1), dx = _p[0], dy = _p[1];
            var poly = new polygon_1.Polygon([
                { x: +kMinWidthT * kage.kL2RDfatten, y: 0 },
                { x: -kMinWidthT * kage.kL2RDfatten, y: 0 },
                { x: +pm2 * kMinWidthT * kage.kL2RDfatten, y: -Math.abs(type2) * kMinWidthT * kage.kL2RDfatten },
            ]);
            poly.transformMatrix2(dx, dy).translate(x2, y2);
            polygons.push(poly);
        }
        if (a2 === 15) { // jump up ... it can change 15->5
            // anytime same degree
            var poly = new polygon_1.Polygon([
                { x: 0, y: -kMinWidthT + 1 },
                { x: +2, y: -kMinWidthT - kage.kWidth * 5 },
                { x: 0, y: -kMinWidthT - kage.kWidth * 5 },
                { x: -kMinWidthT, y: -kMinWidthT + 1 },
            ]);
            if (y1 >= y2) {
                poly.rotate180();
            }
            poly.translate(x2, y2);
            polygons.push(poly);
        }
        if (a2 === 14) { // jump to left, allways go left
            var poly = new polygon_1.Polygon([
                { x: 0, y: 0 },
                { x: 0, y: -kMinWidthT },
                { x: -kage.kWidth * 4 * Math.min(1 - opt2 / 10, Math.pow((kMinWidthT / kage.kMinWidthT), 3)), y: -kMinWidthT },
                { x: -kage.kWidth * 4 * Math.min(1 - opt2 / 10, Math.pow((kMinWidthT / kage.kMinWidthT), 3)), y: -kMinWidthT * 0.5 },
            ]);
            // poly.reverse();
            poly.translate(x2, y2);
            polygons.push(poly);
        }
    }
    else { // gothic
        var a1 = ta1;
        var a2 = ta2;
        if (a1 % 10 === 2) {
            var _q = (x1 === sx1 && y1 === sy1)
                ? [0, kage.kWidth] // ?????
                : util_1.normalize([x1 - sx1, y1 - sy1], kage.kWidth), dx1 = _q[0], dy1 = _q[1];
            x1 += dx1;
            y1 += dy1;
        }
        if (a1 % 10 === 3) {
            var _r = (x1 === sx1 && y1 === sy1)
                ? [0, kage.kWidth * kage.kKakato] // ?????
                : util_1.normalize([x1 - sx1, y1 - sy1], kage.kWidth * kage.kKakato), dx1 = _r[0], dy1 = _r[1];
            x1 += dx1;
            y1 += dy1;
        }
        if (a2 % 10 === 2) {
            var _s = (sx2 === x2 && sy2 === y2)
                ? [0, -kage.kWidth] // ?????
                : util_1.normalize([x2 - sx2, y2 - sy2], kage.kWidth), dx2 = _s[0], dy2 = _s[1];
            x2 += dx2;
            y2 += dy2;
        }
        if (a2 % 10 === 3) {
            var _t = (sx2 === x2 && sy2 === y2)
                ? [0, -kage.kWidth * kage.kKakato] // ?????
                : util_1.normalize([x2 - sx2, y2 - sy2], kage.kWidth * kage.kKakato), dx2 = _t[0], dy2 = _t[1];
            x2 += dx2;
            y2 += dy2;
        }
        var poly = new polygon_1.Polygon();
        var poly2 = new polygon_1.Polygon();
        for (var tt = 0; tt <= 1000; tt += kage.kRate) {
            var t = tt / 1000;
            var x = void 0;
            var y = void 0;
            var ix = void 0;
            var iy = void 0;
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
            var _u = (util_1.round(ix) === 0 && util_1.round(iy) === 0)
                ? [-kage.kWidth, 0] // ?????
                : util_1.normalize([-iy, ix], kage.kWidth), ia = _u[0], ib = _u[1];
            // save to polygon
            poly.push(x - ia, y - ib);
            poly2.push(x + ia, y + ib);
        }
        poly2.reverse();
        poly.concat(poly2);
        polygons.push(poly);
    }
}
function cdDrawBezier(kage, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a1, a2, opt1, opt2, opt3, opt4) {
    cdDrawCurveU(kage, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a1, a2, opt1, opt2, opt3, opt4);
}
exports.cdDrawBezier = cdDrawBezier;
function cdDrawCurve(kage, polygons, x1, y1, x2, y2, x3, y3, a1, a2, opt1, opt2, opt3, opt4) {
    cdDrawCurveU(kage, polygons, x1, y1, x2, y2, x2, y2, x3, y3, a1, a2, opt1, opt2, opt3, opt4);
}
exports.cdDrawCurve = cdDrawCurve;
function cdDrawLine(kage, polygons, tx1, ty1, tx2, ty2, ta1, ta2, opt1, opt2) {
    if (kage.kShotai === kage.kMincho) { // mincho
        var x1 = tx1;
        var y1 = ty1;
        var x2 = tx2;
        var y2 = ty2;
        var a1 = ta1;
        var a2 = ta2;
        var kMinWidthT = kage.kMinWidthT - opt1 / 2;
        if (x1 === x2 || y1 !== y2 && (x1 > x2 || Math.abs(y2 - y1) >= Math.abs(x2 - x1) || a1 === 6 || a2 === 6)) {
            // if TATE stroke, use y-axis
            // for others, use x-axis
            // KAKUDO GA FUKAI or KAGI NO YOKO BOU
            var _a = (x1 === x2)
                ? [0, 1] // ?????
                : util_1.normalize([x2 - x1, y2 - y1]), cosrad = _a[0], sinrad = _a[1];
            var poly0 = new polygon_1.Polygon(4);
            switch (a1) {
                case 0:
                    poly0.set(0, x1 + sinrad * kMinWidthT + cosrad * kage.kMinWidthY / 2, y1 - cosrad * kMinWidthT + sinrad * kage.kMinWidthY / 2);
                    poly0.set(3, x1 - sinrad * kMinWidthT - cosrad * kage.kMinWidthY / 2, y1 + cosrad * kMinWidthT - sinrad * kage.kMinWidthY / 2);
                    break;
                case 1:
                case 6: // ... no need
                    poly0.set(0, x1 + sinrad * kMinWidthT, y1 - cosrad * kMinWidthT);
                    poly0.set(3, x1 - sinrad * kMinWidthT, y1 + cosrad * kMinWidthT);
                    break;
                case 12:
                    poly0.set(0, x1 + sinrad * kMinWidthT - cosrad * kage.kMinWidthY, y1 - cosrad * kMinWidthT - sinrad * kage.kMinWidthY);
                    poly0.set(3, x1 - sinrad * kMinWidthT - cosrad * (kMinWidthT + kage.kMinWidthY), y1 + cosrad * kMinWidthT - sinrad * (kMinWidthT + kage.kMinWidthY));
                    break;
                case 22:
                    if (x1 === x2) {
                        poly0.set(0, x1 + kMinWidthT, y1);
                        poly0.set(3, x1 - kMinWidthT, y1);
                    }
                    else {
                        var rad = Math.atan((y2 - y1) / (x2 - x1));
                        var v = x1 > x2 ? -1 : 1;
                        // TODO: why " + 1" ???
                        poly0.set(0, x1 + (kMinWidthT * v + 1) / Math.sin(rad), y1 + 1);
                        poly0.set(3, x1 - (kMinWidthT * v) / Math.sin(rad), y1);
                    }
                    break;
                case 32:
                    if (x1 === x2) {
                        poly0.set(0, x1 + kMinWidthT, y1 - kage.kMinWidthY);
                        poly0.set(3, x1 - kMinWidthT, y1 - kage.kMinWidthY);
                    }
                    else {
                        poly0.set(0, x1 + kMinWidthT / sinrad, y1);
                        poly0.set(3, x1 - kMinWidthT / sinrad, y1);
                    }
                    break;
            }
            switch (a2) {
                case 0:
                    if (a1 === 6) { // KAGI's tail ... no need
                        poly0.set(1, x2 + sinrad * kMinWidthT, y2 - cosrad * kMinWidthT);
                        poly0.set(2, x2 - sinrad * kMinWidthT, y2 + cosrad * kMinWidthT);
                    }
                    else {
                        poly0.set(1, x2 + sinrad * kMinWidthT - cosrad * kMinWidthT / 2, y2 - cosrad * kMinWidthT - sinrad * kMinWidthT / 2);
                        poly0.set(2, x2 - sinrad * kMinWidthT + cosrad * kMinWidthT / 2, y2 + cosrad * kMinWidthT + sinrad * kMinWidthT / 2);
                    }
                    break;
                case 5:
                    if (x1 === x2) {
                        break;
                    }
                // falls through
                case 1: // is needed?
                    poly0.set(1, x2 + sinrad * kMinWidthT, y2 - cosrad * kMinWidthT);
                    poly0.set(2, x2 - sinrad * kMinWidthT, y2 + cosrad * kMinWidthT);
                    break;
                case 13:
                    poly0.set(1, x2 + sinrad * kMinWidthT + cosrad * kage.kAdjustKakatoL[opt2], y2 - cosrad * kMinWidthT + sinrad * kage.kAdjustKakatoL[opt2]);
                    poly0.set(2, x2 - sinrad * kMinWidthT + cosrad * (kage.kAdjustKakatoL[opt2] + kMinWidthT), y2 + cosrad * kMinWidthT + sinrad * (kage.kAdjustKakatoL[opt2] + kMinWidthT));
                    break;
                case 23:
                    poly0.set(1, x2 + sinrad * kMinWidthT + cosrad * kage.kAdjustKakatoR[opt2], y2 - cosrad * kMinWidthT + sinrad * kage.kAdjustKakatoR[opt2]);
                    poly0.set(2, x2 - sinrad * kMinWidthT + cosrad * (kage.kAdjustKakatoR[opt2] + kMinWidthT), y2 + cosrad * kMinWidthT + sinrad * (kage.kAdjustKakatoR[opt2] + kMinWidthT));
                    break;
                case 24: // for T/H design
                    if (x1 === x2) {
                        poly0.set(1, x2 + kMinWidthT, y2 + kage.kMinWidthY);
                        poly0.set(2, x2 - kMinWidthT, y2 + kage.kMinWidthY);
                    }
                    else {
                        poly0.set(1, x2 + kMinWidthT / sinrad, y2);
                        poly0.set(2, x2 - kMinWidthT / sinrad, y2);
                    }
                    break;
                case 32:
                    if (x1 === x2) {
                        poly0.set(1, x2 + kMinWidthT, y2 + kage.kMinWidthY);
                        poly0.set(2, x2 - kMinWidthT, y2 + kage.kMinWidthY);
                    }
                    else {
                        poly0.set(1, x2 + kMinWidthT / sinrad, y2);
                        poly0.set(2, x2 - kMinWidthT / sinrad, y2);
                    }
                    break;
            }
            polygons.push(poly0);
            if (a2 === 24) { // for T design
                var poly = new polygon_1.Polygon([
                    { x: 0, y: +kage.kMinWidthY },
                    (x1 === x2) // ?????
                        ? { x: +kMinWidthT, y: -kage.kMinWidthY * 3 }
                        : { x: +kMinWidthT * 0.5, y: -kage.kMinWidthY * 4 },
                    { x: +kMinWidthT * 2, y: -kage.kMinWidthY },
                    { x: +kMinWidthT * 2, y: +kage.kMinWidthY },
                ]);
                poly.translate(x2, y2);
                polygons.push(poly);
            }
            if (a2 === 13 && opt2 === 4) { // for new GTH box's left bottom corner
                if (x1 === x2) {
                    var poly = new polygon_1.Polygon([
                        { x: -kMinWidthT, y: -kage.kMinWidthY * 3 },
                        { x: -kMinWidthT * 2, y: 0 },
                        { x: -kage.kMinWidthY, y: +kage.kMinWidthY * 5 },
                        { x: +kMinWidthT, y: +kage.kMinWidthY },
                    ]);
                    poly.translate(x2, y2);
                    polygons.push(poly);
                }
                else { // MUKI KANKEINASHI
                    var m = (x1 > x2 && y1 !== y2)
                        ? Math.floor((x1 - x2) / (y2 - y1) * 3)
                        : 0;
                    var poly = new polygon_1.Polygon([
                        { x: 0, y: -kage.kMinWidthY * 5 },
                        { x: -kMinWidthT * 2, y: 0 },
                        { x: -kage.kMinWidthY, y: +kage.kMinWidthY * 5 },
                        { x: +kMinWidthT, y: +kage.kMinWidthY },
                        { x: 0, y: 0 },
                    ]);
                    poly.translate(x2 + m, y2);
                    polygons.push(poly);
                }
            }
            if (a1 === 22) {
                // box's right top corner
                // SHIKAKU MIGIUE UROKO NANAME DEMO MASSUGU MUKI
                var poly = new polygon_1.Polygon();
                poly.push(-kMinWidthT, -kage.kMinWidthY);
                poly.push(0, -kage.kMinWidthY - kage.kWidth);
                poly.push(+kMinWidthT + kage.kWidth, +kage.kMinWidthY);
                if (x1 === x2) {
                    poly.push(+kMinWidthT, +kMinWidthT);
                    poly.push(-kMinWidthT, 0);
                }
                else {
                    poly.push(+kMinWidthT, +kMinWidthT - 1);
                    poly.push(-kMinWidthT, +kMinWidthT + 4);
                }
                poly.translate(x1, y1);
                polygons.push(poly);
            }
            if (a1 === 0) { // beginning of the stroke
                var poly = new polygon_1.Polygon([
                    {
                        x: +kMinWidthT * sinrad + kage.kMinWidthY * 0.5 * cosrad,
                        y: +kMinWidthT * -cosrad + kage.kMinWidthY * 0.5 * sinrad,
                    },
                    {
                        x: +(kMinWidthT + kMinWidthT * 0.5) * sinrad + (kage.kMinWidthY * 0.5 + kage.kMinWidthY) * cosrad,
                        y: +(kMinWidthT + kMinWidthT * 0.5) * -cosrad + (kage.kMinWidthY * 0.5 + kage.kMinWidthY) * sinrad,
                    },
                    (x1 === x2) // ?????
                        ? {
                            x: +(kMinWidthT - 2) * sinrad + (kage.kMinWidthY * 0.5 + kage.kMinWidthY * 2 + 1) * cosrad,
                            y: +(kMinWidthT - 2) * -cosrad + (kage.kMinWidthY * 0.5 + kage.kMinWidthY * 2 + 1) * sinrad,
                        }
                        : {
                            x: +(kMinWidthT - 2) * sinrad + (kage.kMinWidthY * 0.5 + kage.kMinWidthY * 2) * cosrad,
                            y: +(kMinWidthT + 1) * -cosrad + (kage.kMinWidthY * 0.5 + kage.kMinWidthY * 2) * sinrad,
                        },
                ]);
                poly.translate(x1, y1);
                polygons.push(poly);
            }
            if (x1 === x2 && a2 === 1 || a1 === 6 && (a2 === 0 || x1 !== x2 && a2 === 5)) {
                // KAGI NO YOKO BOU NO SAIGO NO MARU ... no need only used at 1st=yoko
                var poly = new polygon_1.Polygon();
                if (kage.kUseCurve) {
                    poly.push(-sinrad * -kMinWidthT, +cosrad * -kMinWidthT);
                    poly.push(-cosrad * kMinWidthT * 0.9 + -sinrad * -kMinWidthT * 0.9, // typo?
                    +sinrad * kMinWidthT * 0.9 + cosrad * -kMinWidthT * 0.9, true);
                    poly.push(+cosrad * kMinWidthT, +sinrad * kMinWidthT);
                    poly.push(+cosrad * kMinWidthT * 0.9 + -sinrad * kMinWidthT * 0.9, +sinrad * kMinWidthT * 0.9 + cosrad * kMinWidthT * 0.9, true);
                    poly.push(-sinrad * kMinWidthT, +cosrad * kMinWidthT);
                }
                else {
                    var r = (x1 === x2 && (a1 === 6 && a2 === 0 || a2 === 1))
                        ? 0.6
                        : 0.8; // ?????
                    poly.push(0, -kMinWidthT);
                    poly.push(+kMinWidthT * r, -kMinWidthT * 0.6);
                    poly.push(+kMinWidthT, 0);
                    poly.push(+kMinWidthT * r, +kMinWidthT * 0.6);
                    poly.push(0, +kMinWidthT);
                    poly.transformMatrix2(cosrad, sinrad);
                }
                if (x1 === x2 && (a1 === 6 && a2 === 0 || a2 === 1)) {
                    // for backward compatibility
                    poly.reverse();
                }
                poly.translate(x2, y2);
                // poly.reverse(); // for fill-rule
                polygons.push(poly);
            }
            if (x1 !== x2 && a1 === 6 && a2 === 5) {
                // KAGI NO YOKO BOU NO HANE
                var rv = x1 < x2 ? 1 : -1;
                var poly = new polygon_1.Polygon([
                    { x: 0, y: +rv * (-kMinWidthT + 1) },
                    { x: +2, y: +rv * (-kMinWidthT - kage.kWidth * 5) },
                    { x: 0, y: +rv * (-kMinWidthT - kage.kWidth * 5) },
                    { x: -kMinWidthT, y: -kMinWidthT + 1 },
                ]);
                poly.transformMatrix2(cosrad, sinrad).translate(x2, y2);
                polygons.push(poly);
            }
        }
        else if (y1 === y2 && a1 === 6) {
            // if it is YOKO stroke, use x-axis
            // if it is KAGI's YOKO stroke, get bold
            // x1 !== x2 && y1 === y2 && a1 === 6
            var poly0 = new polygon_1.Polygon([
                { x: x1, y: y1 - kMinWidthT },
                { x: x2, y: y2 - kMinWidthT },
                { x: x2, y: y2 + kMinWidthT },
                { x: x1, y: y1 + kMinWidthT },
            ]);
            polygons.push(poly0);
            if (a2 === 1 || a2 === 0 || a2 === 5) { // no need a2=1
                // KAGI NO YOKO BOU NO SAIGO NO MARU
                var _b = (x1 < x2) ? [1, 0] : [-1, 0], cosrad = _b[0], sinrad = _b[1];
                var r = 0.6;
                var poly = new polygon_1.Polygon((kage.kUseCurve)
                    ? [
                        { x: 0, y: -kMinWidthT },
                        { x: +kMinWidthT * 0.9, y: -kMinWidthT * 0.9, off: true },
                        { x: +kMinWidthT, y: 0 },
                        { x: +kMinWidthT * 0.9, y: +kMinWidthT * 0.9, off: true },
                        { x: 0, y: +kMinWidthT },
                    ]
                    : [
                        { x: 0, y: -kMinWidthT },
                        { x: +kMinWidthT * r, y: -kMinWidthT * 0.6 },
                        { x: +kMinWidthT, y: 0 },
                        { x: +kMinWidthT * r, y: +kMinWidthT * 0.6 },
                        { x: 0, y: +kMinWidthT },
                    ]);
                if (x1 >= x2) {
                    poly.reverse();
                }
                poly.transformMatrix2(cosrad, sinrad).translate(x2, y2);
                polygons.push(poly);
            }
            if (a2 === 5) {
                // KAGI NO YOKO BOU NO HANE
                var poly = new polygon_1.Polygon([
                    // { x: 0, y: -kMinWidthT + 1 },
                    { x: 0, y: -kMinWidthT },
                    { x: +2, y: -kMinWidthT - kage.kWidth * (4 * (1 - opt1 / kage.kAdjustMageStep) + 1) },
                    { x: 0, y: -kMinWidthT - kage.kWidth * (4 * (1 - opt1 / kage.kAdjustMageStep) + 1) },
                    // { x: -kMinWidthT, y: -kMinWidthT + 1 },
                    { x: -kMinWidthT, y: -kMinWidthT },
                ]);
                // poly2.reverse(); // for fill-rule
                if (x1 >= x2) {
                    poly.reflectX();
                }
                poly.translate(x2, y2);
                polygons.push(poly);
            }
        }
        else {
            // for others, use x-axis
            // ASAI KAUDO
            var _c = (y1 === y2) ? [1, 0] : util_1.normalize([x2 - x1, y2 - y1]), cosrad = _c[0], sinrad = _c[1];
            // always same
            var poly = new polygon_1.Polygon([
                { x: x1 + sinrad * kage.kMinWidthY, y: y1 - cosrad * kage.kMinWidthY },
                { x: x2 + sinrad * kage.kMinWidthY, y: y2 - cosrad * kage.kMinWidthY },
                { x: x2 - sinrad * kage.kMinWidthY, y: y2 + cosrad * kage.kMinWidthY },
                { x: x1 - sinrad * kage.kMinWidthY, y: y1 + cosrad * kage.kMinWidthY },
            ]);
            polygons.push(poly);
            // UROKO
            if (a2 === 0) {
                var poly2 = new polygon_1.Polygon([
                    { x: +sinrad * kage.kMinWidthY, y: -cosrad * kage.kMinWidthY },
                    { x: -cosrad * kage.kAdjustUrokoX[opt2], y: -sinrad * kage.kAdjustUrokoX[opt2] },
                    { x: -(cosrad - sinrad) * kage.kAdjustUrokoX[opt2] / 2, y: -(sinrad + cosrad) * kage.kAdjustUrokoY[opt2] },
                ]);
                poly2.translate(x2, y2);
                polygons.push(poly2);
            }
        }
    }
    else { // gothic
        var x1 = void 0;
        var y1 = void 0;
        var x2 = void 0;
        var y2 = void 0;
        var a1 = void 0;
        var a2 = void 0;
        if (tx1 === tx2 && ty1 > ty2 || tx1 > tx2) {
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
        var _d = (x1 === x2 && y1 === y2) ? [0, kage.kWidth] : util_1.normalize([x2 - x1, y2 - y1], kage.kWidth), dx = _d[0], dy = _d[1];
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
        var poly = new polygon_1.Polygon([
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
}
exports.cdDrawLine = cdDrawLine;

},{"./curve":4,"./kage":6,"./polygon":9,"./util":12}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dfDrawFont = void 0;
var kagecd_1 = require("./kagecd");
var util_1 = require("./util");
function dfDrawFont(kage, polygons, _a) {
    var a1 = _a.a1, x1 = _a.x1, y1 = _a.y1, x2 = _a.x2, y2 = _a.y2, x3 = _a.x3, y3 = _a.y3, x4 = _a.x4, y4 = _a.y4, a2_100 = _a.a2_100, kirikuchiAdjustment = _a.kirikuchiAdjustment, tateAdjustment = _a.tateAdjustment, opt3 = _a.opt3, a3_100 = _a.a3_100, opt2 = _a.opt2, mageAdjustment = _a.mageAdjustment;
    if (kage.kShotai === kage.kMincho) {
        switch (a1 % 100) { // ... no need to divide
            case 0:
                if (a2_100 === 98 && kirikuchiAdjustment === 0 && tateAdjustment === 0 && opt3 === 0) {
                    for (var _i = 0, _b = polygons.array; _i < _b.length; _i++) {
                        var polygon = _b[_i];
                        var inside = polygon.array.every(function (_a) {
                            var x = _a.x, y = _a.y;
                            return x1 <= x && x <= x2 && y1 <= y && y <= y2;
                        });
                        if (inside) {
                            polygon.reflectX().translate(x1 + x2, 0);
                        }
                    }
                }
                else if (a2_100 === 97 && kirikuchiAdjustment === 0 && tateAdjustment === 0 && opt3 === 0) {
                    for (var _c = 0, _d = polygons.array; _c < _d.length; _c++) {
                        var polygon = _d[_c];
                        var inside = polygon.array.every(function (_a) {
                            var x = _a.x, y = _a.y;
                            return x1 <= x && x <= x2 && y1 <= y && y <= y2;
                        });
                        if (inside) {
                            polygon.reflectY().translate(y1 + y2, 0);
                        }
                    }
                }
                else if (a2_100 === 99 && kirikuchiAdjustment === 0 && tateAdjustment === 0 && opt3 === 0 && a3_100 === 1 && opt2 === 0 && mageAdjustment === 0) {
                    for (var _e = 0, _f = polygons.array; _e < _f.length; _e++) {
                        var polygon = _f[_e];
                        var inside = polygon.array.every(function (_a) {
                            var x = _a.x, y = _a.y;
                            return x1 <= x && x <= x2 && y1 <= y && y <= y2;
                        });
                        if (inside) {
                            // polygon.translate(-x1, -y2).rotate90().translate(x1, y1);
                            polygon.rotate90().translate(x1 + y2, y1 - x1);
                        }
                    }
                }
                else if (a2_100 === 99 && kirikuchiAdjustment === 0 && tateAdjustment === 0 && opt3 === 0 && a3_100 === 2 && opt2 === 0 && mageAdjustment === 0) {
                    for (var _g = 0, _h = polygons.array; _g < _h.length; _g++) {
                        var polygon = _h[_g];
                        var inside = polygon.array.every(function (_a) {
                            var x = _a.x, y = _a.y;
                            return x1 <= x && x <= x2 && y1 <= y && y <= y2;
                        });
                        if (inside) {
                            polygon.rotate180().translate(x1 + x2, y1 + y2);
                        }
                    }
                }
                else if (a2_100 === 99 && kirikuchiAdjustment === 0 && tateAdjustment === 0 && opt3 === 0 && a3_100 === 3 && opt2 === 0 && mageAdjustment === 0) {
                    for (var _j = 0, _k = polygons.array; _j < _k.length; _j++) {
                        var polygon = _k[_j];
                        var inside = polygon.array.every(function (_a) {
                            var x = _a.x, y = _a.y;
                            return x1 <= x && x <= x2 && y1 <= y && y <= y2;
                        });
                        if (inside) {
                            // polygon.translate(-x1, -y1).rotate270().translate(x1, y2);
                            polygon.rotate270().translate(x1 - y1, y2 + x1);
                        }
                    }
                }
                break;
            case 1: {
                if (a3_100 === 4) {
                    var _l = (x1 === x2 && y1 === y2)
                        ? [0, kage.kMage] // ?????
                        : util_1.normalize([x1 - x2, y1 - y2], kage.kMage), dx1 = _l[0], dy1 = _l[1];
                    var tx1 = x2 + dx1;
                    var ty1 = y2 + dy1;
                    kagecd_1.cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment + opt3 * 10, 0);
                    kagecd_1.cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, x2 - kage.kMage * (((kage.kAdjustTateStep + 4) - tateAdjustment - opt3 * 10) / (kage.kAdjustTateStep + 4)), y2, 1, 14, tateAdjustment, opt2, opt3, mageAdjustment);
                }
                else {
                    kagecd_1.cdDrawLine(kage, polygons, x1, y1, x2, y2, a2_100 + kirikuchiAdjustment * 100, a3_100, tateAdjustment + opt3 * 10, opt2 + mageAdjustment * 10);
                }
                break;
            }
            case 2: {
                // case 12: // ... no need
                if (a3_100 === 4) {
                    var _m = (x2 === x3)
                        ? [0, -kage.kMage] // ?????
                        : (y2 === y3)
                            ? [-kage.kMage, 0] // ?????
                            : util_1.normalize([x2 - x3, y2 - y3], kage.kMage), dx1 = _m[0], dy1 = _m[1];
                    var tx1 = x3 + dx1;
                    var ty1 = y3 + dy1;
                    kagecd_1.cdDrawCurve(kage, polygons, x1, y1, x2, y2, tx1, ty1, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment, 0, opt3, 0);
                    kagecd_1.cdDrawCurve(kage, polygons, tx1, ty1, x3, y3, x3 - kage.kMage, y3, 1, 14, 0, opt2, 0, mageAdjustment);
                }
                else if (a3_100 === 5 && opt2 === 0 && mageAdjustment === 0) {
                    kagecd_1.cdDrawCurve(kage, polygons, x1, y1, x2, y2, x3, y3, a2_100 + kirikuchiAdjustment * 100, 15, tateAdjustment, 0, opt3, 0);
                }
                else {
                    kagecd_1.cdDrawCurve(kage, polygons, x1, y1, x2, y2, x3, y3, a2_100 + kirikuchiAdjustment * 100, a3_100, tateAdjustment, opt2, opt3, mageAdjustment);
                }
                break;
            }
            case 3: {
                var _o = (x1 === x2 && y1 === y2)
                    ? [0, kage.kMage] // ?????
                    : util_1.normalize([x1 - x2, y1 - y2], kage.kMage), dx1 = _o[0], dy1 = _o[1];
                var tx1 = x2 + dx1;
                var ty1 = y2 + dy1;
                var _p = (x2 === x3 && y2 === y3)
                    ? [0, -kage.kMage] // ?????
                    : util_1.normalize([x3 - x2, y3 - y2], kage.kMage), dx2 = _p[0], dy2 = _p[1];
                var tx2 = x2 + dx2;
                var ty2 = y2 + dy2;
                kagecd_1.cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment + opt3 * 10, 0);
                kagecd_1.cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1, 0, 0, tateAdjustment + opt3 * 10, mageAdjustment);
                if (a3_100 === 5 && opt2 === 0) {
                    var tx3 = x3;
                    var ty3 = y3;
                    if ((x2 < x3 && tx3 - tx2 > 0) || (x2 > x3 && tx2 - tx3 > 0)) { // for closer position
                        kagecd_1.cdDrawLine(kage, polygons, tx2, ty2, tx3, ty3, 6, 5, mageAdjustment, 0); // bolder by force
                    }
                }
                else {
                    kagecd_1.cdDrawLine(kage, polygons, tx2, ty2, x3, y3, 6, a3_100, mageAdjustment, opt2 + mageAdjustment * 10); // bolder by force
                }
                break;
            }
            case 12: {
                kagecd_1.cdDrawCurve(kage, polygons, x1, y1, x2, y2, x3, y3, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment, 0, opt3, 0);
                kagecd_1.cdDrawLine(kage, polygons, x3, y3, x4, y4, 6, a3_100, 0, opt2 + mageAdjustment * 10);
                break;
            }
            case 4: {
                var rate = util_1.hypot(x3 - x2, y3 - y2) / 120 * 6;
                if (rate > 6) {
                    rate = 6;
                }
                var _q = (x1 === x2 && y1 === y2)
                    ? [0, kage.kMage * rate] // ?????
                    : util_1.normalize([x1 - x2, y1 - y2], kage.kMage * rate), dx1 = _q[0], dy1 = _q[1];
                var tx1 = x2 + dx1;
                var ty1 = y2 + dy1;
                var _r = (x2 === x3 && y2 === y3)
                    ? [0, -kage.kMage * rate] // ?????
                    : util_1.normalize([x3 - x2, y3 - y2], kage.kMage * rate), dx2 = _r[0], dy2 = _r[1];
                var tx2 = x2 + dx2;
                var ty2 = y2 + dy2;
                kagecd_1.cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment + opt3 * 10, 0);
                kagecd_1.cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1, 0, 0, 0, 0);
                if (a3_100 === 5 && opt2 === 0 && mageAdjustment === 0) {
                    var tx3 = x3;
                    var ty3 = y3;
                    if (tx3 - tx2 > 0) { // for closer position
                        kagecd_1.cdDrawLine(kage, polygons, tx2, ty2, tx3, ty3, 6, 5, 0, 0); // bolder by force
                    }
                }
                else {
                    kagecd_1.cdDrawLine(kage, polygons, tx2, ty2, x3, y3, 6, a3_100, 0, opt2 + mageAdjustment * 10); // bolder by force
                }
                break;
            }
            case 6: {
                if (a3_100 === 4) {
                    var _s = (x3 === x4)
                        ? [0, -kage.kMage] // ?????
                        : (y3 === y4)
                            ? [-kage.kMage, 0] // ?????
                            : util_1.normalize([x3 - x4, y3 - y4], kage.kMage), dx1 = _s[0], dy1 = _s[1];
                    var tx1 = x4 + dx1;
                    var ty1 = y4 + dy1;
                    kagecd_1.cdDrawBezier(kage, polygons, x1, y1, x2, y2, x3, y3, tx1, ty1, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment, 0, opt3, 0);
                    kagecd_1.cdDrawCurve(kage, polygons, tx1, ty1, x4, y4, x4 - kage.kMage, y4, 1, 14, 0, opt2, 0, mageAdjustment);
                }
                else if (a3_100 === 5 && opt2 === 0 && mageAdjustment === 0) {
                    kagecd_1.cdDrawBezier(kage, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a2_100 + kirikuchiAdjustment * 100, 15, tateAdjustment, 0, opt3, 0);
                }
                else {
                    kagecd_1.cdDrawBezier(kage, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a2_100 + kirikuchiAdjustment * 100, a3_100, tateAdjustment, opt2, opt3, mageAdjustment);
                }
                break;
            }
            case 7: {
                kagecd_1.cdDrawLine(kage, polygons, x1, y1, x2, y2, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment + opt3 * 10, 0);
                kagecd_1.cdDrawCurve(kage, polygons, x2, y2, x3, y3, x4, y4, 1, a3_100, tateAdjustment, opt2, opt3, mageAdjustment);
                break;
            }
            case 9: // may not be exist ... no need
                // kageCanvas[y1][x1] = 0;
                // kageCanvas[y2][x2] = 0;
                break;
            default:
                break;
        }
    }
    else { // gothic
        switch (a1 % 100) {
            case 0:
                break;
            case 1: {
                if (a3_100 === 4 && opt2 === 0 && mageAdjustment === 0) {
                    var _t = (x1 === x2 && y1 === y2)
                        ? [0, kage.kMage] // ?????
                        : util_1.normalize([x1 - x2, y1 - y2], kage.kMage), dx1 = _t[0], dy1 = _t[1];
                    var tx1 = x2 + dx1;
                    var ty1 = y2 + dy1;
                    kagecd_1.cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment + opt3 * 10, 0);
                    kagecd_1.cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, x2 - kage.kMage * 2, y2 - kage.kMage * 0.5, 1, 0, 0, 0, 0, 0);
                }
                else {
                    kagecd_1.cdDrawLine(kage, polygons, x1, y1, x2, y2, a2_100 + kirikuchiAdjustment * 100, a3_100, tateAdjustment + opt3 * 10, opt2 + mageAdjustment * 10);
                }
                break;
            }
            case 2:
            case 12: {
                if (a3_100 === 4 && opt2 === 0 && mageAdjustment === 0) {
                    var _u = (x2 === x3)
                        ? [0, -kage.kMage] // ?????
                        : (y2 === y3)
                            ? [-kage.kMage, 0] // ?????
                            : util_1.normalize([x2 - x3, y2 - y3], kage.kMage), dx1 = _u[0], dy1 = _u[1];
                    var tx1 = x3 + dx1;
                    var ty1 = y3 + dy1;
                    kagecd_1.cdDrawCurve(kage, polygons, x1, y1, x2, y2, tx1, ty1, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment, 0, opt3, 0);
                    kagecd_1.cdDrawCurve(kage, polygons, tx1, ty1, x3, y3, x3 - kage.kMage * 2, y3 - kage.kMage * 0.5, 1, 0, 0, 0, 0, 0);
                }
                else if (a3_100 === 5 && opt2 === 0 && mageAdjustment === 0) {
                    var tx1 = x3 + kage.kMage;
                    var ty1 = y3;
                    var tx2 = tx1 + kage.kMage * 0.5;
                    var ty2 = y3 - kage.kMage * 2;
                    kagecd_1.cdDrawCurve(kage, polygons, x1, y1, x2, y2, x3, y3, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment, 0, opt3, 0);
                    kagecd_1.cdDrawCurve(kage, polygons, x3, y3, tx1, ty1, tx2, ty2, 1, 0, 0, 0, 0, 0);
                }
                else {
                    kagecd_1.cdDrawCurve(kage, polygons, x1, y1, x2, y2, x3, y3, a2_100 + kirikuchiAdjustment * 100, a3_100, tateAdjustment, opt2, opt3, mageAdjustment);
                }
                break;
            }
            case 3: {
                var _v = (x1 === x2 && y1 === y2)
                    ? [0, kage.kMage] // ?????
                    : util_1.normalize([x1 - x2, y1 - y2], kage.kMage), dx1 = _v[0], dy1 = _v[1];
                var tx1 = x2 + dx1;
                var ty1 = y2 + dy1;
                var _w = (x2 === x3 && y2 === y3)
                    ? [0, -kage.kMage] // ?????
                    : util_1.normalize([x3 - x2, y3 - y2], kage.kMage), dx2 = _w[0], dy2 = _w[1];
                var tx2 = x2 + dx2;
                var ty2 = y2 + dy2;
                kagecd_1.cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment + opt3 * 10, 0);
                kagecd_1.cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1, 0, 0, 0, 0);
                if (a3_100 === 5 && opt2 === 0 && mageAdjustment === 0) {
                    var tx3 = x3 - kage.kMage;
                    var ty3 = y3;
                    var tx4 = x3 + kage.kMage * 0.5;
                    var ty4 = y3 - kage.kMage * 2;
                    kagecd_1.cdDrawLine(kage, polygons, tx2, ty2, tx3, ty3, 1, 1, 0, 0);
                    kagecd_1.cdDrawCurve(kage, polygons, tx3, ty3, x3, y3, tx4, ty4, 1, 0, 0, 0, 0, 0);
                }
                else {
                    kagecd_1.cdDrawLine(kage, polygons, tx2, ty2, x3, y3, 1, a3_100, 0, opt2 + mageAdjustment * 10);
                }
                break;
            }
            case 6: {
                if (a3_100 === 5 && opt2 === 0 && mageAdjustment === 0) {
                    var tx1 = x4 - kage.kMage;
                    var ty1 = y4;
                    var tx2 = x4 + kage.kMage * 0.5;
                    var ty2 = y4 - kage.kMage * 2;
                    /*
                    cdDrawCurve(x1, y1, x2, y2, (x2 + x3) / 2, (y2 + y3) / 2, a2, 1);
                    cdDrawCurve((x2 + x3) / 2, (y2 + y3) / 2, x3, y3, tx1, ty1, 1, 1);
                     */
                    kagecd_1.cdDrawBezier(kage, polygons, x1, y1, x2, y2, x3, y3, tx1, ty1, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment, 0, opt3, 0);
                    kagecd_1.cdDrawCurve(kage, polygons, tx1, ty1, x4, y4, tx2, ty2, 1, 0, 0, 0, 0, 0);
                }
                else {
                    /*
                    cdDrawCurve(x1, y1, x2, y2, (x2 + x3) / 2, (y2 + y3) / 2, a2, 1);
                    cdDrawCurve((x2 + x3) / 2, (y2 + y3) / 2, x3, y3, x4, y4, 1, a3);
                     */
                    kagecd_1.cdDrawBezier(kage, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a2_100 + kirikuchiAdjustment * 100, a3_100, tateAdjustment, opt2, opt3, mageAdjustment);
                }
                break;
            }
            case 7: {
                kagecd_1.cdDrawLine(kage, polygons, x1, y1, x2, y2, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment + opt3 * 10, 0);
                kagecd_1.cdDrawCurve(kage, polygons, x2, y2, x3, y3, x4, y4, 1, a3_100, 0, opt2, 0, mageAdjustment);
                break;
            }
            case 9: // may not be exist
                // kageCanvas[y1][x1] = 0;
                // kageCanvas[y2][x2] = 0;
                break;
            default:
                break;
        }
    }
}
exports.dfDrawFont = dfDrawFont;

},{"./kagecd":7,"./util":12}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polygon = void 0;
var Polygon = /** @class */ (function () {
    function Polygon(param) {
        var _this = this;
        // property
        this._array = [];
        // initialize
        if (param) {
            if (typeof param === "number") {
                for (var i = 0; i < param; i++) {
                    this.push(0, 0, false);
                }
            }
            else {
                param.forEach(function (_a) {
                    var x = _a.x, y = _a.y, off = _a.off;
                    _this.push(x, y, off);
                });
            }
        }
    }
    Object.defineProperty(Polygon.prototype, "array", {
        // resolution : 0.1
        get: function () {
            var _this = this;
            return this._array.map(function (_, i) { return _this.get(i); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Polygon.prototype, "length", {
        get: function () {
            return this._array.length;
        },
        enumerable: false,
        configurable: true
    });
    // method
    Polygon.prototype.push = function (x, y, off) {
        if (off === void 0) { off = false; }
        this._array.push({ x: x, y: y, off: off });
    };
    Polygon.prototype.set = function (index, x, y, off) {
        if (off === void 0) { off = false; }
        this._array[index].x = x;
        this._array[index].y = y;
        this._array[index].off = off;
    };
    Polygon.prototype.get = function (index) {
        var _a = this._array[index], x = _a.x, y = _a.y, off = _a.off;
        return {
            x: Math.floor(x * 10) / 10,
            y: Math.floor(y * 10) / 10,
            off: off,
        };
    };
    Polygon.prototype.reverse = function () {
        this._array.reverse();
    };
    Polygon.prototype.concat = function (poly) {
        this._array = this._array.concat(poly._array);
    };
    Polygon.prototype.shift = function () {
        this._array.shift();
    };
    Polygon.prototype.unshift = function (x, y, off) {
        if (off === void 0) { off = false; }
        this._array.unshift({ x: x, y: y, off: off });
    };
    Polygon.prototype.clone = function () {
        var newpolygon = new Polygon();
        this._array.forEach(function (_a) {
            var x = _a.x, y = _a.y, off = _a.off;
            newpolygon.push(x, y, off);
        });
        return newpolygon;
    };
    Polygon.prototype.translate = function (dx, dy) {
        this._array.forEach(function (point) {
            point.x += dx;
            point.y += dy;
        });
        return this; // for chaining
    };
    Polygon.prototype.transformMatrix = function (a, b, c, d) {
        this._array.forEach(function (point) {
            var x = point.x, y = point.y;
            point.x = a * x + b * y;
            point.y = c * x + d * y;
        });
        return this; // for chaining
    };
    /**
     * Scales by hypot(x, y) and rotates by atan2(y, x). Corresponds to multiplying x+yi on complex plane.
     */
    Polygon.prototype.transformMatrix2 = function (x, y) {
        return this.transformMatrix(x, -y, y, x);
    };
    Polygon.prototype.reflectX = function () {
        this._array.forEach(function (point) {
            point.x *= -1;
        });
        return this; // for chaining
    };
    Polygon.prototype.reflectY = function () {
        this._array.forEach(function (point) {
            point.y *= -1;
        });
        return this; // for chaining
    };
    Polygon.prototype.rotate90 = function () {
        this._array.forEach(function (point) {
            var x = point.x, y = point.y;
            point.x = -y;
            point.y = x;
        });
        return this;
    };
    Polygon.prototype.rotate180 = function () {
        return this.reflectX().reflectY(); // for chaining
    };
    Polygon.prototype.rotate270 = function () {
        this._array.forEach(function (point) {
            var x = point.x, y = point.y;
            point.x = y;
            point.y = -x;
        });
        return this;
    };
    return Polygon;
}());
exports.Polygon = Polygon;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polygons = void 0;
var Polygons = /** @class */ (function () {
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
        if (polygon.length < 3) {
            return;
        }
        for (var _i = 0, _a = polygon.array; _i < _a.length; _i++) {
            var _b = _a[_i], x = _b.x, y = _b.y;
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
                return;
            }
        }
        if (minx !== maxx && miny !== maxy) {
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
        buffer += "%!PS-Adobe-3.0 EPSF-3.0\n%%BoundingBox: 0 -208 1024 816\n%%Pages: 0\n%%Title: Kanji glyph\n%%Creator: GlyphWiki powered by KAGE system\n%%CreationDate: " + new Date().toString() + "\n%%EndComments\n%%EndProlog\n";
        this.array.forEach(function (_a) {
            var array = _a.array;
            for (var j = 0; j < array.length; j++) {
                buffer += array[j].x * 5 + " " + (1000 - array[j].y * 5 - 200) + " ";
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
exports.Stroke = exports.stretch = void 0;
function stretch(dp, sp, p, min, max) {
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
}
exports.stretch = stretch;
var Stroke = /** @class */ (function () {
    function Stroke(data) {
        this.a1 = data[0], this.a2_100 = data[1], this.a3_100 = data[2], this.x1 = data[3], this.y1 = data[4], this.x2 = data[5], this.y2 = data[6], this.x3 = data[7], this.y3 = data[8], this.x4 = data[9], this.y4 = data[10];
        this.kirikuchiAdjustment = Math.floor(this.a2_100 / 100) % 10;
        this.tateAdjustment = Math.floor(this.a2_100 / 1000) % 10;
        this.opt3 = Math.floor(this.a2_100 / 10000);
        this.a2_100 %= 100;
        this.opt2 = Math.floor(this.a3_100 / 100) % 10;
        this.mageAdjustment = Math.floor(this.a3_100 / 1000);
        this.a3_100 %= 100;
    }
    Stroke.prototype.getControlSegments = function () {
        var res = [];
        switch (this.a1) {
            case 0:
            case 8:
            case 9:
                break;
            case 6:
            case 7:
                res.unshift([this.x3, this.y3, this.x4, this.y4]);
            // falls through
            case 2:
            case 12:
            case 3:
                res.unshift([this.x2, this.y2, this.x3, this.y3]);
            // falls through
            default:
                res.unshift([this.x1, this.y1, this.x2, this.y2]);
        }
        return res;
    };
    Stroke.prototype.stretch = function (sx, sx2, sy, sy2, bminX, bmaxX, bminY, bmaxY) {
        this.x1 = stretch(sx, sx2, this.x1, bminX, bmaxX);
        this.y1 = stretch(sy, sy2, this.y1, bminY, bmaxY);
        this.x2 = stretch(sx, sx2, this.x2, bminX, bmaxX);
        this.y2 = stretch(sy, sy2, this.y2, bminY, bmaxY);
        if (this.a1 !== 99) { // always true
            this.x3 = stretch(sx, sx2, this.x3, bminX, bmaxX);
            this.y3 = stretch(sy, sy2, this.y3, bminY, bmaxY);
            this.x4 = stretch(sx, sx2, this.x4, bminX, bmaxX);
            this.y4 = stretch(sy, sy2, this.y4, bminY, bmaxY);
        }
    };
    Stroke.prototype.getBox = function () {
        var minX = Infinity;
        var minY = Infinity;
        var maxX = -Infinity;
        var maxY = -Infinity;
        switch (this.a1) {
            default:
                minX = Math.min(minX, this.x4);
                maxX = Math.max(maxX, this.x4);
                minY = Math.min(minY, this.y4);
                maxY = Math.max(maxY, this.y4);
            // falls through
            case 2:
            case 3:
            case 4:
                minX = Math.min(minX, this.x3);
                maxX = Math.max(maxX, this.x3);
                minY = Math.min(minY, this.y3);
                maxY = Math.max(maxY, this.y3);
            // falls through
            case 1:
            case 99: // unnecessary?
                minX = Math.min(minX, this.x1, this.x2);
                maxX = Math.max(maxX, this.x1, this.x2);
                minY = Math.min(minY, this.y1, this.y2);
                maxY = Math.max(maxY, this.y1, this.y2);
            // falls through
            case 0:
        }
        return { minX: minX, maxX: maxX, minY: minY, maxY: maxY };
    };
    return Stroke;
}());
exports.Stroke = Stroke;

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.round = exports.ternarySearchMax = exports.ternarySearchMin = exports.cubicBezierDeriv = exports.cubicBezier = exports.quadraticBezierDeriv = exports.quadraticBezier = exports.normalize = exports.hypot = void 0;
// eslint-disable-next-line @typescript-eslint/unbound-method
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
    // const s = 1 - t;
    // ds/dt = -1
    // return (-2 * s) * p1 + 2 * (s - t) * p2 + (2 * t) * p3;
    return 2 * (t * (p1 - 2 * p2 + p3) - p1 + p2);
}
exports.quadraticBezierDeriv = quadraticBezierDeriv;
function cubicBezier(p1, p2, p3, p4, t) {
    var s = 1 - t;
    return (s * s * s) * p1 + 3 * (s * s * t) * p2 + 3 * (s * t * t) * p3 + (t * t * t) * p4;
}
exports.cubicBezier = cubicBezier;
/** Returns d/dt(cubicBezier) */
function cubicBezierDeriv(p1, p2, p3, p4, t) {
    // const s = 1 - t;
    // ds/dt = -1
    // const ss = s * s;
    // const st = s * t;
    // const tt = t * t;
    // return (-3 * ss) * p1 + 3 * (ss - 2 * st) * p2 + 3 * (2 * st - tt) * p3 + (3 * tt) * p4;
    return 3 * (t * (t * (-p1 + 3 * p2 - 3 * p3 + p4) + 2 * (p1 - 2 * p2 + p3)) - p1 + p2);
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
function round(v, rate) {
    if (rate === void 0) { rate = 1E8; }
    return Math.round(v * rate) / rate;
}
exports.round = round;

},{}]},{},[2]);
