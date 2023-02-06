import INLEDITOR from "..";
import ondrop from "./ondrop";
import onwheel from "./onwheel";
import keyDown from "./keyDown";
import setDrawState from "./setDrawState";
import selectItem from "./selectItem";
import onDrag from "./onDrag";
import onDbclick from "./dbclick";

export default function (this: INLEDITOR) {
  setDrawState(this);
  ondrop(this, this.container, () => {});
  selectItem(this);
  onwheel(this.stage);
  keyDown(this);
  onDrag.bind(this)();
  onDbclick(this);
}
