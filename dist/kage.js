/*! kage.js v0.3.1
 *  Licensed under GPL-3.0
 *  https://github.com/kurgm/kage-engine#readme
 */
var Kage = (function () {
    'use strict';

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
    var Stroke = /** @class */ (function () {
        function Stroke(data) {
            this.a1 = data[0], this.a2_100 = data[1], this.a3_100 = data[2], this.x1 = data[3], this.y1 = data[4], this.x2 = data[5], this.y2 = data[6], this.x3 = data[7], this.y3 = data[8], this.x4 = data[9], this.y4 = data[10];
            this.kirikuchiAdjustment = Math.floor(this.a2_100 / 100) % 10;
            this.tateAdjustment = Math.floor(this.a2_100 / 1000) % 10;
            this.opt3 = Math.floor(this.a2_100 / 10000);
            this.a2_100 %= 100;
            this.haneAdjustment = this.urokoAdjustment = this.kakatoAdjustment = Math.floor(this.a3_100 / 100) % 10;
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
                case 4:
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

    // eslint-disable-next-line @typescript-eslint/unbound-method
    var hypot = Math.hypot || (function (x, y) { return Math.sqrt(x * x + y * y); });
    /** Calculates a new vector with the same angle and a new magnitude. */
    function normalize(_a, magnitude) {
        var x = _a[0], y = _a[1];
        if (magnitude === void 0) { magnitude = 1; }
        if (x === 0 && y === 0) {
            // Angle is the same as Math.atan2(y, x)
            return [1 / x === Infinity ? magnitude : -magnitude, 0];
        }
        var k = magnitude / hypot(x, y);
        return [x * k, y * k];
    }
    function quadraticBezier(p1, p2, p3, t) {
        var s = 1 - t;
        return (s * s) * p1 + 2 * (s * t) * p2 + (t * t) * p3;
    }
    /** Returns d/dt(quadraticBezier) */
    function quadraticBezierDeriv(p1, p2, p3, t) {
        // const s = 1 - t;
        // ds/dt = -1
        // return (-2 * s) * p1 + 2 * (s - t) * p2 + (2 * t) * p3;
        return 2 * (t * (p1 - 2 * p2 + p3) - p1 + p2);
    }
    function cubicBezier(p1, p2, p3, p4, t) {
        var s = 1 - t;
        return (s * s * s) * p1 + 3 * (s * s * t) * p2 + 3 * (s * t * t) * p3 + (t * t * t) * p4;
    }
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
    function round(v, rate) {
        if (rate === void 0) { rate = 1E8; }
        return Math.round(v * rate) / rate;
    }

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
        return round(cross_1112_1121 * cross_1112_1122, 1E5) <= 0 && round(cross_2122_2111 * cross_2122_2112, 1E5) <= 0;
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
    function isCrossWithOthers(strokesArray, i, bx1, by1, bx2, by2) {
        return strokesArray.some(function (stroke, j) { return (i !== j
            && stroke.getControlSegments().some(function (_a) {
                var x1 = _a[0], y1 = _a[1], x2 = _a[2], y2 = _a[3];
                return (isCross(x1, y1, x2, y2, bx1, by1, bx2, by2));
            })); });
    }

    function divide_curve(x1, y1, sx1, sy1, x2, y2, curve) {
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
    // ------------------------------------------------------------------
    function find_offcurve(curve, sx, sy) {
        var _a = curve[0], nx1 = _a[0], ny1 = _a[1];
        var _b = curve[curve.length - 1], nx2 = _b[0], ny2 = _b[1];
        var area = 8;
        var minx = ternarySearchMin(function (tx) { return curve.reduce(function (diff, p, i) {
            var t = i / (curve.length - 1);
            var x = quadraticBezier(nx1, tx, nx2, t);
            return diff + Math.pow((p[0] - x), 2);
        }, 0); }, sx - area, sx + area);
        var miny = ternarySearchMin(function (ty) { return curve.reduce(function (diff, p, i) {
            var t = i / (curve.length - 1);
            var y = quadraticBezier(ny1, ty, ny2, t);
            return diff + Math.pow((p[1] - y), 2);
        }, 0); }, sy - area, sy + area);
        return [nx1, ny1, minx, miny, nx2, ny2];
    }
    // ------------------------------------------------------------------
    function generateFattenCurve(x1, y1, sx1, sy1, sx2, sy2, x2, y2, kRate, widthFunc, normalize_) {
        if (normalize_ === void 0) { normalize_ = normalize; }
        var curve = { left: [], right: [] };
        var isQuadratic = sx1 === sx2 && sy1 === sy2;
        var xFunc, yFunc, ixFunc, iyFunc;
        if (isQuadratic) {
            // Spline
            xFunc = function (t) { return quadraticBezier(x1, sx1, x2, t); };
            yFunc = function (t) { return quadraticBezier(y1, sy1, y2, t); };
            ixFunc = function (t) { return quadraticBezierDeriv(x1, sx1, x2, t); };
            iyFunc = function (t) { return quadraticBezierDeriv(y1, sy1, y2, t); };
        }
        else { // Bezier
            xFunc = function (t) { return cubicBezier(x1, sx1, sx2, x2, t); };
            yFunc = function (t) { return cubicBezier(y1, sy1, sy2, y2, t); };
            ixFunc = function (t) { return cubicBezierDeriv(x1, sx1, sx2, x2, t); };
            iyFunc = function (t) { return cubicBezierDeriv(y1, sy1, sy2, y2, t); };
        }
        for (var tt = 0; tt <= 1000; tt += kRate) {
            var t = tt / 1000;
            // calculate a dot
            var x = xFunc(t);
            var y = yFunc(t);
            // KATAMUKI of vector by BIBUN
            var ix = ixFunc(t);
            var iy = iyFunc(t);
            var width = widthFunc(t);
            // line SUICHOKU by vector
            var _a = normalize_([-iy, ix], width), ia = _a[0], ib = _a[1];
            curve.left.push([x - ia, y - ib]);
            curve.right.push([x + ia, y + ib]);
        }
        return curve;
    }

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
        Polygon.prototype.scale = function (factor) {
            this._array.forEach(function (point) {
                point.x *= factor;
                point.y *= factor;
            });
            return this; // for chaining
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
            return this.scale(-1); // for chaining
        };
        Polygon.prototype.rotate270 = function () {
            this._array.forEach(function (point) {
                var x = point.x, y = point.y;
                point.x = y;
                point.y = -x;
            });
            return this;
        };
        // for backward compatibility...
        Polygon.prototype.floor = function () {
            this._array.forEach(function (point) {
                var x = point.x, y = point.y;
                point.x = Math.floor(x);
                point.y = Math.floor(y);
            });
            return this;
        };
        return Polygon;
    }());

    function cdDrawCurveU(font, polygons, x1, y1, sx1, sy1, sx2, sy2, x2, y2, ta1, ta2, opt1, haneAdjustment, opt3, opt4) {
        var a1 = ta1;
        var a2 = ta2;
        var kMinWidthT = font.kMinWidthT - opt1 / 2;
        var delta1;
        switch (a1 % 100) {
            case 0:
            case 7:
            case 27:
                delta1 = -1 * font.kMinWidthY * 0.5;
                break;
            case 1:
            case 2: // ... must be 32
            case 6:
            case 22:
            case 32: // changed
                delta1 = 0;
                break;
            case 12:
                // case 32:
                delta1 = font.kMinWidthY;
                break;
            default:
                return;
        }
        if (delta1 !== 0) {
            var _a = (x1 === sx1 && y1 === sy1)
                ? [0, delta1] // ?????
                : normalize([x1 - sx1, y1 - sy1], delta1), dx1 = _a[0], dy1 = _a[1];
            x1 += dx1;
            y1 += dy1;
        }
        var cornerOffset = 0;
        var contourLength = hypot(sx1 - x1, sy1 - y1) + hypot(sx2 - sx1, sy2 - sy1) + hypot(x2 - sx2, y2 - sy2);
        if ((a1 === 22 || a1 === 27) && a2 === 7 && contourLength < 100) {
            cornerOffset = (kMinWidthT > 6) ? (kMinWidthT - 6) * ((100 - contourLength) / 100) : 0;
            x1 += cornerOffset;
        }
        var delta2;
        switch (a2 % 100) {
            case 0:
            case 1:
            case 7:
            case 9:
            case 15: // it can change to 15->5
            case 14: // it can change to 14->4
            case 17: // no need
            case 5:
                delta2 = 0;
                break;
            case 8: // get shorten for tail's circle
                delta2 = -1 * kMinWidthT * 0.5;
                break;
            default:
                delta2 = delta1; // ?????
                break;
        }
        if (delta2 !== 0) {
            var _b = (sx2 === x2 && sy2 === y2)
                ? [0, -delta2] // ?????
                : normalize([x2 - sx2, y2 - sy2], delta2), dx2 = _b[0], dy2 = _b[1];
            x2 += dx2;
            y2 += dy2;
        }
        var isQuadratic = sx1 === sx2 && sy1 === sy2;
        // ---------------------------------------------------------------
        if (isQuadratic && font.kUseCurve) {
            // Spline
            // generating fatten curve -- begin
            var hosomi_1 = 0.5;
            var deltadFunc_1 = (a1 === 7 && a2 === 0) // L2RD: fatten
                ? function (t) { return Math.pow(t, hosomi_1) * 1.1; } // should be font.kL2RDfatten ?
                : (a1 === 7)
                    ? function (t) { return Math.pow(t, hosomi_1); }
                    : (a2 === 7)
                        ? function (t) { return Math.pow((1 - t), hosomi_1); }
                        : (opt3 > 0) // should be (opt3 > 0 || opt4 > 0) ?
                            ? function (t) { return 1 - opt3 / 2 / (kMinWidthT - opt4 / 2) + opt3 / 2 / (kMinWidthT - opt4) * t; } // ??????
                            : function () { return 1; };
            var _c = generateFattenCurve(x1, y1, sx1, sy1, sx1, sy1, x2, y2, 10, function (t) {
                var deltad = deltadFunc_1(t);
                if (deltad < 0.15) {
                    deltad = 0.15;
                }
                return kMinWidthT * deltad;
            }, function (_a, mag) {
                var x = _a[0], y = _a[1];
                return (y === 0)
                    ? [-mag, 0] // ?????
                    : normalize([x, y], mag);
            }), curveL = _c.left, curveR = _c.right; // L and R
            var _d = divide_curve(x1, y1, sx1, sy1, x2, y2, curveL), _e = _d.off, offL1 = _e[0], offL2 = _e[1], indexL = _d.index;
            var curveL1 = curveL.slice(0, indexL + 1);
            var curveL2 = curveL.slice(indexL);
            var _f = divide_curve(x1, y1, sx1, sy1, x2, y2, curveR), _g = _f.off, offR1 = _g[0], offR2 = _g[1], indexR = _f.index;
            var ncl1 = find_offcurve(curveL1, offL1[2], offL1[3]);
            var ncl2 = find_offcurve(curveL2, offL2[2], offL2[3]);
            var poly = new Polygon([
                { x: ncl1[0], y: ncl1[1] },
                { x: ncl1[2], y: ncl1[3], off: true },
                { x: ncl1[4], y: ncl1[5] },
                { x: ncl2[2], y: ncl2[3], off: true },
                { x: ncl2[4], y: ncl2[5] },
            ]);
            var poly2 = new Polygon([
                { x: curveR[0][0], y: curveR[0][1] },
                {
                    x: offR1[2] - (ncl1[2] - offL1[2]),
                    y: offR1[3] - (ncl1[3] - offL1[3]),
                    off: true,
                },
                { x: curveR[indexR][0], y: curveR[indexR][1] },
                {
                    x: offR2[2] - (ncl2[2] - offL2[2]),
                    y: offR2[3] - (ncl2[3] - offL2[3]),
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
            var hosomi_2 = 0.5;
            if (hypot(x2 - x1, y2 - y1) < 50) {
                hosomi_2 += 0.4 * (1 - hypot(x2 - x1, y2 - y1) / 50);
            }
            var deltadFunc_2 = (a1 === 7 || a1 === 27) && a2 === 0 // L2RD: fatten
                ? function (t) { return Math.pow(t, hosomi_2) * font.kL2RDfatten; }
                : (a1 === 7 || a1 === 27)
                    ? (isQuadratic) // ?????
                        ? function (t) { return Math.pow(t, hosomi_2); }
                        : function (t) { return Math.pow((Math.pow(t, hosomi_2)), 0.7); } // make fatten
                    : a2 === 7
                        ? function (t) { return Math.pow((1 - t), hosomi_2); }
                        : isQuadratic && (opt3 > 0 || opt4 > 0) // ?????
                            ? function (t) { return ((font.kMinWidthT - opt3 / 2) - (opt4 - opt3) / 2 * t) / font.kMinWidthT; }
                            : function () { return 1; };
            var _h = generateFattenCurve(x1, y1, sx1, sy1, sx2, sy2, x2, y2, font.kRate, function (t) {
                var deltad = deltadFunc_2(t);
                if (deltad < 0.15) {
                    deltad = 0.15;
                }
                return kMinWidthT * deltad;
            }, function (_a, mag) {
                var x = _a[0], y = _a[1];
                return (round(x) === 0 && round(y) === 0)
                    ? [-mag, 0] // ?????
                    : normalize([x, y], mag);
            }), left = _h.left, right = _h.right;
            var poly = new Polygon();
            var poly2 = new Polygon();
            // copy to polygon structure
            for (var _i = 0, left_1 = left; _i < left_1.length; _i++) {
                var _j = left_1[_i], x = _j[0], y = _j[1];
                poly.push(x, y);
            }
            for (var _k = 0, right_1 = right; _k < right_1.length; _k++) {
                var _l = right_1[_k], x = _l[0], y = _l[1];
                poly2.push(x, y);
            }
            // suiheisen ni setsuzoku
            if (a1 === 132 || a1 === 22 && (isQuadratic ? (y1 > y2) : (x1 > sx1))) { // ?????
                for (var index = 0, length_1 = poly2.length; index + 1 < length_1; index++) {
                    var point1 = poly2.get(index);
                    var point2 = poly2.get(index + 1);
                    if (point1.y <= y1 && y1 <= point2.y) {
                        var newx1 = point2.x + (point1.x - point2.x) * (y1 - point2.y) / (point1.y - point2.y);
                        var newy1 = y1;
                        var point3 = poly.get(0);
                        var point4 = poly.get(1);
                        var newx2 = (a1 === 132) // ?????
                            ? point3.x + (point4.x - point3.x) * (y1 - point3.y) / (point4.y - point3.y)
                            : point3.x + (point4.x - point3.x + 1) * (y1 - point3.y) / (point4.y - point3.y); // "+ 1"?????
                        var newy2 = (a1 === 132) // ?????
                            ? y1
                            : y1 + 1; // "+ 1"?????
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
        switch (a1) {
            case 12: {
                var _m = (x1 === sx1)
                    ? [0, 1] // ?????
                    : normalize([sx1 - x1, sy1 - y1]), dx = _m[0], dy = _m[1];
                var poly = new Polygon([
                    { x: -kMinWidthT, y: 0 },
                    { x: +kMinWidthT, y: 0 },
                    { x: -kMinWidthT, y: -kMinWidthT },
                ]).rotate270().transformMatrix2(dx, dy).translate(x1, y1);
                polygons.push(poly);
                break;
            }
            case 0: {
                var _o = (x1 === sx1)
                    ? [0, 1] // ?????
                    : normalize([sx1 - x1, sy1 - y1]), XX = _o[0], XY = _o[1];
                if (y1 <= y2) { // from up to bottom
                    var type = Math.atan2(Math.abs(y1 - sy1), Math.abs(x1 - sx1)) / Math.PI * 2 - 0.4;
                    if (type > 0) {
                        type *= 2;
                    }
                    else {
                        type *= 16;
                    }
                    var pm = type < 0 ? -1 : 1;
                    var poly = new Polygon([
                        { x: -kMinWidthT, y: 1 },
                        { x: +kMinWidthT, y: 0 },
                        { x: -pm * kMinWidthT, y: -font.kMinWidthY * Math.abs(type) },
                    ]).rotate270().transformMatrix2(XX, XY).translate(x1, y1);
                    // if(x1 > x2){
                    //  poly.reverse();
                    // }
                    polygons.push(poly);
                    // beginning of the stroke
                    var move = type < 0 ? -type * font.kMinWidthY : 0;
                    var poly2 = new Polygon();
                    poly2.push(kMinWidthT, -move);
                    if (x1 === sx1 && y1 === sy1) { // ?????
                        // type === -6.4 && pm === -1 && move === 6.4 * font.kMinWidthY
                        poly2.push(kMinWidthT * 1.5, font.kMinWidthY - move);
                        poly2.push(kMinWidthT - 2, font.kMinWidthY * 2 + 1);
                    }
                    else {
                        poly2.push(kMinWidthT * 1.5, font.kMinWidthY - move * 1.2);
                        poly2.push(kMinWidthT - 2, font.kMinWidthY * 2 - move * 0.8 + 1);
                        // if(x1 < x2){
                        //  poly2.reverse();
                        // }
                    }
                    poly2.rotate270().transformMatrix2(XX, XY).translate(x1, y1);
                    polygons.push(poly2);
                }
                else { // bottom to up
                    var poly = new Polygon([
                        { x: 0, y: +kMinWidthT },
                        { x: 0, y: -kMinWidthT },
                        { x: -font.kMinWidthY, y: -kMinWidthT },
                    ]);
                    poly.transformMatrix2(XX, XY).translate(x1, y1);
                    // if(x1 < x2){
                    //  poly.reverse();
                    // }
                    polygons.push(poly);
                    // beginning of the stroke
                    var poly2 = new Polygon([
                        { x: 0, y: +kMinWidthT },
                        { x: +font.kMinWidthY, y: +kMinWidthT * 1.5 },
                        { x: +font.kMinWidthY * 3, y: +kMinWidthT * 0.5 },
                    ]);
                    // if(x1 < x2){
                    //  poly2.reverse();
                    // }
                    poly2.transformMatrix2(XX, XY).translate(x1, y1);
                    polygons.push(poly2);
                }
                break;
            }
            case 22:
            case 27: { // box's up-right corner, any time same degree
                var poly = new Polygon([
                    { x: -kMinWidthT, y: -font.kMinWidthY },
                    { x: 0, y: -font.kMinWidthY - font.kWidth },
                    { x: +kMinWidthT + font.kWidth, y: +font.kMinWidthY },
                    { x: +kMinWidthT, y: +kMinWidthT - 1 },
                ].concat((a1 === 27)
                    ? [
                        { x: 0, y: +kMinWidthT + 2 },
                        { x: 0, y: 0 },
                    ]
                    : [
                        { x: -kMinWidthT, y: +kMinWidthT + 4 },
                    ]));
                poly.translate(x1 - cornerOffset, y1);
                polygons.push(poly);
                break;
            }
        }
        // process for tail
        switch (a2) {
            case 1:
            case 8:
            case 15: { // the last filled circle ... it can change 15->5
                var kMinWidthT2 = font.kMinWidthT - opt4 / 2;
                var _p = (sx2 === x2)
                    ? [0, 1] // ?????
                    : (sy2 === y2)
                        ? [1, 0] // ?????
                        : normalize([x2 - sx2, y2 - sy2]), dx = _p[0], dy = _p[1];
                var poly = new Polygon((font.kUseCurve)
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
                if (a2 === 15) { // jump up ... it can change 15->5
                    // anytime same degree
                    var poly_1 = new Polygon([
                        { x: 0, y: -kMinWidthT + 1 },
                        { x: +2, y: -kMinWidthT - font.kWidth * 5 },
                        { x: 0, y: -kMinWidthT - font.kWidth * 5 },
                        { x: -kMinWidthT, y: -kMinWidthT + 1 },
                    ]);
                    if (y1 >= y2) {
                        poly_1.rotate180();
                    }
                    poly_1.translate(x2, y2);
                    polygons.push(poly_1);
                }
                break;
            }
            case 0:
                if (!(a1 === 7 || a1 === 27)) {
                    break;
                }
            // fall through
            case 9: { // Math.sinnyu & L2RD Harai ... no need for a2=9
                var type = Math.atan2(Math.abs(y2 - sy2), Math.abs(x2 - sx2)) / Math.PI * 2 - 0.6;
                if (type > 0) {
                    type *= 8;
                }
                else {
                    type *= 3;
                }
                var pm = type < 0 ? -1 : 1;
                var _q = (sy2 === y2)
                    ? [1, 0] // ?????
                    : (sx2 === x2)
                        ? [0, y2 > sy2 ? -1 : 1] // for backward compatibility...
                        : normalize([x2 - sx2, y2 - sy2]), dx = _q[0], dy = _q[1];
                var poly = new Polygon([
                    { x: 0, y: +kMinWidthT * font.kL2RDfatten },
                    { x: 0, y: -kMinWidthT * font.kL2RDfatten },
                    { x: Math.abs(type) * kMinWidthT * font.kL2RDfatten, y: pm * kMinWidthT * font.kL2RDfatten },
                ]);
                poly.transformMatrix2(dx, dy).translate(x2, y2);
                polygons.push(poly);
                break;
            }
            case 14: { // jump to left, allways go left
                var jumpFactor = kMinWidthT > 6 ? 6.0 / kMinWidthT : 1.0;
                var haneLength = font.kWidth * 4 * Math.min(1 - haneAdjustment / 10, Math.pow((kMinWidthT / font.kMinWidthT), 3)) * jumpFactor;
                var poly = new Polygon([
                    { x: 0, y: 0 },
                    { x: 0, y: -kMinWidthT },
                    { x: -haneLength, y: -kMinWidthT },
                    { x: -haneLength, y: -kMinWidthT * 0.5 },
                ]);
                // poly.reverse();
                poly.translate(x2, y2);
                polygons.push(poly);
                break;
            }
        }
    }
    function cdDrawBezier(font, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a1, a2, opt1, haneAdjustment, opt3, opt4) {
        cdDrawCurveU(font, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a1, a2, opt1, haneAdjustment, opt3, opt4);
    }
    function cdDrawCurve(font, polygons, x1, y1, x2, y2, x3, y3, a1, a2, opt1, haneAdjustment, opt3, opt4) {
        cdDrawCurveU(font, polygons, x1, y1, x2, y2, x2, y2, x3, y3, a1, a2, opt1, haneAdjustment, opt3, opt4);
    }
    function cdDrawLine(font, polygons, tx1, ty1, tx2, ty2, ta1, ta2, opt1, urokoAdjustment, kakatoAdjustment, mageAdjustment) {
        var x1 = tx1;
        var y1 = ty1;
        var x2 = tx2;
        var y2 = ty2;
        var a1 = ta1;
        var a2 = ta2;
        var kMinWidthT = font.kMinWidthT - opt1 / 2;
        if (x1 === x2 || y1 !== y2 && (x1 > x2 || Math.abs(y2 - y1) >= Math.abs(x2 - x1) || a1 === 6 || a2 === 6)) {
            // if TATE stroke, use y-axis
            // for others, use x-axis
            // KAKUDO GA FUKAI or KAGI NO YOKO BOU
            var _a = (x1 === x2)
                ? [0, 1] // ?????
                : normalize([x2 - x1, y2 - y1]), cosrad = _a[0], sinrad = _a[1];
            if (!((a2 === 13 || a2 === 23) && mageAdjustment !== 0)) { // for backward compatibility...
                var poly = new Polygon(4);
                switch (a1) {
                    case 0:
                        poly.set(0, x1 + sinrad * kMinWidthT + cosrad * font.kMinWidthY / 2, y1 - cosrad * kMinWidthT + sinrad * font.kMinWidthY / 2);
                        poly.set(3, x1 - sinrad * kMinWidthT - cosrad * font.kMinWidthY / 2, y1 + cosrad * kMinWidthT - sinrad * font.kMinWidthY / 2);
                        break;
                    case 1:
                    case 6: // ... no need
                        poly.set(0, x1 + sinrad * kMinWidthT, y1 - cosrad * kMinWidthT);
                        poly.set(3, x1 - sinrad * kMinWidthT, y1 + cosrad * kMinWidthT);
                        break;
                    case 12:
                        poly.set(0, x1 + sinrad * kMinWidthT - cosrad * font.kMinWidthY, y1 - cosrad * kMinWidthT - sinrad * font.kMinWidthY);
                        poly.set(3, x1 - sinrad * kMinWidthT - cosrad * (kMinWidthT + font.kMinWidthY), y1 + cosrad * kMinWidthT - sinrad * (kMinWidthT + font.kMinWidthY));
                        break;
                    case 22:
                        if (x1 === x2) {
                            poly.set(0, x1 + kMinWidthT, y1);
                            poly.set(3, x1 - kMinWidthT, y1);
                        }
                        else {
                            var rad = Math.atan((y2 - y1) / (x2 - x1));
                            var v = x1 > x2 ? -1 : 1;
                            // TODO: why " + 1" ???
                            poly.set(0, x1 + (kMinWidthT * v + 1) / Math.sin(rad), y1 + 1);
                            poly.set(3, x1 - (kMinWidthT * v) / Math.sin(rad), y1);
                        }
                        break;
                    case 32:
                        if (x1 === x2) {
                            poly.set(0, x1 + kMinWidthT, y1 - font.kMinWidthY);
                            poly.set(3, x1 - kMinWidthT, y1 - font.kMinWidthY);
                        }
                        else {
                            poly.set(0, x1 + kMinWidthT / sinrad, y1);
                            poly.set(3, x1 - kMinWidthT / sinrad, y1);
                        }
                        break;
                }
                switch (a2) {
                    case 0:
                        if (a1 === 6) { // KAGI's tail ... no need
                            poly.set(1, x2 + sinrad * kMinWidthT, y2 - cosrad * kMinWidthT);
                            poly.set(2, x2 - sinrad * kMinWidthT, y2 + cosrad * kMinWidthT);
                        }
                        else {
                            poly.set(1, x2 + sinrad * kMinWidthT - cosrad * kMinWidthT / 2, y2 - cosrad * kMinWidthT - sinrad * kMinWidthT / 2);
                            poly.set(2, x2 - sinrad * kMinWidthT + cosrad * kMinWidthT / 2, y2 + cosrad * kMinWidthT + sinrad * kMinWidthT / 2);
                        }
                        break;
                    case 5:
                        if (x1 === x2) {
                            break;
                        }
                    // falls through
                    case 1: // is needed?
                        poly.set(1, x2 + sinrad * kMinWidthT, y2 - cosrad * kMinWidthT);
                        poly.set(2, x2 - sinrad * kMinWidthT, y2 + cosrad * kMinWidthT);
                        break;
                    case 13:
                        poly.set(1, x2 + sinrad * kMinWidthT + cosrad * font.kAdjustKakatoL[kakatoAdjustment], y2 - cosrad * kMinWidthT + sinrad * font.kAdjustKakatoL[kakatoAdjustment]);
                        poly.set(2, x2 - sinrad * kMinWidthT + cosrad * (font.kAdjustKakatoL[kakatoAdjustment] + kMinWidthT), y2 + cosrad * kMinWidthT + sinrad * (font.kAdjustKakatoL[kakatoAdjustment] + kMinWidthT));
                        break;
                    case 23:
                        poly.set(1, x2 + sinrad * kMinWidthT + cosrad * font.kAdjustKakatoR[kakatoAdjustment], y2 - cosrad * kMinWidthT + sinrad * font.kAdjustKakatoR[kakatoAdjustment]);
                        poly.set(2, x2 - sinrad * kMinWidthT + cosrad * (font.kAdjustKakatoR[kakatoAdjustment] + kMinWidthT), y2 + cosrad * kMinWidthT + sinrad * (font.kAdjustKakatoR[kakatoAdjustment] + kMinWidthT));
                        break;
                    case 24: // for T/H design
                    case 32:
                        if (x1 === x2) {
                            poly.set(1, x2 + kMinWidthT, y2 + font.kMinWidthY);
                            poly.set(2, x2 - kMinWidthT, y2 + font.kMinWidthY);
                        }
                        else {
                            poly.set(1, x2 + kMinWidthT / sinrad, y2);
                            poly.set(2, x2 - kMinWidthT / sinrad, y2);
                        }
                        break;
                }
                polygons.push(poly);
            }
            switch (a2) {
                case 24: { // for T design
                    var poly = new Polygon([
                        { x: 0, y: +font.kMinWidthY },
                        (x1 === x2) // ?????
                            ? { x: +kMinWidthT, y: -font.kMinWidthY * 3 }
                            : { x: +kMinWidthT * 0.5, y: -font.kMinWidthY * 4 },
                        { x: +kMinWidthT * 2, y: -font.kMinWidthY },
                        { x: +kMinWidthT * 2, y: +font.kMinWidthY },
                    ]);
                    poly.translate(x2, y2);
                    polygons.push(poly);
                    break;
                }
                case 13:
                    if (kakatoAdjustment === 4 && mageAdjustment === 0) { // for new GTH box's left bottom corner
                        if (x1 === x2) {
                            var poly = new Polygon([
                                { x: -kMinWidthT, y: -font.kMinWidthY * 3 },
                                { x: -kMinWidthT * 2, y: 0 },
                                { x: -font.kMinWidthY, y: +font.kMinWidthY * 5 },
                                { x: +kMinWidthT, y: +font.kMinWidthY },
                            ]);
                            poly.translate(x2, y2);
                            polygons.push(poly);
                        }
                        else { // MUKI KANKEINASHI
                            var m = (x1 > x2 && y1 !== y2)
                                ? Math.floor((x1 - x2) / (y2 - y1) * 3)
                                : 0;
                            var poly = new Polygon([
                                { x: 0, y: -font.kMinWidthY * 5 },
                                { x: -kMinWidthT * 2, y: 0 },
                                { x: -font.kMinWidthY, y: +font.kMinWidthY * 5 },
                                { x: +kMinWidthT, y: +font.kMinWidthY },
                                { x: 0, y: 0 },
                            ]);
                            poly.translate(x2 + m, y2);
                            polygons.push(poly);
                        }
                    }
                    break;
            }
            switch (a1) {
                case 22:
                case 27: {
                    // box's right top corner
                    // SHIKAKU MIGIUE UROKO NANAME DEMO MASSUGU MUKI
                    var poly = new Polygon();
                    poly.push(-kMinWidthT, -font.kMinWidthY);
                    poly.push(0, -font.kMinWidthY - font.kWidth);
                    poly.push(+kMinWidthT + font.kWidth, +font.kMinWidthY);
                    if (x1 === x2) {
                        poly.push(+kMinWidthT, +kMinWidthT);
                        poly.push(-kMinWidthT, 0);
                    }
                    else {
                        poly.push(+kMinWidthT, +kMinWidthT - 1);
                        if (a1 === 27) {
                            poly.push(0, +kMinWidthT + 2);
                            poly.push(0, 0);
                        }
                        else {
                            poly.push(-kMinWidthT, +kMinWidthT + 4);
                        }
                    }
                    poly.translate(x1, y1);
                    polygons.push(poly);
                    break;
                }
                case 0: { // beginning of the stroke
                    var poly = new Polygon([
                        {
                            x: +kMinWidthT * sinrad + font.kMinWidthY * 0.5 * cosrad,
                            y: +kMinWidthT * -cosrad + font.kMinWidthY * 0.5 * sinrad,
                        },
                        {
                            x: +(kMinWidthT + kMinWidthT * 0.5) * sinrad + (font.kMinWidthY * 0.5 + font.kMinWidthY) * cosrad,
                            y: +(kMinWidthT + kMinWidthT * 0.5) * -cosrad + (font.kMinWidthY * 0.5 + font.kMinWidthY) * sinrad,
                        },
                        (x1 === x2) // ?????
                            ? {
                                x: +(kMinWidthT - 2) * sinrad + (font.kMinWidthY * 0.5 + font.kMinWidthY * 2 + 1) * cosrad,
                                y: +(kMinWidthT - 2) * -cosrad + (font.kMinWidthY * 0.5 + font.kMinWidthY * 2 + 1) * sinrad,
                            }
                            : {
                                x: +(kMinWidthT - 2) * sinrad + (font.kMinWidthY * 0.5 + font.kMinWidthY * 2) * cosrad,
                                y: +(kMinWidthT + 1) * -cosrad + (font.kMinWidthY * 0.5 + font.kMinWidthY * 2) * sinrad,
                            },
                    ]);
                    poly.translate(x1, y1);
                    polygons.push(poly);
                    break;
                }
            }
            if (x1 === x2 && a2 === 1 || a1 === 6 && (a2 === 0 || x1 !== x2 && a2 === 5)) {
                // KAGI NO YOKO BOU NO SAIGO NO MARU ... no need only used at 1st=yoko
                var poly = new Polygon();
                if (font.kUseCurve) {
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
                if (x1 !== x2 && a1 === 6 && a2 === 5) {
                    // KAGI NO YOKO BOU NO HANE
                    var haneLength = font.kWidth * 5;
                    var rv = x1 < x2 ? 1 : -1;
                    var poly_2 = new Polygon([
                        { x: 0, y: +rv * (-kMinWidthT + 1) },
                        { x: +2, y: +rv * (-kMinWidthT - haneLength) },
                        { x: 0, y: +rv * (-kMinWidthT - haneLength) },
                        { x: -kMinWidthT, y: -kMinWidthT + 1 },
                    ]);
                    poly_2.transformMatrix2(cosrad, sinrad).translate(x2, y2);
                    polygons.push(poly_2);
                }
            }
        }
        else if (y1 === y2 && a1 === 6) {
            // if it is YOKO stroke, use x-axis
            // if it is KAGI's YOKO stroke, get bold
            // x1 !== x2 && y1 === y2 && a1 === 6
            var poly0 = new Polygon([
                { x: x1, y: y1 - kMinWidthT },
                { x: x2, y: y2 - kMinWidthT },
                { x: x2, y: y2 + kMinWidthT },
                { x: x1, y: y1 + kMinWidthT },
            ]);
            polygons.push(poly0);
            switch (a2) {
                case 1:
                case 0:
                case 5: { // no need a2=1
                    // KAGI NO YOKO BOU NO SAIGO NO MARU
                    var _b = (x1 < x2) ? [1, 0] : [-1, 0], cosrad = _b[0], sinrad = _b[1];
                    var r = 0.6;
                    var poly = new Polygon((font.kUseCurve)
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
                    if (a2 === 5) {
                        var haneLength = font.kWidth * (4 * (1 - opt1 / font.kAdjustMageStep) + 1);
                        // KAGI NO YOKO BOU NO HANE
                        var poly_3 = new Polygon([
                            // { x: 0, y: -kMinWidthT + 1 },
                            { x: 0, y: -kMinWidthT },
                            { x: +2, y: -kMinWidthT - haneLength },
                            { x: 0, y: -kMinWidthT - haneLength },
                            // { x: -kMinWidthT, y: -kMinWidthT + 1 },
                            { x: -kMinWidthT, y: -kMinWidthT },
                        ]);
                        // poly2.reverse(); // for fill-rule
                        if (x1 >= x2) {
                            poly_3.reflectX();
                        }
                        poly_3.translate(x2, y2);
                        polygons.push(poly_3);
                    }
                    break;
                }
            }
        }
        else {
            // for others, use x-axis
            // ASAI KAUDO
            var _c = (y1 === y2)
                ? [1, 0] // ?????
                : normalize([x2 - x1, y2 - y1]), cosrad = _c[0], sinrad = _c[1];
            // always same
            var poly = new Polygon([
                { x: x1 + sinrad * font.kMinWidthY, y: y1 - cosrad * font.kMinWidthY },
                { x: x2 + sinrad * font.kMinWidthY, y: y2 - cosrad * font.kMinWidthY },
                { x: x2 - sinrad * font.kMinWidthY, y: y2 + cosrad * font.kMinWidthY },
                { x: x1 - sinrad * font.kMinWidthY, y: y1 + cosrad * font.kMinWidthY },
            ]);
            polygons.push(poly);
            switch (a2) {
                // UROKO
                case 0:
                    if (mageAdjustment === 0) {
                        var urokoScale = (font.kMinWidthU / font.kMinWidthY - 1.0) / 4.0 + 1.0;
                        var poly2 = new Polygon([
                            { x: +sinrad * font.kMinWidthY, y: -cosrad * font.kMinWidthY },
                            { x: -cosrad * font.kAdjustUrokoX[urokoAdjustment] * urokoScale, y: -sinrad * font.kAdjustUrokoX[urokoAdjustment] * urokoScale },
                            { x: -(cosrad - sinrad) * font.kAdjustUrokoX[urokoAdjustment] * urokoScale / 2, y: -(sinrad + cosrad) * font.kAdjustUrokoY[urokoAdjustment] * urokoScale },
                        ]);
                        poly2.translate(x2, y2);
                        polygons.push(poly2);
                    }
                    break;
            }
        }
    }

    function selectPolygonsRect(polygons, x1, y1, x2, y2) {
        return polygons.array.filter(function (polygon) { return (polygon.array.every(function (_a) {
            var x = _a.x, y = _a.y;
            return x1 <= x && x <= x2 && y1 <= y && y <= y2;
        })); });
    }
    function dfDrawFont(font, polygons, _a) {
        var a1 = _a.a1, x1 = _a.x1, y1 = _a.y1, x2 = _a.x2, y2 = _a.y2, x3 = _a.x3, y3 = _a.y3, x4 = _a.x4, y4 = _a.y4, a2_100 = _a.a2_100, kirikuchiAdjustment = _a.kirikuchiAdjustment, tateAdjustment = _a.tateAdjustment, opt3 = _a.opt3, a3_100 = _a.a3_100, haneAdjustment = _a.haneAdjustment, urokoAdjustment = _a.urokoAdjustment, kakatoAdjustment = _a.kakatoAdjustment, mageAdjustment = _a.mageAdjustment;
        switch (a1 % 100) { // ... no need to divide
            case 0:
                if (a2_100 === 98 && kirikuchiAdjustment === 0 && tateAdjustment === 0 && opt3 === 0) {
                    var dx = x1 + x2, dy = 0;
                    for (var _i = 0, _b = selectPolygonsRect(polygons, x1, y1, x2, y2); _i < _b.length; _i++) {
                        var polygon = _b[_i];
                        polygon.scale(10).floor().reflectX().translate(dx * 10, dy * 10).scale(0.1);
                    }
                }
                else if (a2_100 === 97 && kirikuchiAdjustment === 0 && tateAdjustment === 0 && opt3 === 0) {
                    var dx = 0, dy = y1 + y2;
                    for (var _c = 0, _d = selectPolygonsRect(polygons, x1, y1, x2, y2); _c < _d.length; _c++) {
                        var polygon = _d[_c];
                        polygon.scale(10).floor().reflectY().translate(dx * 10, dy * 10).scale(0.1);
                    }
                }
                else if (a2_100 === 99 && kirikuchiAdjustment === 0 && tateAdjustment === 0 && opt3 === 0) {
                    if (a3_100 === 1 && haneAdjustment === 0 && mageAdjustment === 0) {
                        var dx = x1 + y2, dy = y1 - x1;
                        for (var _e = 0, _f = selectPolygonsRect(polygons, x1, y1, x2, y2); _e < _f.length; _e++) {
                            var polygon = _f[_e];
                            // polygon.translate(-x1, -y2).rotate90().translate(x1, y1);
                            polygon.scale(10).floor().rotate90().translate(dx * 10, dy * 10).scale(0.1);
                        }
                    }
                    else if (a3_100 === 2 && haneAdjustment === 0 && mageAdjustment === 0) {
                        var dx = x1 + x2, dy = y1 + y2;
                        for (var _g = 0, _h = selectPolygonsRect(polygons, x1, y1, x2, y2); _g < _h.length; _g++) {
                            var polygon = _h[_g];
                            polygon.scale(10).floor().rotate180().translate(dx * 10, dy * 10).scale(0.1);
                        }
                    }
                    else if (a3_100 === 3 && haneAdjustment === 0 && mageAdjustment === 0) {
                        var dx = x1 - y1, dy = y2 + x1;
                        for (var _j = 0, _k = selectPolygonsRect(polygons, x1, y1, x2, y2); _j < _k.length; _j++) {
                            var polygon = _k[_j];
                            // polygon.translate(-x1, -y1).rotate270().translate(x1, y2);
                            polygon.scale(10).floor().rotate270().translate(dx * 10, dy * 10).scale(0.1);
                        }
                    }
                }
                break;
            case 1: {
                if (a3_100 === 4) {
                    var _l = (x1 === x2 && y1 === y2)
                        ? [0, font.kMage] // ?????
                        : normalize([x1 - x2, y1 - y2], font.kMage), dx1 = _l[0], dy1 = _l[1];
                    var tx1 = x2 + dx1;
                    var ty1 = y2 + dy1;
                    cdDrawLine(font, polygons, x1, y1, tx1, ty1, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment + opt3 * 10, 0, 0, 0);
                    cdDrawCurve(font, polygons, tx1, ty1, x2, y2, x2 - font.kMage * (((font.kAdjustTateStep + 4) - tateAdjustment - opt3 * 10) / (font.kAdjustTateStep + 4)), y2, 1, 14, tateAdjustment, haneAdjustment, opt3, mageAdjustment);
                }
                else {
                    cdDrawLine(font, polygons, x1, y1, x2, y2, a2_100 + kirikuchiAdjustment * 100, a3_100, tateAdjustment + opt3 * 10, urokoAdjustment, kakatoAdjustment, mageAdjustment);
                }
                break;
            }
            case 2: {
                // case 12: // ... no need
                if (a3_100 === 4) {
                    var _m = (x2 === x3)
                        ? [0, -font.kMage] // ?????
                        : (y2 === y3)
                            ? [-font.kMage, 0] // ?????
                            : normalize([x2 - x3, y2 - y3], font.kMage), dx1 = _m[0], dy1 = _m[1];
                    var tx1 = x3 + dx1;
                    var ty1 = y3 + dy1;
                    cdDrawCurve(font, polygons, x1, y1, x2, y2, tx1, ty1, a2_100 + kirikuchiAdjustment * 100, 0, tateAdjustment, 0, opt3, 0);
                    cdDrawCurve(font, polygons, tx1, ty1, x3, y3, x3 - font.kMage, y3, 2, 14, tateAdjustment, haneAdjustment, 0, mageAdjustment);
                }
                else {
                    cdDrawCurve(font, polygons, x1, y1, x2, y2, x3, y3, a2_100 + kirikuchiAdjustment * 100, (a3_100 === 5 && haneAdjustment === 0 && mageAdjustment === 0) ? 15 : a3_100, tateAdjustment, haneAdjustment, opt3, mageAdjustment);
                }
                break;
            }
            case 3: {
                var _o = (x1 === x2 && y1 === y2)
                    ? [0, font.kMage] // ?????
                    : normalize([x1 - x2, y1 - y2], font.kMage), dx1 = _o[0], dy1 = _o[1];
                var tx1 = x2 + dx1;
                var ty1 = y2 + dy1;
                var _p = (x2 === x3 && y2 === y3)
                    ? [0, -font.kMage] // ?????
                    : normalize([x3 - x2, y3 - y2], font.kMage), dx2 = _p[0], dy2 = _p[1];
                var tx2 = x2 + dx2;
                var ty2 = y2 + dy2;
                cdDrawLine(font, polygons, x1, y1, tx1, ty1, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment + opt3 * 10, 0, 0, 0);
                cdDrawCurve(font, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1, 0, 0, tateAdjustment + opt3 * 10, mageAdjustment);
                if (!(a3_100 === 5 && haneAdjustment === 0 && !((x2 < x3 && x3 - tx2 > 0) || (x2 > x3 && tx2 - x3 > 0)))) { // for closer position
                    cdDrawLine(font, polygons, tx2, ty2, x3, y3, 6, a3_100, mageAdjustment, urokoAdjustment, kakatoAdjustment, (a3_100 === 5 && haneAdjustment === 0) ? 0 : mageAdjustment); // bolder by force
                }
                break;
            }
            case 12: {
                cdDrawCurve(font, polygons, x1, y1, x2, y2, x3, y3, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment, 0, opt3, 0);
                cdDrawLine(font, polygons, x3, y3, x4, y4, 6, a3_100, 0, urokoAdjustment, kakatoAdjustment, mageAdjustment);
                break;
            }
            case 4: {
                var rate = hypot(x3 - x2, y3 - y2) / 120 * 6;
                if (rate > 6) {
                    rate = 6;
                }
                var _q = (x1 === x2 && y1 === y2)
                    ? [0, font.kMage * rate] // ?????
                    : normalize([x1 - x2, y1 - y2], font.kMage * rate), dx1 = _q[0], dy1 = _q[1];
                var tx1 = x2 + dx1;
                var ty1 = y2 + dy1;
                var _r = (x2 === x3 && y2 === y3)
                    ? [0, -font.kMage * rate] // ?????
                    : normalize([x3 - x2, y3 - y2], font.kMage * rate), dx2 = _r[0], dy2 = _r[1];
                var tx2 = x2 + dx2;
                var ty2 = y2 + dy2;
                cdDrawLine(font, polygons, x1, y1, tx1, ty1, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment + opt3 * 10, 0, 0, 0);
                cdDrawCurve(font, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1, 0, 0, 0, 0);
                if (!(a3_100 === 5 && haneAdjustment === 0 && mageAdjustment === 0 && x3 - tx2 <= 0)) { // for closer position
                    cdDrawLine(font, polygons, tx2, ty2, x3, y3, 6, a3_100, 0, urokoAdjustment, kakatoAdjustment, mageAdjustment); // bolder by force
                }
                break;
            }
            case 6: {
                if (a3_100 === 4) {
                    var _s = (x3 === x4)
                        ? [0, -font.kMage] // ?????
                        : (y3 === y4)
                            ? [-font.kMage, 0] // ?????
                            : normalize([x3 - x4, y3 - y4], font.kMage), dx1 = _s[0], dy1 = _s[1];
                    var tx1 = x4 + dx1;
                    var ty1 = y4 + dy1;
                    cdDrawBezier(font, polygons, x1, y1, x2, y2, x3, y3, tx1, ty1, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment, 0, opt3, 0);
                    cdDrawCurve(font, polygons, tx1, ty1, x4, y4, x4 - font.kMage, y4, 1, 14, 0, haneAdjustment, 0, mageAdjustment);
                }
                else {
                    cdDrawBezier(font, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a2_100 + kirikuchiAdjustment * 100, (a3_100 === 5 && haneAdjustment === 0 && mageAdjustment === 0) ? 15 : a3_100, tateAdjustment, haneAdjustment, opt3, mageAdjustment);
                }
                break;
            }
            case 7: {
                cdDrawLine(font, polygons, x1, y1, x2, y2, a2_100 + kirikuchiAdjustment * 100, 1, tateAdjustment + opt3 * 10, 0, 0, 0);
                cdDrawCurve(font, polygons, x2, y2, x3, y3, x4, y4, 1, a3_100, tateAdjustment, haneAdjustment, opt3, mageAdjustment);
                break;
            }
        }
    }
    var Mincho = /** @class */ (function () {
        function Mincho() {
            this.shotai = KShotai.kMincho;
            this.kRate = 100; // must divide 1000
            this.setSize();
        }
        Mincho.prototype.draw = function (polygons, stroke) {
            dfDrawFont(this, polygons, stroke);
        };
        Mincho.prototype.setSize = function (size) {
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
                this.kMinWidthU = 2;
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
        };
        Mincho.prototype.adjustStrokes = function (strokesArray) {
            this.adjustHane(strokesArray);
            this.adjustMage(strokesArray);
            this.adjustTate(strokesArray);
            this.adjustKakato(strokesArray);
            this.adjustUroko(strokesArray);
            this.adjustUroko2(strokesArray);
            this.adjustKirikuchi(strokesArray);
            return strokesArray;
        };
        Mincho.prototype.adjustHane = function (strokesArray) {
            strokesArray.forEach(function (stroke, i) {
                if ((stroke.a1 === 1 || stroke.a1 === 2 || stroke.a1 === 6)
                    && stroke.a3_100 === 4 && stroke.haneAdjustment === 0 && stroke.mageAdjustment === 0) {
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
                        stroke.haneAdjustment += 7 - Math.floor(mn_1 / 15);
                    }
                }
            });
            return strokesArray;
        };
        Mincho.prototype.adjustMage = function (strokesArray) {
            var _this = this;
            strokesArray.forEach(function (stroke, i) {
                if (stroke.a1 === 3 && stroke.y2 === stroke.y3) {
                    strokesArray.forEach(function (stroke2, j) {
                        if (i !== j && ((stroke2.a1 === 1
                            && stroke2.y1 === stroke2.y2
                            && !(stroke.x2 + 1 > stroke2.x2 || stroke.x3 - 1 < stroke2.x1)
                            && round(Math.abs(stroke.y2 - stroke2.y1)) < _this.kMinWidthT * _this.kAdjustMageStep) || (stroke2.a1 === 3
                            && stroke2.y2 === stroke2.y3
                            && !(stroke.x2 + 1 > stroke2.x3 || stroke.x3 - 1 < stroke2.x2)
                            && round(Math.abs(stroke.y2 - stroke2.y2)) < _this.kMinWidthT * _this.kAdjustMageStep))) {
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
        Mincho.prototype.adjustTate = function (strokesArray) {
            var _this = this;
            strokesArray.forEach(function (stroke, i) {
                if ((stroke.a1 === 1 || stroke.a1 === 3 || stroke.a1 === 7)
                    && stroke.x1 === stroke.x2) {
                    strokesArray.forEach(function (stroke2, j) {
                        if (i !== j
                            && (stroke2.a1 === 1 || stroke2.a1 === 3 || stroke2.a1 === 7)
                            && stroke2.x1 === stroke2.x2
                            && !(stroke.y1 + 1 > stroke2.y2 || stroke.y2 - 1 < stroke2.y1)
                            && round(Math.abs(stroke.x1 - stroke2.x1)) < _this.kMinWidthT * _this.kAdjustTateStep) {
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
        Mincho.prototype.adjustKakato = function (strokesArray) {
            var _this = this;
            strokesArray.forEach(function (stroke, i) {
                if (stroke.a1 === 1
                    && (stroke.a3_100 === 13 || stroke.a3_100 === 23) && stroke.kakatoAdjustment === 0 && stroke.mageAdjustment === 0) {
                    for (var k = 0; k < _this.kAdjustKakatoStep; k++) {
                        if (isCrossBoxWithOthers(strokesArray, i, stroke.x2 - _this.kAdjustKakatoRangeX / 2, stroke.y2 + _this.kAdjustKakatoRangeY[k], stroke.x2 + _this.kAdjustKakatoRangeX / 2, stroke.y2 + _this.kAdjustKakatoRangeY[k + 1])
                            || round(stroke.y2 + _this.kAdjustKakatoRangeY[k + 1]) > 200 // adjust for baseline
                            || round(stroke.y2 - stroke.y1) < _this.kAdjustKakatoRangeY[k + 1] // for thin box
                        ) {
                            stroke.kakatoAdjustment = 3 - k;
                            break;
                        }
                    }
                }
            });
            return strokesArray;
        };
        Mincho.prototype.adjustUroko = function (strokesArray) {
            var _this = this;
            strokesArray.forEach(function (stroke, i) {
                if (stroke.a1 === 1
                    && stroke.a3_100 === 0 && stroke.urokoAdjustment === 0 && stroke.mageAdjustment === 0) { // no operation for TATE
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
                                    ? normalize([stroke.x1 - stroke.x2, stroke.y1 - stroke.y2]) // for backward compatibility...
                                    : normalize([stroke.x2 - stroke.x1, stroke.y2 - stroke.y1]), cosrad = _a[0], sinrad = _a[1];
                            tx = stroke.x2 - _this.kAdjustUrokoLine[k] * cosrad - 0.5 * sinrad;
                            ty = stroke.y2 - _this.kAdjustUrokoLine[k] * sinrad - 0.5 * cosrad;
                            tlen = hypot(stroke.y2 - stroke.y1, stroke.x2 - stroke.x1);
                        }
                        if (round(tlen) < _this.kAdjustUrokoLength[k]
                            || isCrossWithOthers(strokesArray, i, tx, ty, stroke.x2, stroke.y2)) {
                            stroke.urokoAdjustment = _this.kAdjustUrokoLengthStep - k;
                            break;
                        }
                    }
                }
            });
            return strokesArray;
        };
        Mincho.prototype.adjustUroko2 = function (strokesArray) {
            var _this = this;
            strokesArray.forEach(function (stroke, i) {
                if (stroke.a1 === 1 && stroke.a3_100 === 0 && stroke.urokoAdjustment === 0 && stroke.mageAdjustment === 0
                    && stroke.y1 === stroke.y2) {
                    var pressure_1 = 0;
                    strokesArray.forEach(function (stroke2, j) {
                        if (i !== j && ((stroke2.a1 === 1
                            && stroke2.y1 === stroke2.y2
                            && !(stroke.x1 + 1 > stroke2.x2 || stroke.x2 - 1 < stroke2.x1)
                            && round(Math.abs(stroke.y1 - stroke2.y1)) < _this.kAdjustUroko2Length) || (stroke2.a1 === 3
                            && stroke2.y2 === stroke2.y3
                            && !(stroke.x1 + 1 > stroke2.x3 || stroke.x2 - 1 < stroke2.x2)
                            && round(Math.abs(stroke.y1 - stroke2.y2)) < _this.kAdjustUroko2Length))) {
                            pressure_1 += Math.pow((_this.kAdjustUroko2Length - Math.abs(stroke.y1 - stroke2.y2)), 1.1);
                        }
                    });
                    // const result = Math.min(Math.floor(pressure / this.kAdjustUroko2Length), this.kAdjustUroko2Step) * 100;
                    // if (stroke.a3 < result) {
                    stroke.urokoAdjustment = Math.min(Math.floor(pressure_1 / _this.kAdjustUroko2Length), _this.kAdjustUroko2Step);
                    // }
                }
            });
            return strokesArray;
        };
        Mincho.prototype.adjustKirikuchi = function (strokesArray) {
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
        return Mincho;
    }());

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function cdDrawCurveU$1(font, polygons, x1, y1, sx1, sy1, sx2, sy2, x2, y2, ta1, ta2) {
        var a1 = ta1;
        var a2 = ta2;
        var delta1 = 0;
        switch (a1 % 10) {
            case 2:
                delta1 = font.kWidth;
                break;
            case 3:
                delta1 = font.kWidth * font.kKakato;
                break;
        }
        if (delta1 !== 0) {
            var _a = (x1 === sx1 && y1 === sy1)
                ? [0, delta1] // ?????
                : normalize([x1 - sx1, y1 - sy1], delta1), dx1 = _a[0], dy1 = _a[1];
            x1 += dx1;
            y1 += dy1;
        }
        var delta2 = 0;
        switch (a2 % 10) {
            case 2:
                delta2 = font.kWidth;
                break;
            case 3:
                delta2 = font.kWidth * font.kKakato;
                break;
        }
        if (delta2 !== 0) {
            var _b = (sx2 === x2 && sy2 === y2)
                ? [0, -delta2] // ?????
                : normalize([x2 - sx2, y2 - sy2], delta2), dx2 = _b[0], dy2 = _b[1];
            x2 += dx2;
            y2 += dy2;
        }
        var _c = generateFattenCurve(x1, y1, sx1, sy1, sx2, sy2, x2, y2, font.kRate, function () { return font.kWidth; }, function (_a, mag) {
            var x = _a[0], y = _a[1];
            return (round(x) === 0 && round(y) === 0)
                ? [-mag, 0] // ?????
                : normalize([x, y], mag);
        }), left = _c.left, right = _c.right;
        var poly = new Polygon();
        var poly2 = new Polygon();
        // save to polygon
        for (var _i = 0, left_1 = left; _i < left_1.length; _i++) {
            var _d = left_1[_i], x = _d[0], y = _d[1];
            poly.push(x, y);
        }
        for (var _e = 0, right_1 = right; _e < right_1.length; _e++) {
            var _f = right_1[_e], x = _f[0], y = _f[1];
            poly2.push(x, y);
        }
        poly2.reverse();
        poly.concat(poly2);
        polygons.push(poly);
    }
    function cdDrawBezier$1(font, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a1, a2) {
        cdDrawCurveU$1(font, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a1, a2);
    }
    function cdDrawCurve$1(font, polygons, x1, y1, x2, y2, x3, y3, a1, a2) {
        cdDrawCurveU$1(font, polygons, x1, y1, x2, y2, x2, y2, x3, y3, a1, a2);
    }
    function cdDrawLine$1(font, polygons, tx1, ty1, tx2, ty2, ta1, ta2) {
        var x1;
        var y1;
        var x2;
        var y2;
        var a1;
        var a2;
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
        var _a = (x1 === x2 && y1 === y2)
            ? [0, 1] // ?????
            : normalize([x2 - x1, y2 - y1]), dx = _a[0], dy = _a[1];
        var delta1 = 0;
        switch (a1 % 10) {
            case 2:
                delta1 = font.kWidth;
                break;
            case 3:
                delta1 = font.kWidth * font.kKakato;
                break;
        }
        if (delta1 !== 0) {
            x1 -= dx * delta1;
            y1 -= dy * delta1;
        }
        var delta2 = 0;
        switch (a2 % 10) {
            case 2:
                delta2 = font.kWidth;
                break;
            case 3:
                delta2 = font.kWidth * font.kKakato;
                break;
        }
        if (delta2 !== 0) {
            x2 += dx * delta2;
            y2 += dy * delta2;
        }
        // SUICHOKU NO ICHI ZURASHI HA Math.sin TO Math.cos NO IREKAE + x-axis MAINASU KA
        var poly = new Polygon([
            { x: x1 + dy * font.kWidth, y: y1 - dx * font.kWidth },
            { x: x2 + dy * font.kWidth, y: y2 - dx * font.kWidth },
            { x: x2 - dy * font.kWidth, y: y2 + dx * font.kWidth },
            { x: x1 - dy * font.kWidth, y: y1 + dx * font.kWidth },
        ]);
        if (tx1 === tx2) {
            poly.reverse(); // ?????
        }
        polygons.push(poly);
    }

    function dfDrawFont$1(font, polygons, _a) {
        var a1 = _a.a1, x1 = _a.x1, y1 = _a.y1, x2 = _a.x2, y2 = _a.y2, x3 = _a.x3, y3 = _a.y3, x4 = _a.x4, y4 = _a.y4, a2_100 = _a.a2_100, a3_100 = _a.a3_100, haneAdjustment = _a.haneAdjustment, mageAdjustment = _a.mageAdjustment;
        switch (a1 % 100) {
            case 0:
                break;
            case 1: {
                if (a3_100 === 4 && haneAdjustment === 0 && mageAdjustment === 0) {
                    var _b = (x1 === x2 && y1 === y2)
                        ? [0, font.kMage] // ?????
                        : normalize([x1 - x2, y1 - y2], font.kMage), dx1 = _b[0], dy1 = _b[1];
                    var tx1 = x2 + dx1;
                    var ty1 = y2 + dy1;
                    cdDrawLine$1(font, polygons, x1, y1, tx1, ty1, a2_100, 1);
                    cdDrawCurve$1(font, polygons, tx1, ty1, x2, y2, x2 - font.kMage * 2, y2 - font.kMage * 0.5, 1, 0);
                }
                else {
                    cdDrawLine$1(font, polygons, x1, y1, x2, y2, a2_100, a3_100);
                }
                break;
            }
            case 2:
            case 12: {
                if (a3_100 === 4 && haneAdjustment === 0 && mageAdjustment === 0) {
                    var _c = (x2 === x3)
                        ? [0, -font.kMage] // ?????
                        : (y2 === y3)
                            ? [-font.kMage, 0] // ?????
                            : normalize([x2 - x3, y2 - y3], font.kMage), dx1 = _c[0], dy1 = _c[1];
                    var tx1 = x3 + dx1;
                    var ty1 = y3 + dy1;
                    cdDrawCurve$1(font, polygons, x1, y1, x2, y2, tx1, ty1, a2_100, 1);
                    cdDrawCurve$1(font, polygons, tx1, ty1, x3, y3, x3 - font.kMage * 2, y3 - font.kMage * 0.5, 1, 0);
                }
                else if (a3_100 === 5 && haneAdjustment === 0 && mageAdjustment === 0) {
                    var tx1 = x3 + font.kMage;
                    var ty1 = y3;
                    var tx2 = tx1 + font.kMage * 0.5;
                    var ty2 = y3 - font.kMage * 2;
                    cdDrawCurve$1(font, polygons, x1, y1, x2, y2, x3, y3, a2_100, 1);
                    cdDrawCurve$1(font, polygons, x3, y3, tx1, ty1, tx2, ty2, 1, 0);
                }
                else {
                    cdDrawCurve$1(font, polygons, x1, y1, x2, y2, x3, y3, a2_100, a3_100);
                }
                break;
            }
            case 3: {
                var _d = (x1 === x2 && y1 === y2)
                    ? [0, font.kMage] // ?????
                    : normalize([x1 - x2, y1 - y2], font.kMage), dx1 = _d[0], dy1 = _d[1];
                var tx1 = x2 + dx1;
                var ty1 = y2 + dy1;
                var _e = (x2 === x3 && y2 === y3)
                    ? [0, -font.kMage] // ?????
                    : normalize([x3 - x2, y3 - y2], font.kMage), dx2 = _e[0], dy2 = _e[1];
                var tx2 = x2 + dx2;
                var ty2 = y2 + dy2;
                cdDrawLine$1(font, polygons, x1, y1, tx1, ty1, a2_100, 1);
                cdDrawCurve$1(font, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1);
                if (a3_100 === 5 && haneAdjustment === 0 && mageAdjustment === 0) {
                    var tx3 = x3 - font.kMage;
                    var ty3 = y3;
                    var tx4 = x3 + font.kMage * 0.5;
                    var ty4 = y3 - font.kMage * 2;
                    cdDrawLine$1(font, polygons, tx2, ty2, tx3, ty3, 1, 1);
                    cdDrawCurve$1(font, polygons, tx3, ty3, x3, y3, tx4, ty4, 1, 0);
                }
                else {
                    cdDrawLine$1(font, polygons, tx2, ty2, x3, y3, 1, a3_100);
                }
                break;
            }
            case 6: {
                if (a3_100 === 5 && haneAdjustment === 0 && mageAdjustment === 0) {
                    var tx1 = x4 - font.kMage;
                    var ty1 = y4;
                    var tx2 = x4 + font.kMage * 0.5;
                    var ty2 = y4 - font.kMage * 2;
                    /*
                    cdDrawCurve(x1, y1, x2, y2, (x2 + x3) / 2, (y2 + y3) / 2, a2, 1);
                    cdDrawCurve((x2 + x3) / 2, (y2 + y3) / 2, x3, y3, tx1, ty1, 1, 1);
                     */
                    cdDrawBezier$1(font, polygons, x1, y1, x2, y2, x3, y3, tx1, ty1, a2_100, 1);
                    cdDrawCurve$1(font, polygons, tx1, ty1, x4, y4, tx2, ty2, 1, 0);
                }
                else {
                    /*
                    cdDrawCurve(x1, y1, x2, y2, (x2 + x3) / 2, (y2 + y3) / 2, a2, 1);
                    cdDrawCurve((x2 + x3) / 2, (y2 + y3) / 2, x3, y3, x4, y4, 1, a3);
                     */
                    cdDrawBezier$1(font, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a2_100, a3_100);
                }
                break;
            }
            case 7: {
                cdDrawLine$1(font, polygons, x1, y1, x2, y2, a2_100, 1);
                cdDrawCurve$1(font, polygons, x2, y2, x3, y3, x4, y4, 1, a3_100);
                break;
            }
        }
    }
    var Gothic = /** @class */ (function (_super) {
        __extends(Gothic, _super);
        function Gothic() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.shotai = KShotai.kGothic;
            return _this;
        }
        Gothic.prototype.draw = function (polygons, stroke) {
            dfDrawFont$1(this, polygons, stroke);
        };
        return Gothic;
    }(Mincho));

    function select(shotai) {
        switch (shotai) {
            case KShotai.kMincho:
                return new Mincho();
            default:
                return new Gothic();
        }
    }

    var KShotai;
    (function (KShotai) {
        KShotai[KShotai["kMincho"] = 0] = "kMincho";
        KShotai[KShotai["kGothic"] = 1] = "kGothic";
    })(KShotai || (KShotai = {}));
    var Kage = /** @class */ (function () {
        function Kage(size) {
            // TODO: should be static
            this.kMincho = KShotai.kMincho;
            this.kGothic = KShotai.kGothic;
            this.kFont = select(KShotai.kMincho);
            this.stretch = stretch;
            this.kFont.setSize(size);
            this.kBuhin = new Buhin();
        }
        Object.defineProperty(Kage.prototype, "kShotai", {
            // properties
            get: function () {
                return this.kFont.shotai;
            },
            set: function (shotai) {
                this.kFont = select(shotai);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Kage.prototype, "kUseCurve", {
            get: function () {
                return this.kFont.kUseCurve;
            },
            set: function (value) {
                this.kFont.kUseCurve = value;
            },
            enumerable: false,
            configurable: true
        });
        // method
        Kage.prototype.makeGlyph = function (polygons, buhin) {
            var glyphData = this.kBuhin.search(buhin);
            this.makeGlyph2(polygons, glyphData);
        };
        Kage.prototype.makeGlyph2 = function (polygons, data) {
            var _this = this;
            if (data !== "") {
                var strokesArray = this.getEachStrokes(data);
                this.kFont.adjustStrokes(strokesArray);
                strokesArray.forEach(function (stroke) {
                    _this.kFont.draw(polygons, stroke);
                });
            }
        };
        Kage.prototype.makeGlyph3 = function (data) {
            var _this = this;
            var result = [];
            if (data !== "") {
                var strokesArray = this.getEachStrokes(data);
                this.kFont.adjustStrokes(strokesArray);
                strokesArray.forEach(function (stroke) {
                    var polygons = new Polygons();
                    _this.kFont.draw(polygons, stroke);
                    result.push(polygons);
                });
            }
            return result;
        };
        Kage.prototype.makeGlyphSeparated = function (data) {
            var _this = this;
            var strokesArrays = data.map(function (subdata) { return _this.getEachStrokes(subdata); });
            this.kFont.adjustStrokes(strokesArrays.reduce(function (left, right) { return left.concat(right); }, []));
            var polygons = new Polygons();
            return strokesArrays.map(function (strokesArray) {
                var startIndex = polygons.array.length;
                strokesArray.forEach(function (stroke) {
                    _this.kFont.draw(polygons, stroke);
                });
                var result = new Polygons();
                result.array = polygons.array.slice(startIndex);
                return result;
            });
        };
        Kage.prototype.getEachStrokes = function (glyphData) {
            var _this = this;
            var strokesArray = [];
            var strokes = glyphData.split("$");
            strokes.forEach(function (stroke) {
                var columns = stroke.split(":");
                if (Math.floor(+columns[0]) !== 99) {
                    strokesArray.push(new Stroke([
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
        Kage.Buhin = Buhin;
        Kage.Polygons = Polygons;
        return Kage;
    }());

    return Kage;

}());
