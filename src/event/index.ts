import INLEDITOR from "..";
import ondrop from "./ondrop";
import onwheel from "./onwheel";
import keyDown from "./keyDown";
import setDrawState from "./setDrawState";
import selectItem from "./selectItem";
import onDrag from "./onDrag";
import onDbclick from "./dbclick";
import change from "./change";

export default (ie: INLEDITOR) => {
  if (!ie.opt.isPreview) {
    setDrawState(ie, () => {
      change(ie);
    });

    ondrop(ie, ie.container, () => {
      change(ie);
    });

    selectItem(ie);

    keyDown(ie, () => {
      change(ie);
    });

    onDrag(ie, () => {
      change(ie);
    });
    onDbclick(ie);
  }
  onwheel(ie.stage, () => {
    change(ie);
  });
};
