import { Kage as _Kage, Polygons as _Polygons } from "./";

declare interface Window {
	Kage: typeof _Kage;
	Polygons: typeof _Polygons;
}
// eslint-disable-next-line no-var
declare var window: Window;
window.Kage = _Kage;
window.Polygons = _Polygons;
