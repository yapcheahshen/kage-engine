import { Kage, KShotai } from "../kage";
import { Polygons } from "../polygons";
import { Stroke } from "../stroke";
import Mincho from "./mincho";
import Gothic from "./gothic";

export interface Font {
	shotai: KShotai;
	draw(kage: Kage, polygons: Polygons, stroke: Stroke): void;
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
