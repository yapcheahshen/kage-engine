import { Polygons } from "../polygons";
import { Stroke } from "../stroke";
import Mincho from "./mincho";
import Gothic from "./gothic";

export enum KShotai {
	/** Mincho style font */
	kMincho = 0,
	/** Gothic style font */
	kGothic = 1,
}

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
