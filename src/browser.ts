import {Kage as _Kage, Polygons as _Polygons} from "./";

// tslint:disable-next-line:interface-name
declare interface Window {
	Kage: typeof _Kage;
	Polygons: typeof _Polygons;
}
declare var window: Window;
window.Kage = _Kage;
window.Polygons = _Polygons;
