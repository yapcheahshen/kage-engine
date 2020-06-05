import { Polygon } from "./polygon";

export class Polygons {
	public array: Polygon[];

	constructor() {
		// property
		this.array = [];
	}
	// method
	public clear(): void {
		this.array = [];
	}

	public push(polygon: Polygon): void {
		// only a simple check
		let minx = 200;
		let maxx = 0;
		let miny = 200;
		let maxy = 0;
		if (polygon.length < 3) {
			return;
		}
		for (const { x, y } of polygon.array) {
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
	}

	public generateSVG(curve: boolean): string {
		let buffer = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
			+ 'version="1.1" baseProfile="full" viewBox="0 0 200 200" width="200" height="200">\n';
		if (curve) {
			this.array.forEach(({ array }) => {
				let mode = "L";
				buffer += '<path d="';
				for (let j = 0; j < array.length; j++) {
					if (j === 0) {
						buffer += "M ";
					} else if (array[j].off) {
						buffer += "Q ";
						mode = "Q";
					} else if (mode === "Q" && !array[j - 1].off) {
						buffer += "L ";
					} else if (mode === "L" && j === 1) {
						buffer += "L ";
					}
					buffer += `${array[j].x},${array[j].y} `;
				}
				buffer += 'Z" fill="black" />\n';
			});
		} else {
			buffer += '<g fill="black">\n';
			buffer += this.array.map(({ array }) => `<polygon points="${
				array.map(({ x, y }) => `${x},${y} `).join("")
			}" />\n`).join("");
			buffer += "</g>\n";
		}
		buffer += "</svg>\n";
		return buffer;
	}

	public generateEPS(): string {
		let buffer = "";
		buffer += `\
%!PS-Adobe-3.0 EPSF-3.0
%%BoundingBox: 0 -208 1024 816
%%Pages: 0
%%Title: Kanji glyph
%%Creator: GlyphWiki powered by KAGE system
%%CreationDate: ${new Date().toString()}
%%EndComments
%%EndProlog
`;
		this.array.forEach(({ array }) => {
			for (let j = 0; j < array.length; j++) {
				buffer += `${array[j].x * 5} ${1000 - array[j].y * 5 - 200} `;
				if (j === 0) {
					buffer += "newpath\nmoveto\n";
				} else {
					buffer += "lineto\n";
				}
			}
			buffer += "closepath\nfill\n";
		});
		buffer += "%%EOF\n";
		return buffer;
	}
}
