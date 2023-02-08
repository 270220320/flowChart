import INLEDITOR from "..";
import ondrop from "./ondrop";
import onwheel from "./onwheel";
import keyDown from "./keyDown";
import setDrawState from "./setDrawState";
import selectItem from "./selectItem";
import onDrag from "./onDrag";
import onDbclick from "./dbclick";
import change from "./change";

export default function (this: INLEDITOR) {
  if (!this.opt.isPreview) {
    setDrawState(this, () => {
      change(this);
    });

    ondrop(this, this.container, () => {
      change(this);
    });

    selectItem(this);

    keyDown(this, () => {
      change(this);
    });

    onDrag(this, () => {
      change(this);
    });
    onDbclick(this);
  }
  onwheel(this.stage, () => {
    change(this);
  });
}
