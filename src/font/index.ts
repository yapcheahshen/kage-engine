import { Polygons } from "../polygons";
import { Stroke } from "../stroke";
import Mincho from "./mincho";
import Gothic from "./gothic";
import { KShotai } from "./shotai";

export { KShotai } from "./shotai";

export type StrokeDrawer = (polygons: Polygons) => void;

export interface Font {
	readonly shotai: KShotai;
	kUseCurve: boolean;
	setSize(size?: number): void;
	getDrawers(strokes: Stroke[]): StrokeDrawer[];
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
