import { KShotai } from "../../kage";
import { Font } from "..";
import Mincho from "../mincho";

class Gothic extends Mincho implements Font {
	public shotai = KShotai.kGothic;
}

export default Gothic;
