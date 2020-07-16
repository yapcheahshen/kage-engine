import { KShotai } from "../kage";
import { Polygons } from "../polygons";
import { Stroke } from "../stroke";
import Mincho from "./mincho";
import Gothic from "./gothic";

export interface Font {
	shotai: KShotai;
	kUseCurve: boolean;
	draw(polygons: Polygons, stroke: Stroke): void;
	setSize(size?: number): void;
	adjustStrokes(strokes: Stroke[]): Stroke[];
}

export { default as Mincho } from "./mincho";
export { default as Gothic } from "./gothic";

export function select(shotai: KShotai): Font {
	switch (shotai) {
		case KShotai.kMincho:
			return new Mincho();
		default:
			return new Gothic();
	}
}
