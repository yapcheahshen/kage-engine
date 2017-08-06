(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
// Reference : http://www.cam.hi-ho.ne.jp/strong_warriors/teacher/chapter0{4,5}.html
Object.defineProperty(exports, "__esModule", { value: true });
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
function getCrossPoint(x11, y11, x12, y12, x21, y21, x22, y22) {
    var a1 = y12 - y11;
    var b1 = x11 - x12;
    var c1 = -1 * a1 * x11 - b1 * y11;
    var a2 = y22 - y21;
    var b2 = x21 - x22;
    var c2 = -1 * a2 * x21 - b2 * y21;
    var temp = b1 * a2 - b2 * a1;
    if (temp === 0) {
        return null;
    }
    return new Point((c1 * b2 - c2 * b1) / temp, (a1 * c2 - a2 * c1) / temp);
}
function isCross(x11, y11, x12, y12, x21, y21, x22, y22) {
    var temp = getCrossPoint(x11, y11, x12, y12, x21, y21, x22, y22);
    if (!temp) {
        return false;
    }
    if (x11 < x12 && (temp.x < x11 || x12 < temp.x)
        || x11 > x12 && (temp.x < x12 || x11 < temp.x)
        || y11 < y12 && (temp.y < y11 || y12 < temp.y)
        || y11 > y12 && (temp.y < y12 || y11 < temp.y)) {
        return false;
    }
    if (x21 < x22 && (temp.x < x21 || x22 < temp.x)
        || x21 > x22 && (temp.x < x22 || x21 < temp.x)
        || y21 < y22 && (temp.y < y21 || y22 < temp.y)
        || y21 > y22 && (temp.y < y22 || y21 < temp.y)) {
        return false;
    }
    return true;
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
    var div_curve = [[], []];
    for (var i = 0; i <= cut; i++) {
        div_curve[0].push(curve[i]);
    }
    for (var i = cut; i < curve.length; i++) {
        div_curve[1].push(curve[i]);
    }
    var off_curve = [
        [x1, y1, tx1, ty1, tx3, ty3],
        [tx3, ty3, tx2, ty2, x2, y2],
    ];
    return {
        div_curve: div_curve,
        off_curve: off_curve,
    };
}
exports.divide_curve = divide_curve;
// ------------------------------------------------------------------
function find_offcurve(_kage, curve, sx, sy) {
    var _a = curve[0], nx1 = _a[0], ny1 = _a[1];
    var _b = curve[curve.length - 1], nx2 = _b[0], ny2 = _b[1];
    var minx;
    var miny;
    var mindiff = Infinity;
    var area = 8;
    var mesh = 2;
    // area = 10   mesh = 5 -> 281 calcs
    // area = 10   mesh = 4 -> 180 calcs
    // area =  8   mesh = 4 -> 169 calcs
    // area =  7.5 mesh = 3 -> 100 calcs
    // area =  8   mesh = 2 ->  97 calcs
    // area =  7   mesh = 2 ->  80 calcs
    for (var tx = sx - area; tx < sx + area; tx += mesh) {
        for (var ty = sy - area; ty < sy + area; ty += mesh) {
            var diff = 0;
            for (var tt = 0; tt < curve.length; tt++) {
                var t = tt / curve.length;
                // calculate a dot
                var x = (Math.pow((1 - t), 2) * nx1 + 2 * t * (1 - t) * tx + Math.pow(t, 2) * nx2);
                var y = (Math.pow((1 - t), 2) * ny1 + 2 * t * (1 - t) * ty + Math.pow(t, 2) * ny2);
                // KATAMUKI of vector by BIBUN
                // const ix = (nx1 - 2 * tx + nx2) * 2 * t + (-2 * nx1 + 2 * tx);
                // const iy = (ny1 - 2 * ty + ny2) * 2 * t + (-2 * ny1 + 2 * ty);
                diff += Math.pow((curve[tt][0] - x), 2) + Math.pow((curve[tt][1] - y), 2);
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
    for (var tx = minx - mesh + 1; tx <= minx + mesh - 1; tx += 0.5) {
        for (var ty = miny - mesh + 1; ty <= miny + mesh - 1; ty += 0.5) {
            var diff = 0;
            for (var tt = 0; tt < curve.length; tt++) {
                var t = tt / curve.length;
                // calculate a dot
                var x = (Math.pow((1 - t), 2) * nx1 + 2 * t * (1 - t) * tx + Math.pow(t, 2) * nx2);
                var y = (Math.pow((1 - t), 2) * ny1 + 2 * t * (1 - t) * ty + Math.pow(t, 2) * ny2);
                // KATAMUKI of vector by BIBUN
                // const ix = (nx1 - 2 * tx + nx2) * 2 * t + (-2 * nx1 + 2 * tx);
                // const iy = (ny1 - 2 * ty + ny2) * 2 * t + (-2 * ny1 + 2 * ty);
                diff += Math.pow((curve[tt][0] - x), 2) + Math.pow((curve[tt][1] - y), 2);
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
exports.find_offcurve = find_offcurve;
// ------------------------------------------------------------------
function get_candidate(kage, a1, a2, x1, y1, sx1, sy1, x2, y2, opt3, opt4) {
    var curve = [[], []];
    for (var tt = 0; tt <= 1000; tt += kage.kRate) {
        var t = tt / 1000;
        // calculate a dot
        var x = (Math.pow((1 - t), 2) * x1 + 2 * t * (1 - t) * sx1 + Math.pow(t, 2) * x2);
        var y = (Math.pow((1 - t), 2) * y1 + 2 * t * (1 - t) * sy1 + Math.pow(t, 2) * y2);
        // KATAMUKI of vector by BIBUN
        var ix = (x1 - 2 * sx1 + x2) * 2 * t + (-2 * x1 + 2 * sx1);
        var iy = (y1 - 2 * sy1 + y2) * 2 * t + (-2 * y1 + 2 * sy1);
        // line SUICHOKU by vector
        var ia = void 0;
        var ib = void 0;
        if (ix !== 0 && iy !== 0) {
            var ir = Math.atan(iy / ix * -1);
            ia = Math.sin(ir) * (kage.kMinWidthT);
            ib = Math.cos(ir) * (kage.kMinWidthT);
        }
        else if (ix === 0) {
            ia = kage.kMinWidthT;
            ib = 0;
        }
        else {
            ia = 0;
            ib = kage.kMinWidthT;
        }
        var hosomi = 0.5;
        var deltad = (a1 === 7 && a2 === 0) // L2RD: fatten
            ? Math.pow(t, hosomi) * kage.kL2RDfatten
            : (a1 === 7)
                ? Math.pow(t, hosomi)
                : (a2 === 7)
                    ? Math.pow(1 - t, hosomi)
                    : (opt3 > 0)
                        ? (((kage.kMinWidthT - opt4 / 2) - opt3 / 2) / (kage.kMinWidthT - opt4 / 2)
                            + opt3 / 2 / (kage.kMinWidthT - opt4) * t)
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
exports.get_candidate = get_candidate;

},{}],5:[function(require,module,exports){
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
        if (size === 1) {
            this.kMinWidthY = 1.2;
            this.kMinWidthT = 3.6;
            this.kWidth = 3;
            this.kKakato = 1.8;
            this.kL2RDfatten = 1.1;
            this.kMage = 6;
            this.kUseCurve = 0;
            this.kAdjustKakatoL = ([8, 5, 3, 1, 0]); // for KAKATO adjustment 000,100,200,300,400
            this.kAdjustKakatoR = ([4, 3, 2, 1]); // for KAKATO adjustment 000,100,200,300
            this.kAdjustKakatoRangeX = 12; // check area width
            this.kAdjustKakatoRangeY = ([1, 11, 14, 18]); // 3 steps of checking
            this.kAdjustKakatoStep = 3; // number of steps
            this.kAdjustUrokoX = ([14, 12, 9, 7]); // for UROKO adjustment 000,100,200,300
            this.kAdjustUrokoY = ([7, 6, 5, 4]); // for UROKO adjustment 000,100,200,300
            this.kAdjustUrokoLength = ([13, 21, 30]); // length for checking
            this.kAdjustUrokoLengthStep = 3; // number of steps
            this.kAdjustUrokoLine = ([13, 15, 18]); // check for crossing. corresponds to length
        }
        else {
            this.kMinWidthY = 2;
            this.kMinWidthT = 6;
            this.kWidth = 5;
            this.kKakato = 3;
            this.kL2RDfatten = 1.1;
            this.kMage = 10;
            this.kUseCurve = 0;
            this.kAdjustKakatoL = ([14, 9, 5, 2, 0]); // for KAKATO adjustment 000,100,200,300,400
            this.kAdjustKakatoR = ([8, 6, 4, 2]); // for KAKATO adjustment 000,100,200,300
            this.kAdjustKakatoRangeX = 20; // check area width
            this.kAdjustKakatoRangeY = ([1, 19, 24, 30]); // 3 steps of checking
            this.kAdjustKakatoStep = 3; // number of steps
            this.kAdjustUrokoX = ([24, 20, 16, 12]); // for UROKO adjustment 000,100,200,300
            this.kAdjustUrokoY = ([12, 11, 9, 8]); // for UROKO adjustment 000,100,200,300
            this.kAdjustUrokoLength = ([22, 36, 50]); // length for checking
            this.kAdjustUrokoLengthStep = 3; // number of steps
            this.kAdjustUrokoLine = ([22, 26, 30]); // check for crossing. corresponds to length
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
    Kage.prototype.adjustHane = function (sa) {
        for (var i = 0; i < sa.length; i++) {
            if ((sa[i][0] === 1 || sa[i][0] === 2 || sa[i][0] === 6) && sa[i][2] === 4) {
                var lpx = void 0; // lastPointX
                var lpy = void 0; // lastPointY
                if (sa[i][0] === 1) {
                    lpx = sa[i][5];
                    lpy = sa[i][6];
                }
                else if (sa[i][0] === 2) {
                    lpx = sa[i][7];
                    lpy = sa[i][8];
                }
                else {
                    lpx = sa[i][9];
                    lpy = sa[i][10];
                }
                var mn = Infinity; // mostNear
                if (lpx + 18 < 100) {
                    mn = lpx + 18;
                }
                for (var j = 0; j < sa.length; j++) {
                    if (i !== j && sa[j][0] === 1 && sa[j][3] === sa[j][5] && sa[j][3] < lpx && sa[j][4] <= lpy && sa[j][6] >= lpy) {
                        if (lpx - sa[j][3] < 100) {
                            mn = Math.min(mn, lpx - sa[j][3]);
                        }
                    }
                }
                if (mn !== Infinity) {
                    sa[i][2] += 700 - Math.floor(mn / 15) * 100; // 0-99 -> 0-700
                }
            }
        }
        return sa;
    };
    Kage.prototype.adjustUroko = function (strokesArray) {
        for (var i = 0; i < strokesArray.length; i++) {
            if (strokesArray[i][0] === 1 && strokesArray[i][2] === 0) {
                for (var k = 0; k < this.kAdjustUrokoLengthStep; k++) {
                    var tx = void 0;
                    var ty = void 0;
                    var tlen = void 0;
                    if (strokesArray[i][4] === strokesArray[i][6]) {
                        tx = strokesArray[i][5] - this.kAdjustUrokoLine[k];
                        ty = strokesArray[i][6] - 0.5;
                        tlen = strokesArray[i][5] - strokesArray[i][3];
                    }
                    else {
                        var rad = Math.atan((strokesArray[i][6] - strokesArray[i][4]) / (strokesArray[i][5] - strokesArray[i][3]));
                        tx = strokesArray[i][5] - this.kAdjustUrokoLine[k] * Math.cos(rad) - 0.5 * Math.sin(rad);
                        ty = strokesArray[i][6] - this.kAdjustUrokoLine[k] * Math.sin(rad) - 0.5 * Math.cos(rad);
                        tlen = Math.sqrt(Math.pow((strokesArray[i][6] - strokesArray[i][4]), 2) + Math.pow((strokesArray[i][5] - strokesArray[i][3]), 2));
                    }
                    if (tlen < this.kAdjustUrokoLength[k]
                        || _2d_1.isCrossWithOthers(strokesArray, i, tx, ty, strokesArray[i][5], strokesArray[i][6])) {
                        strokesArray[i][2] += (this.kAdjustUrokoLengthStep - k) * 100;
                        break;
                    }
                }
            }
        }
        return strokesArray;
    };
    Kage.prototype.adjustUroko2 = function (strokesArray) {
        for (var i = 0; i < strokesArray.length; i++) {
            if (strokesArray[i][0] === 1 && strokesArray[i][2] === 0 && strokesArray[i][4] === strokesArray[i][6]) {
                var pressure = 0;
                for (var j = 0; j < strokesArray.length; j++) {
                    if (i !== j && ((strokesArray[j][0] === 1
                        && strokesArray[j][4] === strokesArray[j][6]
                        && !(strokesArray[i][3] + 1 > strokesArray[j][5] || strokesArray[i][5] - 1 < strokesArray[j][3])
                        && Math.abs(strokesArray[i][4] - strokesArray[j][4]) < this.kAdjustUroko2Length) || (strokesArray[j][0] === 3
                        && strokesArray[j][6] === strokesArray[j][8]
                        && !(strokesArray[i][3] + 1 > strokesArray[j][7] || strokesArray[i][5] - 1 < strokesArray[j][5])
                        && Math.abs(strokesArray[i][4] - strokesArray[j][6]) < this.kAdjustUroko2Length))) {
                        pressure += Math.pow(this.kAdjustUroko2Length - Math.abs(strokesArray[i][4] - strokesArray[j][6]), 1.1);
                    }
                }
                var result = Math.min(Math.floor(pressure / this.kAdjustUroko2Length), this.kAdjustUroko2Step) * 100;
                if (strokesArray[i][2] < result) {
                    strokesArray[i][2] = strokesArray[i][2] % 100
                        + Math.min(Math.floor(pressure / this.kAdjustUroko2Length), this.kAdjustUroko2Step) * 100;
                }
            }
        }
        return strokesArray;
    };
    Kage.prototype.adjustTate = function (strokesArray) {
        for (var i = 0; i < strokesArray.length; i++) {
            if ((strokesArray[i][0] === 1 || strokesArray[i][0] === 3 || strokesArray[i][0] === 7)
                && strokesArray[i][3] === strokesArray[i][5]) {
                for (var j = 0; j < strokesArray.length; j++) {
                    if (i !== j
                        && (strokesArray[j][0] === 1 || strokesArray[j][0] === 3 || strokesArray[j][0] === 7)
                        && strokesArray[j][3] === strokesArray[j][5]
                        && !(strokesArray[i][4] + 1 > strokesArray[j][6] || strokesArray[i][6] - 1 < strokesArray[j][4])
                        && Math.abs(strokesArray[i][3] - strokesArray[j][3]) < this.kMinWidthT * this.kAdjustTateStep) {
                        strokesArray[i][1] += (this.kAdjustTateStep - Math.floor(Math.abs(strokesArray[i][3] - strokesArray[j][3]) / this.kMinWidthT)) * 1000;
                        if (strokesArray[i][1] > this.kAdjustTateStep * 1000) {
                            strokesArray[i][1] = strokesArray[i][1] % 1000 + this.kAdjustTateStep * 1000;
                        }
                    }
                }
            }
        }
        return strokesArray;
    };
    Kage.prototype.adjustMage = function (strokesArray) {
        for (var i = 0; i < strokesArray.length; i++) {
            if (strokesArray[i][0] === 3 && strokesArray[i][6] === strokesArray[i][8]) {
                for (var j = 0; j < strokesArray.length; j++) {
                    if (i !== j && ((strokesArray[j][0] === 1
                        && strokesArray[j][4] === strokesArray[j][6]
                        && !(strokesArray[i][5] + 1 > strokesArray[j][5] || strokesArray[i][7] - 1 < strokesArray[j][3])
                        && Math.abs(strokesArray[i][6] - strokesArray[j][4]) < this.kMinWidthT * this.kAdjustMageStep) || (strokesArray[j][0] === 3
                        && strokesArray[j][6] === strokesArray[j][8]
                        && !(strokesArray[i][5] + 1 > strokesArray[j][7] || strokesArray[i][7] - 1 < strokesArray[j][5])
                        && Math.abs(strokesArray[i][6] - strokesArray[j][6]) < this.kMinWidthT * this.kAdjustMageStep))) {
                        strokesArray[i][2] += (this.kAdjustMageStep - Math.floor(Math.abs(strokesArray[i][6] - strokesArray[j][6]) / this.kMinWidthT)) * 1000;
                        if (strokesArray[i][2] > this.kAdjustMageStep * 1000) {
                            strokesArray[i][2] = strokesArray[i][2] % 1000 + this.kAdjustMageStep * 1000;
                        }
                    }
                }
            }
        }
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
                        && stroke2[4] === stroke[4] && stroke2[4] === stroke[6]) {
                        stroke[1] = 132;
                        break;
                    }
                }
            }
        });
        return strokesArray;
    };
    Kage.prototype.adjustKakato = function (strokesArray) {
        for (var i = 0; i < strokesArray.length; i++) {
            if (strokesArray[i][0] === 1
                && (strokesArray[i][2] === 13 || strokesArray[i][2] === 23)) {
                for (var k = 0; k < this.kAdjustKakatoStep; k++) {
                    if (_2d_1.isCrossBoxWithOthers(strokesArray, i, strokesArray[i][5] - this.kAdjustKakatoRangeX / 2, strokesArray[i][6] + this.kAdjustKakatoRangeY[k], strokesArray[i][5] + this.kAdjustKakatoRangeX / 2, strokesArray[i][6] + this.kAdjustKakatoRangeY[k + 1])
                        || strokesArray[i][6] + this.kAdjustKakatoRangeY[k + 1] > 200 // adjust for baseline
                        || strokesArray[i][6] - strokesArray[i][4] < this.kAdjustKakatoRangeY[k + 1] // for thin box
                    ) {
                        strokesArray[i][2] += (3 - k) * 100;
                        break;
                    }
                }
            }
        }
        return strokesArray;
    };
    return Kage;
}());
exports.Kage = Kage;

},{"./2d":1,"./buhin":3,"./kagedf":8,"./polygons":10}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var curve_1 = require("./curve");
var kage_1 = require("./kage");
var polygon_1 = require("./polygon");
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
        if (x1 === sx1) {
            if (y1 < sy1) {
                y1 -= delta;
            }
            else {
                y1 += delta;
            }
        }
        else if (y1 === sy1) {
            if (x1 < sx1) {
                x1 -= delta;
            }
            else {
                x1 += delta;
            }
        }
        else {
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
            case 8:// get shorten for tail's circle
                delta = -1 * kMinWidthT * 0.5;
                break;
            default:
                break;
        }
        if (sx2 === x2) {
            if (sy2 < y2) {
                y2 += delta;
            }
            else {
                y2 -= delta;
            }
        }
        else if (sy2 === y2) {
            if (sx2 < x2) {
                x2 += delta;
            }
            else {
                x2 -= delta;
            }
        }
        else {
            var rad = Math.atan2(y2 - sy2, x2 - sx2);
            x2 += delta * Math.cos(rad);
            y2 += delta * Math.sin(rad);
        }
        var hosomi = 0.5;
        if (Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)) < 50) {
            hosomi += 0.4 * (1 - Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)) / 50);
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
                var curve = curve_1.get_candidate(kage2, a1, a2, x1, y1, sx1, sy1, x2, y2, opt3, opt4); // L and R
                var _a = curve_1.divide_curve(kage2, x1, y1, sx1, sy1, x2, y2, curve[0]), dcl12_34 = _a.div_curve, dpl12_34 = _a.off_curve;
                var _b = curve_1.divide_curve(kage2, x1, y1, sx1, sy1, x2, y2, curve[1]), dcr12_34 = _b.div_curve, dpr12_34 = _b.off_curve;
                var ncl1 = curve_1.find_offcurve(kage2, dcl12_34[0], dpl12_34[0][2], dpl12_34[0][3]);
                var ncl2 = curve_1.find_offcurve(kage2, dcl12_34[1], dpl12_34[1][2], dpl12_34[1][3]);
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
            }
            else {
                var poly = new polygon_1.Polygon();
                var poly2 = new polygon_1.Polygon();
                for (var tt = 0; tt <= 1000; tt += kage.kRate) {
                    var t = tt / 1000;
                    // calculate a dot
                    var x = (Math.pow((1 - t), 2) * x1 + 2 * t * (1 - t) * sx1 + Math.pow(t, 2) * x2);
                    var y = (Math.pow((1 - t), 2) * y1 + 2 * t * (1 - t) * sy1 + Math.pow(t, 2) * y2);
                    // KATAMUKI of vector by BIBUN
                    var ix = (x1 - 2 * sx1 + x2) * 2 * t + (-2 * x1 + 2 * sx1);
                    var iy = (y1 - 2 * sy1 + y2) * 2 * t + (-2 * y1 + 2 * sy1);
                    // line SUICHOKU by vector
                    var ia = void 0;
                    var ib = void 0;
                    if (ix !== 0 && iy !== 0) {
                        var ir = Math.atan(iy / ix * -1);
                        ia = Math.sin(ir) * (kMinWidthT);
                        ib = Math.cos(ir) * (kMinWidthT);
                    }
                    else if (ix === 0) {
                        ia = kMinWidthT;
                        ib = 0;
                    }
                    else {
                        ia = 0;
                        ib = kMinWidthT;
                    }
                    var deltad = a1 === 7 && a2 === 0 // L2RD: fatten
                        ? Math.pow(t, hosomi) * kage.kL2RDfatten
                        : a1 === 7
                            ? Math.pow(t, hosomi)
                            : a2 === 7
                                ? Math.pow(1 - t, hosomi)
                                : opt3 > 0 || opt4 > 0
                                    ? ((kage.kMinWidthT - opt3 / 2) - (opt4 - opt3) / 2 * t) / kage.kMinWidthT
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
                    // copy to polygon structure
                    poly.push(x - ia, y - ib);
                    poly2.push(x + ia, y + ib);
                }
                // suiheisen ni setsuzoku
                if (a1 === 132) {
                    var index = 0;
                    while (true) {
                        if (poly2.array[index].y <= y1 && y1 <= poly2.array[index + 1].y) {
                            break;
                        }
                        index++;
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
                    while (true) {
                        if (poly2.array[index].y <= y1 && y1 <= poly2.array[index + 1].y) {
                            break;
                        }
                        index++;
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
                var x = Math.pow((1 - t), 3) * x1 + 3 * t * Math.pow((1 - t), 2) * sx1 + 3 * Math.pow(t, 2) * (1 - t) * sx2 + Math.pow(t, 3) * x2;
                var y = Math.pow((1 - t), 3) * y1 + 3 * t * Math.pow((1 - t), 2) * sy1 + 3 * Math.pow(t, 2) * (1 - t) * sy2 + Math.pow(t, 3) * y2;
                // KATAMUKI of vector by BIBUN
                var ix = Math.pow(t, 2) * (-3 * x1 + 9 * sx1 + -9 * sx2 + 3 * x2)
                    + t * (6 * x1 + -12 * sx1 + 6 * sx2) + -3 * x1 + 3 * sx1;
                var iy = Math.pow(t, 2) * (-3 * y1 + 9 * sy1 + -9 * sy2 + 3 * y2)
                    + t * (6 * y1 + -12 * sy1 + 6 * sy2) + -3 * y1 + 3 * sy1;
                // line SUICHOKU by vector
                var ia = void 0;
                var ib = void 0;
                if (ix !== 0 && iy !== 0) {
                    var ir = Math.atan(iy / ix * -1);
                    ia = Math.sin(ir) * (kMinWidthT);
                    ib = Math.cos(ir) * (kMinWidthT);
                }
                else if (ix === 0) {
                    ia = kMinWidthT;
                    ib = 0;
                }
                else {
                    ia = 0;
                    ib = kMinWidthT;
                }
                var deltad = a1 === 7 && a2 === 0 // L2RD: fatten
                    ? Math.pow(t, hosomi) * kage.kL2RDfatten
                    : a1 === 7
                        ? Math.pow(Math.pow(t, hosomi), 0.7) // make fatten
                        : a2 === 7
                            ? Math.pow(1 - t, hosomi)
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
                // copy to polygon structure
                poly.push(x - ia, y - ib);
                poly2.push(x + ia, y + ib);
            }
            // suiheisen ni setsuzoku
            if (a1 === 132) {
                var index = 0;
                while (true) {
                    if (poly2.array[index].y <= y1 && y1 <= poly2.array[index + 1].y) {
                        break;
                    }
                    index++;
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
                    while (true) {
                        if (poly2.array[index].y <= y1 && y1 <= poly2.array[index + 1].y) {
                            break;
                        }
                        index++;
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
                    poly.push(x2 - kMinWidthT2 * 0.9, y2 + kMinWidthT2 * 0.9, 1);
                    poly.push(x2, y2 + kMinWidthT2);
                    poly.push(x2 + kMinWidthT2 * 0.9, y2 + kMinWidthT2 * 0.9, 1);
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
                    poly.push(x2 + kMinWidthT2 * 0.9, y2 - kMinWidthT2 * 0.9, 1);
                    poly.push(x2 + kMinWidthT2, y2);
                    poly.push(x2 + kMinWidthT2 * 0.9, y2 + kMinWidthT2 * 0.9, 1);
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
                    poly.push(x2 + Math.cos(rad2) * kMinWidthT2 * 0.9 + Math.sin(rad2) * kMinWidthT2 * 0.9, y2 + Math.sin(rad2) * kMinWidthT2 * 0.9 - Math.cos(rad2) * kMinWidthT2 * 0.9, 1);
                    poly.push(x2 + Math.cos(rad2) * kMinWidthT2, y2 + Math.sin(rad2) * kMinWidthT2);
                    poly.push(x2 + Math.cos(rad2) * kMinWidthT2 * 0.9 - Math.sin(rad2) * kMinWidthT2 * 0.9, y2 + Math.sin(rad2) * kMinWidthT2 * 0.9 + Math.cos(rad2) * kMinWidthT2 * 0.9, 1);
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
            poly.push(x2 - kage.kWidth * 4 * Math.min(1 - opt2 / 10, Math.pow(kMinWidthT / kage.kMinWidthT, 3)), y2 - kMinWidthT);
            poly.push(x2 - kage.kWidth * 4 * Math.min(1 - opt2 / 10, Math.pow(kMinWidthT / kage.kMinWidthT, 3)), y2 - kMinWidthT * 0.5);
            // poly.reverse();
            polygons.push(poly);
        }
    }
    else {
        var a1 = ta1 % 1000;
        var a2 = ta2 % 100;
        if (a1 % 10 === 2) {
            if (x1 === sx1) {
                if (y1 < sy1) {
                    y1 -= kage.kWidth;
                }
                else {
                    y1 += kage.kWidth;
                }
            }
            else if (y1 === sy1) {
                if (x1 < sx1) {
                    x1 -= kage.kWidth;
                }
                else {
                    x1 += kage.kWidth;
                }
            }
            else {
                var rad = Math.atan2(sy1 - y1, sx1 - x1);
                x1 -= kage.kWidth * Math.cos(rad);
                y1 -= kage.kWidth * Math.sin(rad);
            }
        }
        if (a1 % 10 === 3) {
            if (x1 === sx1) {
                if (y1 < sy1) {
                    y1 -= kage.kWidth * kage.kKakato;
                }
                else {
                    y1 += kage.kWidth * kage.kKakato;
                }
            }
            else if (y1 === sy1) {
                if (x1 < sx1) {
                    x1 -= kage.kWidth * kage.kKakato;
                }
                else {
                    x1 += kage.kWidth * kage.kKakato;
                }
            }
            else {
                var rad = Math.atan2(sy1 - y1, sx1 - x1);
                x1 -= kage.kWidth * Math.cos(rad) * kage.kKakato;
                y1 -= kage.kWidth * Math.sin(rad) * kage.kKakato;
            }
        }
        if (a2 % 10 === 2) {
            if (sx2 === x2) {
                if (sy2 < y2) {
                    y2 += kage.kWidth;
                }
                else {
                    y2 -= kage.kWidth;
                }
            }
            else if (sy2 === y2) {
                if (sx2 < x2) {
                    x2 += kage.kWidth;
                }
                else {
                    x2 -= kage.kWidth;
                }
            }
            else {
                var rad = Math.atan2(y2 - sy2, x2 - sx2);
                x2 += kage.kWidth * Math.cos(rad);
                y2 += kage.kWidth * Math.sin(rad);
            }
        }
        if (a2 % 10 === 3) {
            if (sx2 === x2) {
                if (sy2 < y2) {
                    y2 += kage.kWidth * kage.kKakato;
                }
                else {
                    y2 -= kage.kWidth * kage.kKakato;
                }
            }
            else if (sy2 === y2) {
                if (sx2 < x2) {
                    x2 += kage.kWidth * kage.kKakato;
                }
                else {
                    x2 -= kage.kWidth * kage.kKakato;
                }
            }
            else {
                var rad = Math.atan2(y2 - sy2, x2 - sx2);
                x2 += kage.kWidth * Math.cos(rad) * kage.kKakato;
                y2 += kage.kWidth * Math.sin(rad) * kage.kKakato;
            }
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
                x = (Math.pow((1 - t), 2) * x1 + 2 * t * (1 - t) * sx1 + Math.pow(t, 2) * x2);
                y = (Math.pow((1 - t), 2) * y1 + 2 * t * (1 - t) * sy1 + Math.pow(t, 2) * y2);
                // SESSEN NO KATAMUKI NO KEISAN(BIBUN)
                ix = (x1 - 2 * sx1 + x2) * 2 * t + (-2 * x1 + 2 * sx1);
                iy = (y1 - 2 * sy1 + y2) * 2 * t + (-2 * y1 + 2 * sy1);
            }
            else {
                // calculate a dot
                x = Math.pow((1 - t), 3) * x1 + 3 * t * Math.pow((1 - t), 2) * sx1 + 3 * Math.pow(t, 2) * (1 - t) * sx2 + Math.pow(t, 3) * x2;
                y = Math.pow((1 - t), 3) * y1 + 3 * t * Math.pow((1 - t), 2) * sy1 + 3 * Math.pow(t, 2) * (1 - t) * sy2 + Math.pow(t, 3) * y2;
                // KATAMUKI of vector by BIBUN
                ix = Math.pow(t, 2) * (-3 * x1 + 9 * sx1 + -9 * sx2 + 3 * x2)
                    + t * (6 * x1 + -12 * sx1 + 6 * sx2) + -3 * x1 + 3 * sx1;
                iy = Math.pow(t, 2) * (-3 * y1 + 9 * sy1 + -9 * sy2 + 3 * y2)
                    + t * (6 * y1 + -12 * sy1 + 6 * sy2) + -3 * y1 + 3 * sy1;
            }
            // SESSEN NI SUICHOKU NA CHOKUSEN NO KEISAN
            var ia = void 0;
            var ib = void 0;
            if (kage.kShotai === kage.kMincho) {
                if (ix !== 0 && iy !== 0) {
                    var ir = Math.atan(iy / ix * -1.0);
                    ia = Math.sin(ir) * kage.kMinWidthT;
                    ib = Math.cos(ir) * kage.kMinWidthT;
                }
                else if (ix === 0) {
                    ia = kage.kMinWidthT;
                    ib = 0;
                }
                else {
                    ia = 0;
                    ib = kage.kMinWidthT;
                }
                ia *= Math.sqrt(1 - t);
                ib *= Math.sqrt(1 - t);
            }
            else {
                if (ix !== 0 && iy !== 0) {
                    var ir = Math.atan(iy / ix * -1.0);
                    ia = Math.sin(ir) * kage.kWidth;
                    ib = Math.cos(ir) * kage.kWidth;
                }
                else if (ix === 0) {
                    ia = kage.kWidth;
                    ib = 0;
                }
                else {
                    ia = 0;
                    ib = kage.kWidth;
                }
            }
            // reverse if vector is going 2nd/3rd quadrants
            if (ix <= 0) {
                ia *= -1;
                ib *= -1;
            }
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
                    poly.push(x2 - kMinWidthT * 0.9, y2 + kMinWidthT * 0.9, 1);
                    poly.push(x2, y2 + kMinWidthT);
                    poly.push(x2 + kMinWidthT * 0.9, y2 + kMinWidthT * 0.9, 1);
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
                            poly2.push(x2 + kMinWidthT * 0.9, y2 - kMinWidthT * 0.9, 1);
                            poly2.push(x2 + kMinWidthT, y2);
                            poly2.push(x2 + kMinWidthT * 0.9, y2 + kMinWidthT * 0.9, 1);
                            poly2.push(x2, y2 + kMinWidthT);
                        }
                        else {
                            poly2.push(x2, y2 - kMinWidthT);
                            poly2.push(x2 - kMinWidthT * 0.9, y2 - kMinWidthT * 0.9, 1);
                            poly2.push(x2 - kMinWidthT, y2);
                            poly2.push(x2 - kMinWidthT * 0.9, y2 + kMinWidthT * 0.9, 1);
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
            var rad = Math.atan((y2 - y1) / (x2 - x1));
            if ((Math.abs(y2 - y1) < Math.abs(x2 - x1)) && (a1 !== 6) && (a2 !== 6) && !(x1 > x2)) {
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
                        poly.push(x2 - Math.cos(rad) * kMinWidthT * 0.9 * v + Math.sin(rad) * kMinWidthT * 0.9 * v, y2 + Math.sin(rad) * kMinWidthT * 0.9 * v - Math.cos(rad) * kMinWidthT * 0.9 * v, 1);
                        poly.push(x2 + Math.cos(rad) * kMinWidthT * v, y2 + Math.sin(rad) * kMinWidthT * v);
                        poly.push(x2 + Math.cos(rad) * kMinWidthT * 0.9 * v - Math.sin(rad) * kMinWidthT * 0.9 * v, y2 + Math.sin(rad) * kMinWidthT * 0.9 * v + Math.cos(rad) * kMinWidthT * 0.9 * v, 1);
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
            var rad = Math.atan((y2 - y1) / (x2 - x1));
            if (a1 % 10 === 2) {
                x1 -= kage.kWidth * Math.cos(rad);
                y1 -= kage.kWidth * Math.sin(rad);
            }
            if (a2 % 10 === 2) {
                x2 += kage.kWidth * Math.cos(rad);
                y2 += kage.kWidth * Math.sin(rad);
            }
            if (a1 % 10 === 3) {
                x1 -= kage.kWidth * Math.cos(rad) * kage.kKakato;
                y1 -= kage.kWidth * Math.sin(rad) * kage.kKakato;
            }
            if (a2 % 10 === 3) {
                x2 += kage.kWidth * Math.cos(rad) * kage.kKakato;
                y2 += kage.kWidth * Math.sin(rad) * kage.kKakato;
            }
            // SUICHOKU NO ICHI ZURASHI HA Math.sin TO Math.cos NO IREKAE + x-axis MAINASU KA
            var poly = new polygon_1.Polygon();
            poly.push(x1 + Math.sin(rad) * kage.kWidth, y1 - Math.cos(rad) * kage.kWidth);
            poly.push(x2 + Math.sin(rad) * kage.kWidth, y2 - Math.cos(rad) * kage.kWidth);
            poly.push(x2 - Math.sin(rad) * kage.kWidth, y2 + Math.cos(rad) * kage.kWidth);
            poly.push(x1 - Math.sin(rad) * kage.kWidth, y1 + Math.cos(rad) * kage.kWidth);
            polygons.push(poly);
        }
    }
}
exports.cdDrawLine = cdDrawLine;

},{"./curve":4,"./kage":6,"./polygon":9}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kagecd_1 = require("./kagecd");
function dfDrawFont(kage, polygons, a1, a2, a3, x1, y1, x2, y2, x3, y3, x4, y4) {
    if (kage.kShotai === kage.kMincho) {
        switch (a1 % 100) {
            case 0:
                break;
            case 1: {
                if (a3 % 100 === 4) {
                    var tx1 = void 0;
                    var ty1 = void 0;
                    if (x1 === x2) {
                        var v = y1 < y2 ? 1 : -1;
                        tx1 = x2;
                        ty1 = y2 - kage.kMage * v;
                    }
                    else if (y1 === y2) {
                        var v = x1 < x2 ? 1 : -1;
                        tx1 = x2 - kage.kMage * v;
                        ty1 = y2;
                    }
                    else {
                        var rad = Math.atan2(y2 - y1, x2 - x1);
                        tx1 = x2 - kage.kMage * Math.cos(rad);
                        ty1 = y2 - kage.kMage * Math.sin(rad);
                    }
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
                    var tx1 = void 0;
                    var ty1 = void 0;
                    if (x2 === x3) {
                        tx1 = x3;
                        ty1 = y3 - kage.kMage;
                    }
                    else if (y2 === y3) {
                        tx1 = x3 - kage.kMage;
                        ty1 = y3;
                    }
                    else {
                        var rad = Math.atan2(y3 - y2, x3 - x2);
                        tx1 = x3 - kage.kMage * Math.cos(rad);
                        ty1 = y3 - kage.kMage * Math.sin(rad);
                    }
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
                    var tx1 = void 0;
                    var ty1 = void 0;
                    if (x1 === x2) {
                        var v = y1 < y2 ? 1 : -1;
                        tx1 = x2;
                        ty1 = y2 - kage.kMage * v;
                    }
                    else if (y1 === y2) {
                        var v = x1 < x2 ? 1 : -1;
                        tx1 = x2 - kage.kMage * v;
                        ty1 = y2;
                    }
                    else {
                        var rad = Math.atan2(y2 - y1, x2 - x1);
                        tx1 = x2 - kage.kMage * Math.cos(rad);
                        ty1 = y2 - kage.kMage * Math.sin(rad);
                    }
                    var tx2 = void 0;
                    var ty2 = void 0;
                    if (x2 === x3) {
                        var v = y2 < y3 ? 1 : -1;
                        tx2 = x2;
                        ty2 = y2 + kage.kMage * v;
                    }
                    else if (y2 === y3) {
                        var v = x2 < x3 ? 1 : -1;
                        tx2 = x2 + kage.kMage * v;
                        ty2 = y2;
                    }
                    else {
                        var rad = Math.atan2(y3 - y2, x3 - x2);
                        tx2 = x2 + kage.kMage * Math.cos(rad);
                        ty2 = y2 + kage.kMage * Math.sin(rad);
                    }
                    var tx3 = x3;
                    var ty3 = y3;
                    kagecd_1.cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2, 1);
                    kagecd_1.cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, tx2, ty2, 1 + (a2 - a2 % 1000) * 10, 1 + (a3 - a3 % 1000));
                    if ((x2 < x3 && tx3 - tx2 > 0) || (x2 > x3 && tx2 - tx3 > 0)) {
                        kagecd_1.cdDrawLine(kage, polygons, tx2, ty2, tx3, ty3, 6 + (a3 - a3 % 1000), 5); // bolder by force
                    }
                }
                else {
                    var tx1 = void 0;
                    var ty1 = void 0;
                    if (x1 === x2) {
                        var v = y1 < y2 ? 1 : -1;
                        tx1 = x2;
                        ty1 = y2 - kage.kMage * v;
                    }
                    else if (y1 === y2) {
                        var v = x1 < x2 ? 1 : -1;
                        tx1 = x2 - kage.kMage * v;
                        ty1 = y2;
                    }
                    else {
                        var rad = Math.atan2(y2 - y1, x2 - x1);
                        tx1 = x2 - kage.kMage * Math.cos(rad);
                        ty1 = y2 - kage.kMage * Math.sin(rad);
                    }
                    var tx2 = void 0;
                    var ty2 = void 0;
                    if (x2 === x3) {
                        var v = y2 < y3 ? 1 : -1;
                        tx2 = x2;
                        ty2 = y2 + kage.kMage * v;
                    }
                    else if (y2 === y3) {
                        var v = x2 < x3 ? 1 : -1;
                        tx2 = x2 + kage.kMage * v;
                        ty2 = y2;
                    }
                    else {
                        var rad = Math.atan2(y3 - y2, x3 - x2);
                        tx2 = x2 + kage.kMage * Math.cos(rad);
                        ty2 = y2 + kage.kMage * Math.sin(rad);
                    }
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
                    rate = Math.sqrt(Math.pow((x3 - x2), 2) + Math.pow((y3 - y2), 2)) / 120 * 6;
                }
                if (a3 === 5) {
                    var tx1 = void 0;
                    var ty1 = void 0;
                    if (x1 === x2) {
                        var v = y1 < y2 ? 1 : -1;
                        tx1 = x2;
                        ty1 = y2 - kage.kMage * v * rate;
                    }
                    else if (y1 === y2) {
                        var v = x1 < x2 ? 1 : -1;
                        tx1 = x2 - kage.kMage * v * rate;
                        ty1 = y2;
                    }
                    else {
                        var rad = Math.atan2(y2 - y1, x2 - x1);
                        tx1 = x2 - kage.kMage * Math.cos(rad) * rate;
                        ty1 = y2 - kage.kMage * Math.sin(rad) * rate;
                    }
                    var tx2 = void 0;
                    var ty2 = void 0;
                    if (x2 === x3) {
                        var v = y2 < y3 ? 1 : -1;
                        tx2 = x2;
                        ty2 = y2 + kage.kMage * v * rate;
                    }
                    else if (y2 === y3) {
                        var v = x2 < x3 ? 1 : -1;
                        tx2 = x2 + kage.kMage * v * rate;
                        ty2 = y2;
                    }
                    else {
                        var rad = Math.atan2(y3 - y2, x3 - x2);
                        tx2 = x2 + kage.kMage * Math.cos(rad) * rate;
                        ty2 = y2 + kage.kMage * Math.sin(rad) * rate;
                    }
                    var tx3 = x3;
                    var ty3 = y3;
                    kagecd_1.cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2, 1);
                    kagecd_1.cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1);
                    if (tx3 - tx2 > 0) {
                        kagecd_1.cdDrawLine(kage, polygons, tx2, ty2, tx3, ty3, 6, 5); // bolder by force
                    }
                }
                else {
                    var tx1 = void 0;
                    var ty1 = void 0;
                    if (x1 === x2) {
                        var v = y1 < y2 ? 1 : -1;
                        tx1 = x2;
                        ty1 = y2 - kage.kMage * v * rate;
                    }
                    else if (y1 === y2) {
                        var v = x1 < x2 ? 1 : -1;
                        tx1 = x2 - kage.kMage * v * rate;
                        ty1 = y2;
                    }
                    else {
                        var rad = Math.atan2(y2 - y1, x2 - x1);
                        tx1 = x2 - kage.kMage * Math.cos(rad) * rate;
                        ty1 = y2 - kage.kMage * Math.sin(rad) * rate;
                    }
                    var tx2 = void 0;
                    var ty2 = void 0;
                    if (x2 === x3) {
                        var v = y2 < y3 ? 1 : -1;
                        tx2 = x2;
                        ty2 = y2 + kage.kMage * v * rate;
                    }
                    else if (y2 === y3) {
                        var v = x2 < x3 ? 1 : -1;
                        tx2 = x2 + kage.kMage * v * rate;
                        ty2 = y2;
                    }
                    else {
                        var rad = Math.atan2(y3 - y2, x3 - x2);
                        tx2 = x2 + kage.kMage * Math.cos(rad) * rate;
                        ty2 = y2 + kage.kMage * Math.sin(rad) * rate;
                    }
                    kagecd_1.cdDrawLine(kage, polygons, x1, y1, tx1, ty1, a2, 1);
                    kagecd_1.cdDrawCurve(kage, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1);
                    kagecd_1.cdDrawLine(kage, polygons, tx2, ty2, x3, y3, 6, a3); // bolder by force
                }
                break;
            }
            case 6: {
                if (a3 % 100 === 4) {
                    var tx1 = void 0;
                    var ty1 = void 0;
                    if (x3 === x4) {
                        tx1 = x4;
                        ty1 = y4 - kage.kMage;
                    }
                    else if (y3 === y4) {
                        tx1 = x4 - kage.kMage;
                        ty1 = y4;
                    }
                    else {
                        var rad = Math.atan2(y4 - y3, x4 - x3);
                        tx1 = x4 - kage.kMage * Math.cos(rad);
                        ty1 = y4 - kage.kMage * Math.sin(rad);
                    }
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
                    var tx1 = void 0;
                    var ty1 = void 0;
                    if (x1 === x2) {
                        var v = y1 < y2 ? 1 : -1;
                        tx1 = x2;
                        ty1 = y2 - kage.kMage * v;
                    }
                    else if (y1 === y2) {
                        var v = x1 < x2 ? 1 : -1;
                        tx1 = x2 - kage.kMage * v;
                        ty1 = y2;
                    }
                    else {
                        var rad = Math.atan2(y2 - y1, x2 - x1);
                        tx1 = x2 - kage.kMage * Math.cos(rad);
                        ty1 = y2 - kage.kMage * Math.sin(rad);
                    }
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
                    var tx1 = void 0;
                    var ty1 = void 0;
                    if (x2 === x3) {
                        tx1 = x3;
                        ty1 = y3 - kage.kMage;
                    }
                    else if (y2 === y3) {
                        tx1 = x3 - kage.kMage;
                        ty1 = y3;
                    }
                    else {
                        var rad = Math.atan2(y3 - y2, x3 - x2);
                        tx1 = x3 - kage.kMage * Math.cos(rad);
                        ty1 = y3 - kage.kMage * Math.sin(rad);
                    }
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
                    var tx1 = void 0;
                    var ty1 = void 0;
                    if (x1 === x2) {
                        var v = y1 < y2 ? 1 : -1;
                        tx1 = x2;
                        ty1 = y2 - kage.kMage * v;
                    }
                    else if (y1 === y2) {
                        var v = x1 < x2 ? 1 : -1;
                        tx1 = x2 - kage.kMage * v;
                        ty1 = y2;
                    }
                    else {
                        var rad = Math.atan2(y2 - y1, x2 - x1);
                        tx1 = x2 - kage.kMage * Math.cos(rad);
                        ty1 = y2 - kage.kMage * Math.sin(rad);
                    }
                    var tx2 = void 0;
                    var ty2 = void 0;
                    if (x2 === x3) {
                        var v = y2 < y3 ? 1 : -1;
                        tx2 = x2;
                        ty2 = y2 + kage.kMage * v;
                    }
                    else if (y2 === y3) {
                        var v = x2 < x3 ? 1 : -1;
                        tx2 = x2 + kage.kMage * v;
                        ty2 = y2;
                    }
                    else {
                        var rad = Math.atan2(y3 - y2, x3 - x2);
                        tx2 = x2 + kage.kMage * Math.cos(rad);
                        ty2 = y2 + kage.kMage * Math.sin(rad);
                    }
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
                    var tx1 = void 0;
                    var ty1 = void 0;
                    if (x1 === x2) {
                        var v = y1 < y2 ? 1 : -1;
                        tx1 = x2;
                        ty1 = y2 - kage.kMage * v;
                    }
                    else if (y1 === y2) {
                        var v = x1 < x2 ? 1 : -1;
                        tx1 = x2 - kage.kMage * v;
                        ty1 = y2;
                    }
                    else {
                        var rad = Math.atan2(y2 - y1, x2 - x1);
                        tx1 = x2 - kage.kMage * Math.cos(rad);
                        ty1 = y2 - kage.kMage * Math.sin(rad);
                    }
                    var tx2 = void 0;
                    var ty2 = void 0;
                    if (x2 === x3) {
                        var v = y2 < y3 ? 1 : -1;
                        tx2 = x2;
                        ty2 = y2 + kage.kMage * v;
                    }
                    else if (y2 === y3) {
                        var v = x2 < x3 ? 1 : -1;
                        tx2 = x2 + kage.kMage * v;
                        ty2 = y2;
                    }
                    else {
                        var rad = Math.atan2(y3 - y2, x3 - x2);
                        tx2 = x2 + kage.kMage * Math.cos(rad);
                        ty2 = y2 + kage.kMage * Math.sin(rad);
                    }
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

},{"./kagecd":7}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Polygon = (function () {
    function Polygon(number) {
        // property
        this.array = [];
        // initialize
        if (number) {
            for (var i = 0; i < number; i++) {
                this.push(0, 0, 0);
            }
        }
    }
    // method
    Polygon.prototype.push = function (x, y, off) {
        if (off !== 1) {
            off = 0;
        }
        this.array.push({
            x: Math.floor(x * 10) / 10,
            y: Math.floor(y * 10) / 10,
            off: off,
        });
    };
    Polygon.prototype.set = function (index, x, y, off) {
        this.array[index].x = Math.floor(x * 10) / 10;
        this.array[index].y = Math.floor(y * 10) / 10;
        if (off !== 1) {
            off = 0;
        }
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
        if (off !== 1) {
            off = 0;
        }
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
                throw new Error("error~~~");
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
                    else if (array[j].off === 1) {
                        buffer += "Q ";
                        mode = "Q";
                    }
                    else if (mode === "Q" && array[j - 1].off !== 1) {
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

},{}]},{},[2]);
