import { Kage as _Kage, Polygons as _Polygons, Buhin as _Buhin } from "./";

declare interface Window {
	Kage: typeof _Kage;
	Polygons: typeof _Polygons;
	Buhin: typeof _Buhin;
}
// eslint-disable-next-line no-var
declare var window: Window;
window.Kage = _Kage;
window.Polygons = _Polygons;
window.Buhin = _Buhin;
